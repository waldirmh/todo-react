import { useState } from "react";
import { Popconfirm } from "antd";
import { iconOptions, colorOptions } from "../../data/categories";
import "./SidebarCategories.css";

function SidebarCategories({ categories, activeView, todos, onNavClick, onAddCategory, onDeleteCategory }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("bi-folder");
  const [newColor, setNewColor] = useState("#6c757d");

  const handleAdd = () => {
    if (newName.trim()) {
      const id = newName.trim().toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
      onAddCategory({ id, label: newName.trim(), icon: newIcon, color: newColor });
      setNewName("");
      setNewIcon("bi-folder");
      setShowAddForm(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAdd();
    } else if (e.key === "Escape") {
      setShowAddForm(false);
      setNewName("");
    }
  };

  return (
    <div className="sidebar-categories">
      <div className="categories-header">
        <span className="categories-title">Módulos</span>
        <button
          className="add-category-btn"
          onClick={() => setShowAddForm(!showAddForm)}
          aria-label="Agregar módulo"
        >
          <i className={`bi ${showAddForm ? "bi-x-lg" : "bi-plus-lg"}`}></i>
        </button>
      </div>

      {showAddForm && (
        <div className="add-category-form">
          <input
            className="category-name-input"
            placeholder="Nombre del módulo"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <div className="category-options">
            <div className="option-group">
              <label className="option-label">Icono</label>
              <div className="icon-grid">
                {iconOptions.map((icon) => (
                  <button
                    key={icon.id}
                    className={`icon-option ${newIcon === icon.id ? "icon-selected" : ""}`}
                    onClick={() => setNewIcon(icon.id)}
                    type="button"
                    title={icon.label}
                  >
                    <i className={`bi ${icon.id}`}></i>
                  </button>
                ))}
              </div>
            </div>
            <div className="option-group">
              <label className="option-label">Color</label>
              <div className="color-grid">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    className={`color-option ${newColor === color ? "color-selected" : ""}`}
                    onClick={() => setNewColor(color)}
                    style={{ backgroundColor: color }}
                    type="button"
                  />
                ))}
              </div>
            </div>
          </div>
          <button className="confirm-add-btn" onClick={handleAdd} type="button">
            Crear módulo
          </button>
        </div>
      )}

      <div className="categories-list">
        {categories.map((cat) => {
          const count = todos.filter((t) => t.category === cat.id && !t.completed).length;
          const isActive = activeView === `category-${cat.id}`;
          return (
            <div
              key={cat.id}
              className={`nav-item category-item ${isActive ? "active" : ""}`}
              onClick={() => onNavClick(`category-${cat.id}`)}
            >
              <i className={`bi ${cat.icon}`} style={{ color: cat.color }}></i>
              <span>{cat.label}</span>
              <span className="nav-count">{count}</span>
              {cat.id !== "general" && (
                <Popconfirm
                  title="Eliminar módulo"
                  description={`¿Eliminar "${cat.label}"? Las tareas se moverán a General.`}
                  okText="Sí"
                  cancelText="No"
                  onConfirm={() => onDeleteCategory(cat.id)}
                >
                  <button
                    className="delete-category-btn"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Eliminar ${cat.label}`}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                </Popconfirm>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { SidebarCategories };
