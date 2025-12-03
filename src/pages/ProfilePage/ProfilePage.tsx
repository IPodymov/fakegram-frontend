import { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPostsByUserIdThunk } from '../../store/thunks/postsThunks';
import { updateUserThunk } from '../../store/thunks/usersThunks';
import { followersApi } from '../../api';
import { AvatarUpload, type AvatarUploadRef } from '../../components/AvatarUpload/AvatarUpload';
import { FollowersModal } from '../../components/FollowersModal/FollowersModal';
import styles from './ProfilePage.module.css';

export const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { posts, loading } = useAppSelector((state) => state.posts);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    bio: user?.bio || '',
    website: user?.website || '',
  });

  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [followersModalTab, setFollowersModalTab] = useState<'followers' | 'following'>('followers');
  
  const avatarUploadRef = useRef<AvatarUploadRef>(null);

  const handleAddStoryClick = () => {
    avatarUploadRef.current?.triggerFileInput();
  };

  const handleFollowersClick = () => {
    setFollowersModalTab('followers');
    setIsFollowersModalOpen(true);
  };

  const handleFollowingClick = () => {
    setFollowersModalTab('following');
    setIsFollowersModalOpen(true);
  };

  useEffect(() => {
    if (user) {
      dispatch(fetchPostsByUserIdThunk(user.id));

      // Загружаем данные о подписчиках и подписках
      const loadFollowData = async () => {
        try {
          const [followers, following] = await Promise.all([
            followersApi.getFollowers(user.id),
            followersApi.getFollowing(user.id),
          ]);

          setFollowersCount(followers.length);
          setFollowingCount(following.length);
        } catch (error) {
          console.error('Ошибка при загрузке данных о подписках:', error);
          setFollowersCount(0);
          setFollowingCount(0);
        }
      };

      loadFollowData();
    }
  }, [dispatch, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      try {
        await dispatch(updateUserThunk(user.id, {
          fullName: formData.fullName || null,
          bio: formData.bio || null,
          website: formData.website || null,
        }));
        setIsEditing(false);
      } catch (error) {
        console.error('Failed to update profile:', error);
      }
    }
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Загрузка профиля...</div>
      </div>
    );
  }

  const userPosts = posts.filter(post => post.user?.id === user.id);

  return (
    <div className={styles.container}>
      <div className={styles.profileHeader}>
        <div className={styles.avatarSection}>
          <AvatarUpload ref={avatarUploadRef} />
          <button className={styles.addStory} onClick={handleAddStoryClick} type="button">
            +
          </button>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.topRow}>
            <h1 className={styles.username}>{user.username}</h1>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{userPosts.length}</span>
              <span className={styles.statLabel}>публикации</span>
            </div>
            <button className={styles.stat} onClick={handleFollowersClick}>
              <span className={styles.statNumber}>{followersCount}</span>
              <span className={styles.statLabel}>подписчики</span>
            </button>
            <button className={styles.stat} onClick={handleFollowingClick}>
              <span className={styles.statNumber}>{followingCount}</span>
              <span className={styles.statLabel}>подписки</span>
            </button>
          </div>

          <div className={styles.bio}>
            {user.fullName && <div className={styles.fullName}>{user.fullName}</div>}
            {user.bio && <div className={styles.bioText}>{user.bio}</div>}
            {user.website && (
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.website}
              >
                {user.website}
              </a>
            )}
          </div>

          <div className={styles.actionButtons}>
            <button
              className={styles.editButton}
              onClick={() => setIsEditing(!isEditing)}
            >
              Редактировать профиль
            </button>
            <button className={styles.shareButton}>
              Поделиться профилем
            </button>
          </div>

          {isEditing && (
            <form onSubmit={handleSubmit} className={styles.editForm}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Имя</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={styles.input}
                  placeholder="Ваше имя"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>О себе</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className={styles.textarea}
                  placeholder="Расскажите о себе"
                  rows={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Веб-сайт</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className={styles.input}
                  placeholder="https://example.com"
                />
              </div>

              <button type="submit" className={styles.saveButton}>
                Сохранить
              </button>
            </form>
          )}
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.postsSection}>
        <div className={styles.postsHeader}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
          <span>ПУБЛИКАЦИИ</span>
        </div>

        {loading ? (
          <div className={styles.loading}>Загрузка постов...</div>
        ) : userPosts.length === 0 ? (
          <div className={styles.noPosts}>
            <div className={styles.noPostsIcon}>
              <svg width="96" height="77" viewBox="0 0 96 77">
                <circle cx="48" cy="38.5" r="34" stroke="currentColor" strokeWidth="3" fill="none"/>
                <circle cx="48" cy="38.5" r="7" fill="currentColor"/>
              </svg>
            </div>
            <h2>Поделитесь фотографиями</h2>
            <p>Когда вы опубликуете свою первую фотографию, она появится здесь.</p>
          </div>
        ) : (
          <div className={styles.postsGrid}>
            {userPosts.map((post) => (
              <div key={post.id} className={styles.postItem}>
                {post.mediaUrl && (
                  <img
                    src={post.mediaUrl}
                    alt={post.title || 'Post'}
                    className={styles.postImage}
                  />
                )}
                <div className={styles.postOverlay}>
                  <div className={styles.postStats}>
                    <div className={styles.postStat}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                      <span>{post.likes?.length || 0}</span>
                    </div>
                    <div className={styles.postStat}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                      </svg>
                      <span>{post.comments?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <FollowersModal
        isOpen={isFollowersModalOpen}
        onClose={() => setIsFollowersModalOpen(false)}
        userId={user.id}
        initialTab={followersModalTab}
        username={user.username}
      />
    </div>
  );
};
