import type { Post } from '../../types';
import { getAvatarUrl, getMediaUrl } from '../../utils/imageUtils';
import { SmartImage } from '../SmartImage';
import styles from './PostCard.module.css';

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Только что';
    if (diffInHours < 24) return `${diffInHours} ч. назад`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} д. назад`;
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <SmartImage
            src={getAvatarUrl(post.user?.profilePictureUrl, 40)}
            alt={post.user?.username || 'User'}
            className={styles.avatar}
          />
          <div className={styles.userDetails}>
            <span className={styles.username}>{post.user?.username || 'Unknown'}</span>
          </div>
        </div>
      </div>

      {post.mediaUrl && (
        <div className={styles.mediaContainer}>
          <SmartImage src={getMediaUrl(post.mediaUrl)} alt={post.title || 'Post'} className={styles.media} />
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.actions}>
          <button className={styles.actionButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className={styles.actionButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {post.likes && post.likes.length > 0 && (
          <div className={styles.likes}>
            {post.likes.length} {post.likes.length === 1 ? 'отметка «Нравится»' : 'отметок «Нравится»'}
          </div>
        )}

        {post.title && (
          <div className={styles.caption}>
            <span className={styles.username}>{post.user?.username || 'Unknown'}</span>{' '}
            <strong>{post.title}</strong>
          </div>
        )}

        {post.content && (
          <div className={styles.caption}>
            {post.content}
          </div>
        )}

        {post.comments && post.comments.length > 0 && (
          <button className={styles.viewComments}>
            Посмотреть все комментарии ({post.comments.length})
          </button>
        )}

        <time className={styles.timestamp}>{formatDate(post.createdAt)}</time>
      </div>
    </article>
  );
};
