import { HttpError } from './errors.js'

const STATUSES = ['planned', 'playing', 'completed'] as const
const MAX_TITLE_LENGTH = 100
const MAX_GENRE_LENGTH = 50
const MAX_NOTE_LENGTH = 1000
const MAX_PLATFORM_ID_LENGTH = 50

export type GameStatus = typeof STATUSES[number]

// Только поля, которые заполняет пользователь. Владельца сервер берёт из токена.
export type CreateGameInput = {
  platformId: string
  title: string
  genre: string
  status: GameStatus
  rating: number | null
  note: string
}

export const gameColumns = `
  id, owner_id, platform_id, title, genre,
  status, rating, note, created_at,
  platforms(id, name)
`

function isStatus(value: unknown): value is GameStatus {
  return STATUSES.some((status) => status === value)
}

function isRating(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 10
}

// Проверяет тело POST /api/games и возвращает очищенные значения
export function parseCreateGame(value: unknown): CreateGameInput {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new HttpError(400, 'VALIDATION_ERROR', 'Ожидается JSON-объект')
  }

  const body: Record<string, unknown> = { ...value }
  const fields: Record<string, string> = {}

  if ('owner_id' in body || 'ownerId' in body) {
    fields.owner_id = 'Владельца нельзя передавать: он определяется по токену'
  }

  const title = typeof body.title === 'string' ? body.title.trim() : ''
  if (title.length === 0 || title.length > MAX_TITLE_LENGTH) {
    fields.title = `Название должно содержать от 1 до ${MAX_TITLE_LENGTH} символов`
  }

  const platformId = typeof body.platformId === 'string' ? body.platformId.trim() : ''
  if (platformId.length === 0 || platformId.length > MAX_PLATFORM_ID_LENGTH) {
    fields.platformId = 'Укажите платформу'
  }

  const genre = typeof body.genre === 'string' ? body.genre.trim() : ''
  if (genre.length === 0 || genre.length > MAX_GENRE_LENGTH) {
    fields.genre = `Жанр должен содержать от 1 до ${MAX_GENRE_LENGTH} символов`
  }

  const status = isStatus(body.status) ? body.status : undefined
  if (status === undefined) {
    fields.status = 'Статус должен быть planned, playing или completed'
  }

  // Оценки может не быть: null или отсутствие поля
  let rating: number | null = null
  if (body.rating !== undefined && body.rating !== null) {
    if (isRating(body.rating)) {
      rating = body.rating
    } else {
      fields.rating = 'Оценка должна быть целым числом от 1 до 10 или null'
    }
  }

  let note = ''
  if (body.note !== undefined) {
    if (typeof body.note === 'string' && body.note.length <= MAX_NOTE_LENGTH) {
      note = body.note.trim()
    } else {
      fields.note = `Заметка должна быть строкой до ${MAX_NOTE_LENGTH} символов`
    }
  }

  if (status === undefined || Object.keys(fields).length > 0) {
    throw new HttpError(400, 'VALIDATION_ERROR', 'Проверьте поля запроса', fields)
  }

  return { platformId, title, genre, status, rating, note }
}
