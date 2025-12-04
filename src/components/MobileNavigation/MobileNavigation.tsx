import { Link, useLocation } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { NotificationsButton } from "../NotificationsButton";
import { SmartImage } from "../SmartImage";
import homeIcon from "../../assets/icons/home.svg";
import searchIcon from "../../assets/icons/search-icon.svg";
import addPostIcon from "../../assets/icons/add-post-icon.svg";
import realsIcon from "../../assets/icons/reals-icon.svg";
import profileEmptyIcon from "../../assets/icons/profile-empty-icon.svg";
import styles from "./MobileNavigation.module.css";

interface MobileNavigationProps {
  onSearchClick: () => void;
  onCreateClick: () => void;
  onNotificationsClick: () => void;
  isNotificationsPanelOpen: boolean;
}

export const MobileNavigation = ({
  onSearchClick,
  onCreateClick,
  onNotificationsClick,
  isNotificationsPanelOpen,
}: MobileNavigationProps) => {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  return (
    <nav className={styles.mobileNav}>
      <Link
        to="/"
        className={`${styles.navItem} ${
          location.pathname === "/" ? styles.active : ""
        }`}
      >
        <img src={homeIcon} alt="Главная" className={styles.icon} />
      </Link>

      <button onClick={onSearchClick} className={styles.navItem}>
        <img src={searchIcon} alt="Поиск" className={styles.icon} />
      </button>

      <div className={styles.navItem}>
        <NotificationsButton
          onClick={onNotificationsClick}
          isActive={isNotificationsPanelOpen}
        />
      </div>

      <button
        onClick={onCreateClick}
        className={`${styles.navItem} ${styles.createButton}`}
      >
        <img src={addPostIcon} alt="Создать" className={styles.icon} />
      </button>

      <Link
        to="/shorts"
        className={`${styles.navItem} ${
          location.pathname === "/shorts" ? styles.active : ""
        }`}
      >
        <img src={realsIcon} alt="Shorts" className={styles.icon} />
      </Link>

      <Link
        to="/profile"
        className={`${styles.navItem} ${
          location.pathname === "/profile" ? styles.active : ""
        }`}
      >
        <SmartImage
          src={user?.profilePictureUrl || profileEmptyIcon}
          alt="Профиль"
          className={`${styles.icon} ${styles.profileAvatar}`}
        />
      </Link>
    </nav>
  );
};
