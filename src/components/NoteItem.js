import React, { useContext, useState } from "react";
import notecontext from '../context/note/noteContext'
import ConfirmModal from './ConfirmModal';
const NoteItem = (props) => {
  const context = useContext(notecontext)
  const { notes,updateNote } = props;
  const {deletenote} = context;

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleDeleteClick = () => {

    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    // Perform the delete operation here
     deletenote(notes._id)
    // After delete is completed, hide the confirm modal
    setShowConfirmModal(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
  };


  
  
  return (
      <div className="card mx-2 my-2" style={{ width: "18rem" }}>
        <div className="card-body">
          <h5 className="card-title">{notes.title}</h5>
          <p className="card-text">
          {notes.description}
          </p>
          <i className="fa-solid fa-trash mx-3" data-toggle="modal" data-target="#exampleModalCenter2" onClick={handleDeleteClick}></i>
          <i className="fa-solid fa-pen-to-square mx-3"  onClick={()=>{updateNote(notes)}}></i>
        </div>
        {showConfirmModal && (
        <ConfirmModal
          message="Are you sure you want to delete?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
      </div>
  );
};

export default NoteItem;
