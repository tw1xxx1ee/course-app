import { Link } from 'react-router'
import { GameCard } from '../components/GameCard'
import { demoGames } from '../data/demoGames'

export function GameListPage() {
  if (demoGames.length === 0) {
    return (
      <section>
        <h1>Мои игры</h1>
        <div className="empty">
          <p>В коллекции пока нет игр.</p>
          <Link to="/games/new" className="button">Добавить первую игру</Link>
        </div>
      </section>
    )
  }

  return (
    <section>
      <h1>Мои игры</h1>
      <div className="game-list">
        {demoGames.map((game) => (
          <GameCard key={game.id} game={game} platformName={game.platform} />
        ))}
      </div>
    </section>
  )
}
