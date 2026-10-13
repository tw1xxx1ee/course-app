import type { Game } from '../types/game'

export type GameSummary = {
  total: number
  completed: number
  completedPercent: number
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

function isGameSummary(value: unknown): value is GameSummary {
  if (typeof value !== 'object' || value === null) return false
  if (!('total' in value) || !('completed' in value) || !('completedPercent' in value)) return false
  return (
    typeof value.total === 'number' &&
    typeof value.completed === 'number' &&
    typeof value.completedPercent === 'number'
  )
}

// Отправляет на свой Node API только статусы игр и получает рассчитанную сводку
export async function getGameSummary(games: Game[]): Promise<GameSummary> {
  if (!apiBaseUrl) {
    throw new Error('Не настроена переменная VITE_API_BASE_URL в .env.local')
  }

  let response: Response
  try {
    response = await fetch(`${apiBaseUrl}/api/summary/games`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: games.map((game) => ({ status: game.status })),
      }),
    })
  } catch {
    throw new Error('API сводки недоступен. Проверьте, что backend запущен.')
  }

  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(payload?.error?.message ?? `Ошибка API: ${response.status}`)
  }
  if (!isGameSummary(payload?.data)) {
    throw new Error('API вернул сводку в неверном формате.')
  }

  return payload.data
}
