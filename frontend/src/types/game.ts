export type GameStatus = 'planned' | 'playing' | 'completed'

export type Game = {
  id: string
  title: string
  platform: string
  platformName: string
  genre: string
  status: GameStatus
  rating: number | null
  note: string
}

// Поля формы: id ставит база, название платформы приходит из справочника
export type GameDraft = Omit<Game, 'id' | 'platformName'>
