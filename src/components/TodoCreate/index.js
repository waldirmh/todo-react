import "./TodoCreate.css";

function TodoCreate({
  newTask,
  handleInputChange,
  handleKeyDown,
  handleAddTask,
}) {
  return (
    <div className="add-task-container">
      <div className="add-task-input-wrapper">
        <i className="bi bi-plus add-task-icon"></i>
        <input
          className="add-task-input"
          placeholder="Añadir una tarea..."
          value={newTask}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}

export { TodoCreate };
