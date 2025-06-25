import FavoritesForm from '../features/FavoritesForm.jsx';
import FavoritesList from '../features/FavoritesList/FavoritesList.jsx';

function FavoritesPage({
  favoriteState,
  favoriteList,
  handleAddFavorite,
  handleUpdateFavorite,
  handleDeleteFavorite,
  handleDragStart,
  handleDragOver,
  handleDrop,
}) {
  return (
    <div>
      <FavoritesForm
        onAddFavorite={handleAddFavorite}
        isSaving={favoriteState.isSaving}
      />
      <FavoritesList
        favoriteList={favoriteList}
        isLoading={favoriteState.isLoading}
        onUpdateFavorite={handleUpdateFavorite}
        onDelete={handleDeleteFavorite}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />
    </div>
  );
}

export default FavoritesPage;
