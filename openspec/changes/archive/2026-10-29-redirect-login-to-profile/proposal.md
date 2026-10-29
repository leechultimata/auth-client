# Proposal

## Why

После успешного входа пользователь попадает на `/`, где только «Hi». Его логичное место после входа — личный кабинет `/profile`: там и кнопка «Выйти».

## What Changes

- После ответа `POST /api/auth/login` с `{ ok: true }` страница `/login` перенаправляет на `/profile` вместо `/`.
- Поведение при ошибке не меняется.

## Capabilities

### New Capabilities
<!-- нет -->

### Modified Capabilities
- `user-auth`: в требовании «Результат входа на странице» адрес перехода после успеха меняется с `/` на `/profile`.

## Impact

- Код: одна строка в `app/routes/login.tsx` (`navigate("/")` → `navigate("/profile")`).
- API, cookie и остальные страницы не меняются.
