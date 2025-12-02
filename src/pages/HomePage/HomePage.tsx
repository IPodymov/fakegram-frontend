import { PostFeed } from '../../components/PostFeed/PostFeed';
import styles from './HomePage.module.css';

export const HomePage = () => {
  return (
    <div className={styles.container}>
      <PostFeed />
    </div>
  );
};
