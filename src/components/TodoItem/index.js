import { useState } from "react";
import { Popconfirm } from "antd";
import "./TodoItem.css";

function TodoItem({ id, text, completed, important, onDeleted, onCompleted, onToggleImportant, onEdit }) {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);

  const handleEditSubmit = () => {
    if (editText.trim()) {
      onEdit(editText.trim());
      setIsEditing(false);
    }
  };

  const handleEditKeyDown = (e) => {
    if (e.key === "Enter") {
      handleEditSubmit();
    } else if (e.key === "Escape") {
      setEditText(text);
      setIsEditing(false);
    }
  };

  const startEdit = () => {
    setEditText(text);
    setIsEditing(true);
  };

  return (
    <li className={`task-item ${completed ? "task-completed" : ""}`}>
      <button
        className={`task-checkbox ${completed ? "task-checked" : ""}`}
        onClick={onCompleted}
        aria-label={completed ? "Marcar como pendiente" : "Marcar como completada"}
      >
        {completed && <i className="bi bi-check2"></i>}
      </button>
      {isEditing ? (
        <input
          className="task-edit-input"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleEditSubmit}
          onKeyDown={handleEditKeyDown}
          autoFocus
        />
      ) : (
        <span className="task-text" onDoubleClick={startEdit}>{text}</span>
      )}
      <div className="task-actions">
        <button
          className={`task-star-btn ${important ? "task-starred" : ""}`}
          onClick={onToggleImportant}
          aria-label={important ? "Quitar de importantes" : "Agregar a importantes"}
        >
          <i className={`bi ${important ? "bi-star-fill" : "bi-star"}`}></i>
        </button>
        <button
          className="task-edit-btn"
          onClick={startEdit}
          aria-label="Editar tarea"
        >
          <i className="bi bi-pencil"></i>
        </button>
        <Popconfirm
          title="Eliminar tarea"
          description="¿Estás seguro de eliminar esta tarea?"
          open={open}
          onConfirm={() => { onDeleted(); setOpen(false); }}
          onCancel={() => setOpen(false)}
          okText="Sí"
          cancelText="No"
        >
          <button
            className="task-delete-btn"
            onClick={() => setOpen(true)}
            aria-label="Eliminar tarea"
          >
            <i className="bi bi-trash3"></i>
          </button>
        </Popconfirm>
      </div>
    </li>
  );
}

export { TodoItem };
