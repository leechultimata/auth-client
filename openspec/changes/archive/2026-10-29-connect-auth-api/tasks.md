# Tasks

## 1. Серверные модули

- [x] 1.1 Создать `app/auth-api.server.ts` с `loginWithAuthApi(login, password)`: `POST {AUTH_API_URL ?? "http://localhost:3032"}/auth/login` с JSON, результат `success | invalid | unavailable` по правилам из design.md; проверить `npm run typecheck`
- [x] 1.2 Создать `app/auth-cookies.server.ts` с собственной функцией сериализации `Set-Cookie` для `accessToken` и `refreshToken` (без `createCookie`): значение `encodeURIComponent(token)`, `Path=/; HttpOnly; SameSite=Lax`, `Secure` в production, без `Max-Age`; проверить, что для токена `"A"` получается `accessToken=A; Path=/; HttpOnly; SameSite=Lax`
- [x] 1.3 Удалить `app/sessions.server.ts`; проверить, что `grep -rn "sessions.server\|SESSION_SECRET" app` пусто

## 2. API `POST /api/auth/login`

- [x] 2.1 Переписать `action` в `app/routes/api.auth.login.ts`: валидация `login`/`password` (400), вызов `loginWithAuthApi`, `success` → `200 { ok: true }` с двумя `Set-Cookie`, `invalid` → `401`, `unavailable` → `502`; `loader` 405 оставить. Проверить curl на собранном сервере при запущенном сервисе на 3032: пустой пароль → 400 без `Set-Cookie`; `{"username":…}` → 400; неверные данные → 401 без `Set-Cookie`; `GET` → 405
- [x] 2.2 Проверить недоступность: `AUTH_API_URL=http://localhost:1` → `502` без `Set-Cookie`
- [x] 2.3 Проверить успешный вход с тестовыми учётными данными `test`/`test`: `200 { ok: true }`, две `Set-Cookie` с токенами, без `Max-Age`; в production-сборке есть `Secure`

## 3. Страница `/login`

- [x] 3.1 В `app/routes/login.tsx` переименовать поле и тело запроса `username` → `login` (`name="login"`, `JSON.stringify({ login, password })`); проверить `curl /login` → в HTML `name="login"`, и в браузере (`npm run dev`) верные данные → переход на `/` и cookie `accessToken`/`refreshToken` в DevTools, неверные → сообщение об ошибке

## 4. Интеграция

- [x] 4.1 `npm run typecheck` и `npm run build` — без ошибок; `/` показывает `Hi`, `/anything` → 404
