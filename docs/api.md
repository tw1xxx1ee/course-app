# API (backend)

Базовый адрес при локальном запуске: `http://localhost:3000`.
Успешный ответ: `{ "data": ... }`. Ошибка: `{ "error": { "code": "...", "message": "..." } }`.

## GET /api/health

Проверка, что сервер запущен. Ничего не изменяет.

```
200 { "status": "ok" }
```

## POST /api/summary/games

Считает сводку по присланному набору игр. Сервер проверяет тело запроса и сам вычисляет
показатели; данные не сохраняются.

> Маршрут существует только в ЛР 8. В ЛР 9 он будет заменён сводкой, которую сервер
> строит по данным из базы.

```
Body: { "items": [{ "status": "completed" }, { "status": "playing" }] }

200 { "data": { "total": 2, "completed": 1, "completedPercent": 50 } }
400 { "error": { "code": "VALIDATION_ERROR", "message": "..." } }
404 { "error": { "code": "NOT_FOUND", "message": "Вид сводки не найден" } }
```

Правила: `items` — массив до 500 элементов; `status` — `planned`, `playing` или `completed`.
`completedPercent` — доля пройденных, округлённая до целого; для пустого набора 0.

## Остальные ответы

| Код | Когда |
|-----|-------|
| 400 | тело не является JSON или не проходит проверку |
| 413 | тело запроса больше 100 КБ |
| 404 | неизвестный маршрут или вид сводки |
| 500 | непредвиденная ошибка: `{ "error": { "code": "INTERNAL_ERROR", "message": "Ошибка сервера" } }` |

## Проверка из терминала

```bash
curl http://localhost:3000/api/health
```

```bash
curl -X POST http://localhost:3000/api/summary/games -H 'Content-Type: application/json' -d '{"items":[{"status":"completed"},{"status":"playing"}]}'
```

```bash
curl -X POST http://localhost:3000/api/summary/games -H 'Content-Type: application/json' -d '{"items":[{"status":"done"}]}'
```

```bash
curl http://localhost:3000/api/unknown
```
