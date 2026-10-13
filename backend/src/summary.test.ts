import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateGameSummary, parseSummaryBody } from './summary.js'
import { HttpError } from './errors.js'

test('empty game list', () => {
  assert.deepEqual(calculateGameSummary([]), {
    total: 0, completed: 0, completedPercent: 0,
  })
})

test('counts completed games and rounds the percent', () => {
  const result = calculateGameSummary([
    { status: 'completed' },
    { status: 'playing' },
    { status: 'planned' },
  ])
  assert.deepEqual(result, { total: 3, completed: 1, completedPercent: 33 })
})

test('all games completed', () => {
  const result = calculateGameSummary([{ status: 'completed' }, { status: 'completed' }])
  assert.deepEqual(result, { total: 2, completed: 2, completedPercent: 100 })
})

test('valid body is accepted', () => {
  assert.deepEqual(parseSummaryBody({ items: [{ status: 'playing' }] }), [{ status: 'playing' }])
})

test('body without items and unknown status are rejected', () => {
  assert.throws(() => parseSummaryBody({}), HttpError)
  assert.throws(() => parseSummaryBody({ items: 'games' }), HttpError)
  assert.throws(() => parseSummaryBody({ items: [{ status: 'done' }] }), HttpError)
})
