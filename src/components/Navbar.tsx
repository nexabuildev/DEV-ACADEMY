import { db } from "@/lib/db";
import { auth, signOut } from "@/auth";
import NavbarClient from "@/components/NavbarClient";

export default async function Navbar() {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  // Obtener datos completos del usuario y notificaciones
  const user = session?.user?.id 
    ? await db.user.findUnique({ where: { id: session.user.id } })
    : null;

  const notifications = session?.user?.id 
    ? await db.notification.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 10
      })
    : [];


  async function signOutAction() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <NavbarClient 
      session={session} 
      isAdmin={isAdmin} 
      signOutAction={signOutAction} 
      notifications={notifications as any}
      user={user as any}
    />

  );
}