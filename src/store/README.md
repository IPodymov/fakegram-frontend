# Redux Store для Fakegram Frontend

Эта директория содержит Redux логику для управления состоянием приложения.

## Структура

```
store/
├── index.ts              # Конфигурация store
├── hooks.ts              # Типизированные хуки useAppDispatch и useAppSelector
├── slices/               # Redux slices
│   ├── authSlice.ts      # Аутентификация
│   ├── usersSlice.ts     # Пользователи
│   └── postsSlice.ts     # Посты
└── thunks/               # Async thunks для API запросов
    ├── authThunks.ts     # Логин, регистрация
    ├── usersThunks.ts    # CRUD операции с пользователями
    └── postsThunks.ts    # CRUD операции с постами
```

## Использование

### В компонентах

```tsx
import { useAppDispatch, useAppSelector } from './store/hooks';
import { loginThunk } from './store/thunks/authThunks';

function LoginComponent() {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.auth);

  const handleLogin = async () => {
    try {
      await dispatch(loginThunk({ username: 'user', password: 'pass' }));
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return <div>...</div>;
}
```

### Доступные thunks

**Auth:**
- `loginThunk(credentials)` - Вход в систему
- `registerThunk(userData)` - Регистрация

**Users:**
- `fetchUsersThunk()` - Получить всех пользователей
- `fetchUserByIdThunk(id)` - Получить пользователя по ID
- `fetchUserByUsernameThunk(username)` - Получить пользователя по username
- `updateUserThunk(id, userData)` - Обновить пользователя
- `deleteUserThunk(id)` - Удалить пользователя

**Posts:**
- `fetchPostsThunk()` - Получить все посты
- `fetchPostByIdThunk(id)` - Получить пост по ID
- `fetchPostsByUserIdThunk(userId)` - Получить посты пользователя
- `createPostThunk(postData)` - Создать пост
- `updatePostThunk(id, postData)` - Обновить пост
- `deletePostThunk(id)` - Удалить пост
