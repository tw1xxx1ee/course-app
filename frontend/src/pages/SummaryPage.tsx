import { useState } from 'react'
import { useGames } from '../hooks/useGames'
import { emptyGameFilters } from '../services/gameService'
import { getGameSummary } from '../services/summaryService'
import type { GameSummary } from '../services/summaryService'

type SummaryState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; summary: GameSummary }

export function SummaryPage() {
  // Страница при каждом открытии заново читает игры, поэтому сводка не устаревает
  const { gamesState, retry } = useGames(emptyGameFilters)
  const [summaryState, setSummaryState] = useState<SummaryState>({ status: 'idle' })

  if (gamesState.status === 'loading') {
    return <p role="status">Загружаем игры…</p>
  }

  if (gamesState.status === 'error') {
    return (
      <div className="empty">
        <p role="alert" className="error">{gamesState.message}</p>
        <button type="button" className="button-secondary" onClick={retry}>
          Повторить
        </button>
      </div>
    )
  }

  const games = gamesState.games

  async function handleCalculate() {
    setSummaryState({ status: 'loading' })
    try {
      const summary = await getGameSummary(games)
      setSummaryState({ status: 'success', summary })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Не удалось рассчитать сводку.'
      setSummaryState({ status: 'error', message })
    }
  }

  return (
    <section>
      <h1>Сводка</h1>
      <p>Игр в коллекции: {games.length}. Расчёт выполняет сервер.</p>

      <button type="button" className="button"
        disabled={summaryState.status === 'loading'} onClick={handleCalculate}>
        {summaryState.status === 'loading' ? 'Считаем…' : 'Рассчитать'}
      </button>

      {summaryState.status === 'idle' && (
        <p className="hint summary-hint">Сводка ещё не рассчитана.</p>
      )}

      {summaryState.status === 'error' && (
        <p role="alert" className="error summary-hint">{summaryState.message}</p>
      )}

      {summaryState.status === 'success' && (
        <dl className="summary">
          <div>
            <dt>Всего игр</dt>
            <dd>{summaryState.summary.total}</dd>
          </div>
          <div>
            <dt>Пройдено</dt>
            <dd>{summaryState.summary.completed}</dd>
          </div>
          <div>
            <dt>Доля пройденных</dt>
            <dd>{summaryState.summary.completedPercent}%</dd>
          </div>
        </dl>
      )}
    </section>
  )
}
