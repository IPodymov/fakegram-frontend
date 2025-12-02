import likeIcon from '../../assets/icons/like-icon.svg';
import viewingIcon from '../../assets/icons/viewing-icon.svg';
import styles from './ShortsPage.module.css';

export const ShortsPage = () => {
  // TODO: Подключить реальные данные из API
  const mockShorts = Array.from({ length: 6 }, (_, i) => ({
    id: `short-${i + 1}`,
    videoUrl: `https://example.com/video-${i + 1}.mp4`,
    thumbnailUrl: `https://picsum.photos/400/700?random=${i}`,
    title: `Короткое видео ${i + 1}`,
    author: {
      username: `user_${i + 1}`,
      profilePictureUrl: undefined,
    },
    likesCount: 1000 + i * 500,
    viewsCount: 5000 + i * 1000,
  }));

  const handleShortClick = (shortId: string) => {
    console.log('Open short:', shortId);
    // TODO: Открыть видео в полноэкранном режиме
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Shorts</h1>
        <p className={styles.subtitle}>Короткие вертикальные видео</p>
      </div>

      <div className={styles.grid}>
        {mockShorts.map((short) => (
          <button
            key={short.id}
            onClick={() => handleShortClick(short.id)}
            className={styles.shortCard}
          >
            <div className={styles.thumbnail}>
              <img src={short.thumbnailUrl} alt={short.title} />
              <div className={styles.playIcon}>▶</div>
            </div>
            <div className={styles.info}>
              <div className={styles.stats}>
                <span className={styles.stat}>
                  <img src={viewingIcon} alt="Просмотры" className={styles.statIcon} />
                  {short.viewsCount.toLocaleString()}
                </span>
                <span className={styles.stat}>
                  <img src={likeIcon} alt="Лайки" className={styles.statIcon} />
                  {short.likesCount.toLocaleString()}
                </span>
              </div>
              <div className={styles.author}>@{short.author.username}</div>
            </div>
          </button>
        ))}
      </div>

      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>🎬</div>
        <h2>Создавайте короткие видео</h2>
        <p>Делитесь моментами длительностью до 60 секунд</p>
      </div>
    </div>
  );
};
