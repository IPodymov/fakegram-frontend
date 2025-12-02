import { useState, useRef, useImperativeHandle, forwardRef, type ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateUserThunk } from '../../store/thunks/usersThunks';
import photoIcon from '../../assets/icons/photo-icon.svg';
import profileEmptyIcon from '../../assets/icons/profile-empty-icon.svg';
import styles from './AvatarUpload.module.css';

interface AvatarUploadProps {
  onChangeClick?: () => void;
}

export interface AvatarUploadRef {
  triggerFileInput: () => void;
}

export const AvatarUpload = forwardRef<AvatarUploadRef, AvatarUploadProps>((_, ref) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { loading } = useAppSelector((state) => state.users);
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    triggerFileInput: () => {
      fileInputRef.current?.click();
    },
  }));

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

  const handleFileChange = () => {
    fileInputRef.current?.click();
  };

  const currentAvatar = previewUrl || user?.profilePictureUrl || profileEmptyIcon;

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
          onClick={handleFileChange}
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
});

AvatarUpload.displayName = 'AvatarUpload';

export { AvatarUpload as default };
