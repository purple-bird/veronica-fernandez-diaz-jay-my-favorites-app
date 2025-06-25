import Categories from '../shared/Categories.jsx';
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
      <p>
        You can submit your favorite items below. You can select, drag, and drop
        the item to change the order of the list.
      </p>
      <br></br>
      <label htmlFor="favoriteTitle">Enter favorite item here: </label>
      <input
        id="favoriteTitle"
        name="title"
        value={workingFavoriteTitle}
        ref={favoriteTitleInput}
        onChange={(e) => setWorkingFavoriteTitle(e.target.value)}
      ></input>
      <br></br>
      <Categories value={selectedCategory} onChange={setSelectedCategory} />
      <br></br>
      <br></br>
      <button
        disabled={
          isSaving ||
          workingFavoriteTitle.trim() === '' ||
          selectedCategory === 'default'
        }
      >
        Add Favorite
      </button>
      {isSaving && <div>Saving...</div>}
    </form>
  );
}

export default FavoritesForm;
