import { useState } from 'react'
import type { FormEvent } from 'react'
import type { GameDraft } from '../types/game'
import { gameStatuses, gameStatusLabels, isGameStatus } from '../data/gameStatuses'

type GameFormProps = {
  initialValues: GameDraft
  onSave: (draft: GameDraft) => void
  onCancel: () => void
}

export function GameForm({ initialValues, onSave, onCancel }: GameFormProps) {
  const [draft, setDraft] = useState(initialValues)
  // Оценку храним отдельно строкой, потому что поле может быть пустым
  const [ratingText, setRatingText] = useState(
    initialValues.rating === null ? '' : String(initialValues.rating)
  )
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const title = draft.title.trim()
    if (title.length === 0 || title.length > 100) {
      setError('Название должно содержать от 1 до 100 символов.')
      return
    }

    const platform = draft.platform.trim()
    if (platform === '') {
      setError('Укажите платформу.')
      return
    }

    const genre = draft.genre.trim()
    if (genre === '') {
      setError('Укажите жанр.')
      return
    }

    const rating = ratingText === '' ? null : Number(ratingText)
    if (rating !== null && (!Number.isInteger(rating) || rating < 1 || rating > 10)) {
      setError('Оценка должна быть целым числом от 1 до 10 или не указана.')
      return
    }

    setError('')
    onSave({ ...draft, title, platform, genre, rating, note: draft.note.trim() })
  }

  return (
    <form className="game-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="game-title">Название</label>
      <input id="game-title" value={draft.title} required
        onChange={(event) => setDraft({ ...draft, title: event.target.value })}
      />

      <label htmlFor="game-platform">Платформа</label>
      <input id="game-platform" value={draft.platform} required
        onChange={(event) => setDraft({ ...draft, platform: event.target.value })}
      />

      <label htmlFor="game-genre">Жанр</label>
      <input id="game-genre" value={draft.genre} required
        onChange={(event) => setDraft({ ...draft, genre: event.target.value })}
      />

      <label htmlFor="game-status">Статус</label>
      <select id="game-status" value={draft.status}
        onChange={(event) => {
          const status = event.target.value
          if (isGameStatus(status)) {
            setDraft({ ...draft, status })
          }
        }}>
        {gameStatuses.map((status) => (
          <option key={status} value={status}>{gameStatusLabels[status]}</option>
        ))}
      </select>

      <label htmlFor="game-rating">Оценка</label>
      <input id="game-rating" type="number" min={1} max={10} value={ratingText}
        placeholder="от 1 до 10, можно оставить пустым"
        onChange={(event) => setRatingText(event.target.value)}
      />

      <label htmlFor="game-note">Заметка</label>
      <textarea id="game-note" value={draft.note}
        onChange={(event) => setDraft({ ...draft, note: event.target.value })}
      />

      {error && <p role="alert" className="error">{error}</p>}

      <div className="actions">
        <button type="submit" className="button">
          Сохранить
        </button>
        <button type="button" className="button-secondary" onClick={onCancel}>
          Отмена
        </button>
      </div>
    </form>
  )
}
