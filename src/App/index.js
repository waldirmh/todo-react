import "./App.css";
import React, { useState, useEffect } from "react";
import { TodoList } from "../components/TodoList";
import { TodoItem } from "../components/TodoItem";
import { TodoCounter } from "../components/TodoCounter/index";
import { TodoSearch } from "../components/TodoSearch";
import { TodoCreate } from "../components/TodoCreate";
import { ToastContainer, toast } from "react-toastify";
import { useLocalStorage } from "./useLocalStorage";
// Importar Bootstrap CSS y JS
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [completedCount, setCompletedCount] = useState(0);
  const [newTask, setNewTask] = useState("");
  const [todos, setTodos] = useLocalStorage("TODOS", []);
  const [hasTask, setHasTask] = useState(false);
  // funtions

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (e) => {
    setNewTask(e.target.value);
  };

  const handlePressKey = (e) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  const completedTask = (taskIndex) => {
    const updatedTodos = todos.map((todo, index) =>
      index === taskIndex ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    localStorage.setItem("TODOS", JSON.stringify(updatedTodos));
    toast.success("Task completed!");
  };

  const handleCancelAddTask = () => {
    setNewTask("");
  };
  const handleAddTask = () => {
    if (newTask.trim()) {
      const newTodo = { text: newTask, completed: false };
      setTodos([...todos, newTodo]);
      setNewTask("");
      toast.success("Task Added!");
    }
  };
  const deleteTask = (taskIndex) => {
    const updatedTodos = todos.filter((_, index) => index !== taskIndex);
    setTodos(updatedTodos);
    localStorage.setItem("TODOS", JSON.stringify(updatedTodos));
    toast.warning("Task deleted!");
  };
  const getCompletedTodosCount = () => {
    return todos.filter((todo) => todo.completed).length;
  };

  const filteredTodos = todos.filter((todo) =>
    todo.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // useEffect
  useEffect(() => {
    setCompletedCount(getCompletedTodosCount());
    localStorage.setItem("TODOS", JSON.stringify(todos));
  }, [todos]);

  return (
    <>
      <ToastContainer />
      <div className="container-fluid d-flex justify-content-center align-items-center">
        <div className="container">
          <div className="row g-2">
            <div className="container col-sm-12  col-md-5 col-lg-5">
              <TodoCreate
                newTask={newTask}
                handleInputChange={handleInputChange}
                handlePressKey={handlePressKey}
                handleAddTask={handleAddTask}
                handleCancelAddTask={handleCancelAddTask}
              />
            </div>
            <div className="container col-sm-12 col-md-7 col-lg-7">
              <div className="content-tasks">
                <TodoCounter completed={completedCount} total={todos.length} />
                <TodoSearch handleSearchChange={handleSearchChange} />
                <TodoList todos={todos}>
                  {filteredTodos.map((todo, index) => (
                    <TodoItem
                      key={index}
                      text={todo.text}
                      completed={todo.completed}
                      onDeleted={() => deleteTask(index)}
                      onCompleted={() => completedTask(index)}
                    />
                  ))}
                </TodoList>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
