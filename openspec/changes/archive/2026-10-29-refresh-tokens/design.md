# Design

## Context

Мотивация — см. proposal.md, требования — см. specs/. Сейчас `loader` в `app/routes/profile.tsx` проверяет `accessToken` через `isAuthorized` (`GET /me`) и при неудаче делает `redirect("/login")`. Cookie собирает `tokenCookie` в `app/auth-cookies.server.ts`, без `Max-Age`.

Сервис проверен вручную:
- `POST /auth/refresh` с `{ refreshToken }` отвечает `200 { accessToken, refreshToken }`;
- `refreshToken` ротируется: повторный запрос со старым даёт `401 Invalid refresh token`;
- срок жизни: `accessToken` — 900 с, `refreshToken` — 2592000 с (по `exp − iat` в JWT).

## Goals / Non-Goals

**Goals:**
- Минимальное реактивное обновление токенов в одном месте — `loader` страницы `/profile`.

**Non-Goals:**
- Упреждающее обновление по `exp`, общий middleware для всех маршрутов, защита от параллельных обновлений.

## Decisions

- **Реактивно, по факту отказа `/me`**, а не по разбору `exp` из JWT: не нужно декодировать токен, и заодно ловятся отозванные токены. Если cookie `accessToken` уже истекла по `Max-Age`, браузер её не пришлёт — это тот же случай «нет `accessToken`».
- **`refreshTokens(refreshToken)` в `app/auth-api.server.ts`** возвращает `AuthTokens | null`: `null` при любом не-`200`, ответе без токенов или сетевой ошибке. Устроена по образцу `loginWithAuthApi`.
- **Повторно `/me` после обновления не вызываем:** свежий токен от сервиса заведомо валиден, лишний запрос не нужен.
- **Новые cookie из `loader`:** `return data(null, { headers })`, где `headers` заполняет существующий `appendTokenCookies`. В исходниках React Router 8 проверено, что `Set-Cookie` из заголовков `loader` переносится в ответ HTML-документа без экспорта `headers` (`prependCookies(loaderHeaders, headers)`).
- **`Max-Age`** добавляется в `tokenCookie` параметром: 900 для `accessToken`, 2592000 для `refreshToken`. Константы задаются прямо в `appendTokenCookies`, а не берутся из `exp` токена — так проще, и это совпадает со сроками сервиса.

## Risks / Trade-offs

- [Два параллельных запроса к `/profile` с одним истёкшим `accessToken` одновременно обновят токены; второй получит `401` и уйдёт на `/login`] → для учебного проекта приемлемо, записано как вне рамок.
- [Сервис поменяет сроки жизни токенов] → тогда константы `Max-Age` придётся поправить вручную.
