import "./TodoList.css";

function TodoList({ todos, children }) {
  return (
    <div className="task-list">
      {todos.length === 0 && (
        <div className="empty-state">
          <i className="bi bi-clipboard-check empty-icon"></i>
          <p className="empty-text">No hay tareas pendientes</p>
        </div>
      )}
      <ul className="task-list-items">{children}</ul>
    </div>
  );
}

export { TodoList };
