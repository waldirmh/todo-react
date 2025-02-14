import "./TodoCreate.css";
function TodoCreate({
  newTask,
  handleInputChange,
  handlePressKey,
  handleAddTask,
  handleCancelAddTask,
}) {
  return (
    <>
      <div className="content-create-task p-md-3">
        <h5 className="t1 mt-md-3"> Create New Task</h5>
        <div className="mb-1">
          <label className="form-label fw-semibold t2">My Task</label>
          <input
            className="form-control input-task"
            placeholder="your task"
            value={newTask}
            onChange={handleInputChange}
            onKeyPress={handlePressKey}
          />
        </div>
        <div className="content-buttons d-flex align-items-center ">
          <button
            type="button "
            className="btn btn-create fw-semibold"
            onClick={handleAddTask}
          >
            Create Task
          </button>
          <button
            type="button "
            className="btn btn-cancel fw-semibold"
            onClick={handleCancelAddTask}
          >
            Cancelar
          </button>
        </div>
        <div className="content-image">
          <img src="/robot.png" alt="Computadora" className="img-fluid" />
        </div>
      </div>
    </>
  );
}

export { TodoCreate };
