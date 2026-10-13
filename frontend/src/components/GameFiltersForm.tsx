import { useState } from 'react'
import type { FormEvent } from 'react'
import { gameStatuses, gameStatusLabels, isGameStatus } from '../data/gameStatuses'
import { usePlatforms } from '../hooks/usePlatforms'
import { emptyGameFilters } from '../services/gameService'
import type { GameFilters } from '../services/gameService'

type GameFiltersFormProps = {
  isPending: boolean
  onApply: (filters: GameFilters) => void
}

const MAX_QUERY_LENGTH = 50

export function GameFiltersForm({ isPending, onApply }: GameFiltersFormProps) {
  const [draft, setDraft] = useState(emptyGameFilters)
  const { platformsState } = usePlatforms()
  const platforms = platformsState.status === 'success' ? platformsState.platforms : []

  // Запрос к базе уходит только по кнопке, а не на каждую букву
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onApply({ ...draft, query: draft.query.trim() })
  }

  function handleReset() {
    setDraft(emptyGameFilters)
    onApply(emptyGameFilters)
  }

  return (
    <form className="filters-form" onSubmit={handleSubmit}>
      <div className="filter-field">
        <label htmlFor="filter-query">Название</label>
        <input id="filter-query" type="search" maxLength={MAX_QUERY_LENGTH}
          placeholder="Часть названия"
          value={draft.query}
          onChange={(event) => setDraft({ ...draft, query: event.target.value })}
        />
      </div>

      <div className="filter-field">
        <label htmlFor="filter-status">Статус</label>
        <select id="filter-status" value={draft.status}
          onChange={(event) => {
            const status = event.target.value
            if (status === 'all' || isGameStatus(status)) {
              setDraft({ ...draft, status })
            }
          }}>
          <option value="all">Все статусы</option>
          {gameStatuses.map((status) => (
            <option key={status} value={status}>{gameStatusLabels[status]}</option>
          ))}
        </select>
      </div>

      <div className="filter-field">
        <label htmlFor="filter-platform">Платформа</label>
        <select id="filter-platform" value={draft.platformId}
          onChange={(event) => setDraft({ ...draft, platformId: event.target.value })}>
          <option value="all">Все платформы</option>
          {platforms.map((platform) => (
            <option key={platform.id} value={platform.id}>{platform.name}</option>
          ))}
        </select>
      </div>

      <div className="actions">
        <button type="submit" className="button" disabled={isPending}>Применить</button>
        <button type="button" className="button-secondary" onClick={handleReset}>
          Сбросить
        </button>
      </div>
    </form>
  )
}
