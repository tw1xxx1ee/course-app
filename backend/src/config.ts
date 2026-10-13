// Читает обязательную переменную окружения или останавливает запуск
function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Не задана переменная окружения ${name}`)
  }
  return value
}

function readPort(): number {
  const port = Number(process.env.PORT ?? '3000')
  if (!Number.isInteger(port) || port < 1) {
    throw new Error('PORT должен быть положительным целым числом')
  }
  return port
}

export const supabaseUrl = requireEnv('SUPABASE_URL')
export const supabasePublishableKey = requireEnv('SUPABASE_PUBLISHABLE_KEY')
// Точный адрес интерфейса без пути и завершающего слеша: только ему CORS разрешает читать ответы
export const frontendOrigin = requireEnv('FRONTEND_ORIGIN')
export const port = readPort()
// 0.0.0.0 — слушать все сетевые интерфейсы, этого требует хостинг
export const host = process.env.HOST ?? '0.0.0.0'
