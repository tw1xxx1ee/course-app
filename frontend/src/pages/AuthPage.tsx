import { useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '../lib/supabase'

type Mode = 'login' | 'register'

const MIN_PASSWORD_LENGTH = 8

export function AuthPage() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  function switchMode(nextMode: Mode) {
    setMode(nextMode)
    setError('')
    setMessage('')
  }

  async function login() {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    if (error) throw error
    // Дальше App увидит сессию и сам откроет список игр
  }

  async function register() {
    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new Error(`Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов.`)
    }
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: window.location.origin },
    })
    if (error) throw error
    // Если включено подтверждение email, сессии ещё нет
    if (!data.session) {
      setMessage('Проверьте почту и подтвердите регистрацию, затем войдите.')
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsPending(true)
    setError('')
    setMessage('')
    try {
      if (mode === 'login') {
        await login()
      } else {
        await register()
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Не удалось выполнить запрос.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <section>
      <h1>{mode === 'login' ? 'Вход' : 'Регистрация'}</h1>

      <div className="filters" role="group" aria-label="Режим">
        <button type="button" className="chip" aria-pressed={mode === 'login'}
          onClick={() => switchMode('login')}>
          Вход
        </button>
        <button type="button" className="chip" aria-pressed={mode === 'register'}
          onClick={() => switchMode('register')}>
          Регистрация
        </button>
      </div>

      <form className="game-form" onSubmit={handleSubmit}>
        <label htmlFor="auth-email">Email</label>
        <input id="auth-email" type="email" autoComplete="email" required
          value={email} onChange={(event) => setEmail(event.target.value)}
        />

        <label htmlFor="auth-password">Пароль</label>
        <input id="auth-password" type="password" required
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          value={password} onChange={(event) => setPassword(event.target.value)}
        />

        {error && <p role="alert" className="error">{error}</p>}
        {message && <p role="status" className="hint">{message}</p>}

        <div className="actions">
          <button type="submit" className="button" disabled={isPending}>
            {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </div>
      </form>
    </section>
  )
}
