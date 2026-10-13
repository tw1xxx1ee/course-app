import { Link } from 'react-router'
import type { GameState } from '../hooks/useGame'

type GameStateMessageProps = {
  gameState: GameState
  onRetry: () => void
}

// Что показать, пока игра не загружена: ожидание, ошибка или «не найдена»
export function GameStateMessage({ gameState, onRetry }: GameStateMessageProps) {
  if (gameState.status === 'loading') {
    return <p role="status">Загружаем игру…</p>
  }

  if (gameState.status === 'error') {
    return (
      <div className="empty">
        <p role="alert" className="error">{gameState.message}</p>
        <button type="button" className="button-secondary" onClick={onRetry}>
          Повторить
        </button>
      </div>
    )
  }

  return (
    <section>
      <h1>Игра не найдена</h1>
      <Link to="/games">← Все игры</Link>
    </section>
  )
}
