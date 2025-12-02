import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppSelector } from '../../store/hooks';
import { LoginForm } from '../../components/LoginForm/LoginForm';
import logo from '../../assets/images/logo.jpeg';
import styles from './LoginPage.module.css';

export const LoginPage = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoContainer}>
          <img src={logo} alt="Fakegram" className={styles.logo} />
        </div>

        <LoginForm />

        <div className={styles.divider}>
          <span className={styles.dividerText}>ИЛИ</span>
        </div>

        <div className={styles.signup}>
          <span>Нет аккаунта? </span>
          <Link to="/register" className={styles.link}>
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  );
};
