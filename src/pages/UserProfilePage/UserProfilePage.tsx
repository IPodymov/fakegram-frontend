import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchUserByIdThunk } from "../../store/thunks/usersThunks";
import { fetchPostsByUserIdThunk } from "../../store/thunks/postsThunks";
import { followersApi } from "../../api";
import { FollowersModal } from "../../components/FollowersModal/FollowersModal";
import { getAvatarUrl, getMediaUrl } from "../../utils/imageUtils";
import { SmartImage } from "../../components/SmartImage";
import styles from "./UserProfilePage.module.css";

export const UserProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { currentUser: profileUser, loading: userLoading } = useAppSelector(
    (state) => state.users
  );
  const { posts, loading: postsLoading } = useAppSelector(
    (state) => state.posts
  );

  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false);
  const [followersModalTab, setFollowersModalTab] = useState<'followers' | 'following'>('followers');

  // Загрузка данных о подписках
  useEffect(() => {
    if (userId) {
      // Если это профиль текущего пользователя, перенаправляем на /profile
      if (currentUser && userId === currentUser.id) {
        navigate("/profile", { replace: true });
        return;
      }

      dispatch(fetchUserByIdThunk(userId));
      dispatch(fetchPostsByUserIdThunk(userId));

      // Загружаем данные о подписках
      const loadFollowData = async () => {
        setIsDataLoading(true);
        try {
          // Загружаем количество подписчиков и подписок
          const [followers, following, followingStatus] = await Promise.all([
            followersApi.getFollowers(userId),
            followersApi.getFollowing(userId),
            currentUser ? followersApi.isFollowing(userId) : Promise.resolve({ isFollowing: false }),
          ]);

          setFollowersCount(followers.length);
          setFollowingCount(following.length);
          setIsFollowing(followingStatus.isFollowing);
        } catch (error) {
          console.error("Ошибка при загрузке данных о подписках:", error);
          // Устанавливаем значения по умолчанию при ошибке
          setFollowersCount(0);
          setFollowingCount(0);
          setIsFollowing(false);
        } finally {
          setIsDataLoading(false);
        }
      };

      loadFollowData();
    }
  }, [userId, dispatch, currentUser, navigate]);

  const handleFollowClick = async () => {
    if (!userId || isFollowLoading || !currentUser) return;

    setIsFollowLoading(true);

    try {
      if (isFollowing) {
        // Отписаться
        await followersApi.unfollow(userId);
        setIsFollowing(false);
        setFollowersCount((prev) => Math.max(0, prev - 1));
      } else {
        // Подписаться
        await followersApi.follow(userId);
        setIsFollowing(true);
        setFollowersCount((prev) => prev + 1);
      }
    } catch (error: any) {
      console.error("Ошибка при подписке/отписке:", error);
      
      // Обработка специфичных ошибок API
      if (error.response?.status === 409) {
        alert("Вы уже подписаны на этого пользователя.");
      } else if (error.response?.status === 400) {
        alert("Нельзя подписаться на самого себя.");
      } else if (error.response?.status === 404) {
        alert("Пользователь не найден.");
      } else {
        alert("Произошла ошибка при подписке. Попробуйте еще раз.");
      }
      
      // Восстанавливаем предыдущее состояние в случае ошибки
      setIsFollowing(!isFollowing);
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleMessageClick = () => {
    // TODO: Реализовать переход к сообщениям
    // Пример: navigate(`/messages/${userId}`)
    alert(
      `Функция сообщений будет доступна в следующем обновлении.\nОтправить сообщение пользователю: ${profileUser?.username}`
    );
  };

  const handleSuggestClick = async () => {
    if (!profileUser || !userId) return;
    
    const profileUrl = `${window.location.origin}/users/${userId}`;
    
    try {
      // Пробуем использовать современный API для копирования
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(profileUrl);
        alert(`Ссылка на профиль ${profileUser.username} скопирована в буфер обмена!\n\n${profileUrl}`);
      } else {
        // Fallback для старых браузеров
        const textArea = document.createElement('textarea');
        textArea.value = profileUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          alert(`Ссылка на профиль ${profileUser.username} скопирована!\n\n${profileUrl}`);
        } catch (err) {
          console.error('Ошибка копирования:', err);
          alert(`Ссылка на профиль:\n${profileUrl}`);
        }
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Ошибка при копировании ссылки:', err);
      alert(`Ссылка на профиль:\n${profileUrl}`);
    }
  };

  const handleFollowersClick = () => {
    setFollowersModalTab('followers');
    setIsFollowersModalOpen(true);
  };

  const handleFollowingClick = () => {
    setFollowersModalTab('following');
    setIsFollowersModalOpen(true);
  };

  if (userLoading || isDataLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Загрузка профиля...</div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Пользователь не найден</h2>
          <button onClick={() => navigate("/")} className={styles.backButton}>
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  const userPosts = posts.filter((post) => post.user?.id === userId);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.profileHeader}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
              {profileUser.profilePictureUrl ? (
                <SmartImage
                  src={getAvatarUrl(profileUser.profilePictureUrl, 150)}
                  alt={profileUser.username}
                  className={styles.avatar}
                />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {profileUser.username[0].toUpperCase()}
              </div>
            )}
          </div>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.topRow}>
            <h1 className={styles.username}>{profileUser.username}</h1>
            <div className={styles.actionButtons}>
              <button
                className={
                  isFollowing ? styles.followingButton : styles.followButton
                }
                onClick={handleFollowClick}
                disabled={isFollowLoading}
              >
                {isFollowLoading ? (
                  <span className={styles.loadingText}>
                    {isFollowing ? "Отписка..." : "Подписка..."}
                  </span>
                ) : isFollowing ? (
                  "Отписаться"
                ) : (
                  "Подписаться"
                )}
              </button>
              <button
                className={styles.messageButton}
                onClick={handleMessageClick}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                <span>Сообщение</span>
              </button>
              <button
                className={styles.suggestButton}
                onClick={handleSuggestClick}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </button>
              <button className={styles.moreButton}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="19" cy="12" r="1.5" />
                  <circle cx="5" cy="12" r="1.5" />
                </svg>
              </button>
            </div>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{userPosts.length}</span>
              <span className={styles.statLabel}>публикаций</span>
            </div>
            <button className={styles.stat} onClick={handleFollowersClick}>
              <span className={styles.statNumber}>{followersCount}</span>
              <span className={styles.statLabel}>подписчиков</span>
            </button>
            <button className={styles.stat} onClick={handleFollowingClick}>
              <span className={styles.statNumber}>{followingCount}</span>
              <span className={styles.statLabel}>подписок</span>
            </button>
            </div>
          </div>

          <div className={styles.bio}>
            {profileUser.fullName && (
              <div className={styles.fullName}>{profileUser.fullName}</div>
            )}
            {profileUser.bio && (
              <div className={styles.bioText}>{profileUser.bio}</div>
            )}
            {profileUser.website && (
              <a
                href={profileUser.website}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.website}
              >
                {profileUser.website}
              </a>
            )}
          </div>
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

        {postsLoading ? (
          <div className={styles.loading}>Загрузка постов...</div>
        ) : userPosts.length === 0 ? (
          <div className={styles.noPosts}>
            <div className={styles.noPostsIcon}>
              <svg width="96" height="77" viewBox="0 0 96 77">
                <circle
                  cx="48"
                  cy="38.5"
                  r="34"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                />
                <circle cx="48" cy="38.5" r="7" fill="currentColor" />
              </svg>
            </div>
            <h2>Нет публикаций</h2>
            <p>У этого пользователя пока нет публикаций.</p>
          </div>
        ) : (
          <div className={styles.postsGrid}>
            {userPosts.map((post) => (
              <div key={post.id} className={styles.postItem}>
                {post.mediaUrl && (
                  <SmartImage
                    src={getMediaUrl(post.mediaUrl)}
                    alt={post.title || "Post"}
                    className={styles.postImage}
                  />
                )}
                <div className={styles.postOverlay}>
                  <div className={styles.postStats}>
                    <div className={styles.postStat}>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="white"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      <span>{post.likes?.length || 0}</span>
                    </div>
                    <div className={styles.postStat}>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="white"
                      >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
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
        userId={userId!}
        initialTab={followersModalTab}
        username={profileUser.username}
      />
    </>
  );
};
