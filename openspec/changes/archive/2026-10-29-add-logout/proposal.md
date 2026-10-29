# Proposal

## Why

Пользователь может войти, но выйти не может: токены остаются в cookie до закрытия браузера, а `refreshToken` продолжает действовать в сервисе авторизации. Нужен выход, который отзывает токен и очищает cookie.

## What Changes

- Новый эндпоинт `POST /api/auth/logout`:
  - берёт `refreshToken` из cookie и отправляет его во внешний сервис `POST {AUTH_API_URL}/auth/logout`;
  - **при любом исходе** (204, ошибка, сервис недоступен, cookie нет) удаляет cookie `accessToken` и `refreshToken` и перенаправляет на `/login`.
- На главной странице под `Hi` появляется кнопка «Выйти» — обычная HTML-форма `POST /api/auth/logout`.

## Capabilities

### New Capabilities
<!-- нет -->

### Modified Capabilities
- `user-auth`: добавляется выход из системы.
- `home-page`: требование «только приветствие» расширяется кнопкой «Выйти».

## Impact

- Код: новый `app/routes/api.auth.logout.ts`, правки в `app/routes.ts`, `app/routes/home.tsx`, `app/auth-api.server.ts`, `app/auth-cookies.server.ts`.
- Новых зависимостей и переменных окружения нет.
- Вне рамок: скрытие кнопки для невошедших пользователей, защита `/`, обновление токенов.
