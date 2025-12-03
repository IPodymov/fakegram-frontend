import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationsApi } from '../../api/notificationsApi';
import { getAvatarUrl } from '../../utils/imageUtils';
import type { Notification } from '../../types';
import styles from './NotificationsPanel.module.css';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsPanel = ({ isOpen, onClose }: NotificationsPanelProps) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const loadUnreadCount = useCallback(async () => {
    try {
      const count = await notificationsApi.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = filter === 'unread' 
        ? await notificationsApi.getUnread()
        : await notificationsApi.getAll();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
      loadUnreadCount();
    }
  }, [isOpen, filter, loadNotifications, loadUnreadCount]);

  useEffect(() => {
    // Обновляем каждые 30 секунд
    if (isOpen) {
      const interval = setInterval(() => {
        loadNotifications();
        loadUnreadCount();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isOpen, loadNotifications, loadUnreadCount]);

  const handleNotificationClick = async (notification: Notification) => {
    // Отмечаем как прочитанное
    if (!notification.isRead) {
      try {
        await notificationsApi.markAsRead(notification.id);
        setNotifications(prev =>
          prev.map(n => (n.id === notification.id ? { ...n, isRead: true } : n))
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    }

    // Переходим к соответствующему контенту
    if (notification.referenceId) {
      if (notification.type === 'follow') {
        navigate(`/profile/${notification.referenceId}`);
      } else if (notification.type === 'like' || notification.type === 'comment' || notification.type === 'new_post') {
        console.log('Navigate to post:', notification.referenceId);
      }
    }

    onClose();
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await notificationsApi.delete(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      loadUnreadCount();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Удалить все уведомления?')) return;
    
    try {
      await notificationsApi.deleteAll();
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to clear all notifications:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Только что';
    if (diffInMinutes < 60) return `${diffInMinutes} мин. назад`;
    if (diffInHours < 24) return `${diffInHours} ч. назад`;
    if (diffInDays < 7) return `${diffInDays} д. назад`;
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  if (!isOpen) return null;

  const handleOverlayClick = () => {
    if (window.innerWidth > 768) {
      onClose();
    }
  };

  return (
    <>
      <div className={styles.overlay} onClick={handleOverlayClick} />
      <div className={styles.panel}>
        <div className={styles.header}>
          <h2 className={styles.title}>Уведомления</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Закрыть">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={styles.filters}>
          <button
            className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            Все
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'unread' ? styles.active : ''}`}
            onClick={() => setFilter('unread')}
          >
            Непрочитанные {unreadCount > 0 && `(${unreadCount})`}
          </button>
        </div>

        {unreadCount > 0 && filter === 'all' && (
          <div className={styles.actions}>
            <button className={styles.actionButton} onClick={handleMarkAllAsRead}>
              Прочитать все
            </button>
          </div>
        )}

        <div className={styles.content}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <div className={styles.loadingText}>Загрузка...</div>
            </div>
          ) : notifications.length === 0 ? (
            <div className={styles.empty}>
              <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <div className={styles.emptyText}>
                {filter === 'unread' ? 'Нет непрочитанных уведомлений' : 'Нет уведомлений'}
              </div>
              <div className={styles.emptySubtext}>
                {filter === 'unread' 
                  ? 'У вас нет непрочитанных уведомлений' 
                  : 'Когда появятся новые действия, они отобразятся здесь'}
              </div>
            </div>
          ) : (
            <div className={styles.list}>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`${styles.notificationItem} ${!notification.isRead ? styles.unread : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <img
                    src={getAvatarUrl(notification.user?.profilePictureUrl, 48)}
                    alt={notification.user?.username || 'User'}
                    className={styles.avatar}
                  />
                  <div className={styles.notificationContent}>
                    <div className={styles.notificationMessage}>{notification.message}</div>
                    <div className={styles.notificationTime}>{formatTime(notification.createdAt)}</div>
                  </div>
                  {!notification.isRead && <span className={styles.unreadDot}></span>}
                  <button
                    className={styles.deleteButton}
                    onClick={(e) => handleDelete(e, notification.id)}
                    aria-label="Удалить"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className={styles.footer}>
            <button className={styles.clearAllButton} onClick={handleClearAll}>
              Очистить все уведомления
            </button>
          </div>
        )}
      </div>
    </>
  );
};
