import type { PlatformsState } from '../hooks/usePlatforms'

type PlatformSelectProps = {
  value: string
  platformsState: PlatformsState
  onChange: (platformId: string) => void
  onRetry: () => void
}

export function PlatformSelect({ value, platformsState, onChange, onRetry }: PlatformSelectProps) {
  const platforms = platformsState.status === 'success' ? platformsState.platforms : []
  const isEmpty = platformsState.status === 'success' && platforms.length === 0
  // Платформа записи, которой нет в загруженном справочнике
  const isUnknown = platformsState.status === 'success' && value !== '' &&
    !platforms.some((platform) => platform.id === value)

  return (
    <>
      <label htmlFor="game-platform">Платформа</label>
      <select id="game-platform" value={value} required
        disabled={platforms.length === 0}
        onChange={(event) => onChange(event.target.value)}>
        <option value="">Выберите платформу</option>
        {isUnknown && (
          <option value={value} disabled>Неизвестная платформа: {value}</option>
        )}
        {platforms.map((platform) => (
          <option key={platform.id} value={platform.id}>{platform.name}</option>
        ))}
      </select>

      {platformsState.status === 'loading' && (
        <p role="status" className="hint">Загружаем платформы…</p>
      )}

      {platformsState.status === 'error' && (
        <div className="field-message">
          <p role="alert" className="error">{platformsState.message}</p>
          <button type="button" className="button-secondary" onClick={onRetry}>
            Повторить
          </button>
        </div>
      )}

      {isEmpty && (
        <div className="field-message">
          <p role="status">Платформ пока нет. Сохранение недоступно.</p>
          <button type="button" className="button-secondary" onClick={onRetry}>
            Повторить
          </button>
        </div>
      )}

      {isUnknown && !isEmpty && (
        <p role="status" className="hint">
          Этой платформы нет в справочнике. Выберите другую.
        </p>
      )}

      {platforms.length > 0 && (
        <button type="button" className="button-link" onClick={onRetry}>
          Обновить справочник
        </button>
      )}
    </>
  )
}
