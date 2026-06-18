import { useState } from "react";
import { Popconfirm, Dropdown } from "antd";
import "./TodoItem.css";

function TodoItem({ id, text, completed, important, category, categories, onDeleted, onCompleted, onToggleImportant, onEdit, onChangeCategory }) {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);

  const categoryData = categories.find((c) => c.id === category) || categories[0];

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

  const categoryMenuItems = categories.map((cat) => ({
    key: cat.id,
    label: (
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <i className={`bi ${cat.icon}`} style={{ color: cat.color }}></i>
        {cat.label}
      </span>
    ),
  }));

  return (
    <li className={`task-item ${completed ? "task-completed" : ""}`}>
      <button
        className={`task-checkbox ${completed ? "task-checked" : ""}`}
        onClick={onCompleted}
        aria-label={completed ? "Marcar como pendiente" : "Marcar como completada"}
      >
        {completed && <i className="bi bi-check2"></i>}
      </button>
      <div className="task-content">
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
        <span className="task-category-badge" style={{ borderColor: categoryData.color, color: categoryData.color }}>
          <i className={`bi ${categoryData.icon}`}></i>
          <span>{categoryData.label}</span>
        </span>
      </div>
      <div className="task-actions">
        <button
          className={`task-star-btn ${important ? "task-starred" : ""}`}
          onClick={onToggleImportant}
          aria-label={important ? "Quitar de importantes" : "Agregar a importantes"}
        >
          <i className={`bi ${important ? "bi-star-fill" : "bi-star"}`}></i>
        </button>
        <Dropdown
          menu={{
            items: categoryMenuItems,
            onClick: ({ key }) => onChangeCategory(key),
          }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <button
            className="task-category-btn"
            aria-label="Cambiar categoría"
          >
            <i className="bi bi-tag"></i>
          </button>
        </Dropdown>
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
