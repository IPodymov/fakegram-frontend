import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { createPostThunk } from '../../store/thunks/postsThunks';
import styles from './CreatePublicationForm.module.css';

interface CreatePublicationFormProps {
  type: 'post' | 'story';
  onSuccess: () => void;
}

export const CreatePublicationForm = ({ type, onSuccess }: CreatePublicationFormProps) => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Размер файла не должен превышать 2 МБ');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (type === 'post') {
      if (!title.trim()) {
        setError('Пожалуйста, введите заголовок');
        return;
      }
      if (!content.trim()) {
        setError('Пожалуйста, введите содержимое');
        return;
      }
    } else {
      // Для историй обязательно изображение
      if (!image) {
        setError('Пожалуйста, добавьте изображение для истории');
        return;
      }
    }

    setIsLoading(true);

    try {
      await dispatch(
        createPostThunk({
          title: type === 'story' ? 'История' : title,
          content: type === 'story' ? (content || 'История') : content,
          published: true,
          mediaUrl: image || undefined,
        })
      );

      setTitle('');
      setContent('');
      setImage(null);
      setImagePreview(null);
      onSuccess();
    } catch {
      setError('Не удалось создать публикацию. Попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {type === 'post' ? (
        <>
          <div className={styles.field}>
            <label htmlFor="title" className={styles.label}>
              Заголовок
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
              placeholder="Введите заголовок..."
              disabled={isLoading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="content" className={styles.label}>
              Описание
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={styles.textarea}
              placeholder="Расскажите о чём-нибудь..."
              rows={4}
              disabled={isLoading}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="image" className={styles.label}>
              Изображение (необязательно)
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.fileInput}
              disabled={isLoading}
            />
          </div>
        </>
      ) : (
        <>
          <div className={styles.field}>
            <label htmlFor="storyImage" className={styles.label}>
              Изображение истории
            </label>
            <input
              id="storyImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.fileInput}
              disabled={isLoading}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="storyContent" className={styles.label}>
              Подпись (необязательно)
            </label>
            <textarea
              id="storyContent"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={styles.textarea}
              placeholder="Добавьте подпись..."
              rows={2}
              disabled={isLoading}
            />
          </div>
        </>
      )}

      {imagePreview && (
        <div className={styles.preview}>
          <img src={imagePreview} alt="Предпросмотр" className={styles.previewImage} />
          <button
            type="button"
            onClick={() => {
              setImage(null);
              setImagePreview(null);
            }}
            className={styles.removeImage}
            disabled={isLoading}
          >
            ✕
          </button>
        </div>
      )}

      {error && <div className={styles.error}>{error}</div>}

      <button type="submit" className={styles.submitButton} disabled={isLoading}>
        {isLoading ? 'Публикация...' : `Опубликовать ${type === 'post' ? 'пост' : 'историю'}`}
      </button>
    </form>
  );
};
