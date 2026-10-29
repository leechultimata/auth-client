# Tasks

## 1. Удаление шаблонного макета

- [x] 1.1 Заменить содержимое `app/routes/home.tsx` на компонент `Home`, возвращающий `<div>Hi</div>`, без `meta` и без импорта `Welcome`; проверить, что в файле нет ссылок на `welcome`
- [x] 1.2 Удалить каталог `app/welcome/` целиком; проверить через `grep -rni welcome app`, что ссылок не осталось
- [x] 1.3 Удалить экспорт `links` (Google Fonts) из `app/root.tsx`, сохранив `Layout`, `App` и `ErrorBoundary`; проверить `grep -n fonts app/root.tsx` — пусто
- [x] 1.4 Оставить в `app/app.css` только `@import "tailwindcss";`; проверить, что нет упоминаний `Inter` и `bg-gray-950`

## 2. Проверка

- [x] 2.1 Выполнить `npm run typecheck` — без ошибок
- [x] 2.2 Выполнить `npm run build` — сборка успешна
- [x] 2.3 Запустить `npm run dev`, открыть `/` — видно только `Hi`, в `<head>` нет ссылок на Google Fonts; открыть `/anything` — показывается 404
