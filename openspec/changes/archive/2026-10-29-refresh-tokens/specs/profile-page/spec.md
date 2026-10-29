# Spec Delta

## ADDED Requirements

### Requirement: Обновление токенов при открытии кабинета
Если при запросе к `/profile` cookie `accessToken` нет или `GET {AUTH_API_URL}/me` не ответил `200`, но есть cookie `refreshToken`, сервер SHALL вызвать `POST {AUTH_API_URL}/auth/refresh` с `{ "refreshToken" }`. Если сервис вернул новые `accessToken` и `refreshToken`, ответ SHALL перезаписать обе cookie (по правилам хранения токенов из `user-auth`) и отдать личный кабинет со статусом 200.

#### Scenario: Истёкший accessToken, живой refreshToken
- **WHEN** пользователь с недействительным или отсутствующим `accessToken` и действующим `refreshToken` открывает `/profile`
- **THEN** страница отвечает 200 и показывает «Личный кабинет»
- **AND** ответ содержит `Set-Cookie` с новыми `accessToken` (`Max-Age=900`) и `refreshToken` (`Max-Age=2592000`)

#### Scenario: Старый refreshToken после обновления
- **WHEN** после успешного обновления запрос приходит со старым `refreshToken` и без действующего `accessToken`
- **THEN** ответ — редирект на `/login`

## MODIFIED Requirements

### Requirement: Перенаправление неавторизованного пользователя
Если `accessToken` не принят (cookie нет, сервис ответил не `200` или недоступен) и обновление токенов не удалось (cookie `refreshToken` нет, сервис отклонил его или недоступен), запрос к `/profile` SHALL перенаправляться на `/login`, а содержимое кабинета SHALL NOT отдаваться.

#### Scenario: Нет cookie
- **WHEN** пользователь без cookie `accessToken` и `refreshToken` открывает `/profile`
- **THEN** ответ — редирект на `/login`

#### Scenario: Недействительный токен
- **WHEN** cookie `accessToken` и `refreshToken` содержат поддельные или истёкшие токены
- **THEN** ответ — редирект на `/login`

#### Scenario: Сервис авторизации недоступен
- **WHEN** пользователь с cookie токенов открывает `/profile`, а сервис недоступен
- **THEN** ответ — редирект на `/login`

#### Scenario: После выхода
- **WHEN** пользователь нажал «Выйти», а затем открыл `/profile`
- **THEN** ответ — редирект на `/login`
