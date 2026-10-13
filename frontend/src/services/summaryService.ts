import { apiFetch } from './api'

export type GameSummary = {
  total: number
  completed: number
  completedPercent: number
}

// Сводку считает сервер по играм пользователя из базы. platformId — необязательный фильтр.
export function getGameSummary(accessToken: string, platformId: 'all' | string): Promise<GameSummary> {
  const query = platformId === 'all' ? '' : `?platformId=${encodeURIComponent(platformId)}`
  return apiFetch<GameSummary>(`/api/summary${query}`, accessToken)
}
