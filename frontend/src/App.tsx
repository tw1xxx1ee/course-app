import { Navigate, Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { RequireAuth } from './components/RequireAuth'
import { AuthPage } from './pages/AuthPage'
import { GameListPage } from './pages/GameListPage'
import { GameDetailsPage } from './pages/GameDetailsPage'
import { AddGamePage } from './pages/AddGamePage'
import { EditGamePage } from './pages/EditGamePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { useAuth } from './hooks/useAuth'
import './App.css'

export default function App() {
  const auth = useAuth()

  return (
    <Routes>
      <Route element={<Layout auth={auth} />}>
        <Route path="auth" element={
          auth.status === 'authenticated' ? <Navigate to="/games" replace /> : <AuthPage />
        } />

        {/* Личные страницы: каждая сама загружает свои данные из базы */}
        <Route element={<RequireAuth auth={auth} />}>
          <Route index element={<Navigate to="/games" replace />} />
          <Route path="games" element={<GameListPage />} />
          <Route path="games/new" element={<AddGamePage />} />
          <Route path="games/:id" element={<GameDetailsPage />} />
          <Route path="games/:id/edit" element={<EditGamePage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
