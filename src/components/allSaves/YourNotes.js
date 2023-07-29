import React from "react";
import Notes from "../Notes";
import AddNote from "../AddNote";

const YourNotes = (props) => {
  return (
    <>
      <div className="container">
        {localStorage.getItem("token") ? (
          <>
            <AddNote ShowAlert={props.ShowAlert} />
            <h1>Your Notes</h1>
            <Notes ShowAlert={props.ShowAlert} />
          </>
        ) : (
          <div>
            <h1 className="text-4xl font-black text-center">
              Please login first...
            </h1>
          </div>
        )}
      </div>
    </>
  );
};

export default YourNotes;
