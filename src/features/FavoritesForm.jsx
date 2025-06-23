import { useState, useRef } from 'react';

function FavoritesForm({ onAddFavorite }) {
  const [workingFavoriteTitle, setWorkingFavoriteTitle] = useState('');
  const favoriteTitleInput = useRef('');

  function handleAddFavorite(event) {
    event.preventDefault();

    onAddFavorite(workingFavoriteTitle);

    setWorkingFavoriteTitle('');

    favoriteTitleInput.current.focus();
  }

  return (
    <form onSubmit={handleAddFavorite}>
      <label htmlFor="favoriteTitle">Favorite</label>
      <input
        id="favoriteTitle"
        name="title"
        value={workingFavoriteTitle}
        ref={favoriteTitleInput}
        onChange={(e) => setWorkingFavoriteTitle(e.target.value)}
      ></input>
      <button disabled={workingFavoriteTitle.trim() === ''}>
        Add Favorite
      </button>
    </form>
  );
}

export default FavoritesForm;
