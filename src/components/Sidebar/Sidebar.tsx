import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import homeIcon from '../../assets/icons/home.svg';
import searchIcon from '../../assets/icons/search-icon.svg';
import exploreIcon from '../../assets/icons/explore-icon.svg';
import realsIcon from '../../assets/icons/reals-icon.svg';
import addPostIcon from '../../assets/icons/add-post-icon.svg';
// import exitIcon from '../../assets/icons/hamburger-icon.svg';
import exitIcon from "../../assets/icons/exit-icon.svg"
import profileEmptyIcon from '../../assets/icons/profile-empty-icon.svg';
import { CreateModal } from '../CreateModal/CreateModal';
import { SearchPanel } from '../SearchPanel/SearchPanel';
import { ExplorePanel } from '../ExplorePanel/ExplorePanel';
import styles from './Sidebar.module.css';

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(false);
  const [isExplorePanelOpen, setIsExplorePanelOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleSearchClick = () => {
    setIsSearchPanelOpen(!isSearchPanelOpen);
    setIsExplorePanelOpen(false);
  };

  const handleExploreClick = () => {
    setIsExplorePanelOpen(!isExplorePanelOpen);
    setIsSearchPanelOpen(false);
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
  };

  const closeSearchPanel = () => {
    setIsSearchPanelOpen(false);
  };

  const closeExplorePanel = () => {
    setIsExplorePanelOpen(false);
  };

  return (
    <>
      <nav className={styles.sidebar}>
        <div className={styles.logo}>
          <h1>Fakegram</h1>
        </div>

        <div className={styles.menu}>
          <Link
            to="/"
            className={`${styles.menuItem} ${location.pathname === '/' ? styles.active : ''}`}
          >
            <img src={homeIcon} alt="Главная" className={styles.icon} />
            <span>Главная</span>
          </Link>

          <button
            onClick={handleSearchClick}
            className={`${styles.menuItem} ${styles.createButton} ${isSearchPanelOpen ? styles.active : ''}`}
          >
            <img src={searchIcon} alt="Поиск" className={styles.icon} />
            <span>Поиск</span>
          </button>

          <button
            onClick={handleExploreClick}
            className={`${styles.menuItem} ${styles.createButton} ${isExplorePanelOpen ? styles.active : ''}`}
          >
            <img src={exploreIcon} alt="Интересное" className={styles.icon} />
            <span>Интересное</span>
          </button>

          <Link
            to="/shorts"
            className={`${styles.menuItem} ${location.pathname === '/shorts' ? styles.active : ''}`}
          >
            <img src={realsIcon} alt="Shorts" className={styles.icon} />
            <span>Shorts</span>
          </Link>

          <button
            onClick={handleCreateClick}
            className={`${styles.menuItem} ${styles.createButton}`}
          >
            <img src={addPostIcon} alt="Создать" className={styles.icon} />
            <span>Создать</span>
          </button>

          <Link
            to="/profile"
            className={`${styles.menuItem} ${location.pathname === '/profile' ? styles.active : ''}`}
          >
            <img
              src={user?.profilePictureUrl || profileEmptyIcon}
              alt="Профиль"
              className={`${styles.icon} ${styles.profileAvatar}`}
            />
            <span>Профиль</span>
          </Link>
        </div>

        <div className={styles.footer}>
          <button onClick={handleLogout} className={styles.menuItem}>
            <img src={exitIcon} alt="Ещё" className={styles.icon} />
            <span>Выход</span>
          </button>
        </div>
      </nav>

      <CreateModal isOpen={isCreateModalOpen} onClose={closeModal} />
      <SearchPanel isOpen={isSearchPanelOpen} onClose={closeSearchPanel} />
      <ExplorePanel isOpen={isExplorePanelOpen} onClose={closeExplorePanel} />
    </>
  );
};
