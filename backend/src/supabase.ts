import { createClient } from '@supabase/supabase-js'
import { supabasePublishableKey, supabaseUrl } from './config.js'

// Сервер не хранит и не обновляет сессии пользователей
const authOptions = {
  autoRefreshToken: false,
  persistSession: false,
  detectSessionInUrl: false,
}

// Общий клиент только для проверки токена
export const authClient = createClient(supabaseUrl, supabasePublishableKey, {
  auth: authOptions,
})

// Отдельный клиент на каждый запрос: база видит пользователя этого токена, RLS работает
export function createUserClient(token: string) {
  return createClient(supabaseUrl, supabasePublishableKey, {
    accessToken: async () => token,
    auth: authOptions,
  })
}

export type UserClient = ReturnType<typeof createUserClient>
