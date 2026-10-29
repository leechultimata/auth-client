# Tasks

## 1. Перенос кнопки

- [x] 1.1 Убрать форму «Выйти» из `app/routes/home.tsx` (оставить `<div>Hi</div>`) и добавить её в `app/routes/profile.tsx` под `<div>Личный кабинет</div>`. Проверить `npm run typecheck`, `npm run build` и curl на собранном сервере:
  - `/` → только `<div>Hi</div>`, нет `action="/api/auth/logout"`;
  - `/profile` с cookie после входа `test`/`test` → `<div>Личный кабинет</div>` и кнопка «Выйти»;
  - `/profile` без cookie → 302 на `/login`.
- [x] 1.2 Проверить в браузере (`npm run dev`): после входа на `/profile` нажать «Выйти» → `/login`, повторное открытие `/profile` перебрасывает на `/login`; на `/` кнопки нет
