import type { Game } from '../types/game'

export const demoGames: Game[] = [
  {
    id: 'g1',
    title: 'The Witcher 3: Wild Hunt',
    platform: 'pc',
    genre: 'RPG',
    status: 'completed',
    rating: 10,
    note: 'Прошёл вместе с обоими дополнениями.',
  },
  {
    id: 'g2',
    title: 'Hollow Knight',
    platform: 'switch',
    genre: 'Метроидвания',
    status: 'playing',
    rating: 9,
    note: 'Застрял на боссе в Глубинном гнезде.',
  },
  {
    id: 'g3',
    title: 'Elden Ring',
    platform: 'ps5',
    genre: 'Экшен-RPG',
    status: 'planned',
    rating: null,
    note: 'Начать после выхода из отпуска.',
  },
  {
    id: 'g4',
    title: 'Stardew Valley',
    platform: 'pc',
    genre: 'Симулятор фермы',
    status: 'completed',
    rating: 8,
    note: 'Отличная игра для спокойных вечеров.',
  },
  {
    id: 'g5',
    title: 'Hades',
    platform: 'xbox',
    genre: 'Roguelike',
    status: 'playing',
    rating: 9,
    note: 'Осталось открыть все оружия.',
  },
]
