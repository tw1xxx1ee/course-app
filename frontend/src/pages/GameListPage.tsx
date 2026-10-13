import { useState } from 'react'
import { Link } from 'react-router'
import { GameCard } from '../components/GameCard'
import { GameFiltersForm } from '../components/GameFiltersForm'
import { useGames } from '../hooks/useGames'
import { emptyGameFilters } from '../services/gameService'

export function GameListPage() {
  const [filters, setFilters] = useState(emptyGameFilters)
  const { gamesState, retry } = useGames(filters)

  const hasFilters =
    filters.query !== '' ||
    filters.status !== 'all' ||
    filters.platformId !== 'all'

  return (
    <section>
      <h1>Мои игры</h1>

      <GameFiltersForm isPending={gamesState.status === 'loading'} onApply={setFilters} />

      {gamesState.status === 'loading' && (
        <p role="status">Загружаем игры…</p>
      )}

      {gamesState.status === 'error' && (
        <div className="empty">
          <p role="alert" className="error">{gamesState.message}</p>
          <button type="button" className="button-secondary" onClick={retry}>
            Повторить
          </button>
        </div>
      )}

      {gamesState.status === 'success' && gamesState.games.length === 0 && !hasFilters && (
        <div className="empty">
          <p>В коллекции пока нет игр.</p>
          <Link to="/games/new" className="button">Добавить первую игру</Link>
        </div>
      )}

      {gamesState.status === 'success' && gamesState.games.length === 0 && hasFilters && (
        <div className="empty">
          <p>По этим фильтрам ничего не найдено. Измените условия или нажмите «Сбросить».</p>
        </div>
      )}

      {gamesState.status === 'success' && gamesState.games.length > 0 && (
        <div className="game-list">
          {gamesState.games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </section>
  )
}
