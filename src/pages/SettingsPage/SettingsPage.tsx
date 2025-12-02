import { useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import exitIcon from '../../assets/icons/exit-icon.svg';
import styles from './SettingsPage.module.css';

export const SettingsPage = () => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Настройки</h1>
      </div>

      <div className={styles.section}>
        <button onClick={handleLogout} className={styles.logoutButton}>
          <img src={exitIcon} alt="Выход" className={styles.icon} />
          <span>Выйти из аккаунта</span>
        </button>
      </div>
    </div>
  );
};
