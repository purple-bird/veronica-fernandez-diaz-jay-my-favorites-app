import './App.css';
import FavoritesList from './features/FavoritesList/FavoritesList.jsx';
import FavoritesForm from './features/FavoritesForm.jsx';
import FavoritesManager from './features/FavoritesManager.jsx';
import { useState } from 'react';

function App() {
  const [favoriteList, setFavoriteList] = useState([]);

  return (
    <div>
      <h1>My favorites</h1>
      <FavoritesManager
        favoriteList={favoriteList}
        setFavoriteList={setFavoriteList}
      />
    </div>
  );
}

export default App;
