# Публикация

## Публичные адреса

| Что | Адрес |
|-----|-------|
| Приложение (frontend) | https://game-catalog-three.vercel.app |
| API (backend), проверка | https://game-catalog-api-mauve.vercel.app/api/health |
| Репозиторий | https://github.com/tw1xxx1ee/course-app |

Хостинг — Vercel. Frontend и backend — два отдельных проекта из одного репозитория.
Оба используют один проект Supabase.

## Backend — проект `game-catalog-api`

| Настройка | Значение |
|-----------|----------|
| Рабочая папка | `backend` |
| Установка и сборка | `npm ci`, `npm run build` (Vercel сам собирает Express из `src/index.ts`) |
| Запуск на обычном сервере | `npm start` (выполняет `node dist/index.js`) |
| Версия Node | 24 |

Переменные окружения (читаются при запуске процесса):

| Переменная | Значение |
|------------|----------|
| `SUPABASE_URL` | адрес проекта Supabase |
| `SUPABASE_PUBLISHABLE_KEY` | публичный ключ |
| `FRONTEND_ORIGIN` | `https://game-catalog-three.vercel.app` — точный адрес без пути и слеша в конце |
| `PORT` | задаёт платформа; локально 3000 |

Сервер проверяет, что `PORT` — положительное целое, и слушает `0.0.0.0`.
CORS разрешает только `FRONTEND_ORIGIN`, методы `GET`, `POST`, `OPTIONS`,
заголовки `Authorization` и `Content-Type`.

## Frontend — проект `game-catalog`

| Настройка | Значение |
|-----------|----------|
| Рабочая папка | `frontend` |
| Сборка | `npm ci && npm run build` |
| Каталог публикации | `dist` |
| SPA fallback | `frontend/vercel.json`: `/(.*) → /index.html` |

Переменные окружения (подставляются во время сборки и попадают в JavaScript,
поэтому здесь только публичные значения):

| Переменная | Значение |
|------------|----------|
| `VITE_SUPABASE_URL` | адрес проекта Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | публичный ключ |
| `VITE_API_BASE_URL` | `https://game-catalog-api-mauve.vercel.app` — без `/api` в конце |

После изменения любой `VITE_`-переменной frontend нужно собрать и опубликовать заново.

## Команды публикации

Из папки пакета, после `vercel link`:

```bash
vercel deploy --prod
```

Публикация выполняется этой командой вручную; автоматической сборки по `git push` нет.

## Supabase

Миграции применяются по порядку, затем seed:

1. `supabase/migrations/202610060001_initial_schema.sql`
2. `supabase/migrations/202610130001_games_owner_policies.sql`
3. `supabase/migrations/202610130002_games_platform_link.sql`
4. `supabase/seed.sql`

Authentication → URL Configuration:

```
Site URL:
https://game-catalog-three.vercel.app

Redirect URLs:
https://game-catalog-three.vercel.app/**
http://localhost:5173/**
```

Secret key и `service_role` в приложении не используются и нигде не заданы.

## Проверка после публикации

1. `/api/health` → `{"status":"ok"}`; `/api/summary` без токена → 401.
2. Открыть напрямую `https://game-catalog-three.vercel.app/games/123/edit` — приложение
   загружается (SPA fallback) и ведёт гостя на `/auth`.
3. В чистом окне браузера: регистрация, подтверждение email, вход.
4. Создать игру — в Network `POST https://game-catalog-api-mauve.vercel.app/api/games` → 201.
5. Обновить страницу, открыть игру, изменить, применить фильтры, открыть «Сводку».
6. Войти вторым аккаунтом — список и сводка свои.
7. Удалить игру, выйти — личный адрес снова требует входа.
8. Повторить основной путь с телефона.

## Известные ограничения

- Backend на Vercel запускается по запросу, а не работает постоянно: первый запрос после
  простоя может отвечать на 1–2 секунды дольше.
- Встроенная почта Supabase отправляет ограниченное число писем в час — подтверждения
  регистрации при частых проверках могут задерживаться.
