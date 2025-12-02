import { useState } from "react";
import { CreatePublicationForm } from "../CreatePublicationForm/CreatePublicationForm";
import styles from "./CreateModal.module.css";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ContentType = "menu" | "publication" | "short" | "live";
type PublicationType = "post" | "story";

export const CreateModal = ({ isOpen, onClose }: CreateModalProps) => {
  const [contentType, setContentType] = useState<ContentType>("menu");
  const [publicationType, setPublicationType] =
    useState<PublicationType>("post");

  if (!isOpen) return null;

  const handleClose = () => {
    setContentType("menu");
    setPublicationType("post");
    onClose();
  };

  const handleBackToMenu = () => {
    setContentType("menu");
    setPublicationType("post");
  };

  const renderContent = () => {
    switch (contentType) {
      case "menu":
        return (
          <div className={styles.menuContent}>
            <h2 className={styles.title}>Создать</h2>
            <div className={styles.options}>
              <button
                className={styles.optionButton}
                onClick={() => setContentType("publication")}
              >
                <span className={styles.optionIcon}>📝</span>
                <span>Создать публикацию</span>
              </button>
              <button
                className={styles.optionButton}
                onClick={() => setContentType("short")}
              >
                <span className={styles.optionIcon}>🎬</span>
                <span>Создать короткое видео</span>
              </button>
              <button
                className={styles.optionButton}
                onClick={() => setContentType("live")}
              >
                <span className={styles.optionIcon}>📹</span>
                <span>Создать прямой эфир</span>
              </button>
            </div>
          </div>
        );

      case "publication":
        return (
          <div className={styles.publicationContent}>
            <div className={styles.header}>
              <button onClick={handleBackToMenu} className={styles.backButton}>
                ← Назад
              </button>
              <h2 className={styles.title}>Создать публикацию</h2>
            </div>

            <div className={styles.typeToggle}>
              <button
                className={`${styles.toggleButton} ${
                  publicationType === "post" ? styles.active : ""
                }`}
                onClick={() => setPublicationType("post")}
              >
                Пост
              </button>
              <button
                className={`${styles.toggleButton} ${
                  publicationType === "story" ? styles.active : ""
                }`}
                onClick={() => setPublicationType("story")}
              >
                История
              </button>
            </div>

            <CreatePublicationForm
              type={publicationType}
              onSuccess={handleClose}
            />
          </div>
        );

      case "short":
        return (
          <div className={styles.shortContent}>
            <div className={styles.header}>
              <button onClick={handleBackToMenu} className={styles.backButton}>
                ← Назад
              </button>
              <h2 className={styles.title}>Создать короткое видео</h2>
            </div>
            <div className={styles.shortForm}>
              <div className={styles.uploadArea}>
                <div className={styles.uploadIcon}>🎬</div>
                <h3>Загрузите вертикальное видео</h3>
                <p className={styles.uploadHint}>
                  Длительность до 60 секунд, формат 9:16
                </p>
                <label htmlFor="shortVideo" className={styles.uploadButton}>
                  Выбрать видео
                  <input
                    id="shortVideo"
                    type="file"
                    accept="video/*"
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
              <div className={styles.guidelines}>
                <h4>Рекомендации:</h4>
                <ul>
                  <li>Оптимальное разрешение: 1080×1920</li>
                  <li>Максимальный размер: 100 МБ</li>
                  <li>Форматы: MP4, MOV, AVI</li>
                  <li>Добавьте описание и хэштеги</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case "live":
        return (
          <div className={styles.liveContent}>
            <div className={styles.header}>
              <button onClick={handleBackToMenu} className={styles.backButton}>
                ← Назад
              </button>
              <h2 className={styles.title}>Прямой эфир</h2>
            </div>
            <div className={styles.comingSoon}>
              <p>🎥 Функция находится в разработке</p>
              <p className={styles.hint}>
                Скоро вы сможете запускать прямые эфиры
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={handleClose}>
          ×
        </button>
        {renderContent()}
      </div>
    </div>
  );
};
