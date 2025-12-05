import { useState, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginThunk } from "../../store/thunks/authThunks";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import styles from "./LoginForm.module.css";

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      return;
    }

    try {
      await dispatch(loginThunk({ username, password }));
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <Input
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={3}
        />
      </div>

      <div className={styles.formGroup}>
        <Input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <Button type="submit" isLoading={loading}>
        Войти
      </Button>
    </form>
  );
};
