import express from 'express'
import type { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { getAuth, requireUser } from './auth.js'
import { frontendOrigin, port } from './config.js'
import { HttpError, mapSupabaseError } from './errors.js'
import { gameColumns, parseCreateGame } from './games.js'
import { calculateGameSummary, loadGamesForSummary, parseSummaryQuery } from './summary.js'
import { createUserClient } from './supabase.js'

const app = express()

app.use(cors({
  origin: frontendOrigin,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Authorization', 'Content-Type'],
}))
app.use(express.json({ limit: '100kb' }))

app.get('/api/health', (_request, response) => {
  response.status(200).json({ status: 'ok' })
})

// Создание игры: владелец берётся из проверенного токена, а не из тела запроса
app.post('/api/games', requireUser, async (request, response) => {
  const input = parseCreateGame(request.body)
  const { token, userId } = getAuth(response)
  const supabase = createUserClient(token)

  const { data, error } = await supabase
    .from('games')
    .insert({
      owner_id: userId,
      platform_id: input.platformId,
      title: input.title,
      genre: input.genre,
      status: input.status,
      rating: input.rating,
      note: input.note,
    })
    .select(gameColumns)
    .single()

  if (error) throw mapSupabaseError(error)
  response.status(201).json({ data })
})

// Личная сводка: сервер сам читает игры пользователя из базы и считает показатели
app.get('/api/summary', requireUser, async (request, response) => {
  const platformId = parseSummaryQuery(request.query)
  const { token } = getAuth(response)
  const supabase = createUserClient(token)

  const games = await loadGamesForSummary(supabase, platformId)
  const data = calculateGameSummary(games)
  response.status(200).json({ data })
})

app.use((_request, response) => {
  response.status(404).json({
    error: { code: 'NOT_FOUND', message: 'Маршрут не найден' },
  })
})

// Ошибка express.json: тело больше установленного лимита
function isPayloadTooLarge(error: unknown): boolean {
  return typeof error === 'object' && error !== null &&
    'type' in error && error.type === 'entity.too.large'
}

// Общий обработчик ошибок: клиент получает только код, сообщение и ошибки полей
app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  if (error instanceof HttpError) {
    response.status(error.status).json({
      error: { code: error.code, message: error.message, fields: error.fields },
    })
    return
  }

  // Ошибку разбора тела бросает express.json до маршрута
  if (error instanceof SyntaxError) {
    response.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Тело запроса не является корректным JSON' },
    })
    return
  }

  if (isPayloadTooLarge(error)) {
    response.status(413).json({
      error: { code: 'PAYLOAD_TOO_LARGE', message: 'Тело запроса больше 100 КБ' },
    })
    return
  }

  console.error(error)
  response.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Ошибка сервера' },
  })
})

app.listen(port, () => console.log(`API: http://localhost:${port}`))
