# Tasks

## 1. Серверная часть

- [x] 1.1 Добавить `isAuthorized(accessToken)` в `app/auth-api.server.ts` (`GET {AUTH_API_URL}/me` с Bearer, `response.ok`, при ошибке — `false`); заменить `getRefreshToken` на `getCookie(request, name)` в `app/auth-cookies.server.ts` и обновить вызов в `app/routes/api.auth.logout.ts`; проверить `npm run typecheck`

## 2. Страница `/profile`

- [x] 2.1 Создать `app/routes/profile.tsx` (`loader`: нет cookie или `!isAuthorized` → `throw redirect("/login")`; компонент `<div>Личный кабинет</div>`) и добавить `route("profile", ...)` в `app/routes.ts`. Проверить curl на собранном сервере:
  - с cookie `accessToken` после входа `test`/`test` → 200 и `<div>Личный кабинет</div>`;
  - без cookie → 302 `Location: /login`;
  - `accessToken=garbage` → 302 на `/login`;
  - `AUTH_API_URL=http://localhost:1` с валидной cookie → 302 на `/login`.

## 3. Интеграция

- [x] 3.1 `npm run typecheck` и `npm run build` без ошибок; выход по-прежнему работает (`POST /api/auth/logout` с cookie → 302 на `/login`, а токен отозван); `/anything` → 404
- [x] 3.2 Проверить в браузере (`npm run dev`): после входа `/profile` показывает «Личный кабинет»; после «Выйти» `/profile` перебрасывает на `/login`
