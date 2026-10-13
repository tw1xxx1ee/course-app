// Ошибка с HTTP-статусом: общий обработчик превращает её в JSON-ответ
export class HttpError extends Error {
  status: number
  code: string
  // Ошибки отдельных полей: { title: 'Название обязательно' }
  fields?: Record<string, string>

  constructor(status: number, code: string, message: string, fields?: Record<string, string>) {
    super(message)
    this.status = status
    this.code = code
    this.fields = fields
  }
}

// Коды ошибок PostgreSQL
const FOREIGN_KEY_VIOLATION = '23503'
const CHECK_VIOLATION = '23514'
const UNIQUE_VIOLATION = '23505'

// Переводит ожидаемые ошибки базы в безопасные ответы. Остальное — 500 без подробностей.
export function mapSupabaseError(error: { code?: string; message: string }): HttpError {
  if (error.code === FOREIGN_KEY_VIOLATION) {
    return new HttpError(400, 'VALIDATION_ERROR', 'Выбранной платформы нет в справочнике')
  }
  if (error.code === CHECK_VIOLATION) {
    return new HttpError(400, 'VALIDATION_ERROR', 'Данные не проходят ограничения базы')
  }
  if (error.code === UNIQUE_VIOLATION) {
    return new HttpError(409, 'CONFLICT', 'Такая запись уже существует')
  }

  console.error('Supabase error:', error.code, error.message)
  return new HttpError(500, 'INTERNAL_ERROR', 'Ошибка сервера')
}
