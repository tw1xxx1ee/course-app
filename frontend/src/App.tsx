import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { GameListPage } from './pages/GameListPage'
import { GameDetailsPage } from './pages/GameDetailsPage'
import { AddGamePage } from './pages/AddGamePage'
import { EditGamePage } from './pages/EditGamePage'
import { NotFoundPage } from './pages/NotFoundPage'
import type { Game, GameDraft } from './types/game'
import { demoGames } from './data/demoGames'
import './App.css'

export default function App() {
  const [games, setGames] = useState<Game[]>(() =>
    demoGames.map((game) => ({ ...game }))
  )

  function createGame(draft: GameDraft): string {
    const id = crypto.randomUUID()
    setGames((current) => [...current, { ...draft, id }])
    return id
  }

  function updateGame(id: string, draft: GameDraft): void {
    setGames((current) => current.map((game) =>
      game.id === id ? { ...draft, id } : game
    ))
  }

  function deleteGame(id: string): void {
    setGames((current) => current.filter((game) => game.id !== id))
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/games" replace />} />
        <Route path="games" element={<GameListPage games={games} />} />
        <Route path="games/new" element={<AddGamePage onCreate={createGame} />} />
        <Route path="games/:id" element={
          <GameDetailsPage games={games} onDelete={deleteGame} />
        } />
        <Route path="games/:id/edit" element={
          <EditGamePage games={games} onUpdate={updateGame} />
        } />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
