import { Link, useParams } from 'react-router'
import { StatusBadge } from '../components/StatusBadge'
import { demoGames } from '../data/demoGames'

export function GameDetailsPage() {
  const { id } = useParams()
  const game = demoGames.find((item) => item.id === id)

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
        <dd>{game.platform}</dd>
        <dt>Жанр</dt>
        <dd>{game.genre}</dd>
        <dt>Оценка</dt>
        <dd>{game.rating === null ? 'Без оценки' : `${game.rating} / 10`}</dd>
        <dt>Заметка</dt>
        <dd>{game.note || 'Нет заметки'}</dd>
      </dl>
    </section>
  )
}
