import { Outlet } from 'react-router'
import type { GamesState } from '../types/game'

type RequireGamesProps = {
  gamesState: GamesState
  onRetry: () => void
}

// Показывает страницы только после того, как игры загружены из базы
export function RequireGames({ gamesState, onRetry }: RequireGamesProps) {
  if (gamesState.status === 'loading') {
    return <p role="status">Загружаем игры…</p>
  }
  if (gamesState.status === 'error') {
    return (
      <div className="empty">
        <p role="alert" className="error">{gamesState.message}</p>
        <button type="button" className="button-secondary" onClick={onRetry}>
          Повторить
        </button>
      </div>
    )
  }
  return <Outlet />
}
