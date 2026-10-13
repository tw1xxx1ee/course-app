import { useNavigate } from 'react-router'
import { GameForm } from '../components/GameForm'
import type { GameDraft } from '../types/game'

type AddGamePageProps = {
  onCreate: (draft: GameDraft) => Promise<string>
}

const emptyGame: GameDraft = {
  title: '',
  platform: '',
  genre: '',
  status: 'planned',
  rating: null,
  note: '',
}

export function AddGamePage({ onCreate }: AddGamePageProps) {
  const navigate = useNavigate()

  async function handleSave(draft: GameDraft) {
    const id = await onCreate(draft)
    navigate(`/games/${id}`)
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
