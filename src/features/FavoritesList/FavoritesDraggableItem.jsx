import FavoritesListItem from './FavoritesListItem.jsx';
import { useState, useEffect } from 'react';

function FavoritesDraggableItem({
  favorite,
  index,
  onDragStart,
  onDragOver,
  onDrop,
  onDelete,
  onUpdateFavorite,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(favorite.title);

  useEffect(() => {
    setWorkingTitle(favorite.title);
  }, [favorite]);

  function handleCancelEdit() {
    setWorkingTitle(favorite.title);
    setIsEditing(false);
  }

  function handleEdit(event) {
    setWorkingTitle(event.target.value);
  }

  function handleUpdate(event) {
    if (isEditing === false) return;
    event.preventDefault();
    onUpdateFavorite({
      ...favorite,
      title: workingTitle,
    });
    setIsEditing(false);
  }

  return (
    <div>
      <li
        draggable
        onDragStart={() => onDragStart(index)}
        onDragOver={onDragOver}
        onDrop={() => onDrop(index)}
      >
        {isEditing ? (
          <>
            <input type="text" value={workingTitle} onChange={handleEdit} />
            <button type="button" onClick={handleCancelEdit}>
              Cancel
            </button>
            <button type="button" onClick={handleUpdate}>
              Update
            </button>
          </>
        ) : (
          <>
            <FavoritesListItem favorite={favorite} />
            <button type="button" onClick={() => setIsEditing(true)}>
              Edit
            </button>
            <button type="button" onClick={() => onDelete(favorite.id)}>
              Delete
            </button>
          </>
        )}
      </li>
    </div>
  );
}

export default FavoritesDraggableItem;
