import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { followersApi } from '../../api';
import { getAvatarUrl } from '../../utils/imageUtils';
import type { User } from '../../types';
import styles from './FollowersModal.module.css';

interface FollowersModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  initialTab?: 'followers' | 'following';
  username: string;
}

export const FollowersModal = ({
  isOpen,
  onClose,
  userId,
  initialTab = 'followers',
  username,
}: FollowersModalProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>(initialTab);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const loadData = async () => {
        setLoading(true);
        try {
          const [followersData, followingData] = await Promise.all([
            followersApi.getFollowers(userId),
            followersApi.getFollowing(userId),
          ]);
          setFollowers(followersData);
          setFollowing(followingData);
        } catch (error) {
          console.error('Ошибка при загрузке данных:', error);
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }
  }, [isOpen, userId]);

  const handleUserClick = (clickedUserId: string) => {
    onClose();
    navigate(`/users/${clickedUserId}`);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const currentList = activeTab === 'followers' ? followers : following;

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{username}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'followers' ? styles.active : ''}`}
            onClick={() => setActiveTab('followers')}
          >
            <span className={styles.tabLabel}>Подписчики</span>
            <span className={styles.tabCount}>{followers.length}</span>
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'following' ? styles.active : ''}`}
            onClick={() => setActiveTab('following')}
          >
            <span className={styles.tabLabel}>Подписки</span>
            <span className={styles.tabCount}>{following.length}</span>
          </button>
        </div>

        <div className={styles.content}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Загрузка...</p>
            </div>
          ) : currentList.length === 0 ? (
            <div className={styles.empty}>
              <p>
                {activeTab === 'followers'
                  ? 'Пока нет подписчиков'
                  : 'Пока нет подписок'}
              </p>
            </div>
          ) : (
            <div className={styles.userList}>
              {currentList.map((user) => (
                <div
                  key={user.id}
                  className={styles.userItem}
                  onClick={() => handleUserClick(user.id)}
                >
                  <div className={styles.userAvatar}>
                    {user.profilePictureUrl ? (
                      <img
                        src={getAvatarUrl(user.profilePictureUrl, 44)}
                        alt={user.username}
                        className={styles.avatar}
                      />
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        {user.username[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className={styles.userInfo}>
                    <div className={styles.username}>{user.username}</div>
                    {user.fullName && (
                      <div className={styles.fullName}>{user.fullName}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
