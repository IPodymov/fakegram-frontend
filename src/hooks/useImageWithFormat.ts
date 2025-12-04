import { useState, useEffect } from 'react';
import { getImageUrl } from '../utils/imageUtils';

/**
 * Хук для загрузки изображения с автоматическим определением формата
 * Пробует форматы: jpeg, jpg, png
 */
export const useImageWithFormat = (
  url: string | null | undefined,
  fallback: string = 'https://via.placeholder.com/150'
) => {
  const [imageUrl, setImageUrl] = useState<string>(fallback);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (!url) {
      setImageUrl(fallback);
      setIsLoading(false);
      setError(true);
      return;
    }

    const baseUrl = getImageUrl(url);

    // Если это base64 или placeholder, используем напрямую
    if (baseUrl.startsWith('data:image') || baseUrl.startsWith('https://via.placeholder.com')) {
      setImageUrl(baseUrl);
      setIsLoading(false);
      return;
    }

    // Если URL уже имеет расширение, используем его
    if (/\.(png|jpe?g|webp|gif)$/i.test(baseUrl)) {
      setImageUrl(baseUrl);
      setIsLoading(false);
      return;
    }

    // Пробуем разные форматы
    const urlWithoutExtension = baseUrl.replace(/\.(png|jpe?g|webp|gif)$/i, '');
    const formats = ['jpeg', 'jpg', 'png'];
    let currentIndex = 0;
    let mounted = true;

    const tryNextFormat = () => {
      if (!mounted) return;

      if (currentIndex >= formats.length) {
        // Все форматы не сработали, используем первый вариант
        setImageUrl(`${urlWithoutExtension}.jpeg`);
        setIsLoading(false);
        setError(true);
        return;
      }

      const format = formats[currentIndex];
      const urlToTry = `${urlWithoutExtension}.${format}`;

      const img = new Image();

      img.onload = () => {
        if (mounted) {
          setImageUrl(urlToTry);
          setIsLoading(false);
          setError(false);
        }
      };

      img.onerror = () => {
        currentIndex++;
        tryNextFormat();
      };

      img.src = urlToTry;
    };

    setIsLoading(true);
    setError(false);
    tryNextFormat();

    return () => {
      mounted = false;
    };
  }, [url, fallback]);

  return { imageUrl, isLoading, error };
};
