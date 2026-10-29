# Design

## Context

Мотивация — см. proposal.md, требования — см. specs/profile-page/spec.md. Токены лежат в httpOnly cookie `accessToken` и `refreshToken`. Внешний сервис проверен вручную: `GET /me` с `Authorization: Bearer <accessToken>` отвечает `200 { id, login }`, без токена или с плохим токеном — `401`. `accessToken` — JWT со сроком жизни 15 минут (`exp − iat = 900`).

## Goals / Non-Goals

**Goals:**
- Минимальная серверная проверка доступа к `/profile` через `/me`.

**Non-Goals:**
- Refresh-поток, общий механизм защиты для других маршрутов, отображение данных пользователя.

## Decisions

- **Проверка в `loader` маршрута `profile`**: `loader` выполняется на сервере до рендера, а `throw redirect("/login")` не даёт отдать разметку кабинета. Альтернатива — проверка в компоненте на клиенте — отклонена: `accessToken` httpOnly и из JS недоступен, а страница успела бы отрисоваться.
- **`isAuthorized(accessToken)` в `app/auth-api.server.ts`** возвращает `response.ok` от `GET /me`, а при сетевой ошибке — `false`. Ответ `/me` не разбирается, потому что данные пользователя пока не нужны.
- **Чтение cookie:** `getRefreshToken(request)` превращается в `getCookie(request, name)`, logout вызывает `getCookie(request, "refreshToken")`. Это одна функция вместо двух почти одинаковых.
- **Локальная проверка JWT** (подпись и `exp`) отклонена: для неё нужен секрет сервиса авторизации, а запрос `/me` проще и заодно ловит отозванные токены.

## Risks / Trade-offs

- [Лишний запрос к сервису на каждое открытие `/profile`] → для учебного проекта приемлемо.
- [Через 15 минут после входа пользователя выбросит на `/login`] → refresh-поток вне рамок, это осознанное ограничение.
