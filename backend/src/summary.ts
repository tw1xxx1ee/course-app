import { HttpError } from './errors.js'

const STATUSES = ['planned', 'playing', 'completed']
const MAX_ITEMS = 500

// Для расчёта нужен только статус игры
export type SummaryGame = {
  status: 'planned' | 'playing' | 'completed'
}

export type GameSummary = {
  total: number
  completed: number
  completedPercent: number
}

export function calculateGameSummary(items: SummaryGame[]): GameSummary {
  const total = items.length
  const completed = items.filter((item) => item.status === 'completed').length
  const completedPercent = total === 0 ? 0 : Math.round((completed / total) * 100)

  return { total, completed, completedPercent }
}

function isSummaryGame(value: unknown): value is SummaryGame {
  if (typeof value !== 'object' || value === null) return false
  if (!('status' in value)) return false
  return typeof value.status === 'string' && STATUSES.includes(value.status)
}

// Проверяет тело запроса во время выполнения: типы TypeScript этого не делают
export function parseSummaryBody(value: unknown): SummaryGame[] {
  if (typeof value !== 'object' || value === null || !('items' in value)) {
    throw new HttpError(400, 'VALIDATION_ERROR', 'Ожидается JSON-объект с полем items')
  }

  const items = value.items
  if (!Array.isArray(items) || items.length > MAX_ITEMS) {
    throw new HttpError(400, 'VALIDATION_ERROR', `items должен быть массивом до ${MAX_ITEMS} элементов`)
  }
  if (!items.every(isSummaryGame)) {
    throw new HttpError(400, 'VALIDATION_ERROR', 'У каждого элемента должен быть status: planned, playing или completed')
  }

  return items
}
