import { Navigate, Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { GameListPage } from './pages/GameListPage'
import { GameDetailsPage } from './pages/GameDetailsPage'
import { AddGamePage } from './pages/AddGamePage'
import { NotFoundPage } from './pages/NotFoundPage'
import './App.css'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/games" replace />} />
        <Route path="games" element={<GameListPage />} />
        <Route path="games/new" element={<AddGamePage />} />
        <Route path="games/:id" element={<GameDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
