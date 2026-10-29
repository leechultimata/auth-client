# Tasks

## 1. Сессия

- [x] 1.1 Создать `app/sessions.server.ts` с `createCookieSessionStorage` (cookie `__session`, httpOnly, path `/`, sameSite lax, secure в production, maxAge 7 дней, секрет из `SESSION_SECRET` с dev-фолбэком и ошибкой в production); проверить `npm run typecheck`

## 2. API `POST /api/auth/login`

- [x] 2.1 Добавить `route("api/auth/login", "routes/api.auth.login.ts")` в `app/routes.ts`; проверить, что `npm run typecheck` генерирует типы `+types/api.auth.login`
- [x] 2.2 Реализовать `action` в `app/routes/api.auth.login.ts`: разбор JSON, валидация `username`/`password` (непустые строки после `trim`) → `400 { ok: false, error }` без `Set-Cookie`; при успехе (заглушка с `TODO`) записать `username` в сессию и вернуть `200 { ok: true }` с `Set-Cookie`. Проверить curl-запросами на собранном сервере: валидное тело → 200 с `Set-Cookie: __session=...; HttpOnly; SameSite=Lax`, пустой пароль → 400 без `Set-Cookie`, тело `not json` → 400
- [x] 2.3 Добавить `loader`, который отвечает `405` на `GET`; проверить `curl -i http://localhost:<port>/api/auth/login` → 405

## 3. Страница `/login`

- [x] 3.1 Добавить `route("login", "routes/login.tsx")` в `app/routes.ts` и создать страницу с формой (логин, пароль `type="password"`, кнопка «Войти»); проверить, что `curl /login` → 200 и в HTML есть оба поля и кнопка
- [x] 3.2 Реализовать отправку: `fetch` `POST /api/auth/login` с JSON, кнопка неактивна во время запроса; при `ok: true` выполнить `navigate("/")`, иначе показать `error` (или сетевую ошибку), сохранив логин. Проверить в браузере через `npm run dev`: валидные данные → переход на `/` и cookie `__session` в DevTools; пустой пароль → сообщение об ошибке на форме

## 4. Интеграция

- [x] 4.1 Выполнить `npm run typecheck` и `npm run build` — без ошибок
- [x] 4.2 Проверить, что `SESSION_SECRET` нужен в production: `NODE_ENV=production` без переменной → сервер падает с понятной ошибкой; с переменной — запускается
- [x] 4.3 Проверить, что `/` по-прежнему показывает только `Hi`, а `/anything` отвечает 404 (`curl -o /dev/null -w '%{http_code}'`)
