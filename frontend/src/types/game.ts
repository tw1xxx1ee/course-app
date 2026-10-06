export type GameStatus = 'planned' | 'playing' | 'completed'

export type Game = {
  id: string
  title: string
  platform: string
  genre: string
  status: GameStatus
  rating: number | null
  note: string
}
