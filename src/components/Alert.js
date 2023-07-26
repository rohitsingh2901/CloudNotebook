import React from "react";

const Alert = (props) => {
  return (
    <>
      <div style={{ "height": "55px", "display":"flex","justifyContent":"center" }}>
        {props.alert && <div
          id="alert"
          className={`alert alert-${props.alert.type} alert-dismissible fade show w-25 text-xs mb-2`}
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
