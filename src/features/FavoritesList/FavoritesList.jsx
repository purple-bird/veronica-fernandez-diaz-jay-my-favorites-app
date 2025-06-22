import FavoritesListItem from './FavoritesListItem.jsx';

function FavoritesList({ favoriteList }) {
  if (favoriteList.length === 0) {
    return <p>Add a favorite to get started</p>;
  }

  return (
    <ol>
      {favoriteList.map((favorite) => (
        <FavoritesListItem key={favorite.id} favorite={favorite} />
      ))}
    </ol>
  );
}

export default FavoritesList;
