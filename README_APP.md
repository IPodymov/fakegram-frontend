# Fakegram Frontend

Instagram Clone Frontend на React + Redux Toolkit

## Установка зависимостей

Выполните следующую команду для установки всех необходимых зависимостей:

```bash
npm install react-router-dom
```

Все остальные зависимости уже указаны в предыдущем README (Redux Toolkit, React-Redux, Axios).

Полная команда для установки всех зависимостей:

```bash
npm install @reduxjs/toolkit react-redux axios react-router-dom
```

## Структура проекта

```
src/
├── api/
│   └── index.ts                    # API клиент и методы
├── assets/
│   └── images/
│       └── logo.jpeg               # Логотип приложения
├── components/
│   ├── CreatePost/
│   │   ├── CreatePost.tsx
│   │   └── CreatePost.module.css
│   ├── Header/
│   │   ├── Header.tsx
│   │   └── Header.module.css
│   ├── Layout/
│   │   ├── Layout.tsx
│   │   └── Layout.module.css
│   ├── LoginForm/
│   │   ├── LoginForm.tsx
│   │   └── LoginForm.module.css
│   ├── PostCard/
│   │   ├── PostCard.tsx
│   │   └── PostCard.module.css
│   ├── PostFeed/
│   │   ├── PostFeed.tsx
│   │   └── PostFeed.module.css
│   ├── ProtectedRoute/
│   │   └── ProtectedRoute.tsx
│   └── RegisterForm/
│       ├── RegisterForm.tsx
│       └── RegisterForm.module.css
├── pages/
│   ├── CreatePostPage/
│   │   ├── CreatePostPage.tsx
│   │   └── CreatePostPage.module.css
│   ├── HomePage/
│   │   ├── HomePage.tsx
│   │   └── HomePage.module.css
│   ├── LoginPage/
│   │   ├── LoginPage.tsx
│   │   └── LoginPage.module.css
│   └── RegisterPage/
│       ├── RegisterPage.tsx
│       └── RegisterPage.module.css
├── store/
│   ├── slices/
│   │   ├── authSlice.ts
│   │   ├── postsSlice.ts
│   │   └── usersSlice.ts
│   ├── thunks/
│   │   ├── authThunks.ts
│   │   ├── postsThunks.ts
│   │   └── usersThunks.ts
│   ├── hooks.ts
│   ├── index.ts
│   └── README.md
├── types/
│   └── index.ts                    # TypeScript типы
├── App.tsx                         # Главный компонент с роутингом
└── main.tsx                        # Entry point с Redux Provider
```

## Возможности

### Авторизация и регистрация
- Форма входа с валидацией
- Форма регистрации с подтверждением пароля
- JWT токен сохраняется в localStorage
- Автоматическая авторизация при наличии токена
- Защита роутов для неавторизованных пользователей

### Лента постов
- Отображение всех постов с изображениями
- Информация о пользователе (аватар, username)
- Лайки и комментарии
- Местоположение
- Время публикации

### Создание поста
- Загрузка изображения с превью
- Добавление подписи
- Указание местоположения
- Валидация размера файла (до 5MB)

### Header
- Логотип с переходом на главную
- Навигация (Главная, Создать пост)
- Меню пользователя с выходом

## Запуск проекта

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev
```

Убедитесь, что backend запущен на `http://localhost:3000`.

## Роуты

- `/` - Главная страница (лента постов) - защищено
- `/login` - Страница входа
- `/register` - Страница регистрации
- `/create` - Создание нового поста - защищено

## API

Все запросы к API идут через `src/api/index.ts`:

- **Auth**: логин, регистрация
- **Users**: получение, обновление, удаление пользователей
- **Posts**: CRUD операции с постами

Токен автоматически добавляется к каждому запросу через interceptor.
