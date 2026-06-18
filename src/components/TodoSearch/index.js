import "./TodoSearch.css";

function TodoSearch({ searchTerm, handleSearchChange, clearSearch }) {
  return (
    <div className="search-container">
      <i className="bi bi-search search-icon"></i>
      <input
        className="search-input"
        placeholder="Buscar tareas..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      {searchTerm && (
        <button className="search-clear-btn" onClick={clearSearch}>
          <i className="bi bi-x-lg"></i>
        </button>
      )}
    </div>
  );
}

export { TodoSearch };
