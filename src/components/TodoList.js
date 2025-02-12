import "../styles/TodoList.css";

function TodoList(props) {
  return (
    <div className="content-task">
      <ul>{props.children}</ul>
    </div>
  );
}

export { TodoList };
