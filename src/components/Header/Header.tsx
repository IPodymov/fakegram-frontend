import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";
import logo from "../../assets/images/logo.jpeg";
import homeIcon from "../../assets/icons/home.svg";
import addPostIcon from "../../assets/icons/add-post-icon.svg";
import profileIcon from "../../assets/icons/profile-icon.svg";
import styles from "./Header.module.css";

export const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logoLink}>
          <img src={logo} alt="Fakegram" className={styles.logo} />
        </Link>

        {isAuthenticated && (
          <nav className={styles.nav}>
            <Link to="/" className={styles.navLink}>
              <img src={homeIcon} alt="Главная" width="24" height="24" />
            </Link>

            <Link to="/create" className={styles.navLink}>
              <img
                src={addPostIcon}
                alt="Создать пост"
                width="24"
                height="24"
              />
            </Link>

            <Link to="/profile" className={styles.navLink}>
              <img
                src={user?.profilePictureUrl || profileIcon}
                alt={user?.username || "User"}
                className={styles.avatar}
              />
            </Link>

            <button onClick={handleLogout} className={styles.logoutButton}>
              Выйти
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};
