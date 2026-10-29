# Tasks

## 1. Оформление формы

- [x] 1.1 В `app/routes/login.tsx` только разметка и классы, логику не трогать:
  - обёртка `<div className="flex min-h-screen items-center justify-center">`;
  - `form` — `flex w-72 flex-col gap-3 border border-black p-6`;
  - `label` — `flex flex-col gap-1`;
  - `input` — `border border-black px-2 py-1`;
  - `button` — `bg-black px-2 py-1 text-white disabled:opacity-50`.

  Проверить `npm run typecheck`, `npm run build` и `curl /login`: 200, в HTML есть `border-black`, `bg-black`, оба поля и кнопка «Войти»
- [x] 1.2 Проверить в браузере (`npm run dev`): форма по центру в рамке, поля друг под другом, кнопка с чёрным фоном; вход `test`/`test` ведёт на `/profile`, неверный пароль показывает ошибку
