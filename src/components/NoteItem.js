import React, { useContext } from "react";
import notecontext from '../context/note/noteContext'
const NoteItem = (props) => {
  const context = useContext(notecontext)
  const { notes,updateNote } = props;
  const {deletenote} = context;

  
  return (
      <div className="card mx-2 my-2" style={{ width: "18rem" }}>
        <div className="card-body">
          <h5 className="card-title">{notes.title}</h5>
          <p className="card-text">
          {notes.description}
          </p>
          <i className="fa-solid fa-trash mx-3" onClick={()=>{deletenote(notes._id)}}></i>
          <i className="fa-solid fa-pen-to-square mx-3" onClick={()=>{updateNote(notes)}}></i>
        </div>
      </div>
  );
};

export default NoteItem;
