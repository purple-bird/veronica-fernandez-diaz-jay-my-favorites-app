import styles from './FavoritesListItem.module.css';

function FavoritesListItem({ favorite }) {
  return (
    <div className={styles.itemContainer}>
      <span className={styles.title}> {favorite.title} </span>
      <span className={styles.category}> {favorite.category} </span>
    </div>
  );
}

export default FavoritesListItem;
