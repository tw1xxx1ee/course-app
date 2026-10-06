import { Link } from 'react-router'

export function AddGamePage() {
  return (
    <section>
      <h1>Добавление игры</h1>
      <p>Форма добавления игры появится в следующей лабораторной работе.</p>
      <Link to="/games">← Все игры</Link>
    </section>
  )
}
