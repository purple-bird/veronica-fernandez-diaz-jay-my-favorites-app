import './App.css';
import FavoritesList from './features/FavoritesList/FavoritesList.jsx';
import FavoritesForm from './features/FavoritesForm.jsx';
import FavoritesDraggableList from './features/FavoritesDraggableList/FavoritesDraggableList.jsx';
import { useState } from 'react';

function App() {
  const [favoriteList, setFavoriteList] = useState([]);
  const [draggable, setDraggable] = useState(true);

  function handleAddFavorite(title) {
    const newFavorite = { title, id: Date.now() };
    setFavoriteList([...favoriteList, newFavorite]);
  }

  return (
    <div>
      <h1>My favorites</h1>
      <FavoritesForm onAddFavorite={handleAddFavorite} />
      {draggable ? (
        <FavoritesDraggableList
          favoriteList={favoriteList}
          setFavoriteList={setFavoriteList}
        />
      ) : (
        <FavoritesList favoriteList={favoriteList} />
      )}
    </div>
  );
}

export default App;
