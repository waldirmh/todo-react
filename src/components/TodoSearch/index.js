import "./TodoSearch.css";

function TodoSearch({ searchTerm, handleSearchChange, clearSearch, searchRef }) {
  return (
    <div className="search-container">
      <i className="bi bi-search search-icon"></i>
      <input
        ref={searchRef}
        className="search-input"
        placeholder="Buscar tareas... (/)"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      {searchTerm && (
        <button className="search-clear-btn" onClick={clearSearch} aria-label="Limpiar búsqueda">
          <i className="bi bi-x-lg"></i>
        </button>
      )}
    </div>
  );
}

export { TodoSearch };
