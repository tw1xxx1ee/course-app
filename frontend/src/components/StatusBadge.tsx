import type { GameStatus } from '../types/game'
import { gameStatusLabels } from '../data/gameStatuses'

type StatusBadgeProps = { status: GameStatus }

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`badge badge-${status}`}>{gameStatusLabels[status]}</span>
  )
}
