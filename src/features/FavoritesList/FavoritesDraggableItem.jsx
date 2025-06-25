import FavoritesListItem from './FavoritesListItem.jsx';
import Categories from '../../shared/Categories.jsx';
import styles from './FavoritesDraggableItem.module.css';
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
      className={styles.item}
    >
      {isEditing ? (
        <>
          <input type="text" value={workingTitle} onChange={handleEdit} />
          <Categories value={workingCategory} onChange={setWorkingCategory} />
          <button
            type="button"
            onClick={handleCancelEdit}
            className={styles.cancelButton}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpdate}
            className={styles.updateButton}
          >
            Update
          </button>
        </>
      ) : (
        <>
          <FavoritesListItem favorite={favorite} />
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className={styles.editButton}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(favorite.id)}
            className={styles.deleteButton}
          >
            Delete
          </button>
        </>
      )}
    </li>
  );
}

export default FavoritesDraggableItem;
