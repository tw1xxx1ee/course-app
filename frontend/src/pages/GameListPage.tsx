import { useState } from 'react'
import { Link } from 'react-router'
import { GameCard } from '../components/GameCard'
import type { Game, GameStatus } from '../types/game'
import { gameStatuses, gameStatusLabels } from '../data/gameStatuses'

type GameListPageProps = { games: Game[] }

type StatusFilter = GameStatus | 'all'

const filters: StatusFilter[] = ['all', ...gameStatuses]

function matchesFilter(game: Game, filter: StatusFilter): boolean {
  return filter === 'all' || game.status === filter
}

function getFilterLabel(filter: StatusFilter): string {
  return filter === 'all' ? 'Все' : gameStatusLabels[filter]
}

export function GameListPage({ games }: GameListPageProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const visibleGames = games.filter((game) => matchesFilter(game, statusFilter))

  if (games.length === 0) {
    return (
      <section>
        <h1>Мои игры</h1>
        <div className="empty">
          <p>В коллекции пока нет игр.</p>
          <Link to="/games/new" className="button">Добавить первую игру</Link>
        </div>
      </section>
    )
  }

  return (
    <section>
      <h1>Мои игры</h1>

      <div className="filters" role="group" aria-label="Фильтр по статусу">
        {filters.map((filter) => (
          <button key={filter} type="button" className="chip"
            aria-pressed={statusFilter === filter}
            onClick={() => setStatusFilter(filter)}>
            {getFilterLabel(filter)}
            <span className="chip-count">
              {games.filter((game) => matchesFilter(game, filter)).length}
            </span>
          </button>
        ))}
      </div>

      {visibleGames.length === 0 ? (
        <div className="empty">
          <p>Нет игр со статусом «{getFilterLabel(statusFilter)}».</p>
          <button type="button" className="button-secondary"
            onClick={() => setStatusFilter('all')}>
            Показать все игры
          </button>
        </div>
      ) : (
        <div className="game-list">
          {visibleGames.map((game) => (
            <GameCard key={game.id} game={game}
              platformName={game.platform} />
          ))}
        </div>
      )}
    </section>
  )
}
