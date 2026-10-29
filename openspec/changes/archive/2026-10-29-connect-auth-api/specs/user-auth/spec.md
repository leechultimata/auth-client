# Spec Delta

## MODIFIED Requirements

### Requirement: Отправка формы во внутренний API
При отправке форма SHALL выполнить `POST /api/auth/login` с телом JSON `{ "login", "password" }` и заголовком `Content-Type: application/json`, не перезагружая страницу.

#### Scenario: Отправка заполненной формы
- **WHEN** пользователь вводит логин и пароль и нажимает «Войти»
- **THEN** браузер отправляет `POST /api/auth/login` с JSON-телом `{ "login", "password" }`, содержащим введённые значения
- **AND** кнопка отправки недоступна, пока запрос выполняется

### Requirement: Валидация запроса входа
`POST /api/auth/login` SHALL отвечать `400` с JSON `{ "ok": false, "error": string }`, если тело не является JSON или если `login` либо `password` отсутствует или пустой после обрезки пробелов. В этом случае внешний сервис авторизации SHALL NOT вызываться, а cookie SHALL NOT устанавливаться.

#### Scenario: Пустой пароль
- **WHEN** клиент отправляет `{ "login": "alice", "password": "" }`
- **THEN** ответ — `400` с `ok: false`
- **AND** в ответе нет заголовка `Set-Cookie`

#### Scenario: Некорректный JSON
- **WHEN** клиент отправляет тело, которое не является JSON
- **THEN** ответ — `400` с `ok: false`

#### Scenario: Старое поле username
- **WHEN** клиент отправляет `{ "username": "alice", "password": "secret" }`
- **THEN** ответ — `400` с `ok: false`

## REMOVED Requirements

### Requirement: Успешный вход (заглушка)
**Reason**: Заглушка заменяется проверкой учётных данных во внешнем сервисе авторизации.
**Migration**: См. требования «Вход через внешний сервис авторизации» и «Хранение токенов в cookie». Cookie `__session` больше не выставляется.

## ADDED Requirements

### Requirement: Вход через внешний сервис авторизации
При валидном теле `POST /api/auth/login` SHALL отправить `POST {AUTH_API_URL}/auth/login` с JSON `{ "login", "password" }`. По умолчанию `AUTH_API_URL` равен `http://localhost:3032`. Если сервис ответил `2xx` с непустыми строками `accessToken` и `refreshToken`, ответ клиенту SHALL быть `200` `{ "ok": true }`.

#### Scenario: Верные учётные данные
- **WHEN** клиент отправляет верные `login` и `password`
- **THEN** внешний сервис получает `POST /auth/login` с этими значениями
- **AND** ответ клиенту — `200` `{ "ok": true }`

### Requirement: Хранение токенов в cookie
При успешном входе ответ SHALL установить две cookie, `accessToken` и `refreshToken`, со значениями токенов из ответа сервиса. Обе cookie SHALL иметь атрибуты `HttpOnly`, `Path=/`, `SameSite=Lax` и быть сессионными (без `Max-Age`/`Expires`). В production SHALL добавляться `Secure`.

#### Scenario: Cookie после входа
- **WHEN** вход успешен и сервис вернул `{ "accessToken": "A", "refreshToken": "R" }`
- **THEN** ответ содержит `Set-Cookie: accessToken=A; Path=/; HttpOnly; SameSite=Lax` и `Set-Cookie: refreshToken=R; Path=/; HttpOnly; SameSite=Lax`
- **AND** ни у одной из них нет `Max-Age` или `Expires`

#### Scenario: Production
- **WHEN** приложение запущено в production и вход успешен
- **THEN** обе cookie токенов содержат атрибут `Secure`

### Requirement: Неверные учётные данные
Если внешний сервис ответил `400`, `401` или `403`, `POST /api/auth/login` SHALL ответить `401` с JSON `{ "ok": false, "error": string }` и SHALL NOT устанавливать cookie токенов.

#### Scenario: Неверный пароль
- **WHEN** внешний сервис отвечает `401`
- **THEN** ответ клиенту — `401` с `ok: false` и текстом ошибки
- **AND** в ответе нет `Set-Cookie`

### Requirement: Недоступность внешнего сервиса
Если внешний сервис недоступен, ответил другим статусом или `2xx` без строковых `accessToken`/`refreshToken`, `POST /api/auth/login` SHALL ответить `502` с JSON `{ "ok": false, "error": string }` и SHALL NOT устанавливать cookie токенов.

#### Scenario: Сервис не запущен
- **WHEN** по адресу `AUTH_API_URL` нет сервиса
- **THEN** ответ клиенту — `502` с `ok: false`
- **AND** в ответе нет `Set-Cookie`

#### Scenario: Ответ без токенов
- **WHEN** внешний сервис отвечает `200` с телом без `refreshToken`
- **THEN** ответ клиенту — `502` с `ok: false`
