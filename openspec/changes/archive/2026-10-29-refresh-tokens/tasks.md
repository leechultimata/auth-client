# Tasks

## 1. Серверная часть

- [x] 1.1 Добавить `Max-Age` в `tokenCookie` (`accessToken` — 900, `refreshToken` — 2592000) в `app/auth-cookies.server.ts`; проверить curl: вход `test`/`test` на собранном сервере → `Set-Cookie` с `Max-Age=900` и `Max-Age=2592000`
- [x] 1.2 Добавить `refreshTokens(refreshToken)` в `app/auth-api.server.ts` (`POST {AUTH_API_URL}/auth/refresh`, `AuthTokens | null`); проверить `npm run typecheck`

## 2. Страница `/profile`

- [x] 2.1 В `loader` `app/routes/profile.tsx`: если `accessToken` не принят — `refreshTokens(getCookie(request, "refreshToken"))`; при успехе вернуть `data(null, { headers })` с новыми cookie, иначе `throw redirect("/login")`. Проверить curl на собранном сервере:
  - только cookie `refreshToken` (без `accessToken`) → 200, «Личный кабинет», два `Set-Cookie` с новыми токенами;
  - повтор со старым `refreshToken` → 302 на `/login`;
  - `accessToken=garbage` и действующий `refreshToken` → 200 и новые cookie;
  - валидный `accessToken` → 200 без `Set-Cookie`;
  - нет cookie / мусор в обоих → 302 на `/login`.

## 3. Интеграция

- [x] 3.1 `npm run typecheck` и `npm run build` без ошибок; выход по-прежнему сбрасывает cookie и отзывает токен; `/anything` → 404
- [x] 3.2 Проверить в браузере (`npm run dev`): после входа удалить cookie `accessToken` в DevTools и обновить `/profile` → страница открывается, cookie `accessToken` появилась снова, у `refreshToken` новое значение; после закрытия и открытия браузера `/profile` открывается без нового входа
