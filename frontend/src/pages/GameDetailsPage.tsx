import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { GameStateMessage } from '../components/GameStateMessage'
import { StatusBadge } from '../components/StatusBadge'
import { useGame } from '../hooks/useGame'
import { deleteGame } from '../services/gameService'

export function GameDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { gameState, retry } = useGame(id)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  if (gameState.status !== 'success') {
    return <GameStateMessage gameState={gameState} onRetry={retry} />
  }

  const game = gameState.game

  async function handleDelete() {
    if (!window.confirm(`Удалить игру «${game.title}»?`)) return

    setIsDeleting(true)
    setDeleteError('')
    try {
      await deleteGame(game.id)
      navigate('/games', { replace: true })
    } catch (error: unknown) {
      setDeleteError(error instanceof Error ? error.message : 'Не удалось удалить игру.')
      setIsDeleting(false)
    }
  }

  return (
    <section className="details">
      <Link to="/games" className="back-link">← Все игры</Link>
      <h1>{game.title}</h1>
      <StatusBadge status={game.status} />

      <dl className="details-list">
        <dt>Платформа</dt>
        <dd>{game.platformName}</dd>
        <dt>Жанр</dt>
        <dd>{game.genre}</dd>
        <dt>Оценка</dt>
        <dd>{game.rating === null ? 'Без оценки' : `${game.rating} / 10`}</dd>
        <dt>Заметка</dt>
        <dd>{game.note || 'Нет заметки'}</dd>
      </dl>

      <div className="actions">
        <Link to={`/games/${game.id}/edit`} className="button">Редактировать</Link>
        <button type="button" className="button-danger" disabled={isDeleting}
          onClick={handleDelete}>
          {isDeleting ? 'Удаляем…' : 'Удалить'}
        </button>
      </div>

      {deleteError && <p role="alert" className="error">{deleteError}</p>}
    </section>
  )
}
