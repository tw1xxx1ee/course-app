import { Link, useNavigate, useParams } from 'react-router'
import type { Game } from '../types/game'
import { StatusBadge } from '../components/StatusBadge'
import { getPlatformName, usePlatforms } from '../hooks/usePlatforms'

type GameDetailsPageProps = {
  games: Game[]
  onDelete: (id: string) => void
}

export function GameDetailsPage({ games, onDelete }: GameDetailsPageProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { platformsState } = usePlatforms()
  const game = games.find((item) => item.id === id)

  if (!game) {
    return (
      <section>
        <h1>Игра не найдена</h1>
        <Link to="/games">← Все игры</Link>
      </section>
    )
  }

  return (
    <section className="details">
      <Link to="/games" className="back-link">← Все игры</Link>
      <h1>{game.title}</h1>
      <StatusBadge status={game.status} />

      <dl className="details-list">
        <dt>Платформа</dt>
        <dd>{getPlatformName(platformsState, game.platform)}</dd>
        <dt>Жанр</dt>
        <dd>{game.genre}</dd>
        <dt>Оценка</dt>
        <dd>{game.rating === null ? 'Без оценки' : `${game.rating} / 10`}</dd>
        <dt>Заметка</dt>
        <dd>{game.note || 'Нет заметки'}</dd>
      </dl>

      <div className="actions">
        <Link to={`/games/${game.id}/edit`} className="button">Редактировать</Link>
        <button type="button" className="button-danger" onClick={() => {
          if (window.confirm(`Удалить игру «${game.title}»?`)) {
            onDelete(game.id)
            navigate('/games', { replace: true })
          }
        }}>
          Удалить
        </button>
      </div>
    </section>
  )
}
