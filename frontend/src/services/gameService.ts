import type { Game, GameDraft, GameStatus } from '../types/game'
import { supabase } from '../lib/supabase'
import { apiFetch } from './api'

export type GameFilters = {
  query: string
  status: 'all' | GameStatus
  platformId: 'all' | string
}

export const emptyGameFilters: GameFilters = {
  query: '',
  status: 'all',
  platformId: 'all',
}

// Строка таблицы games вместе со связанной платформой
type GameRow = {
  id: string
  owner_id: string
  platform_id: string
  title: string
  genre: string
  status: GameStatus
  rating: number | null
  note: string
  created_at: string
  platforms: { id: string; name: string } | null
}

const gameColumns = `
  id, owner_id, platform_id, title, genre,
  status, rating, note, created_at,
  platforms(id, name)
`

// Код ошибки PostgreSQL: строка не является корректным uuid
const INVALID_UUID = '22P02'

function fromRow(row: GameRow): Game {
  if (row.platforms === null) {
    throw new Error('У игры не найдена платформа.')
  }
  return {
    id: row.id,
    title: row.title,
    platform: row.platform_id,
    platformName: row.platforms.name,
    genre: row.genre,
    status: row.status,
    rating: row.rating,
    note: row.note,
  }
}

// Поля для изменения игры. owner_id не передаём: владельца менять нельзя
function toWrite(draft: GameDraft) {
  return {
    platform_id: draft.platform,
    title: draft.title.trim(),
    genre: draft.genre.trim(),
    status: draft.status,
    rating: draft.rating,
    note: draft.note.trim(),
  }
}

export async function getGames(filters: GameFilters): Promise<Game[]> {
  let request = supabase
    .from('games')
    .select(gameColumns)
    .order('created_at', { ascending: false })

  // В ilike символы % и _ работают как шаблон: % — любая строка, _ — один символ
  const query = filters.query.trim()
  if (query) request = request.ilike('title', `%${query}%`)
  if (filters.status !== 'all') {
    request = request.eq('status', filters.status)
  }
  if (filters.platformId !== 'all') {
    request = request.eq('platform_id', filters.platformId)
  }

  const { data, error } = await request
    .overrideTypes<GameRow[], { merge: false }>()

  if (error) throw new Error(`Не удалось загрузить игры: ${error.message}`)
  return data.map(fromRow)
}

// Возвращает null, если игры нет или она принадлежит другому пользователю
export async function getGame(id: string): Promise<Game | null> {
  const { data, error } = await supabase
    .from('games')
    .select(gameColumns)
    .eq('id', id)
    .maybeSingle()
    .overrideTypes<GameRow, { merge: false }>()

  if (error?.code === INVALID_UUID) return null
  if (error) throw new Error(`Не удалось загрузить игру: ${error.message}`)
  return data ? fromRow(data) : null
}

// Создание идёт через свой Node API: React → Node → Supabase
export async function createGame(draft: GameDraft, accessToken: string): Promise<Game> {
  const row = await apiFetch<GameRow>('/api/games', accessToken, {
    method: 'POST',
    body: JSON.stringify({
      platformId: draft.platform,
      title: draft.title,
      genre: draft.genre,
      status: draft.status,
      rating: draft.rating,
      note: draft.note,
    }),
  })
  return fromRow(row)
}

export async function updateGame(id: string, draft: GameDraft): Promise<Game> {
  const { data, error } = await supabase
    .from('games')
    .update(toWrite(draft))
    .eq('id', id)
    .select(gameColumns)
    .single()
    .overrideTypes<GameRow, { merge: false }>()

  if (error) throw new Error(`Не удалось изменить игру: ${error.message}`)
  return fromRow(data)
}

export async function deleteGame(id: string): Promise<void> {
  const { error } = await supabase.from('games').delete().eq('id', id)

  if (error) throw new Error(`Не удалось удалить игру: ${error.message}`)
}
