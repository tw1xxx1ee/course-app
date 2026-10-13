import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export type AuthState =
  | { status: 'checking' }
  | { status: 'guest' }
  | { status: 'authenticated'; session: Session }

function fromSession(session: Session | null): AuthState {
  return session
    ? { status: 'authenticated', session }
    : { status: 'guest' }
}

export function useAuth(): AuthState {
  const [auth, setAuth] = useState<AuthState>({ status: 'checking' })

  useEffect(() => {
    let isActive = true

    // Вход, выход и обновление токена
    const { data: { subscription } } = supabase.auth
      .onAuthStateChange((_event, session) => {
        if (isActive) setAuth(fromSession(session))
      })

    // Восстановление сессии при открытии страницы
    void supabase.auth.getSession().then(({ data, error }) => {
      if (!isActive) return
      setAuth((current) => current.status === 'checking'
        ? (error ? { status: 'guest' } : fromSession(data.session))
        : current)
    })

    return () => {
      isActive = false
      subscription.unsubscribe()
    }
  }, [])

  return auth
}
