import React, { useState, useEffect } from "react";

import "./TodoItem.css";
import { Popconfirm } from "antd";

function TodoItem({ text, completed, onDeleted, onCompleted }) {
  const [open, setOpen] = useState(false);
  const showPopconfirm = () => {
    setOpen(true);
  };
  const handleOk = () => {
    onDeleted();
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <li className="task-item">
        <i
          className={`bi ${
            completed
              ? "bi-check-square-fill completed"
              : "bi-check-square-fill"
          }`}
          onClick={onCompleted}
        ></i>{" "}
        <span className={`text-item ${completed ? "completed-text" : ""}`}>
          {text.length > 20 ? `${text.slice(0, 20)}...` : text}{" "}
        </span>
        <Popconfirm
          title="Delete the task"
          description="Are you sure to delete this task?"
          open={open}
          onConfirm={handleOk}
          onCancel={handleCancel}
          okText="Yes"
          cancelText="No"
        >
          <i
            className={`bi ${
              completed ? "bi bi-trash-fill completed" : "bi bi-trash-fill"
            }`}
            onClick={showPopconfirm}
          ></i>
        </Popconfirm>
      </li>
    </>
  );
}

export { TodoItem };
