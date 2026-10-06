import './App.css'

const appTitle: string = 'Каталог игр'

export default function App() {
  return (
    <main className="app">
      <header>
        <h1>{appTitle}</h1>
        <p>Личная коллекция игр и отслеживание прохождения.</p>
      </header>
      <section aria-labelledby="items-title">
        <h2 id="items-title">Мои игры</h2>
        <p>Здесь появится список ваших игр.</p>
      </section>
    </main>
  )
}
