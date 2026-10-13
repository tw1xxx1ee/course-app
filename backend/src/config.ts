// Читает обязательную переменную окружения или останавливает запуск
function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Не задана переменная окружения ${name}`)
  }
  return value
}

export const supabaseUrl = requireEnv('SUPABASE_URL')
export const supabasePublishableKey = requireEnv('SUPABASE_PUBLISHABLE_KEY')
export const frontendOrigin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173'
export const port = Number(process.env.PORT ?? 3000)
