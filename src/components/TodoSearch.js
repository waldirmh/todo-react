import "../styles/TodoSearch.css";

function TodoSearch({ handleSearchChange }) {
  return (
    <div className="content-search">
      <input
        placeholder="search ...."
        className="input-search"
        onChange={handleSearchChange}
        
      />
      <i className="bi bi-search"></i>
    </div>
  );
}

export { TodoSearch };
