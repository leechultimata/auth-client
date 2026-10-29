# Proposal

## Why

Проект создан из `create-react-router` и содержит демонстрационный стартовый макет (компонент Welcome, логотипы, ссылки на документацию, шрифт Inter из Google Fonts, тематические стили). Он не относится к приложению `auth-client` и мешает начинать разработку с чистого листа.

## What Changes

- Удалить каталог `app/welcome/` (`welcome.tsx`, `logo-light.svg`, `logo-dark.svg`).
- Оставить единственный маршрут — индексный `routes/home.tsx`; его компонент рендерит только `<div>Hi</div>`.
- Убрать из `home.tsx` шаблонные мета-теги (`New React Router App`, `Welcome to React Router!`).
- Убрать из `root.tsx` подключение шрифта Inter из Google Fonts (`links`).
- Убрать из `app/app.css` шаблонные настройки темы (шрифт Inter, фон `bg-white`/`dark:bg-gray-950`), оставив только `@import "tailwindcss"`.
- **BREAKING** (только для внешнего вида): главная страница больше не показывает приветственный экран React Router.

## Capabilities

### New Capabilities
- `home-page`: содержимое главной страницы приложения (индексный маршрут `/`).

### Modified Capabilities
<!-- нет -->

## Impact

- Код: `app/routes/home.tsx`, `app/root.tsx`, `app/app.css`; удаляется `app/welcome/`.
- `app/routes.ts` не меняется — индексный маршрут уже единственный.
- Зависимости не меняются (Tailwind остаётся, так как его классы используются в `ErrorBoundary`).
- Внешние запросы к `fonts.googleapis.com` / `fonts.gstatic.com` прекращаются.
- Вне рамок: `README.md`, `Dockerfile`, `ErrorBoundary` и `Layout` в `root.tsx`.
