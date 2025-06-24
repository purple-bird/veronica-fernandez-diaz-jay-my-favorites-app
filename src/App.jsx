import './App.css';
import FavoritesManager from './features/FavoritesManager.jsx';
import { useState, useEffect, useCallback } from 'react';
import styles from './App.module.css';

function App() {
  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${
    import.meta.env.VITE_TABLE_NAME
  }`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  const [favoriteList, setFavoriteList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const memoizedSetErrorMessage = useCallback((message) => {
    setErrorMessage(message);
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      setIsLoading(true);
      memoizedSetErrorMessage('');

      const options = {
        method: 'GET',
        headers: { Authorization: token },
      };

      try {
        const resp = await fetch(url, options);
        if (!resp.ok) {
          const errorText = await resp.text();
          throw new Error(errorText || 'Failed to fetch favorites');
        }

        const data = await resp.json();

        const fetchedFavorites = data.records
          .map((record) => ({
            id: record.id,
            title: record.fields.title,
            category: record.fields.category,
            order: record.fields.order ?? 9999,
          }))
          .sort((a, b) => a.order - b.order);

        setFavoriteList(fetchedFavorites);
      } catch (error) {
        memoizedSetErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFavorites();
  }, [url, token, memoizedSetErrorMessage]);

  return (
    <div className={styles.form}>
      <h1>My favorites</h1>
      <FavoritesManager
        favoriteList={favoriteList}
        setFavoriteList={setFavoriteList}
        isLoading={isLoading}
        isSaving={isSaving}
        setIsSaving={setIsSaving}
        setErrorMessage={memoizedSetErrorMessage}
        url={url}
        token={token}
      />
      {errorMessage && (
        <div className={styles.errorBox}>
          <hr />
          <p className={styles.errorMessage}>{errorMessage}</p>
          <button
            className={styles.errorButton}
            onClick={() => memoizedSetErrorMessage('')}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
