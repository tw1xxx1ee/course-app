import type { GameStatus } from '../types/game'

export const gameStatusLabels: Record<GameStatus, string> = {
  planned: 'В планах',
  playing: 'Прохожу',
  completed: 'Пройдена',
}
