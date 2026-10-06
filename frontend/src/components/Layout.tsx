import { Link, NavLink, Outlet } from 'react-router'

export function Layout() {
  return (
    <div className="app">
      <header className="app-header">
        <Link to="/games" className="app-title">Каталог игр</Link>
        <nav aria-label="Основная навигация">
          <NavLink to="/games" end>Мои игры</NavLink>
          <NavLink to="/games/new">Добавить игру</NavLink>
        </nav>
      </header>

      <p className="notice" role="note">
        Игры хранятся только в памяти страницы: после обновления вернётся демонстрационный набор.
      </p>

      <main><Outlet /></main>
    </div>
  )
}
