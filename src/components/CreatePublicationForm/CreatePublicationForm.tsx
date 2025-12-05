/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useAppDispatch } from "../../store/hooks";
import { createPostThunk } from "../../store/thunks/postsThunks";
import { createStoryThunk } from "../../store/thunks/storiesThunks";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import styles from "./CreatePublicationForm.module.css";

interface CreatePublicationFormProps {
  type: "post" | "story";
  onSuccess: () => void;
}

export const CreatePublicationForm = ({
  type,
  onSuccess,
}: CreatePublicationFormProps) => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("Не удалось создать canvas context"));
            return;
          }

          // Максимальные размеры
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;

          let width = img.width;
          let height = img.height;

          // Пропорциональное уменьшение
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = (height * MAX_WIDTH) / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = (width * MAX_HEIGHT) / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Сжатие с качеством 0.6 для меньшего размера
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6);

          // Проверка размера (примерно base64 длина * 0.75 = размер в байтах)
          const sizeInBytes = compressedBase64.length * 0.75;
          const sizeInMB = sizeInBytes / (1024 * 1024);

          console.log(`Compressed image size: ${sizeInMB.toFixed(2)} MB`);

          if (sizeInMB > 5) {
            reject(
              new Error(
                "Сжатое изображение всё ещё слишком большое. Попробуйте изображение меньшего размера."
              )
            );
            return;
          }

          resolve(compressedBase64);
        };
        img.onerror = () =>
          reject(new Error("Не удалось загрузить изображение"));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Не удалось прочитать файл"));
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("Размер файла не должен превышать 10 МБ");
        return;
      }

      try {
        setIsLoading(true);
        setError("Сжатие изображения...");
        const compressedBase64 = await compressImage(file);
        setImage(compressedBase64);
        setImagePreview(compressedBase64);
        setError("");
      } catch (err) {
        console.error("Ошибка при обработке изображения:", err);
        const error = err as Error;
        setError(error.message || "Не удалось обработать изображение");
        setImage(null);
        setImagePreview(null);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (type === "post") {
      if (!title.trim()) {
        setError("Пожалуйста, введите заголовок");
        return;
      }
      if (!content.trim()) {
        setError("Пожалуйста, введите содержимое");
        return;
      }
    } else {
      // Для историй обязательно изображение
      if (!image) {
        setError("Пожалуйста, добавьте изображение для истории");
        return;
      }
    }

    setIsLoading(true);
    setError("");

    try {
      if (type === "story") {
        // Создание истории
        await dispatch(
          createStoryThunk({
            content: content || "История",
            mediaUrl: image || undefined,
          })
        );
      } else {
        // Создание поста
        const postData: {
          title: string;
          content: string;
          published: boolean;
          mediaUrl?: string;
        } = {
          title,
          content,
          published: true,
        };

        // Добавляем mediaUrl только если есть изображение
        if (image) {
          postData.mediaUrl = image;
        }

        await dispatch(createPostThunk(postData));
      }

      // Очищаем форму после успешного создания
      setTitle("");
      setContent("");
      setImage(null);
      setImagePreview(null);
      setError("");
      onSuccess();
    } catch (error) {
      console.error("Failed to create publication:", error);

      // Более детальная обработка ошибок
      const err = error as {
        response?: {
          status?: number;
          data?: any;
        };
        message?: string;
      };

      if (err.response?.status === 400) {
        const errorMsg =
          err.response?.data?.message ||
          "Проверьте правильность заполнения полей.";
        setError(errorMsg);
      } else if (err.response?.status === 401) {
        setError("Вы не авторизованы. Пожалуйста, войдите в систему.");
      } else if (err.response?.status === 413) {
        setError(
          "Изображение слишком большое. Попробуйте выбрать изображение меньшего размера."
        );
      } else if (err.response?.status === 500) {
        const errorDetails = err.response?.data?.message || "";
        console.error("Server error details:", err.response?.data);
        setError(
          `Ошибка сервера: ${
            errorDetails || "Попробуйте позже или обратитесь к администратору."
          }`
        );
      } else if (err.message) {
        setError(`Ошибка: ${err.message}`);
      } else {
        setError("Не удалось создать публикацию. Попробуйте позже.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {type === "post" ? (
        <>
          <div className={styles.field}>
            <Input
              id="title"
              label="Заголовок"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
          <img
            src={imagePreview}
            alt="Предпросмотр"
            className={styles.previewImage}
          />
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

      <Button
        type="submit"
        disabled={isLoading}
      >
        {isLoading
          ? "Публикация..."
          : `Опубликовать ${type === "post" ? "пост" : "историю"}`}
      </Button>
    </form>
  );
};
