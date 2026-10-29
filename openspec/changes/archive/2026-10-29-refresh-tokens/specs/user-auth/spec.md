# Spec Delta

## MODIFIED Requirements

### Requirement: Хранение токенов в cookie
При успешном входе ответ SHALL установить две cookie, `accessToken` и `refreshToken`, со значениями токенов из ответа сервиса. Обе cookie SHALL иметь атрибуты `HttpOnly`, `Path=/`, `SameSite=Lax`. Cookie `accessToken` SHALL иметь `Max-Age=900` (15 минут), cookie `refreshToken` — `Max-Age=2592000` (30 дней). В production SHALL добавляться `Secure`.

#### Scenario: Cookie после входа
- **WHEN** вход успешен и сервис вернул `{ "accessToken": "A", "refreshToken": "R" }`
- **THEN** ответ содержит `Set-Cookie: accessToken=A; Path=/; HttpOnly; SameSite=Lax; Max-Age=900` и `Set-Cookie: refreshToken=R; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`

#### Scenario: Production
- **WHEN** приложение запущено в production и вход успешен
- **THEN** обе cookie токенов содержат атрибут `Secure`
