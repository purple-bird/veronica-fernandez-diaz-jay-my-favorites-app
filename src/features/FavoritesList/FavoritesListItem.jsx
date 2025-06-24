function FavoritesListItem({ favorite }) {
  return (
    <div>
      {favorite.title}
      {favorite.category}
    </div>
  );
}

export default FavoritesListItem;
