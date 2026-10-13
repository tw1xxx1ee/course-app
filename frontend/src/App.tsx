import { Navigate, Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { RequireAuth } from './components/RequireAuth'
import { AuthPage } from './pages/AuthPage'
import { GameListPage } from './pages/GameListPage'
import { GameDetailsPage } from './pages/GameDetailsPage'
import { AddGamePage } from './pages/AddGamePage'
import { EditGamePage } from './pages/EditGamePage'
import { SummaryPage } from './pages/SummaryPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { useAuth } from './hooks/useAuth'
import './App.css'

export default function App() {
  const auth = useAuth()
  // Токен текущей сессии для запросов к своему Node API
  const accessToken = auth.status === 'authenticated' ? auth.session.access_token : ''

  return (
    <Routes>
      <Route element={<Layout auth={auth} />}>
        <Route path="auth" element={
          auth.status === 'authenticated' ? <Navigate to="/games" replace /> : <AuthPage />
        } />

        {/* Личные страницы: каждая сама загружает свои данные */}
        <Route element={<RequireAuth auth={auth} />}>
          <Route index element={<Navigate to="/games" replace />} />
          <Route path="games" element={<GameListPage />} />
          <Route path="games/new" element={<AddGamePage accessToken={accessToken} />} />
          <Route path="games/:id" element={<GameDetailsPage />} />
          <Route path="games/:id/edit" element={<EditGamePage />} />
          <Route path="summary" element={<SummaryPage accessToken={accessToken} />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
