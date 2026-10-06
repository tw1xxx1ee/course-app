import type { GameStatus } from '../types/game'

export const gameStatuses: GameStatus[] = ['planned', 'playing', 'completed']

export const gameStatusLabels: Record<GameStatus, string> = {
  planned: 'В планах',
  playing: 'Прохожу',
  completed: 'Пройдена',
}

export function isGameStatus(value: string): value is GameStatus {
  return gameStatuses.some((status) => status === value)
}
