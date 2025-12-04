import { useState, useEffect } from 'react';
import styles from './CookieConsent.module.css';

const COOKIE_CONSENT_KEY = 'fakegram_cookie_consent';

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Проверяем, было ли уже дано согласие
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Показываем баннер после небольшой задержки для лучшего UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.banner}>
        <div className={styles.content}>
          <div className={styles.icon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <div className={styles.text}>
            <h3 className={styles.title}>Мы используем cookies</h3>
            <p className={styles.description}>
              Этот сайт использует файлы cookie для улучшения работы и анализа производительности. 
              Продолжая использовать сайт, вы соглашаетесь с использованием cookie в соответствии с нашей{' '}
              <a href="/terms" className={styles.link}>
                политикой конфиденциальности
              </a>
              .
            </p>
          </div>
        </div>
        <div className={styles.actions}>
          <button className={styles.declineButton} onClick={handleDecline}>
            Отклонить
          </button>
          <button className={styles.acceptButton} onClick={handleAccept}>
            Принять все
          </button>
        </div>
      </div>
    </div>
  );
};
