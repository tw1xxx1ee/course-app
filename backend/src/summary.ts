import { HttpError, mapSupabaseError } from './errors.js'
import type { GameStatus } from './games.js'
import type { UserClient } from './supabase.js'

const PAGE_SIZE = 500
const MAX_PLATFORM_ID_LENGTH = 50

// Для расчёта нужен только статус игры
export type SummaryGame = {
  status: GameStatus
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

// Необязательный параметр ?platformId=pc: сводка только по одной платформе
export function parseSummaryQuery(query: unknown): string | null {
  if (typeof query !== 'object' || query === null || !('platformId' in query)) {
    return null
  }

  const platformId = query.platformId
  if (typeof platformId !== 'string' || platformId.trim() === '' ||
    platformId.length > MAX_PLATFORM_ID_LENGTH) {
    throw new HttpError(400, 'VALIDATION_ERROR', 'platformId должен быть непустой строкой')
  }
  return platformId.trim()
}

// Читает игры пользователя страницами, чтобы сводка учла все строки, а не первые 500.
// Чужих строк здесь не будет: их отсекает RLS по токену клиента.
export async function loadGamesForSummary(
  supabase: UserClient, platformId: string | null,
): Promise<SummaryGame[]> {
  const result: SummaryGame[] = []

  for (let from = 0; ; from += PAGE_SIZE) {
    let request = supabase
      .from('games')
      .select('status')
      .order('created_at')
      // id уникален: строки с одинаковым created_at не теряются и не повторяются между страницами
      .order('id')
      .range(from, from + PAGE_SIZE - 1)
    if (platformId !== null) {
      request = request.eq('platform_id', platformId)
    }

    const { data, error } = await request.overrideTypes<SummaryGame[], { merge: false }>()
    if (error) throw mapSupabaseError(error)

    result.push(...data)
    if (data.length < PAGE_SIZE) return result
  }
}
