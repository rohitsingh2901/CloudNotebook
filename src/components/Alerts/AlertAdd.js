import React from "react";

const Alert = () => {
  return (
    <>
    <div style={{"height":"55px"}}>
    <div id="alert1" className="alert alert-success alert-dismissible fade d-none" role="alert">
      <strong>Success!</strong> Note added successfully...
      <button
        type="button"
        className="close"
        data-dismiss="alert"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div id="alert2" className="alert alert-success alert-dismissible fade d-none" role="alert">
      <strong>Success!</strong> Note updated successfully...
      <button
        type="button"
        className="close"
        data-dismiss="alert"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div id="alert3" className="alert alert-success alert-dismissible fade d-none" role="alert">
      <strong>Success!</strong> Note deleted successfully...
      <button
        type="button"
        className="close"
        data-dismiss="alert"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    </div>
    </>
  );
};

export default Alert;
