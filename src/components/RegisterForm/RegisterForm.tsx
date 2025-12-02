import { useState, useRef, type FormEvent, type ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { registerThunk } from "../../store/thunks/authThunks";
import profileEmptyIcon from "../../assets/icons/profile-empty-icon.svg";
import styles from "./RegisterForm.module.css";

export const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Разрешаем только английские буквы, цифры, точки и нижние подчёркивания
    const englishOnly = value.replace(/[^a-zA-Z0-9._]/g, "");
    setUsername(englishOnly);
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setValidationError("Пожалуйста, выберите изображение");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setValidationError("Размер файла не должен превышать 2MB");
      return;
    }

    setAvatarFile(file);
    setValidationError("");

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (password !== confirmPassword) {
      setValidationError("Пароли не совпадают");
      return;
    }

    if (password.length < 6) {
      setValidationError("Пароль должен быть не менее 6 символов");
      return;
    }

    if (username.length < 3) {
      setValidationError("Имя пользователя должно быть не менее 3 символов");
      return;
    }

    try {
      let avatarBase64: string | undefined;

      if (avatarFile) {
        const reader = new FileReader();
        avatarBase64 = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(avatarFile);
        });
      }

      await dispatch(
        registerThunk({
          username,
          email,
          password,
          profilePictureUrl: avatarBase64,
        })
      );
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.avatarSection}>
        <div className={styles.avatarWrapper} onClick={handleAvatarClick}>
          <img
            src={avatarPreview || profileEmptyIcon}
            alt="Avatar"
            className={styles.avatar}
          />
          <div className={styles.avatarOverlay}>
            <span>Добавить фото</span>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className={styles.fileInput}
        />
      </div>

      <div className={styles.formGroup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <input
          type="text"
          placeholder="Имя пользователя (только английские буквы)"
          value={username}
          onChange={handleUsernameChange}
          className={styles.input}
          required
          minLength={3}
          pattern="[a-zA-Z0-9._]+"
          title="Только английские буквы, цифры, точки и подчёркивания"
        />
      </div>

      <div className={styles.formGroup}>
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
          minLength={6}
        />
      </div>

      <div className={styles.formGroup}>
        <input
          type="password"
          placeholder="Подтвердите пароль"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={styles.input}
          required
          minLength={6}
        />
      </div>

      {(error || validationError) && (
        <div className={styles.error}>{validationError || error}</div>
      )}

      <button type="submit" className={styles.button} disabled={loading}>
        {loading ? "Регистрация..." : "Зарегистрироваться"}
      </button>
    </form>
  );
};
