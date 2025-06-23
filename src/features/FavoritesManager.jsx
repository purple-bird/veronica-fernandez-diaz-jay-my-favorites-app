import { useRef } from 'react';
import FavoritesDraggableItem from './FavoritesList/FavoritesDraggableItem.jsx';
import FavoritesForm from './FavoritesForm.jsx';

function FavoritesManager({ favoriteList, setFavoriteList }) {
  const dragItemIndex = useRef(null);

  function handleAddFavorite(title) {
    const newFavorite = { title, id: Date.now() };
    setFavoriteList([...favoriteList, newFavorite]);
  }

  function handleUpdateFavorite(updatedItem) {
    setFavoriteList((currentList) =>
      currentList.map((currentItem) =>
        currentItem.id === updatedItem.id ? updatedItem : currentItem
      )
    );
  }

  function handleDragStart(index) {
    dragItemIndex.current = index;
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(index) {
    const updated = [...favoriteList];
    const [movedItem] = updated.splice(dragItemIndex.current, 1);
    updated.splice(index, 0, movedItem);
    setFavoriteList(updated);
  }

  function handleDeleteItem(id) {
    const updated = favoriteList.filter((item) => item.id !== id);
    setFavoriteList(updated);
  }

  return (
    <div>
      <FavoritesForm onAddFavorite={handleAddFavorite} />

      {favoriteList.length === 0 ? (
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
