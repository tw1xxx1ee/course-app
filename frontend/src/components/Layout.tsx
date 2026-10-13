import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router'
import type { AuthState } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

type LayoutProps = { auth: AuthState }

export function Layout({ auth }: LayoutProps) {
  const [signOutError, setSignOutError] = useState('')

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut({ scope: 'local' })
    setSignOutError(error ? 'Не удалось выйти. Попробуйте ещё раз.' : '')
  }

  return (
    <div className="app">
      <header className="app-header">
        <Link to="/games" className="app-title">Каталог игр</Link>

        {auth.status === 'authenticated' && (
          <nav aria-label="Основная навигация">
            <NavLink to="/games" end>Мои игры</NavLink>
            <NavLink to="/games/new">Добавить игру</NavLink>
          </nav>
        )}

        {auth.status === 'authenticated' && (
          <div className="account">
            <span className="account-email">{auth.session.user.email}</span>
            <button type="button" className="button-secondary" onClick={handleSignOut}>
              Выйти
            </button>
          </div>
        )}
      </header>

      {signOutError && <p role="alert" className="error">{signOutError}</p>}

      <main><Outlet /></main>
    </div>
  )
}
