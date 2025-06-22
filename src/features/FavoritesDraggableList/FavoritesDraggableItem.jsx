import FavoritesListItem from '../FavoritesList/FavoritesListItem.jsx';

function FavoritesDraggableItem({
  favorite,
  index,
  onDragStart,
  onDragOver,
  onDrop,
}) {
  return (
    <li
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={onDragOver}
      onDrop={() => onDrop(index)}
    >
      <FavoritesListItem favorite={favorite} />
    </li>
  );
}

export default FavoritesDraggableItem;
