# Tasks

## 1. Серверная часть

- [x] 1.1 Добавить `logoutWithAuthApi(refreshToken)` в `app/auth-api.server.ts` (`POST {AUTH_API_URL}/auth/logout`, ошибки глушить) и `getRefreshToken(request)` / `clearTokenCookies(headers)` в `app/auth-cookies.server.ts`; проверить `npm run typecheck`
- [x] 1.2 Создать `app/routes/api.auth.logout.ts` с `action` (вызов сервиса, если есть токен → очистка cookie → `redirect("/login")`) и добавить `route("api/auth/logout", ...)` в `app/routes.ts`. Проверить curl на собранном сервере: с cookie `refreshToken`, полученной после входа `test`/`test`, → `302` `Location: /login` и два `Set-Cookie` с `Max-Age=0`; повторный `POST /auth/refresh` во внешний сервис с этим токеном больше не проходит; без cookie → тот же ответ

## 2. Главная страница

- [x] 2.1 Добавить в `app/routes/home.tsx` форму `<form method="post" action="/api/auth/logout"><button>Выйти</button></form>` под `<div>Hi</div>`; проверить `curl /` → в HTML есть `Hi` и кнопка «Выйти», и в браузере: после входа нажать «Выйти» → `/login`, cookie токенов в DevTools пропали

## 3. Интеграция

- [x] 3.1 `npm run typecheck` и `npm run build` — без ошибок; `/anything` → 404
