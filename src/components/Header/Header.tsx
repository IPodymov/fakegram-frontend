import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import logo from '../../assets/images/logo.jpeg';
import styles from './Header.module.css';

export const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logoLink}>
          <img src={logo} alt="Fakegram" className={styles.logo} />
        </Link>

        {isAuthenticated && user && (
          <nav className={styles.nav}>
            <Link to="/" className={styles.navLink}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>

            <Link to="/create" className={styles.navLink}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </Link>

            <div className={styles.userMenu}>
              <img
                src={user.profilePictureUrl || 'https://via.placeholder.com/32'}
                alt={user.username}
                className={styles.avatar}
              />
              <div className={styles.dropdown}>
                <div className={styles.userInfo}>
                  <span className={styles.username}>{user.username}</span>
                  {user.email && <span className={styles.email}>{user.email}</span>}
                </div>
                <button onClick={handleLogout} className={styles.logoutButton}>
                  Выйти
                </button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
