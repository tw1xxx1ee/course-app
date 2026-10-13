import type { Platform } from '../types/platform'
import { supabase } from '../lib/supabase'

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
  const { data, error } = await supabase
    .from('platforms')
    .select('id, name')
    .order('name')
    .abortSignal(signal)

  if (signal.aborted) {
    throw new DOMException('Запрос отменён', 'AbortError')
  }
  if (error) {
    throw new Error(`Не удалось загрузить платформы: ${error.message}`)
  }

  return parsePlatforms(data)
}
