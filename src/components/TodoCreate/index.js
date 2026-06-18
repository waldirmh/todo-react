import "./TodoCreate.css";

function TodoCreate({
  newTask,
  handleInputChange,
  handleKeyDown,
  handleAddTask,
  selectedCategory,
  onCategoryChange,
  categories,
  addTaskRef,
}) {
  return (
    <div className="add-task-container">
      <div className="add-task-input-wrapper">
        <i className="bi bi-plus-circle add-task-icon"></i>
        <input
          ref={addTaskRef}
          className="add-task-input"
          placeholder="Añadir una tarea..."
          value={newTask}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button className="btn-add-task" onClick={handleAddTask} type="button">
          Agregar
        </button>
      </div>
      <div className="category-selector">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`category-btn ${selectedCategory === cat.id ? "category-active" : ""}`}
            onClick={() => onCategoryChange(cat.id)}
            type="button"
            style={{ "--cat-color": cat.color }}
          >
            <i className={`bi ${cat.icon}`}></i>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export { TodoCreate };
