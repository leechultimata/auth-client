# Design

## Context

Мотивация — см. proposal.md, требования — см. specs/user-auth/spec.md. Приложение использует React Router 8.5 в режиме SSR (`ssr: true`), маршруты объявляются вручную в `app/routes.ts`. Сейчас там один индексный маршрут `routes/home.tsx`. Серверного кода, работы с сессиями и env-переменных в проекте пока нет.

## Goals / Non-Goals

**Goals:**
- Страница `/login`, resource route `api/auth/login` и cookie-сессия, готовые к замене заглушки на реальную проверку.

**Non-Goals:**
- Чтение сессии на других страницах, logout, защита `/`, хеширование паролей и хранилище пользователей.

## Decisions

- **Маршруты в `app/routes.ts`:** `route("login", "routes/login.tsx")` и `route("api/auth/login", "routes/api.auth.login.ts")`. Явная конфигурация уже принята в проекте; альтернатива `@react-router/fs-routes` добавила бы зависимость.
- **API как resource route:** модуль экспортирует только `action` (без компонента по умолчанию). Для `GET` добавляется `loader`, который отвечает `405` — без него React Router сам вернул бы ошибку другого вида. Ответы формируются через `Response.json(...)` и `data(...)`/`Response` с заголовком `Set-Cookie`.
- **Отправка через `fetch` с JSON** (выбор пользователя), а не `<Form>`/`useFetcher`: так API остаётся обычным JSON-эндпоинтом, который смогут вызывать и другие клиенты. Компромисс: без JS форма не работает. Состояние (`pending`, `error`) хранится в `useState`, а после успеха выполняется `useNavigate()("/")`.
- **Сессия:** `createCookieSessionStorage` из `react-router` в серверном модуле `app/sessions.server.ts`. Cookie `__session` с атрибутами `httpOnly`, `path: "/"`, `sameSite: "lax"`, `secure: process.env.NODE_ENV === "production"`, `maxAge` 7 дней. В сессию пишется `username`. Суффикс `.server` гарантирует, что модуль не попадёт в клиентский бандл.
- **Секрет:** `SESSION_SECRET` из `process.env`. Без него в production модуль выбрасывает ошибку при загрузке; в dev используется фиксированный dev-секрет с предупреждением в консоли. Альтернатива — падать и в dev — отклонена как лишнее трение для локальной разработки.
- **Валидация** выполняется вручную: `typeof === "string"` и `trim()` не пустой. Библиотека схем (zod) для двух полей избыточна.

## Risks / Trade-offs

- [Заглушка пускает любого] → в коде action явный комментарий `TODO`, а в proposal записано, что реальная проверка — отдельное изменение.
- [CSRF при cookie-сессии] → `SameSite=Lax` и JSON-тело (cross-site HTML-форма не может отправить `application/json` без preflight). Полноценные CSRF-токены вне рамок.
## Migration Plan

Задеплоить с заданным `SESSION_SECRET`. Откат — удалить два маршрута из `routes.ts`; cookie без пользователей ни на что не влияет.
