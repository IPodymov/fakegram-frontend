import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SearchPanel.module.css';

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface User {
  id: string;
  username: string;
  profilePictureUrl?: string;
  fullName?: string;
}

export const SearchPanel = ({ isOpen, onClose }: SearchPanelProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<User[]>([]);

  const handleSearchChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    
    // TODO: Заменить на реальный API запрос
    setTimeout(() => {
      // Симуляция поиска
      const mockResults: User[] = [
        {
          id: '1',
          username: 'john_doe',
          fullName: 'John Doe',
          profilePictureUrl: undefined,
        },
        {
          id: '2',
          username: 'jane_smith',
          fullName: 'Jane Smith',
          profilePictureUrl: undefined,
        },
      ].filter(user => 
        user.username.toLowerCase().includes(query.toLowerCase()) ||
        user.fullName?.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(mockResults);
      setIsLoading(false);
    }, 300);
  };

  const handleUserClick = (user: User) => {
    // Добавить в недавние поиски
    const updated = [user, ...recentSearches.filter(u => u.id !== user.id)].slice(0, 5);
    setRecentSearches(updated);
    
    // Перейти на профиль пользователя
    navigate(`/profile/${user.id}`);
    onClose();
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  if (!isOpen) return null;

  const handleOverlayClick = () => {
    if (window.innerWidth > 768) {
      onClose();
    }
  };

  return (
    <>
      <div className={styles.overlay} onClick={handleOverlayClick} />
      <div className={styles.panel}>
        <div className={styles.header}>
          <button onClick={onClose} className={styles.backButton}>
            ←
          </button>
          <h2 className={styles.title}>Поиск</h2>
        </div>

        <div className={styles.searchBox}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Поиск пользователей..."
            className={styles.searchInput}
            autoFocus
          />
          {searchQuery && (
            <button onClick={clearSearch} className={styles.clearButton}>
              ✕
            </button>
          )}
        </div>

        <div className={styles.content}>
          {isLoading ? (
            <div className={styles.loading}>Поиск...</div>
          ) : searchQuery.trim() ? (
            searchResults.length > 0 ? (
              <div className={styles.results}>
                {searchResults.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleUserClick(user)}
                    className={styles.userItem}
                  >
                    <div className={styles.userAvatar}>
                      {user.profilePictureUrl ? (
                        <img src={user.profilePictureUrl} alt={user.username} />
                      ) : (
                        <div className={styles.avatarPlaceholder}>
                          {user.username[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className={styles.userInfo}>
                      <div className={styles.username}>{user.username}</div>
                      {user.fullName && (
                        <div className={styles.fullName}>{user.fullName}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className={styles.noResults}>
                <p>Результатов не найдено</p>
                <span>Попробуйте другой запрос</span>
              </div>
            )
          ) : recentSearches.length > 0 ? (
            <div className={styles.recent}>
              <div className={styles.recentHeader}>
                <h3>Недавние</h3>
                <button onClick={clearRecentSearches} className={styles.clearAllButton}>
                  Очистить все
                </button>
              </div>
              {recentSearches.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleUserClick(user)}
                  className={styles.userItem}
                >
                  <div className={styles.userAvatar}>
                    {user.profilePictureUrl ? (
                      <img src={user.profilePictureUrl} alt={user.username} />
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        {user.username[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className={styles.userInfo}>
                    <div className={styles.username}>{user.username}</div>
                    {user.fullName && (
                      <div className={styles.fullName}>{user.fullName}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <p>Недавних поисков нет</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
