import FavoritesListItem from './FavoritesListItem.jsx';
import CategoryDropdown from '../../shared/CategoryDropdown.jsx';
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
  const [workingCategory, setWorkingCategory] = useState(favorite.category);

  useEffect(() => {
    setWorkingTitle(favorite.title);
    setWorkingCategory(favorite.category);
  }, [favorite]);

  function handleCancelEdit() {
    setWorkingTitle(favorite.title);
    setWorkingCategory(favorite.category);
    setIsEditing(false);
  }

  function handleEdit(event) {
    setWorkingTitle(event.target.value);
  }

  function handleUpdate(event) {
    event.preventDefault();
    if (isEditing === false) return;
    onUpdateFavorite({
      ...favorite,
      title: workingTitle,
      category: workingCategory,
    });
    setIsEditing(false);
  }

  return (
    <li
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={onDragOver}
      onDrop={() => onDrop(index)}
    >
      {isEditing ? (
        <>
          <input type="text" value={workingTitle} onChange={handleEdit} />
          <CategoryDropdown
            value={workingCategory}
            onChange={setWorkingCategory}
          />
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
  );
}

export default FavoritesDraggableItem;
