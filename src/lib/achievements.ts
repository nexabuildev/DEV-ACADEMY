import { db } from "@/lib/db";
import { notifyResponse } from "@/actions/notifications"; 

export const ACHIEVEMENTS = {
  FIRST_CODE: {
    type: "FIRST_CODE",
    title: "Primer Código",
    description: "Has completado tu primera lección. El viaje de mil millas comienza con un paso.",
    icon: "🚀"
  },
  TOP_HELPER: {
    type: "TOP_HELPER",
    title: "Buen Samaritano",
    description: "Has respondido 5 dudas en la comunidad. ¡Gracias por ayudar a otros!",
    icon: "🤝"
  },
  COURSE_COMPLETE: {
    type: "COURSE_COMPLETE",
    title: "Maratón Dev",
    description: "Has completado un curso completo. ¡No hay quien te pare!",
    icon: "🏆"
  }
};

export async function checkAndAwardAchievements(userId: string, event: "LESSON_COMPLETED" | "COMMENT_CREATED" | "COURSE_COMPLETED") {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { achievements: true, comments: true, userProgress: true }
    });

    if (!user) return;

    const currentAchievementTypes = user.achievements.map(a => a.type);
    const newAchievements = [];

    // Lógica para FIRST_CODE
    if (event === "LESSON_COMPLETED" && !currentAchievementTypes.includes("FIRST_CODE")) {
      const completedLessons = user.userProgress.filter(p => p.isCompleted).length;
      if (completedLessons >= 1) {
        newAchievements.push(ACHIEVEMENTS.FIRST_CODE);
      }
    }

    // Lógica para TOP_HELPER
    if (event === "COMMENT_CREATED" && !currentAchievementTypes.includes("TOP_HELPER")) {
      if (user.comments.length >= 5) {
        newAchievements.push(ACHIEVEMENTS.TOP_HELPER);
      }
    }

    // Lógica para COURSE_COMPLETE
    if (event === "COURSE_COMPLETED" && !currentAchievementTypes.includes("COURSE_COMPLETE")) {
       newAchievements.push(ACHIEVEMENTS.COURSE_COMPLETE);
    }

    // Otorgar nuevos logros
    for (const achievement of newAchievements) {
      await db.achievement.create({
        data: {
          userId,
          type: achievement.type,
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon
        }
      });

      // Crear Notificación
      await db.notification.create({
        data: {
          userId,
          title: `¡Nuevo Logro Desbloqueado: ${achievement.title}! ${achievement.icon}`,
          message: achievement.description,
          link: `/perfil/${userId}`
        }
      });
    }

  } catch (error) {
    console.error("Error al verificar logros:", error);
  }
}
