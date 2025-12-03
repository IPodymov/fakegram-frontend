import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppSelector } from '../../store/hooks';
import { RegisterForm } from '../../components/RegisterForm/RegisterForm';
import logo from '../../assets/images/logo.png';
import styles from './RegisterPage.module.css';

export const RegisterPage = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoContainer}>
          <img src={logo} alt="Fakegram" className={styles.logo} />
        </div>

        <p className={styles.subtitle}>
          Зарегистрируйтесь, чтобы смотреть фото и видео ваших друзей.
        </p>

        <RegisterForm />

        <div className={styles.divider}>
          <span className={styles.dividerText}>ИЛИ</span>
        </div>

        <div className={styles.login}>
          <span>Уже есть аккаунт? </span>
          <Link to="/login" className={styles.link}>
            Войти
          </Link>
        </div>
      </div>
    </div>
  );
};
