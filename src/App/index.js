import "./App.css";
import React, { useState, useMemo, useEffect } from "react";
import { TodoList } from "../components/TodoList";
import { TodoItem } from "../components/TodoItem";
import { TodoSearch } from "../components/TodoSearch";
import { TodoCreate } from "../components/TodoCreate";
import { ToastContainer, toast } from "react-toastify";
import { useLocalStorage } from "./useLocalStorage";
import { playCompleteSound, playAddSound, playDeleteSound } from "../utils/sounds";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [newTask, setNewTask] = useState("");
  const [todos, setTodos] = useLocalStorage("TODOS", []);
  const [darkMode, setDarkMode] = useLocalStorage("DARK_MODE", false);
  const [activeView, setActiveView] = useState("today");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const completedCount = useMemo(
    () => todos.filter((todo) => todo.completed).length,
    [todos]
  );

  const pendingCount = todos.length - completedCount;
  const importantCount = useMemo(
    () => todos.filter((todo) => todo.important && !todo.completed).length,
    [todos]
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleInputChange = (e) => {
    setNewTask(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  const completedTask = (taskId) => {
    const todo = todos.find((t) => t.id === taskId);
    if (todo && !todo.completed) {
      playCompleteSound();
    }
    setTodos((prevTodos) =>
      prevTodos.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      const newTodo = { id: Date.now(), text: newTask, completed: false, important: false };
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      setNewTask("");
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

  const getFilteredTodos = () => {
    let filtered = todos;

    if (activeView === "completed") {
      filtered = todos.filter((todo) => todo.completed);
    } else if (activeView === "important") {
      filtered = todos.filter((todo) => todo.important && !todo.completed);
    } else {
      filtered = todos.filter((todo) => !todo.completed);
    }

    if (searchTerm) {
      filtered = filtered.filter((todo) =>
        todo.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const getViewTitle = () => {
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

  return (
    <>
      <ToastContainer
        theme={darkMode ? "dark" : "light"}
        position="top-right"
        style={{ fontSize: "13px" }}
      />
      <div className="app-layout">
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <i className="bi bi-check2-circle"></i>
              <span>TodoApp</span>
            </div>
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Cambiar tema"
            >
              <i
                className={`bi ${darkMode ? "bi-sun-fill" : "bi-moon-fill"}`}
              ></i>
            </button>
          </div>
          <nav className="sidebar-nav">
            <div
              className={`nav-item ${activeView === "today" ? "active" : ""}`}
              onClick={() => setActiveView("today")}
            >
              <i className="bi bi-inbox-fill" style={{ color: "var(--accent-color)" }}></i>
              <span>Hoy</span>
              <span className="nav-count">{pendingCount}</span>
            </div>
            <div
              className={`nav-item ${activeView === "upcoming" ? "active" : ""}`}
              onClick={() => setActiveView("upcoming")}
            >
              <i
                className="bi bi-calendar-event"
                style={{ color: "var(--success-color)" }}
              ></i>
              <span>Próximos</span>
            </div>
            <div
              className={`nav-item ${activeView === "important" ? "active" : ""}`}
              onClick={() => setActiveView("important")}
            >
              <i className="bi bi-star-fill" style={{ color: "var(--warning-color)" }}></i>
              <span>Importantes</span>
              <span className="nav-count">{importantCount}</span>
            </div>
            <div
              className={`nav-item ${activeView === "completed" ? "active" : ""}`}
              onClick={() => setActiveView("completed")}
            >
              <i
                className="bi bi-check-circle"
                style={{ color: "var(--purple-color)" }}
              ></i>
              <span>Completadas</span>
              <span className="nav-count">{completedCount}</span>
            </div>
          </nav>
        </aside>
        <main className="main-content">
          <header className="content-header">
            <h1 className="content-title">{getViewTitle()}</h1>
            <p className="content-date">{getViewDate()}</p>
          </header>
          <div className="tasks-container">
            <TodoSearch
              searchTerm={searchTerm}
              handleSearchChange={handleSearchChange}
              clearSearch={clearSearch}
            />
            <TodoList todos={displayTodos}>
              {displayTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  id={todo.id}
                  text={todo.text}
                  completed={todo.completed}
                  important={todo.important}
                  onDeleted={() => deleteTask(todo.id)}
                  onCompleted={() => completedTask(todo.id)}
                  onToggleImportant={() => toggleImportant(todo.id)}
                  onEdit={(newText) => editTask(todo.id, newText)}
                />
              ))}
            </TodoList>
          </div>
          <div className="task-add-container">
            <TodoCreate
              newTask={newTask}
              handleInputChange={handleInputChange}
              handleKeyDown={handleKeyDown}
              handleAddTask={handleAddTask}
            />
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
