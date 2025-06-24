import './App.css';
import FavoritesPage from './pages/FavoritesPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import Header from './shared/Header.jsx';
import { useEffect, useCallback, useReducer, useRef } from 'react';
import styles from './App.module.css';
import {
  reducer as favoritesReducer,
  actions as favoriteActions,
  initialState as initialFavoritesState,
} from './reducers/favorites.reducer.js';
import { Routes, Route } from 'react-router';

function App() {
  const [favoriteState, dispatch] = useReducer(
    favoritesReducer,
    initialFavoritesState
  );

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${
    import.meta.env.VITE_TABLE_NAME
  }`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  const { favoriteList, errorMessage } = favoriteState;
  const dragItemIndex = useRef(null);

  const memoizedSetErrorMessage = useCallback((message) => {
    dispatch({
      type: favoriteActions.setLoadError,
      error: new Error(message),
    });
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      dispatch({ type: favoriteActions.fetchFavorites });

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

        dispatch({
          type: favoriteActions.loadFavorites,
          records: data.records,
        });
      } catch (error) {
        memoizedSetErrorMessage(error.message);
      }
    };
    fetchFavorites();
  }, [url, token, memoizedSetErrorMessage]);

  const getSortedFavorites = useCallback(() => {
    return favoriteList.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [favoriteList]);

  const handleAddFavorite = async (newFavorite) => {
    const lastOrder =
      favoriteList.length > 0
        ? Math.max(...favoriteList.map((favorite) => favorite.order || 0))
        : 0;

    const payload = {
      records: [
        {
          fields: {
            title: newFavorite.title,
            category: newFavorite.category,
            order: lastOrder + 1,
          },
        },
      ],
    };

    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    try {
      dispatch({ type: favoriteActions.startRequest });
      const resp = await fetch(url, options);
      if (!resp.ok) {
        throw new Error('Error saving favorite item...');
      }
      const { records } = await resp.json();
      dispatch({ type: favoriteActions.addFavorite, records });
    } catch (error) {
      memoizedSetErrorMessage(error.message);
      dispatch({ type: favoriteActions.endRequest });
    }
  };

  const handleUpdateFavorite = async (editedFavorite) => {
    dispatch({ type: favoriteActions.startRequest });

    const originalFavorite = favoriteList.find(
      (favorite) => favorite.id === editedFavorite.id
    );

    const payload = {
      records: [
        {
          id: editedFavorite.id,
          fields: {
            title: editedFavorite.title,
            category: editedFavorite.category,
            order: originalFavorite.order,
          },
        },
      ],
    };

    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(url, options);

      if (!resp.ok) {
        throw new Error('Error updating item...');
      }

      const { records } = await resp.json();
      const updatedFavorite = {
        id: records[0]['id'],
        ...records[0].fields,
      };

      dispatch({ type: favoriteActions.updateFavorite, updatedFavorite });
    } catch (error) {
      dispatch({
        type: favoriteActions.revertFavorite,
        originalFavorite,
        error,
      });

      memoizedSetErrorMessage(
        `${error.message}. Reverting to original favorite...`
      );
    } finally {
      dispatch({ type: favoriteActions.endRequest });
    }
  };

  const handleDeleteItem = async (id) => {
    dispatch({ type: favoriteActions.startRequest });

    const options = {
      method: 'DELETE',
      headers: {
        Authorization: token,
      },
    };

    try {
      const resp = await fetch(`${url}/${id}`, options);

      if (!resp.ok) {
        throw new Error('Failed to delete item...');
      }

      dispatch({ type: favoriteActions.deleteFavorite, id });
    } catch (error) {
      memoizedSetErrorMessage(`${error.message}. Deletion failed...`);
    } finally {
      dispatch({ type: favoriteActions.endRequest });
    }
  };

  function handleDragStart(index) {
    dragItemIndex.current = index;
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  const handleDrop = async (toIndex) => {
    const fromIndex = dragItemIndex.current;
    if (fromIndex === null || fromIndex === toIndex) return;

    const originalOrder = [...favoriteList];
    const reorderedList = [...favoriteList];
    const [movedItem] = reorderedList.splice(fromIndex, 1);
    reorderedList.splice(toIndex, 0, movedItem);

    const reordered = reorderedList.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    dispatch({
      type: favoriteActions.reorderFavorites,
      fromIndex,
      toIndex,
    });

    try {
      dispatch({ type: favoriteActions.startRequest });
      await storeOrder(reordered);
    } catch (error) {
      memoizedSetErrorMessage(`${error.message}. Reverting order...`);
      dispatch({
        type: favoriteActions.loadFavorites,
        records: originalOrder.map((favorite) => ({
          id: favorite.id,
          fields: {
            title: favorite.title,
            category: favorite.category,
            order: favorite.order,
          },
        })),
      });
    } finally {
      dispatch({ type: favoriteActions.endRequest });
      dragItemIndex.current = null;
    }
  };

  const storeOrder = async (updatedFavorites) => {
    const payload = {
      records: updatedFavorites.map((favorite, index) => ({
        id: favorite.id,
        fields: {
          order: index + 1,
        },
      })),
    };

    const options = {
      method: 'PATCH',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    try {
      const resp = await fetch(url, options);
      if (!resp.ok) {
        const errorText = await resp.text();
        throw new Error(errorText || 'Failed to save order...');
      }
      const data = await resp.json();
      return data.records;
    } catch (error) {
      memoizedSetErrorMessage(error.message);
      throw error;
    }
  };

  return (
    <div className={styles.form}>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <FavoritesPage
              favoriteState={favoriteState}
              favoriteList={getSortedFavorites()}
              handleAddFavorite={handleAddFavorite}
              handleUpdateFavorite={handleUpdateFavorite}
              handleDeleteFavorite={handleDeleteItem}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              handleDrop={handleDrop}
            />
          }
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {errorMessage && (
        <div className={styles.errorBox}>
          <hr />
          <p className={styles.errorMessage}>{errorMessage}</p>
          <button
            className={styles.errorButton}
            onClick={() => dispatch({ type: favoriteActions.clearError })}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
