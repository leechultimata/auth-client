# Tasks

## 1. Редирект после входа

- [x] 1.1 В `app/routes/login.tsx` заменить `navigate("/")` на `navigate("/profile")`; проверить `npm run typecheck`, `npm run build` и `grep -n 'navigate("/profile")' app/routes/login.tsx`
- [x] 1.2 Проверить в браузере (`npm run dev`): вход `test`/`test` на `/login` → попадание на `/profile` с «Личный кабинет»; неверный пароль → сообщение об ошибке на форме
