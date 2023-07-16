import React, { useEffect,useRef ,useState} from "react";
import { useContext } from "react";
import notecontext from "../context/note/noteContext";
import NoteItem from "./NoteItem";
import { useNavigate } from "react-router-dom";

const Notes = (props) => {
  const allNotes = useContext(notecontext);
  const navigate = useNavigate();
  const { notes, getnotes,updatenote } = allNotes;
  useEffect(() => {
    if(localStorage.getItem('token')){
      getnotes();
    }
    else{
      navigate('/login')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const ref = useRef(null);
  const refclose = useRef(null);
  
  const [note, setnote] = useState({"id":"","etitle": "","edescription": ""})
  
  const updateNote = (note) => {
    ref.current.click();
    setnote({"id":note._id,"etitle" : note.title, "edescription" : note.description })
  };
 const onChange = (e)=>{
    setnote({...note ,[e.target.name] : e.target.value} )
 }
 const handdlebtn = (e)=>{
    e.preventDefault();
    updatenote(note.id,note.etitle,note.edescription)
    props.ShowAlert('Note updated successfully','success')
    refclose.current.click();
 }
  return (
    <>
      <button
        ref={ref}
        type="button"
        className="btn btn-light d-none"
        data-toggle="modal"
        data-target="#exampleModalCenter"
      >
        Edit Note
      </button>

      <div
        className="modal fade"
        id="exampleModalCenter"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">
                Edit Note
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body"><div className="mb-3">
        <label htmlhtmlfor="etitle" className="form-label">
          Title
        </label>
        <input
          
          onChange={onChange}
          type="etitle"
          value={note.etitle}
          name="etitle"
          className="form-control"
          id="etitle"
          placeholder="Enter your title here"
        />
      </div>
      <div className="mb-3">
        <label htmlhtmlfor="edescription" className="form-label">
          Description
        </label>
        <textarea
          
          onChange={onChange}
          className="form-control"
          name="edescription"
          value={note.edescription}
          id="edescription"
          rows="3"
          placeholder="Enter your description here"
        ></textarea>
      </div>
      </div>
            <div className="modal-footer">
              <button
                ref={refclose}
                type="button"
                className="btn btn-light"
                data-dismiss="modal"
              >
                Close
              </button>
              <button onClick={handdlebtn} type="button" className="btn btn-light">
                Update Note
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container row">
        <div style={{"":""}}>
            {notes.length===0 && 'There are no notes available at the moment.'}
        </div>
        {    
        notes.map((n) => { 
                return <NoteItem confirm={props.confirm}  notes={n} updateNote={updateNote} key={n._id} />;
        })}
      </div>
    </>
  );
};

export default Notes;
