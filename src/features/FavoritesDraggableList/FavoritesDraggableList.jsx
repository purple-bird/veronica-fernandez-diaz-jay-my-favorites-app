import { useRef } from 'react';
import FavoritesDraggableItem from './FavoritesDraggableItem.jsx';

function FavoritesDraggableList({ favoriteList, setFavoriteList }) {
  const dragItemIndex = useRef(null);

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

  if (favoriteList.length === 0) {
    return <p>Add a favorite to get started</p>;
  }

  return (
    <ol>
      {favoriteList.map((favorite, index) => (
        <FavoritesDraggableItem
          key={favorite.id}
          favorite={favorite}
          index={index}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      ))}
    </ol>
  );
}

export default FavoritesDraggableList;
