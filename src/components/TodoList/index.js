import "./TodoList.css";

function TodoList({ todos, children }) {
  return (
    <div className="content-task">
      {todos.length === 0 && (
        <div className="alert alert-primary" role="alert">
          Oops you don't have any Task
        </div>
      )}

      <ul>{children}</ul>
    </div>
  );
}

export { TodoList };
