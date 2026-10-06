import type { Platform } from '../types/platform'

const platformsUrl = `${import.meta.env.BASE_URL}demo/platforms.json`

function isPlatform(value: unknown): value is Platform {
  if (typeof value !== 'object' || value === null) return false
  if (!('id' in value) || !('name' in value)) return false

  const hasId = typeof value.id === 'string' && value.id !== '' && value.id === value.id.trim()
  const hasName = typeof value.name === 'string' && value.name.trim() !== ''
  return hasId && hasName
}

export function parsePlatforms(value: unknown): Platform[] {
  if (!Array.isArray(value) || !value.every(isPlatform)) {
    throw new Error('Неверная структура справочника платформ.')
  }

  const ids = value.map((platform) => platform.id)
  if (new Set(ids).size !== ids.length) {
    throw new Error('В справочнике повторяются идентификаторы.')
  }

  return value
}

export async function getPlatforms(signal: AbortSignal): Promise<Platform[]> {
  const response = await fetch(platformsUrl, { signal, cache: 'no-store' })
  if (!response.ok) {
    throw new Error(`Не удалось загрузить платформы: HTTP ${response.status}`)
  }

  const data: unknown = await response.json()
  return parsePlatforms(data)
}
