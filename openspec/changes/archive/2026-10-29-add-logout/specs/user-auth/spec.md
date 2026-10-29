# Spec Delta

## ADDED Requirements

### Requirement: Выход из системы
`POST /api/auth/logout` SHALL отправить `refreshToken` из cookie во внешний сервис `POST {AUTH_API_URL}/auth/logout` с JSON `{ "refreshToken" }`, если такая cookie есть. Затем при любом результате вызова эндпоинт SHALL удалить cookie `accessToken` и `refreshToken` и перенаправить на `/login`.

#### Scenario: Выход вошедшего пользователя
- **WHEN** пользователь с cookie `refreshToken` отправляет `POST /api/auth/logout`
- **THEN** внешний сервис получает `POST /auth/logout` с этим `refreshToken`
- **AND** ответ — редирект на `/login`
- **AND** ответ содержит `Set-Cookie` для `accessToken` и `refreshToken` с `Max-Age=0` и `Path=/`

#### Scenario: Сервис авторизации недоступен
- **WHEN** пользователь отправляет `POST /api/auth/logout`, а внешний сервис недоступен
- **THEN** cookie всё равно удаляются и происходит редирект на `/login`

#### Scenario: Нет cookie
- **WHEN** запрос `POST /api/auth/logout` пришёл без cookie `refreshToken`
- **THEN** внешний сервис не вызывается
- **AND** cookie удаляются и происходит редирект на `/login`
