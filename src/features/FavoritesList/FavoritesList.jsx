import FavoritesDraggableItem from './FavoritesDraggableItem.jsx';

function FavoritesList({
  favoriteList,
  isLoading,
  onUpdateFavorite,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
}) {
  if (isLoading) {
    return <p>Loading your favorite items...</p>;
  }

  if (favoriteList.length === 0) {
    return <p>Add a favorite to get started...</p>;
  }

  return (
    <ol>
      <br></br>
      {favoriteList.map((favorite, index) => (
        <FavoritesDraggableItem
          key={favorite.id}
          favorite={favorite}
          index={index}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={() => onDrop(index)}
          onDelete={onDelete}
          onUpdateFavorite={onUpdateFavorite}
        />
      ))}
    </ol>
  );
}

export default FavoritesList;
