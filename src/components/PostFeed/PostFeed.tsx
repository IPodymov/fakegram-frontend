import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPostsThunk } from '../../store/thunks/postsThunks';
import { PostCard } from '../PostCard/PostCard';
import styles from './PostFeed.module.css';

export const PostFeed = () => {
  const dispatch = useAppDispatch();
  const { posts, loading, error } = useAppSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPostsThunk());
  }, [dispatch]);

  if (loading && posts.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Загрузка постов...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Ошибка: {error}</div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>
          <h2>Постов пока нет</h2>
          <p>Создайте свой первый пост!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.feed}>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};
