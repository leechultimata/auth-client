# Spec Delta

## MODIFIED Requirements

### Requirement: Личный кабинет для авторизованного пользователя
Если запрос к `/profile` содержит cookie `accessToken`, а внешний сервис `GET {AUTH_API_URL}/me` с заголовком `Authorization: Bearer <accessToken>` отвечает `200`, страница SHALL отвечать статусом 200 и выводить `<div>Личный кабинет</div>` и кнопку «Выйти», которая отправляет `POST /api/auth/logout`.

#### Scenario: Вошедший пользователь открывает кабинет
- **WHEN** пользователь после входа `test`/`test` открывает `/profile`
- **THEN** страница отвечает 200
- **AND** в `<body>` отображаются `<div>Личный кабинет</div>` и кнопка «Выйти»

#### Scenario: Нажатие «Выйти»
- **WHEN** пользователь в личном кабинете нажимает «Выйти»
- **THEN** браузер отправляет `POST /api/auth/logout` и оказывается на `/login`
