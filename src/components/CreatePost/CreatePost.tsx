import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createPostThunk } from '../../store/thunks/postsThunks';
import styles from './CreatePost.module.css';

export const CreatePost = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.posts);
  const { user } = useAppSelector((state) => state.auth);

  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Пожалуйста, выберите изображение');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Размер файла не должен превышать 5MB');
        return;
      }

      setImageFile(file);
      setError('');

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!imageFile) {
      setError('Пожалуйста, выберите изображение');
      return;
    }

    if (!user) {
      setError('Необходимо войти в систему');
      return;
    }

    try {
      // В реальном приложении здесь нужно загрузить изображение на сервер
      // и получить URL. Для демонстрации используем base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageUrl = reader.result as string;
        
        await dispatch(createPostThunk({
          userId: user.id,
          mediaUrl: imageUrl,
          caption: caption.trim() || null,
          location: location.trim() || null,
          isVideo: false,
        }));

        // Очищаем форму после успешного создания
        setCaption('');
        setLocation('');
        setImageFile(null);
        setImagePreview(null);
      };
      reader.readAsDataURL(imageFile);
    } catch (err) {
      setError('Не удалось создать пост');
      console.error('Failed to create post:', err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Создать новый пост</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.uploadSection}>
            {imagePreview ? (
              <div className={styles.previewContainer}>
                <img src={imagePreview} alt="Preview" className={styles.preview} />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className={styles.removeButton}
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className={styles.uploadLabel}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.fileInput}
                />
                <div className={styles.uploadPlaceholder}>
                  <svg width="96" height="77" viewBox="0 0 96 77" fill="none">
                    <path d="M43.5 0H52.5L56.6 10.4L69.1 13.7L79.5 9.6L87 17.1L82.9 27.5L86.2 40L96.6 44.1V53.1L86.2 57.2L82.9 69.7L87 80.1L79.5 87.6L69.1 83.5L56.6 86.8L52.5 97.2H43.5L39.4 86.8L26.9 83.5L16.5 87.6L9 80.1L13.1 69.7L9.8 57.2L-0.6 53.1V44.1L9.8 40L13.1 27.5L9 17.1L16.5 9.6L26.9 13.7L39.4 10.4L43.5 0Z" fill="currentColor"/>
                  </svg>
                  <p>Выберите фото</p>
                  <span>или перетащите его сюда</span>
                </div>
              </label>
            )}
          </div>

          <div className={styles.formGroup}>
            <textarea
              placeholder="Подпись к посту..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className={styles.textarea}
              rows={4}
            />
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="Добавить местоположение"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={styles.input}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading || !imageFile}
          >
            {loading ? 'Публикация...' : 'Опубликовать'}
          </button>
        </form>
      </div>
    </div>
  );
};
