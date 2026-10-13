import express from 'express'
import type { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { HttpError } from './errors.js'
import { calculateGameSummary, parseSummaryBody } from './summary.js'

const app = express()
const port = Number(process.env.PORT ?? 3000)
const frontendOrigin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173'

app.use(cors({
  origin: frontendOrigin,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}))
app.use(express.json({ limit: '100kb' }))

app.get('/api/health', (_request, response) => {
  response.status(200).json({ status: 'ok' })
})

// Временный маршрут ЛР 8: браузер присылает игры, сервер считает сводку
app.post('/api/summary/:kind', (request, response) => {
  if (request.params.kind !== 'games') {
    throw new HttpError(404, 'NOT_FOUND', 'Вид сводки не найден')
  }

  const items = parseSummaryBody(request.body)
  const data = calculateGameSummary(items)
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

// Общий обработчик ошибок: клиент получает только код и сообщение
app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  if (error instanceof HttpError) {
    response.status(error.status).json({
      error: { code: error.code, message: error.message },
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
