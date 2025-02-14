import "./TodoCounter.css";

function TodoCounter({ total, completed }) {
  return (
    <>
      <h5 className="t1 mt-md-3"> Your Tasks</h5>
      <p className="t2 fw-semibold mb-2">
        {" "}
        You Have Completed {completed} of {total} Tasks
      </p>
    </>
  );
}

export { TodoCounter };
