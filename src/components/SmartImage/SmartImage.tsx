import { useState, useEffect } from 'react';
import { getImageUrl } from '../../utils/imageUtils';

interface SmartImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallback?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Компонент изображения с автоматическим определением формата
 * Пробует форматы: jpeg, jpg, png
 */
export const SmartImage = ({ 
  src, 
  alt, 
  className, 
  fallback = 'https://via.placeholder.com/150',
  onLoad,
  onError 
}: SmartImageProps) => {
  const [currentSrc, setCurrentSrc] = useState<string>(fallback);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!src) {
      setCurrentSrc(fallback);
      setIsLoading(false);
      onError?.();
      return;
    }

    const baseUrl = getImageUrl(src);

    // Если это base64 или placeholder, используем напрямую
    if (baseUrl.startsWith('data:image') || baseUrl.startsWith('https://via.placeholder.com')) {
      setCurrentSrc(baseUrl);
      setIsLoading(false);
      return;
    }

    // Если URL уже имеет расширение, используем его
    if (/\.(png|jpe?g|webp|gif)$/i.test(baseUrl)) {
      setCurrentSrc(baseUrl);
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
        setCurrentSrc(`${urlWithoutExtension}.jpeg`);
        setIsLoading(false);
        onError?.();
        return;
      }

      const format = formats[currentIndex];
      const urlToTry = `${urlWithoutExtension}.${format}`;

      const img = new Image();

      img.onload = () => {
        if (mounted) {
          setCurrentSrc(urlToTry);
          setIsLoading(false);
          onLoad?.();
        }
      };

      img.onerror = () => {
        currentIndex++;
        tryNextFormat();
      };

      img.src = urlToTry;
    };

    setIsLoading(true);
    tryNextFormat();

    return () => {
      mounted = false;
    };
  }, [src, fallback, onLoad, onError]);

  return (
    <img 
      src={currentSrc} 
      alt={alt} 
      className={className}
      style={{ opacity: isLoading ? 0.5 : 1, transition: 'opacity 0.3s' }}
    />
  );
};
