import type { Game, GameDraft } from '../types/game'
import { supabase } from '../lib/supabase'

// Строка таблицы games: имена столбцов как в базе
type GameRow = {
  id: string
  owner_id: string
  platform_id: string
  title: string
  genre: string
  status: Game['status']
  rating: number | null
  note: string
  created_at: string
}

const gameColumns = 'id, owner_id, platform_id, title, genre, status, rating, note, created_at'

function fromRow(row: GameRow): Game {
  return {
    id: row.id,
    title: row.title,
    platform: row.platform_id,
    genre: row.genre,
    status: row.status,
    rating: row.rating,
    note: row.note,
  }
}

// owner_id не передаём: база подставит текущего пользователя
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

export async function getGames(): Promise<Game[]> {
  const { data, error } = await supabase
    .from('games')
    .select(gameColumns)
    .order('created_at', { ascending: false })
    .overrideTypes<GameRow[], { merge: false }>()

  if (error) throw new Error(`Не удалось загрузить игры: ${error.message}`)
  return data.map(fromRow)
}

export async function createGame(draft: GameDraft): Promise<Game> {
  const { data, error } = await supabase
    .from('games')
    .insert(toWrite(draft))
    .select(gameColumns)
    .single()
    .overrideTypes<GameRow, { merge: false }>()

  if (error) throw new Error(`Не удалось создать игру: ${error.message}`)
  return fromRow(data)
}

export async function updateGame(id: string, draft: GameDraft): Promise<void> {
  const { error } = await supabase
    .from('games')
    .update(toWrite(draft))
    .eq('id', id)

  if (error) throw new Error(`Не удалось изменить игру: ${error.message}`)
}

export async function deleteGame(id: string): Promise<void> {
  const { error } = await supabase.from('games').delete().eq('id', id)

  if (error) throw new Error(`Не удалось удалить игру: ${error.message}`)
}
