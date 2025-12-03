import { useState, useEffect } from "react";
import likeIcon from "../../assets/icons/like-icon.svg";
import commentIcon from "../../assets/icons/comment-icon.svg";
import styles from "./ExplorePanel.module.css";

interface ExplorePost {
  id: string;
  mediaUrl?: string;
  title: string;
  likesCount: number;
  commentsCount: number;
}

interface ExplorePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExplorePanel = ({ isOpen, onClose }: ExplorePanelProps) => {
  const [posts, setPosts] = useState<ExplorePost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "Все" },
    { id: "trending", label: "Популярное" },
    { id: "recent", label: "Новое" },
    { id: "following", label: "Похожее" },
  ];

  const loadExplorePosts = async () => {
    setIsLoading(true);

    // TODO: Заменить на реальный API запрос
    setTimeout(() => {
      const mockPosts: ExplorePost[] = Array.from({ length: 12 }, (_, i) => ({
        id: `post-${i + 1}`,
        mediaUrl: `https://picsum.photos/400/400?random=${i}`,
        title: `Интересный пост ${i + 1}`,
        likesCount: Math.floor(Math.random() * 1000),
        commentsCount: Math.floor(Math.random() * 100),
      }));

      setPosts(mockPosts);
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (isOpen) {
        await loadExplorePosts();
      }
    };
    void fetchData();
  }, [isOpen, selectedCategory]);

  const handlePostClick = (postId: string) => {
    console.log("Open post:", postId);
    // TODO: Открыть модальное окно с постом
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
          <button onClick={onClose} className={styles.backButton}>
            ←
          </button>
          <h2 className={styles.title}>Интересное</h2>
        </div>

        <div className={styles.categories}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`${styles.categoryButton} ${
                selectedCategory === category.id ? styles.active : ""
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className={styles.content}>
          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner} />
              <p>Загрузка...</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {posts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => handlePostClick(post.id)}
                  className={styles.gridItem}
                >
                  {post.mediaUrl ? (
                    <img
                      src={post.mediaUrl}
                      alt={post.title}
                      className={styles.postImage}
                    />
                  ) : (
                    <div className={styles.noImage}>
                      <span>📷</span>
                    </div>
                  )}
                  <div className={styles.overlay}>
                    <div className={styles.stats}>
                      <span className={styles.stat}>
                        <img
                          src={likeIcon}
                          alt="Лайки"
                          className={styles.statIcon}
                        />
                        {post.likesCount}
                      </span>
                      <span className={styles.stat}>
                        <img
                          src={commentIcon}
                          alt="Комментарии"
                          className={styles.statIcon}
                        />
                        {post.commentsCount}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
