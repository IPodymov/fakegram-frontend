import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchUsersThunk } from '../../store/thunks/usersThunks';
import type { RootState, AppDispatch } from '../../store';
import type { User } from '../../types';
import { SmartImage } from '../SmartImage';
import styles from './SearchPanel.module.css';

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECENT_SEARCHES_KEY = 'fakegram_recent_searches';

export const SearchPanel = ({ isOpen, onClose }: SearchPanelProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { users: searchResults, loading: isLoading } = useSelector((state: RootState) => state.users);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<User[]>([]);

  // Загрузка недавних поисков из localStorage
  useEffect(() => {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recent searches:', e);
      }
    }
  }, []);

  const handleSearchChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length < 2) {
      return;
    }

    try {
      await dispatch(searchUsersThunk(query));
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleUserClick = (user: User) => {
    // Добавить в недавние поиски
    const updated = [user, ...recentSearches.filter(u => u.id !== user.id)].slice(0, 5);
    setRecentSearches(updated);
    
    // Сохранить в localStorage
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    
    // Перейти на профиль пользователя
    navigate(`/users/${user.id}`);
    onClose();
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
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
          ) : searchQuery.trim().length >= 2 ? (
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
                        <SmartImage src={user.profilePictureUrl} alt={user.username} />
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
                      <SmartImage src={user.profilePictureUrl} alt={user.username} />
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
