/**
 * Consolidated game type definitions
 * This file serves as the single source of truth for game types across the application
 */

export type GameType = 'grammar' | 'vocabulary' | 'pronunciation' | 'shopping' | 'translation';

export type GameDifficulty = 'beginner' | 'intermediate' | 'advanced' | string;

export const GAME_TYPES: GameType[] = [
  'grammar',
  'vocabulary',
  'pronunciation',
  'shopping',
  'translation'
] as const;

export const GAME_DIFFICULTIES: GameDifficulty[] = [
  'beginner',
  'intermediate',
  'advanced'
] as const;

