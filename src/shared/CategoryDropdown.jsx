function CategoryDropdown({ value, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="default" disabled>
        Select Category
      </option>
      <option value="Books">Books</option>
      <option value="Movies">Movies</option>
      <option value="Music">Music</option>
    </select>
  );
}

export default CategoryDropdown;
