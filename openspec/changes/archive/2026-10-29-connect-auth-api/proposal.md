# Proposal

## Why

Сейчас `POST /api/auth/login` — заглушка: пускает любого с непустыми данными и пишет в подписанную cookie только логин. Появился реальный сервис авторизации (`http://localhost:3032`, `POST /auth/login`), который проверяет учётные данные и выдаёт `accessToken` и `refreshToken`. Приложение должно ходить в него и сохранять выданные токены в cookie.

## What Changes

- `POST /api/auth/login` проксирует проверку во внешний сервис `POST {AUTH_API_URL}/auth/login` с телом `{ login, password }`. `AUTH_API_URL` по умолчанию `http://localhost:3032`.
- При успехе ответ внешнего сервиса `{ accessToken, refreshToken }` сохраняется в две httpOnly cookie `accessToken` и `refreshToken` (сессионные, без `Max-Age`). Ответ клиенту — `200 { ok: true }`.
- **BREAKING:** поле `username` в теле `POST /api/auth/login` переименовано в `login`. Форма на `/login` отправляет `login`.
- Неверные учётные данные (внешний `401`) → `401 { ok: false, error }`.
- Внешний сервис недоступен, отвечает `5xx` или неожиданным телом → `502 { ok: false, error }`.
- **BREAKING:** cookie `__session` и переменная `SESSION_SECRET` больше не используются. Модуль подписанной сессии удаляется.

## Capabilities

### New Capabilities
<!-- нет -->

### Modified Capabilities
- `user-auth`: поле `username` → `login`; заглушка успешного входа заменяется проверкой через внешний сервис и сохранением токенов в cookie; добавляется обработка ошибок внешнего сервиса.

## Impact

- Код: `app/routes/api.auth.login.ts`, `app/routes/login.tsx`; удаляется `app/sessions.server.ts`. Добавляется серверный модуль cookie токенов.
- Окружение: новая необязательная переменная `AUTH_API_URL`. `SESSION_SECRET` больше не нужна.
- Зависимости: нет новых, используются `fetch` (Node) и `createCookie` из `react-router`.
- Внешняя зависимость во время работы: доступность сервиса авторизации.
- Вне рамок: обновление токенов через `refreshToken`, logout, использование `accessToken` в запросах к другим API и защита маршрутов.
