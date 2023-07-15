import React from "react";

const Alert = (props) => {
  return (
    <>
      <div style={{ "height": "55px" }}>
        {props.alert && <div
          id="alert"
          className={`alert alert-${props.alert.type} alert-dismissible fade show`}
          role="alert"
        >
          <strong>{props.alert.type==='danger' ?'Error' : props.alert.type.toUpperCase()} : </strong> 
          
          {props.alert.msg}
        </div>}
      </div>
    </>
  );
};

export default Alert;
