import { useState, useRef, type ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateUserThunk } from '../../store/thunks/usersThunks';
import photoIcon from '../../assets/icons/photo-icon.svg';
import styles from './AvatarUpload.module.css';

export const AvatarUpload = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { loading } = useAppSelector((state) => state.users);
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Валидация
    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, выберите изображение');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Размер файла не должен превышать 2MB');
      return;
    }

    setError('');

    // Создаем превью
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      setPreviewUrl(imageUrl);
      
      // Сразу загружаем аватар
      if (user) {
        dispatch(updateUserThunk(user.id, {
          profilePictureUrl: imageUrl,
        }))
          .then(() => {
            setPreviewUrl(null);
          })
          .catch(() => {
            setError('Не удалось загрузить аватар');
            setPreviewUrl(null);
          });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const currentAvatar = previewUrl || user?.profilePictureUrl || 'https://via.placeholder.com/150';

  return (
    <div className={styles.container}>
      <div className={styles.avatarWrapper}>
        <img
          src={currentAvatar}
          alt={user?.username || 'User'}
          className={styles.avatar}
        />
        {loading && (
          <div className={styles.overlay}>
            <div className={styles.spinner} />
          </div>
        )}
        <button
          type="button"
          onClick={handleClick}
          className={styles.changeButton}
          disabled={loading}
        >
          <img src={photoIcon} alt="Изменить фото" width="40" height="40" className={styles.icon} />
        </button>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className={styles.fileInput}
      />
      
      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};
