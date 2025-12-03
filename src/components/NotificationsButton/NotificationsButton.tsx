import { useState, useEffect, useCallback } from 'react';
import { notificationsApi } from '../../api/notificationsApi';
import styles from './NotificationsButton.module.css';

interface NotificationsButtonProps {
  onClick: () => void;
  isActive: boolean;
}

export const NotificationsButton = ({ onClick, isActive }: NotificationsButtonProps) => {
  const [unreadCount, setUnreadCount] = useState(0);

  const loadUnreadCount = useCallback(async () => {
    try {
      const count = await notificationsApi.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  }, []);

  useEffect(() => {
    // Загружаем количество непрочитанных при монтировании
    void loadUnreadCount();

    // Обновляем каждые 30 секунд
    const interval = setInterval(loadUnreadCount, 30000);

    return () => clearInterval(interval);
  }, [loadUnreadCount]);

  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${isActive ? styles.active : ''}`}
    >
      <div className={styles.iconWrapper}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className={styles.badge}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </div>
      <span>Уведомления</span>
    </button>
  );
};
