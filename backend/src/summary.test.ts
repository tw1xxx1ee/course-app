import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateGameSummary, parseSummaryQuery } from './summary.js'
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

test('summary query: platform is optional', () => {
  assert.equal(parseSummaryQuery({}), null)
  assert.equal(parseSummaryQuery({ platformId: 'pc' }), 'pc')
  assert.throws(() => parseSummaryQuery({ platformId: '' }), HttpError)
  assert.throws(() => parseSummaryQuery({ platformId: ['pc', 'ps5'] }), HttpError)
})
