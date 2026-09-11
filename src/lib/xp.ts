// src/lib/xp.ts

export const XP_PER_LESSON = 50;
export const XP_PER_POST = 20;
export const XP_PER_COMMENT = 10;
export const XP_PER_VOTE_RECEIVED = 5;
export const XP_PER_SOLUTION = 50;

/**
 * Calcula el nivel actual basado en el XP total.
 * Fórmula: Nivel = floor(sqrt(xp / 100)) + 1
 * Ej: 0 XP = Nivel 1, 400 XP = Nivel 3, 1600 XP = Nivel 5
 */
export function calculateLevel(xp: number) {
  if (xp <= 0) return 1;
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

/**
 * Calcula cuánto XP total se necesita para llegar a un nivel específico.
 */
export function xpForLevel(level: number) {
  if (level <= 1) return 0;
  return Math.pow(level - 1, 2) * 100;
}

/**
 * Devuelve el progreso (0-100) dentro del nivel actual.
 */
export function getLevelProgress(xp: number) {
  const currentLevel = calculateLevel(xp);
  const xpCurrentLevelStart = xpForLevel(currentLevel);
  const xpNextLevelStart = xpForLevel(currentLevel + 1);
  
  const xpInCurrentLevel = xp - xpCurrentLevelStart;
  const totalXpNeededInLevel = xpNextLevelStart - xpCurrentLevelStart;
  
  return Math.min(100, Math.max(0, (xpInCurrentLevel / totalXpNeededInLevel) * 100));
}

/**
 * Devuelve el nombre del rango según el nivel.
 */
export function getRankName(level: number) {
  if (level < 5) return "Principiante";
  if (level < 10) return "Desarrollador Junior";
  if (level < 20) return "Desarrollador Fullstack";
  if (level < 40) return "Tech Lead";
  return "Arquitecto Senior";
}
