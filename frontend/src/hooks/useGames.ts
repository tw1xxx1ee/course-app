import { useEffect, useState } from 'react'
import type { Game } from '../types/game'
import { getGames } from '../services/gameService'
import type { GameFilters } from '../services/gameService'

export type GamesState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; games: Game[] }

// Загружает список игр из базы с учётом фильтров
export function useGames(filters: GameFilters) {
  const [gamesState, setGamesState] = useState<GamesState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let isActive = true

    setGamesState({ status: 'loading' })
    getGames(filters)
      .then((games) => {
        if (isActive) setGamesState({ status: 'success', games })
      })
      .catch((error: unknown) => {
        if (isActive) {
          const message = error instanceof Error ? error.message : 'Не удалось загрузить игры.'
          setGamesState({ status: 'error', message })
        }
      })

    return () => {
      isActive = false
    }
  }, [filters, attempt])

  function retry() {
    setAttempt(attempt + 1)
  }

  return { gamesState, retry }
}
