# Интеграция API подписок

## Текущее состояние

Кнопки "Подписаться/Отписаться" и "Сообщение" реализованы с mock-функциональностью.

## Где находится код

- **Компонент**: `/src/pages/UserProfilePage/UserProfilePage.tsx`
- **API методы**: `/src/api/followersApi.ts` (заготовка)

## Как работает сейчас

### Кнопка "Подписаться/Отписаться"

```typescript
const handleFollowClick = async () => {
  if (isFollowLoading) return;

  setIsFollowLoading(true);

  try {
    // TODO: Заменить на реальный API запрос
    await new Promise((resolve) => setTimeout(resolve, 500)); // Симуляция

    setIsFollowing(!isFollowing);
    setFollowersCount((prev) => (isFollowing ? prev - 1 : prev + 1));
  } catch (error) {
    console.error("Ошибка при подписке/отписке:", error);
  } finally {
    setIsFollowLoading(false);
  }
};
```

### Кнопка "Сообщение"

```typescript
const handleMessageClick = () => {
  // TODO: Реализовать переход к сообщениям
  alert(`Функция сообщений будет доступна в следующем обновлении.`);
};
```

## Что нужно для интеграции с реальным API

### 1. Backend должен реализовать endpoints:

```
POST   /users/:userId/follow      - Подписаться
DELETE /users/:userId/follow      - Отписаться
GET    /users/:userId/followers   - Список подписчиков
GET    /users/:userId/following   - Список подписок
GET    /users/:userId/is-following - Проверка подписки
```

### 2. Обновить UserProfilePage.tsx

Заменить симуляцию на реальный API:

```typescript
import { followersApi } from "../../api/followersApi";

// В handleFollowClick заменить:
await new Promise((resolve) => setTimeout(resolve, 500));

// На:
if (isFollowing) {
  await followersApi.unfollow(userId!);
} else {
  await followersApi.follow(userId!);
}
```

### 3. Загрузка статуса подписки при открытии профиля

Добавить в useEffect:

```typescript
useEffect(() => {
  const loadFollowStatus = async () => {
    if (userId && currentUser) {
      try {
        const isFollowingUser = await followersApi.checkFollowing(userId);
        setIsFollowing(isFollowingUser);
      } catch (error) {
        console.error("Failed to load follow status:", error);
      }
    }
  };

  loadFollowStatus();
}, [userId, currentUser]);
```

### 4. Загрузка реального количества подписчиков

Заменить mock-данные:

```typescript
// Вместо:
const [followersCount, setFollowersCount] = useState(
  () => Math.floor(Math.random() * 1000) + 50
);

// Использовать:
const [followersCount, setFollowersCount] = useState(0);

useEffect(() => {
  const loadFollowersCount = async () => {
    if (userId) {
      try {
        const followers = await followersApi.getFollowers(userId);
        setFollowersCount(followers.length);
      } catch (error) {
        console.error("Failed to load followers count:", error);
      }
    }
  };

  loadFollowersCount();
}, [userId]);
```

## Для функции сообщений

### Backend endpoints:

```
GET    /messages/:userId          - Получить чат с пользователем
POST   /messages/:userId          - Отправить сообщение
GET    /messages                  - Список всех чатов
```

### Frontend интеграция:

```typescript
const handleMessageClick = () => {
  navigate(`/messages/${userId}`);
};
```

## Структура данных (примерная)

### Follower entity:

```typescript
interface Follower {
  id: string;
  followerId: string; // кто подписался
  followingId: string; // на кого подписались
  createdAt: string;
  follower?: User;
  following?: User;
}
```

### Message entity:

```typescript
interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  sender?: User;
  receiver?: User;
}
```

## Готовность к интеграции

✅ UI готов и работает
✅ Обработка состояний загрузки
✅ Обработка ошибок
✅ Анимации и feedback для пользователя
⏳ Ожидается реализация API на бекенде

После реализации API достаточно заменить TODO комментарии в коде на реальные вызовы API.
