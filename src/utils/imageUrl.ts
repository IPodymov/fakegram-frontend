/**
 * Получает URL изображения с поддержкой разных форматов (png, jpeg, jpg)
 * Пробует форматы в порядке приоритета: jpeg -> jpg -> png
 */
export const getImageUrl = (baseUrl: string | null | undefined): string | null => {
  if (!baseUrl) return null;
  
  // Если URL уже содержит расширение, используем его
  if (/\.(png|jpe?g)$/i.test(baseUrl)) {
    return baseUrl;
  }
  
  // Удаляем возможное расширение из URL
  const urlWithoutExtension = baseUrl.replace(/\.(png|jpe?g)$/i, '');
  
  return urlWithoutExtension;
};

/**
 * Создает элемент img для проверки доступности изображения
 * Пробует загрузить изображение с разными расширениями
 */
export const tryImageFormats = (
  baseUrl: string | null | undefined,
  onSuccess: (url: string) => void,
  onError?: () => void
): void => {
  if (!baseUrl) {
    onError?.();
    return;
  }

  // Если URL уже содержит расширение, используем его напрямую
  if (/\.(png|jpe?g)$/i.test(baseUrl)) {
    const img = new Image();
    img.onload = () => onSuccess(baseUrl);
    img.onerror = () => onError?.();
    img.src = baseUrl;
    return;
  }

  // Удаляем возможное расширение из базового URL
  const urlWithoutExtension = baseUrl.replace(/\.(png|jpe?g)$/i, '');
  
  // Форматы для попытки загрузки в порядке приоритета
  const formats = ['jpeg', 'jpg', 'png'];
  let currentIndex = 0;

  const tryNextFormat = () => {
    if (currentIndex >= formats.length) {
      // Все форматы не сработали, возвращаем оригинальный URL
      onSuccess(baseUrl);
      return;
    }

    const format = formats[currentIndex];
    const urlToTry = `${urlWithoutExtension}.${format}`;
    
    const img = new Image();
    
    img.onload = () => {
      onSuccess(urlToTry);
    };
    
    img.onerror = () => {
      currentIndex++;
      tryNextFormat();
    };
    
    img.src = urlToTry;
  };

  tryNextFormat();
};

/**
 * Возвращает массив возможных URL с разными расширениями
 */
export const getImageUrlVariants = (baseUrl: string | null | undefined): string[] => {
  if (!baseUrl) return [];
  
  // Если URL уже содержит расширение, возвращаем только его
  if (/\.(png|jpe?g)$/i.test(baseUrl)) {
    return [baseUrl];
  }
  
  const urlWithoutExtension = baseUrl.replace(/\.(png|jpe?g)$/i, '');
  
  return [
    `${urlWithoutExtension}.jpeg`,
    `${urlWithoutExtension}.jpg`,
    `${urlWithoutExtension}.png`,
  ];
};
