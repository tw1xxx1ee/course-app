import { Link } from 'react-router'
import type { Game } from '../types/game'
import { StatusBadge } from './StatusBadge'

type GameCardProps = { game: Game }

export function GameCard({ game }: GameCardProps) {
  return (
    <article className="game-card">
      <h2>
        <Link to={`/games/${game.id}`}>{game.title}</Link>
      </h2>
      <p className="game-meta">{game.platformName} · {game.genre}</p>
      <div className="game-card-footer">
        <StatusBadge status={game.status} />
        <span className="rating">
          {game.rating === null ? 'Без оценки' : `${game.rating} / 10`}
        </span>
      </div>
    </article>
  )
}
