# profile-page Specification

## Purpose

Определяет защищённую страницу личного кабинета `/profile`, доступную только авторизованному пользователю.

## Requirements

### Requirement: Личный кабинет для авторизованного пользователя
Если запрос к `/profile` содержит cookie `accessToken`, а внешний сервис `GET {AUTH_API_URL}/me` с заголовком `Authorization: Bearer <accessToken>` отвечает `200`, страница SHALL отвечать статусом 200 и выводить `<div>Личный кабинет</div>` и кнопку «Выйти», которая отправляет `POST /api/auth/logout`.

#### Scenario: Вошедший пользователь открывает кабинет
- **WHEN** пользователь после входа `test`/`test` открывает `/profile`
- **THEN** страница отвечает 200
- **AND** в `<body>` отображаются `<div>Личный кабинет</div>` и кнопка «Выйти»

#### Scenario: Нажатие «Выйти»
- **WHEN** пользователь в личном кабинете нажимает «Выйти»
- **THEN** браузер отправляет `POST /api/auth/logout` и оказывается на `/login`

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

### Requirement: Обновление токенов при открытии кабинета
Если при запросе к `/profile` cookie `accessToken` нет или `GET {AUTH_API_URL}/me` не ответил `200`, но есть cookie `refreshToken`, сервер SHALL вызвать `POST {AUTH_API_URL}/auth/refresh` с `{ "refreshToken" }`. Если сервис вернул новые `accessToken` и `refreshToken`, ответ SHALL перезаписать обе cookie (по правилам хранения токенов из `user-auth`) и отдать личный кабинет со статусом 200.

#### Scenario: Истёкший accessToken, живой refreshToken
- **WHEN** пользователь с недействительным или отсутствующим `accessToken` и действующим `refreshToken` открывает `/profile`
- **THEN** страница отвечает 200 и показывает «Личный кабинет»
- **AND** ответ содержит `Set-Cookie` с новыми `accessToken` (`Max-Age=900`) и `refreshToken` (`Max-Age=2592000`)

#### Scenario: Старый refreshToken после обновления
- **WHEN** после успешного обновления запрос приходит со старым `refreshToken` и без действующего `accessToken`
- **THEN** ответ — редирект на `/login`
