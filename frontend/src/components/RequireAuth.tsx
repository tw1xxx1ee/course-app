import { Navigate, Outlet } from 'react-router'
import type { AuthState } from '../hooks/useAuth'

type RequireAuthProps = { auth: AuthState }

export function RequireAuth({ auth }: RequireAuthProps) {
  if (auth.status === 'checking') {
    return <p role="status">Проверяем сессию…</p>
  }
  if (auth.status === 'guest') {
    return <Navigate to="/auth" replace />
  }
  return <Outlet />
}
