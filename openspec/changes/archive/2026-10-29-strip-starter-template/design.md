# Design

## Context

Мотивация — см. proposal.md. Текущее состояние: `app/routes.ts` уже объявляет только `index("routes/home.tsx")`; `home.tsx` рендерит `<Welcome />` из `app/welcome/` и задаёт `meta`; `root.tsx` подключает Inter из Google Fonts; `app.css` задаёт тему под Inter и фон.

## Goals / Non-Goals

**Goals:**
- Минимальная главная страница с `<div>Hi</div>` и удаление всех артефактов демо-макета.

**Non-Goals:**
- Удаление Tailwind, `Layout`/`ErrorBoundary` из `root.tsx`, правки `README.md` и `Dockerfile`.

## Decisions

- **Оставить `root.tsx` (Layout, App, ErrorBoundary), убрать только `links`.** `Layout` обязателен для SSR-документа React Router, `ErrorBoundary` даёт поведение 404 из спецификации. Альтернатива — удалить и `ErrorBoundary` — отклонена: тогда неизвестный путь показывал бы дефолтный экран ошибки фреймворка.
- **Убрать `meta` из `home.tsx`.** Это шаблонные заголовок и описание; вместе с ним уходит импорт `Route` типов, ставший неиспользуемым. Альтернатива — заменить на свои мета-теги — вне рамок запроса.
- **Оставить в `app.css` только `@import "tailwindcss"`.** Тема Inter и фон относятся к шаблону; сам Tailwind используется в `ErrorBoundary`, поэтому зависимость остаётся.

## Risks / Trade-offs

- [Устаревшие сгенерированные типы `+types/home`] → после правок запустить `npm run typecheck`, который заново выполняет `react-router typegen`.
- [Без фона из темы страница в тёмной ОС будет со стандартным белым фоном браузера] → приемлемо для минимального макета.
