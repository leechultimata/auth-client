# Design

## Context

Мотивация — см. proposal.md, требования — см. specs/. Токены лежат в httpOnly cookie `accessToken` и `refreshToken`, которые выставляет `app/auth-cookies.server.ts`. Внешний сервис проверен вручную: `POST /auth/logout` с `{ refreshToken }` отвечает `204`, без токена — `400`.

## Goals / Non-Goals

**Goals:**
- Минимальный выход: отозвать `refreshToken` в сервисе, очистить cookie, отправить на `/login`.

**Non-Goals:**
- Скрывать кнопку для невошедших, обрабатывать ошибки сервиса, отдавать 405 на `GET /api/auth/logout`.

## Decisions

- **Кнопка — обычная `<form method="post" action="/api/auth/logout">`**, а не `fetch`, как на странице входа. Ответ — `302` на `/login`, браузер выполнит переход сам, без клиентского JS. Это меньше кода, чем `fetch` + `navigate`.
- **Resource route `api/auth/logout`** только с `action`. Он читает cookie, вызывает сервис, затем возвращает `redirect("/login")` с двумя `Set-Cookie`.
- **Ошибки сервиса игнорируются:** `logoutWithAuthApi(refreshToken)` в `app/auth-api.server.ts` оборачивает `fetch` в `try/catch` и ничего не возвращает. Так решил пользователь: локальный выход важнее.
- **Работа с cookie** — в `app/auth-cookies.server.ts`:
  - `getRefreshToken(request)` достаёт значение из заголовка `Cookie` (split по `; ` и `decodeURIComponent`);
  - `clearTokenCookies(headers)` добавляет `accessToken=; Path=/; Max-Age=0` и то же для `refreshToken`.

## Risks / Trade-offs

- [Кнопка видна и невошедшим] → нажатие просто ведёт на `/login`, вреда нет.
- [Сервис не отозвал токен из-за ошибки] → токен остаётся валидным до истечения срока, но в браузере его уже нет.
