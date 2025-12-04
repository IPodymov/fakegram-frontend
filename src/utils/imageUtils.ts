const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Получает возможные варианты URL с разными расширениями изображений
 */
const getImageUrlVariants = (baseUrl: string): string[] => {
  // Если URL уже содержит расширение, возвращаем только его
  if (/\.(png|jpe?g|webp|gif)$/i.test(baseUrl)) {
    return [baseUrl];
  }

  // Удаляем возможное расширение из базового URL
  const urlWithoutExtension = baseUrl.replace(/\.(png|jpe?g|webp|gif)$/i, "");

  // Возвращаем варианты в порядке приоритета
  return [
    `${urlWithoutExtension}.jpeg`,
    `${urlWithoutExtension}.jpg`,
    `${urlWithoutExtension}.png`,
    urlWithoutExtension, // на случай если расширение не требуется
  ];
};

/**
 * Преобразует URL изображения в абсолютный путь
 * Если URL начинается с /uploads, добавляет базовый URL API
 * Если это base64 или полный URL, возвращает как есть
 * Поддерживает автоматическое определение формата (png, jpeg, jpg)
 */
export const getImageUrl = (url: string | null | undefined): string => {
  if (!url) {
    return "https://via.placeholder.com/150";
  }

  // Если это base64, возвращаем как есть
  if (url.startsWith("data:image")) {
    return url;
  }

  // Если это абсолютный URL (http/https), возвращаем как есть
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Если это относительный путь, добавляем базовый URL API
  if (url.startsWith("/uploads") || url.startsWith("uploads")) {
    const cleanUrl = url.startsWith("/") ? url : `/${url}`;
    return `${API_URL}${cleanUrl}`;
  }

  // В остальных случаях возвращаем как есть
  return url;
};

/**
 * Пробует загрузить изображение с разными расширениями
 * Возвращает Promise с успешным URL или fallback
 */
export const tryLoadImage = async (
  url: string | null | undefined,
  fallback: string = "https://via.placeholder.com/150"
): Promise<string> => {
  if (!url) {
    return fallback;
  }

  const baseUrl = getImageUrl(url);

  // Если это base64 или уже есть расширение, возвращаем как есть
  if (
    baseUrl.startsWith("data:image") ||
    /\.(png|jpe?g|webp|gif)$/i.test(baseUrl)
  ) {
    return baseUrl;
  }

  const variants = getImageUrlVariants(baseUrl);

  // Пробуем загрузить каждый вариант
  for (const variant of variants) {
    try {
      const response = await fetch(variant, { method: "HEAD" });
      if (response.ok) {
        return variant;
      }
    } catch {
      // Продолжаем со следующим вариантом
      continue;
    }
  }

  // Если ни один вариант не сработал, возвращаем первый вариант (jpeg)
  return variants[0] || fallback;
};

/**
 * Получает URL аватара пользователя с фоллбэком
 */
export const getAvatarUrl = (
  profilePictureUrl: string | null | undefined,
  size: number = 150
): string => {
  const url = getImageUrl(profilePictureUrl);

  if (url === "https://via.placeholder.com/150") {
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
