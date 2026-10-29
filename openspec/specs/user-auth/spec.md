# user-auth Specification

## Purpose

Позволяет пользователю войти в приложение: страница логина и внутренний API, который принимает учётные данные и создаёт сессию пользователя.

## Requirements

### Requirement: Страница входа
Приложение SHALL отдавать по пути `/login` страницу с формой: текстовое поле логина, поле пароля (ввод скрыт) и кнопка отправки. Форма SHALL стоять по центру окна по горизонтали и вертикали, иметь рамку и выводить подписи, поля и кнопку друг под другом. Кнопка «Войти» SHALL иметь заливку фона.

#### Scenario: Открытие страницы входа
- **WHEN** пользователь открывает `/login`
- **THEN** страница отвечает статусом 200
- **AND** отображаются поле «Логин», поле «Пароль» с `type="password"` и кнопка «Войти»

#### Scenario: Внешний вид формы
- **WHEN** пользователь открывает `/login` в окне браузера
- **THEN** форма находится по центру окна и обведена рамкой
- **AND** «Логин», его поле, «Пароль», его поле и кнопка «Войти» идут сверху вниз в один столбец
- **AND** у кнопки «Войти» тёмный фон и светлый текст

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

### Requirement: Неподдерживаемые методы API
`/api/auth/login` SHALL принимать только `POST`; на `GET` эндпоинт SHALL NOT отдавать HTML-страницу и SHALL отвечать `405`.

#### Scenario: GET-запрос
- **WHEN** клиент выполняет `GET /api/auth/login`
- **THEN** ответ — `405`

### Requirement: Результат входа на странице
После ответа API страница входа SHALL перенаправить пользователя на `/profile`, если `ok: true`, а иначе показать текст ошибки на форме, оставив введённый логин.

#### Scenario: Успех
- **WHEN** API отвечает `200` `{ "ok": true }`
- **THEN** пользователь оказывается на `/profile` и видит «Личный кабинет»

#### Scenario: Ошибка
- **WHEN** API отвечает с `ok: false` или запрос не удался из-за сети
- **THEN** на форме отображается сообщение об ошибке, а поле логина сохраняет значение

### Requirement: Вход через внешний сервис авторизации
При валидном теле `POST /api/auth/login` SHALL отправить `POST {AUTH_API_URL}/auth/login` с JSON `{ "login", "password" }`. По умолчанию `AUTH_API_URL` равен `http://localhost:3032`. Если сервис ответил `2xx` с непустыми строками `accessToken` и `refreshToken`, ответ клиенту SHALL быть `200` `{ "ok": true }`.

#### Scenario: Верные учётные данные
- **WHEN** клиент отправляет верные `login` и `password`
- **THEN** внешний сервис получает `POST /auth/login` с этими значениями
- **AND** ответ клиенту — `200` `{ "ok": true }`

### Requirement: Хранение токенов в cookie
При успешном входе ответ SHALL установить две cookie, `accessToken` и `refreshToken`, со значениями токенов из ответа сервиса. Обе cookie SHALL иметь атрибуты `HttpOnly`, `Path=/`, `SameSite=Lax`. Cookie `accessToken` SHALL иметь `Max-Age=900` (15 минут), cookie `refreshToken` — `Max-Age=2592000` (30 дней). В production SHALL добавляться `Secure`.

#### Scenario: Cookie после входа
- **WHEN** вход успешен и сервис вернул `{ "accessToken": "A", "refreshToken": "R" }`
- **THEN** ответ содержит `Set-Cookie: accessToken=A; Path=/; HttpOnly; SameSite=Lax; Max-Age=900` и `Set-Cookie: refreshToken=R; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`

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
