# API (backend)

Базовый адрес при локальном запуске: `http://localhost:3000`.
Успешный ответ: `{ "data": ... }`. Ошибка: `{ "error": { "code": "...", "message": "...", "fields": { ... } } }`
(`fields` есть только у ошибок проверки полей).

## Авторизация

Маршруты, кроме `/api/health`, требуют заголовок с токеном текущей сессии Supabase:

```
Authorization: Bearer <access token>
```

Сервер проверяет токен через Supabase Auth (`getUser`) и берёт из ответа `user.id`.
Запрос к базе выполняется отдельным клиентом с токеном этого пользователя, поэтому
действуют политики RLS: сервер видит и создаёт только строки владельца токена.
Secret key и `service_role` не используются.

## GET /api/health

Проверка, что сервер запущен. Токен не нужен.

```
200 { "status": "ok" }
```

## POST /api/games

Создаёт игру текущего пользователя. Владельца сервер определяет по токену; поле
`owner_id` в теле запроса не принимается.

```
Body:
{
  "platformId": "pc",
  "title": "Portal 2",
  "genre": "Головоломка",
  "status": "completed",
  "rating": 10,
  "note": ""
}

201 { "data": { "id": "…", "owner_id": "…", "platform_id": "pc", "title": "Portal 2",
                "genre": "Головоломка", "status": "completed", "rating": 10, "note": "",
                "created_at": "…", "platforms": { "id": "pc", "name": "PC" } } }
400 { "error": { "code": "VALIDATION_ERROR", "message": "Проверьте поля запроса",
                 "fields": { "title": "Название должно содержать от 1 до 100 символов" } } }
401 { "error": { "code": "UNAUTHORIZED", "message": "Требуется вход" } }
```

Правила полей: `title` 1–100 символов; `platformId` — id из справочника платформ;
`genre` 1–50 символов; `status` — `planned`, `playing` или `completed`;
`rating` — целое от 1 до 10 или `null` (можно не передавать); `note` — строка до 1000 символов
(можно не передавать). Несуществующая платформа → 400.

## GET /api/summary

Личная сводка: сервер сам читает игры пользователя из базы (все страницы по 500 строк)
и считает показатели.

Необязательный параметр `platformId` ограничивает сводку одной платформой:
`GET /api/summary?platformId=pc`.

```
200 { "data": { "total": 5, "completed": 2, "completedPercent": 40 } }
400 { "error": { "code": "VALIDATION_ERROR", "message": "platformId должен быть непустой строкой" } }
401 { "error": { "code": "UNAUTHORIZED", "message": "Сессия недействительна" } }
```

`completedPercent` — доля пройденных, округлённая до целого; без игр — 0.

## Коды ответов

| Код | Когда |
|-----|-------|
| 400 | тело не является JSON, поля или параметры не проходят проверку |
| 413 | тело запроса больше 100 КБ |
| 401 | нет заголовка `Authorization` или токен недействителен |
| 404 | неизвестный маршрут |
| 409 | конфликт уникальности в базе |
| 500 | непредвиденная ошибка: `{ "error": { "code": "INTERNAL_ERROR", "message": "Ошибка сервера" } }` |

Временный маршрут ЛР 8 `POST /api/summary/games` удалён: браузер больше не присылает
набор игр для расчёта.

## Проверка из терминала

```bash
curl http://localhost:3000/api/health
```

```bash
curl -i http://localhost:3000/api/summary
```

```bash
curl -i http://localhost:3000/api/summary -H 'Authorization: Bearer not-a-real-token'
```

```bash
curl -i -X POST http://localhost:3000/api/games -H 'Content-Type: application/json' -d '{}'
```

Три последних запроса должны вернуть 401. Запросы с настоящим токеном удобнее
смотреть в браузере: DevTools → Network при создании игры и на странице «Сводка».
