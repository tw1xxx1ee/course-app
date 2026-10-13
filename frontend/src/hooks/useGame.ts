import { useEffect, useState } from 'react'
import type { Game } from '../types/game'
import { getGame } from '../services/gameService'

export type GameState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'notFound' }
  | { status: 'success'; game: Game }

// Загружает одну игру по id из адреса страницы
export function useGame(id: string | undefined) {
  const [gameState, setGameState] = useState<GameState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (id === undefined) {
      setGameState({ status: 'notFound' })
      return
    }

    let isActive = true

    setGameState({ status: 'loading' })
    getGame(id)
      .then((game) => {
        if (isActive) {
          setGameState(game ? { status: 'success', game } : { status: 'notFound' })
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          const message = error instanceof Error ? error.message : 'Не удалось загрузить игру.'
          setGameState({ status: 'error', message })
        }
      })

    return () => {
      isActive = false
    }
  }, [id, attempt])

  function retry() {
    setAttempt(attempt + 1)
  }

  return { gameState, retry }
}
