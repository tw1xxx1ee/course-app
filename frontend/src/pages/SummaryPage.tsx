import { useState } from 'react'
import { usePlatforms } from '../hooks/usePlatforms'
import { getGameSummary } from '../services/summaryService'
import type { GameSummary } from '../services/summaryService'

type SummaryPageProps = { accessToken: string }

type SummaryState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; summary: GameSummary }

export function SummaryPage({ accessToken }: SummaryPageProps) {
  const [platformId, setPlatformId] = useState('all')
  const [summaryState, setSummaryState] = useState<SummaryState>({ status: 'idle' })
  const { platformsState } = usePlatforms()
  const platforms = platformsState.status === 'success' ? platformsState.platforms : []

  async function handleCalculate() {
    setSummaryState({ status: 'loading' })
    try {
      const summary = await getGameSummary(accessToken, platformId)
      setSummaryState({ status: 'success', summary })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Не удалось рассчитать сводку.'
      setSummaryState({ status: 'error', message })
    }
  }

  return (
    <section>
      <h1>Сводка</h1>
      <p>Сервер читает ваши игры из базы и считает показатели.</p>

      <div className="filters-form">
        <div className="filter-field">
          <label htmlFor="summary-platform">Платформа</label>
          <select id="summary-platform" value={platformId}
            onChange={(event) => {
              setPlatformId(event.target.value)
              // Прежний результат относился к другому условию
              setSummaryState({ status: 'idle' })
            }}>
            <option value="all">Все платформы</option>
            {platforms.map((platform) => (
              <option key={platform.id} value={platform.id}>{platform.name}</option>
            ))}
          </select>
        </div>

        <div className="actions">
          <button type="button" className="button"
            disabled={summaryState.status === 'loading'} onClick={handleCalculate}>
            {summaryState.status === 'loading' ? 'Считаем…' : 'Рассчитать'}
          </button>
        </div>
      </div>

      {summaryState.status === 'idle' && (
        <p className="hint">Сводка ещё не рассчитана.</p>
      )}

      {summaryState.status === 'error' && (
        <p role="alert" className="error">{summaryState.message}</p>
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
