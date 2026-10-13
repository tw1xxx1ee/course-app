import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { RequireAuth } from './components/RequireAuth'
import { RequireGames } from './components/RequireGames'
import { AuthPage } from './pages/AuthPage'
import { GameListPage } from './pages/GameListPage'
import { GameDetailsPage } from './pages/GameDetailsPage'
import { AddGamePage } from './pages/AddGamePage'
import { EditGamePage } from './pages/EditGamePage'
import { NotFoundPage } from './pages/NotFoundPage'
import type { GameDraft, GamesState } from './types/game'
import { useAuth } from './hooks/useAuth'
import { createGame, deleteGame, getGames, updateGame } from './services/gameService'
import './App.css'

export default function App() {
  const auth = useAuth()
  const userId = auth.status === 'authenticated' ? auth.session.user.id : null

  const [gamesState, setGamesState] = useState<GamesState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)
  const games = gamesState.status === 'success' ? gamesState.games : []

  // Загружаем игры после входа. При выходе и смене пользователя список очищается.
  useEffect(() => {
    setGamesState({ status: 'loading' })
    if (userId === null) return

    let isActive = true
    getGames()
      .then((games) => {
        if (isActive) setGamesState({ status: 'success', games })
      })
      .catch((error: unknown) => {
        if (isActive) {
          const message = error instanceof Error ? error.message : 'Не удалось загрузить игры.'
          setGamesState({ status: 'error', message })
        }
      })

    return () => {
      isActive = false
    }
  }, [userId, attempt])

  async function reloadGames(): Promise<void> {
    const games = await getGames()
    setGamesState({ status: 'success', games })
  }

  async function handleCreate(draft: GameDraft): Promise<string> {
    const game = await createGame(draft)
    await reloadGames()
    return game.id
  }

  async function handleUpdate(id: string, draft: GameDraft): Promise<void> {
    await updateGame(id, draft)
    await reloadGames()
  }

  async function handleDelete(id: string): Promise<void> {
    await deleteGame(id)
    await reloadGames()
  }

  return (
    <Routes>
      <Route element={<Layout auth={auth} />}>
        <Route path="auth" element={
          auth.status === 'authenticated' ? <Navigate to="/games" replace /> : <AuthPage />
        } />

        <Route element={<RequireAuth auth={auth} />}>
          <Route element={
            <RequireGames gamesState={gamesState} onRetry={() => setAttempt(attempt + 1)} />
          }>
            <Route index element={<Navigate to="/games" replace />} />
            <Route path="games" element={<GameListPage games={games} />} />
            <Route path="games/new" element={<AddGamePage onCreate={handleCreate} />} />
            <Route path="games/:id" element={
              <GameDetailsPage games={games} onDelete={handleDelete} />
            } />
            <Route path="games/:id/edit" element={
              <EditGamePage games={games} onUpdate={handleUpdate} />
            } />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
