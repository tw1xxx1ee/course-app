import test from 'node:test'
import assert from 'node:assert/strict'
import { parseCreateGame } from './games.js'
import { HttpError } from './errors.js'

const validBody = {
  platformId: 'pc',
  title: '  Portal 2  ',
  genre: 'Головоломка',
  status: 'completed',
  rating: 10,
  note: '',
}

function getFields(body: unknown): Record<string, string> {
  try {
    parseCreateGame(body)
  } catch (error) {
    if (error instanceof HttpError) return error.fields ?? {}
  }
  return {}
}

test('valid game is accepted and trimmed', () => {
  assert.deepEqual(parseCreateGame(validBody), { ...validBody, title: 'Portal 2' })
})

test('rating and note are optional', () => {
  const game = parseCreateGame({ platformId: 'pc', title: 'Hades', genre: 'Roguelike', status: 'playing' })
  assert.equal(game.rating, null)
  assert.equal(game.note, '')
})

test('invalid fields are reported by name', () => {
  const fields = getFields({ ...validBody, title: ' ', status: 'done', rating: 11 })
  assert.deepEqual(Object.keys(fields).sort(), ['rating', 'status', 'title'])
})

test('owner_id in the body is rejected', () => {
  const fields = getFields({ ...validBody, owner_id: '00000000-0000-4000-8000-000000000000' })
  assert.deepEqual(Object.keys(fields), ['owner_id'])
})

test('non-object body is rejected', () => {
  assert.throws(() => parseCreateGame(null), HttpError)
  assert.throws(() => parseCreateGame([validBody]), HttpError)
})
