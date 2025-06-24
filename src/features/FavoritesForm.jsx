import CategoryDropdown from '../shared/CategoryDropdown.jsx';
import { useState, useRef } from 'react';

function FavoritesForm({ onAddFavorite, isSaving }) {
  const [workingFavoriteTitle, setWorkingFavoriteTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('default');
  const favoriteTitleInput = useRef('');

  function handleAddFavorite(event) {
    event.preventDefault();

    if (selectedCategory === 'default') return;

    onAddFavorite({ title: workingFavoriteTitle, category: selectedCategory });

    setWorkingFavoriteTitle('');
    setSelectedCategory('default');

    favoriteTitleInput.current.focus();
  }

  return (
    <form onSubmit={handleAddFavorite}>
      <label htmlFor="favoriteTitle">Enter favorite item here:</label>
      <input
        id="favoriteTitle"
        name="title"
        value={workingFavoriteTitle}
        ref={favoriteTitleInput}
        onChange={(e) => setWorkingFavoriteTitle(e.target.value)}
      ></input>
      <br></br>
      <CategoryDropdown
        value={selectedCategory}
        onChange={setSelectedCategory}
      />
      <br />
      <button
        disabled={
          isSaving ||
          workingFavoriteTitle.trim() === '' ||
          selectedCategory === 'default'
        }
      >
        {isSaving ? 'Saving...' : 'Add Favorite'}
      </button>
    </form>
  );
}

export default FavoritesForm;
