import { useEffect, useState } from 'react'
import type { Platform } from '../types/platform'
import { getPlatforms } from '../services/platformService'

export type PlatformsState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; platforms: Platform[] }

export function usePlatforms() {
  const [platformsState, setPlatformsState] = useState<PlatformsState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let isActive = true

    getPlatforms(controller.signal)
      .then((platforms) => {
        if (isActive) {
          setPlatformsState({ status: 'success', platforms })
        }
      })
      .catch((error: unknown) => {
        if (isActive) {
          const message = error instanceof Error ? error.message : 'Не удалось загрузить платформы.'
          setPlatformsState({ status: 'error', message })
        }
      })

    // При уходе со страницы отменяем запрос и игнорируем его ответ
    return () => {
      isActive = false
      controller.abort()
    }
  }, [attempt])

  function retry() {
    setPlatformsState({ status: 'loading' })
    setAttempt(attempt + 1)
  }

  return { platformsState, retry }
}

// Название платформы по id; пока справочник не загружен, показываем многоточие
export function getPlatformName(platformsState: PlatformsState, id: string): string {
  if (platformsState.status !== 'success') return '…'
  const platform = platformsState.platforms.find((item) => item.id === id)
  return platform ? platform.name : id
}
