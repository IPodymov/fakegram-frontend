import { CreatePost } from '../../components/CreatePost/CreatePost';
import styles from './CreatePostPage.module.css';

export const CreatePostPage = () => {
  return (
    <div className={styles.container}>
      <CreatePost />
    </div>
  );
};
