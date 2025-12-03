const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Преобразует URL изображения в абсолютный путь
 * Если URL начинается с /uploads, добавляет базовый URL API
 * Если это base64 или полный URL, возвращает как есть
 */
export const getImageUrl = (url: string | null | undefined): string => {
  if (!url) {
    return 'https://via.placeholder.com/150';
  }

  // Если это base64, возвращаем как есть
  if (url.startsWith('data:image')) {
    return url;
  }

  // Если это абсолютный URL (http/https), возвращаем как есть
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Если это относительный путь, добавляем базовый URL API
  if (url.startsWith('/uploads') || url.startsWith('uploads')) {
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    return `${API_URL}${cleanUrl}`;
  }

  // В остальных случаях возвращаем как есть
  return url;
};

/**
 * Получает URL аватара пользователя с фоллбэком
 */
export const getAvatarUrl = (profilePictureUrl: string | null | undefined, size: number = 150): string => {
  const url = getImageUrl(profilePictureUrl);
  
  if (url === 'https://via.placeholder.com/150') {
    return `https://via.placeholder.com/${size}`;
  }
  
  return url;
};

/**
 * Получает URL медиа поста с фоллбэком
 */
export const getMediaUrl = (mediaUrl: string | null | undefined): string => {
  return getImageUrl(mediaUrl);
};
