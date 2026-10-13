import { useNavigate, useParams } from 'react-router'
import { GameForm } from '../components/GameForm'
import { GameStateMessage } from '../components/GameStateMessage'
import { useGame } from '../hooks/useGame'
import { updateGame } from '../services/gameService'
import type { GameDraft } from '../types/game'

export function EditGamePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { gameState, retry } = useGame(id)

  if (gameState.status !== 'success') {
    return <GameStateMessage gameState={gameState} onRetry={retry} />
  }

  const game = gameState.game

  const initialValues: GameDraft = {
    title: game.title,
    platform: game.platform,
    genre: game.genre,
    status: game.status,
    rating: game.rating,
    note: game.note,
  }

  // Страница игры после перехода заново загрузит сохранённую запись из базы
  async function handleSave(draft: GameDraft) {
    const saved = await updateGame(game.id, draft)
    navigate(`/games/${saved.id}`)
  }

  return (
    <section>
      <h1>Редактирование игры</h1>
      <GameForm
        key={game.id}
        initialValues={initialValues}
        onSave={handleSave}
        onCancel={() => navigate(`/games/${game.id}`)}
      />
    </section>
  )
}
