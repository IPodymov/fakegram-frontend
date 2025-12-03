import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar/Sidebar';
import { MobileNavigation } from '../MobileNavigation/MobileNavigation';
import { CreateModal } from '../CreateModal/CreateModal';
import { SearchPanel } from '../SearchPanel/SearchPanel';
import { NotificationsPanel } from '../NotificationsPanel';
import styles from './Layout.module.css';

export const Layout = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(false);
  const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);

  const handleSearchClick = () => {
    setIsSearchPanelOpen(!isSearchPanelOpen);
    setIsNotificationsPanelOpen(false);
  };

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleNotificationsClick = () => {
    setIsNotificationsPanelOpen(!isNotificationsPanelOpen);
    setIsSearchPanelOpen(false);
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
  };

  const closeSearchPanel = () => {
    setIsSearchPanelOpen(false);
  };

  const closeNotificationsPanel = () => {
    setIsNotificationsPanelOpen(false);
  };

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <MobileNavigation 
        onSearchClick={handleSearchClick}
        onCreateClick={handleCreateClick}
        onNotificationsClick={handleNotificationsClick}
        isNotificationsPanelOpen={isNotificationsPanelOpen}
      />
      <CreateModal isOpen={isCreateModalOpen} onClose={closeModal} />
      <SearchPanel isOpen={isSearchPanelOpen} onClose={closeSearchPanel} />
      <NotificationsPanel isOpen={isNotificationsPanelOpen} onClose={closeNotificationsPanel} />
    </div>
  );
};
