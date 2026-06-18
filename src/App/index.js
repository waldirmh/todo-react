import "./App.css";
import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { TodoItem } from "../components/TodoItem";
import { TodoSearch } from "../components/TodoSearch";
import { TodoCreate } from "../components/TodoCreate";
import { SidebarCategories } from "../components/SidebarCategories";
import { ToastContainer, toast } from "react-toastify";
import { useLocalStorage } from "./useLocalStorage";
import { playCompleteSound, playAddSound, playDeleteSound } from "../utils/sounds";
import { defaultCategories } from "../data/categories";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [newTask, setNewTask] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [todos, setTodos] = useLocalStorage("TODOS", []);
  const [categories, setCategories] = useLocalStorage("CATEGORIES", defaultCategories);
  const [darkMode, setDarkMode] = useLocalStorage("DARK_MODE", false);
  const [activeView, setActiveView] = useState("today");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState("all");

  const searchRef = useRef(null);
  const addTaskRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleKeyboardShortcuts = useCallback((e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    if (e.key === "n" || e.key === "N") {
      e.preventDefault();
      addTaskRef.current?.focus();
    } else if (e.key === "/") {
      e.preventDefault();
      searchRef.current?.focus();
    } else if (e.key === "Escape") {
      setSidebarOpen(false);
      setSearchTerm("");
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyboardShortcuts);
    return () => document.removeEventListener("keydown", handleKeyboardShortcuts);
  }, [handleKeyboardShortcuts]);

  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const completedCount = useMemo(
    () => todos.filter((todo) => todo.completed).length,
    [todos]
  );

  const pendingCount = todos.length - completedCount;
  const importantCount = useMemo(
    () => todos.filter((todo) => todo.important && !todo.completed).length,
    [todos]
  );

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const clearSearch = () => setSearchTerm("");
  const handleInputChange = (e) => setNewTask(e.target.value);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAddTask();
  };

  const completedTask = (taskId) => {
    const todo = todos.find((t) => t.id === taskId);
    if (todo && !todo.completed) playCompleteSound();
    setTodos((prevTodos) =>
      prevTodos.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      const newTodo = {
        id: Date.now(),
        text: newTask,
        completed: false,
        important: false,
        category: selectedCategory,
        createdAt: new Date().toISOString(),
      };
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      setNewTask("");
      setSelectedCategory("general");
      playAddSound();
      toast.success("¡Tarea agregada!");
    }
  };

  const deleteTask = (taskId) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== taskId));
    playDeleteSound();
    toast.warning("¡Tarea eliminada!");
  };

  const toggleImportant = (taskId) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === taskId ? { ...todo, important: !todo.important } : todo
      )
    );
  };

  const editTask = (taskId, newText) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === taskId ? { ...todo, text: newText } : todo
      )
    );
  };

  const changeTaskCategory = (taskId, newCategory) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === taskId ? { ...todo, category: newCategory } : todo
      )
    );
    toast.info("¡Categoría actualizada!");
  };

  const addCategory = (newCategory) => {
    setCategories((prev) => [...prev, newCategory]);
    toast.success("¡Módulo creado!");
  };

  const deleteCategory = (categoryId) => {
    const hasTasks = todos.some((t) => t.category === categoryId);
    if (hasTasks) {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.category === categoryId ? { ...todo, category: "general" } : todo
        )
      );
    }
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    toast.warning("¡Módulo eliminado!");
  };

  const isWithinDateRange = (dateStr, filter) => {
    if (filter === "all") return true;
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (filter === "today") return diffDays < 1;
    if (filter === "week") return diffDays < 7;
    if (filter === "month") return diffDays < 30;
    return true;
  };

  const getFilteredTodos = () => {
    let filtered = todos;

    if (activeView === "completed") {
      filtered = todos.filter((todo) => todo.completed);
    } else if (activeView === "important") {
      filtered = todos.filter((todo) => todo.important && !todo.completed);
    } else if (activeView.startsWith("category-")) {
      const categoryId = activeView.replace("category-", "");
      filtered = todos.filter((todo) => todo.category === categoryId && !todo.completed);
    } else {
      filtered = todos.filter((todo) => !todo.completed);
    }

    filtered = filtered.filter((todo) => isWithinDateRange(todo.createdAt, timeFilter));

    if (searchTerm) {
      filtered = filtered.filter((todo) =>
        todo.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const getViewTitle = () => {
    if (activeView.startsWith("category-")) {
      const categoryId = activeView.replace("category-", "");
      const cat = categories.find((c) => c.id === categoryId);
      return cat ? cat.label : "Módulo";
    }
    const titles = {
      today: "Hoy",
      upcoming: "Próximos",
      important: "Importantes",
      completed: "Completadas",
    };
    return titles[activeView] || "Hoy";
  };

  const getViewDate = () => {
    const today = new Date();
    const options = { weekday: "long", day: "numeric", month: "long" };
    return today.toLocaleDateString("es-ES", options);
  };

  const displayTodos = getFilteredTodos();

  const handleNavClick = (view) => {
    setActiveView(view);
    setTimeFilter("all");
    closeSidebar();
  };

  const handleTimeFilterChange = (filter) => {
    setTimeFilter(filter);
  };

  return (
    <>
      <ToastContainer
        theme={darkMode ? "dark" : "light"}
        position="top-right"
        style={{ fontSize: "13px" }}
      />
      <div className="app-layout">
        <div
          className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`}
          onClick={closeSidebar}
        />
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <i className="bi bi-check2-circle"></i>
              <span>Mis Tareas</span>
            </div>
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Cambiar tema"
            >
              <i className={`bi ${darkMode ? "bi-sun-fill" : "bi-moon-fill"}`}></i>
            </button>
          </div>
          <nav className="sidebar-nav">
            <div
              className={`nav-item ${activeView === "today" ? "active" : ""}`}
              onClick={() => handleNavClick("today")}
            >
              <i className="bi bi-inbox-fill" style={{ color: "var(--accent-color)" }}></i>
              <span>Hoy</span>
              <span className="nav-count">{pendingCount}</span>
            </div>
            <div
              className={`nav-item ${activeView === "upcoming" ? "active" : ""}`}
              onClick={() => handleNavClick("upcoming")}
            >
              <i className="bi bi-calendar-event" style={{ color: "var(--success-color)" }}></i>
              <span>Próximos</span>
            </div>
            <div
              className={`nav-item ${activeView === "important" ? "active" : ""}`}
              onClick={() => handleNavClick("important")}
            >
              <i className="bi bi-star-fill" style={{ color: "var(--warning-color)" }}></i>
              <span>Importantes</span>
              <span className="nav-count">{importantCount}</span>
            </div>
            <div
              className={`nav-item ${activeView === "completed" ? "active" : ""}`}
              onClick={() => handleNavClick("completed")}
            >
              <i className="bi bi-check-circle" style={{ color: "var(--purple-color)" }}></i>
              <span>Completadas</span>
              <span className="nav-count">{completedCount}</span>
            </div>
            <div className="sidebar-divider"></div>
            <SidebarCategories
              categories={categories}
              activeView={activeView}
              todos={todos}
              onNavClick={handleNavClick}
              onAddCategory={addCategory}
              onDeleteCategory={deleteCategory}
            />
          </nav>
          <div className="sidebar-footer">
            <span className="total-tasks">
              <i className="bi bi-bar-chart-fill"></i>
              Total: {todos.length} tareas
            </span>
            <span className="keyboard-hint">
              <kbd>N</kbd> nueva <kbd>/</kbd> buscar
            </span>
          </div>
        </aside>
        <main className="main-content">
          <header className="content-header">
            <button
              className="mobile-menu-btn"
              onClick={toggleSidebar}
              aria-label="Abrir menú"
            >
              <i className="bi bi-list"></i>
            </button>
            <div className="header-text">
              <h1 className="content-title">{getViewTitle()}</h1>
              <p className="content-date">{getViewDate()}</p>
            </div>
            <div className="time-filters">
              <button
                className={`time-filter-btn ${timeFilter === "all" ? "active" : ""}`}
                onClick={() => handleTimeFilterChange("all")}
              >
                Todas
              </button>
              <button
                className={`time-filter-btn ${timeFilter === "today" ? "active" : ""}`}
                onClick={() => handleTimeFilterChange("today")}
              >
                Hoy
              </button>
              <button
                className={`time-filter-btn ${timeFilter === "week" ? "active" : ""}`}
                onClick={() => handleTimeFilterChange("week")}
              >
                Semana
              </button>
              <button
                className={`time-filter-btn ${timeFilter === "month" ? "active" : ""}`}
                onClick={() => handleTimeFilterChange("month")}
              >
                Mes
              </button>
            </div>
          </header>
          <div className="tasks-container">
            <TodoSearch
              searchTerm={searchTerm}
              handleSearchChange={handleSearchChange}
              clearSearch={clearSearch}
              searchRef={searchRef}
            />
            <TransitionGroup className="task-list-items">
              {displayTodos.map((todo) => (
                <CSSTransition key={todo.id} timeout={300} classNames="task">
                  <TodoItem
                    id={todo.id}
                    text={todo.text}
                    completed={todo.completed}
                    important={todo.important}
                    category={todo.category || "general"}
                    categories={categories}
                    onDeleted={() => deleteTask(todo.id)}
                    onCompleted={() => completedTask(todo.id)}
                    onToggleImportant={() => toggleImportant(todo.id)}
                    onEdit={(newText) => editTask(todo.id, newText)}
                    onChangeCategory={(newCat) => changeTaskCategory(todo.id, newCat)}
                  />
                </CSSTransition>
              ))}
            </TransitionGroup>
            {displayTodos.length === 0 && (
              <div className="empty-state">
                <i className="bi bi-clipboard-check empty-icon"></i>
                <p className="empty-text">No hay tareas pendientes</p>
              </div>
            )}
          </div>
          <div className="task-add-container">
            <TodoCreate
              newTask={newTask}
              handleInputChange={handleInputChange}
              handleKeyDown={handleKeyDown}
              handleAddTask={handleAddTask}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={categories}
              addTaskRef={addTaskRef}
            />
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
