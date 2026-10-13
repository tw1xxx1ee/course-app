import { useNavigate } from 'react-router'
import { GameForm } from '../components/GameForm'
import { createGame } from '../services/gameService'
import type { GameDraft } from '../types/game'

const emptyGame: GameDraft = {
  title: '',
  platform: '',
  genre: '',
  status: 'planned',
  rating: null,
  note: '',
}

type AddGamePageProps = { accessToken: string }

export function AddGamePage({ accessToken }: AddGamePageProps) {
  const navigate = useNavigate()

  async function handleSave(draft: GameDraft) {
    const game = await createGame(draft, accessToken)
    navigate(`/games/${game.id}`)
  }

  return (
    <section>
      <h1>Добавление игры</h1>
      <GameForm
        initialValues={emptyGame}
        onSave={handleSave}
        onCancel={() => navigate('/games')}
      />
    </section>
  )
}
