import { useRef } from 'react';
import FavoritesDraggableItem from './FavoritesList/FavoritesDraggableItem.jsx';
import FavoritesForm from './FavoritesForm.jsx';

function FavoritesManager({
  favoriteList,
  setFavoriteList,
  isLoading,
  isSaving,
  setIsSaving,
  setErrorMessage,
  url,
  token,
}) {
  const dragItemIndex = useRef(null);

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
      setIsSaving(true);
      const resp = await fetch(url, options);

      if (!resp.ok) {
        throw new Error('Error Saving');
      }

      const { records } = await resp.json();
      const savedFavorite = {
        id: records[0].id,
        ...records[0].fields,
      };

      setFavoriteList([...favoriteList, savedFavorite]);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDrop = async (index) => {
    const originalOrder = [...favoriteList];
    const updated = [...favoriteList];
    const [movedItem] = updated.splice(dragItemIndex.current, 1);
    updated.splice(index, 0, movedItem);

    setFavoriteList(updated);

    try {
      setIsSaving(true);
      await storeOrder(updated);
    } catch (error) {
      setErrorMessage(`${error.message}. Reverting order.`);
      setFavoriteList(originalOrder);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateFavorite = async (editedFavorite) => {
    setIsSaving(true);

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
        throw new Error('Error updating item');
      }

      const { records } = await resp.json();
      const updatedFavorite = {
        id: records[0]['id'],
        ...records[0].fields,
      };

      const updatedFavorites = favoriteList.map((favorite) =>
        favorite.id === updatedFavorite.id ? { ...updatedFavorite } : favorite
      );

      setFavoriteList([...updatedFavorites]);
    } catch (error) {
      setErrorMessage(`${error.message}. Reverting to original favorite...`);

      const revertedFavorites = favoriteList.map((favorite) =>
        favorite.id === originalFavorite.id ? { ...originalFavorite } : favorite
      );

      setFavoriteList([...revertedFavorites]);
    } finally {
      setIsSaving(false);
    }
  };

  function handleDragStart(index) {
    dragItemIndex.current = index;
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

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
        throw new Error(errorText || 'Failed to save order');
      }
      const data = await resp.json();
      return data.records;
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleDeleteItem = async (id) => {
    const originalFavorites = [...favoriteList];
    setIsSaving(true);

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

      const updated = favoriteList.filter((item) => item.id !== id);

      setFavoriteList(updated);
    } catch (error) {
      setErrorMessage(`${error.message}. Reverting deletion...`);
      setFavoriteList([...originalFavorites]);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <FavoritesForm onAddFavorite={handleAddFavorite} isSaving={isSaving} />

      {isLoading ? (
        <p>Loading your favorite items...</p>
      ) : favoriteList.length === 0 ? (
        <p>Add a favorite to get started</p>
      ) : (
        <ol>
          {favoriteList.map((favorite, index) => (
            <FavoritesDraggableItem
              key={favorite.id}
              favorite={favorite}
              index={index}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDelete={handleDeleteItem}
              onUpdateFavorite={handleUpdateFavorite}
            />
          ))}
        </ol>
      )}
    </div>
  );
}

export default FavoritesManager;
