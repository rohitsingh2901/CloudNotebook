import React, { useContext, useState } from "react";
import notecontext from '../context/note/noteContext'
const AddNote = (props) => {
const allNotes = useContext(notecontext);
 const {addnote} = allNotes
const [note, setnote] = useState({"title":"","description" : ""})
 const handdleClick = (e)=>{
    e.preventDefault()
    let check =false; 
    if (note.title.length === 0) {
      document.getElementById('w1').classList.remove('hidden')

      check = true;
    }
    else{
      document.getElementById('w1').classList.add('hidden')
    }
    if (note.description.length === 0) {
      document.getElementById('w2').classList.remove('hidden')

      check=true;
    }
    else if (note.description.length>0 && note.description.length < 3) {
      document.getElementById('w2').innerHTML = 'Please provide minimum 3-word description.'
      document.getElementById('w2').classList.remove('hidden')

      check=true;
    }
    else{
      document.getElementById('w2').classList.add('hidden')
    }
    if(check) return
    addnote(note.title,note.description)
    setnote({"title":"","description" : ""})
    props.ShowAlert('Note added successfully','success')
 }

 const onChange = (e)=>{
    setnote({...note ,[e.target.name] : e.target.value} )
 }
  return (
    <div>
      <form>
      <h1>Add a Note</h1>
      <div className="mb-3">
        <label htmlhtmlfor="title" className="form-label">
          Title
        </label>
        <input
          required
          minLength="3"
          onChange={onChange}
          type="title"
          name="title"
          value={note.title}
          className="form-control"
          id="title"
          placeholder="Enter your title here"
        />
        
        <small id="w1" className="hidden" style={{"color" :"red"}}>Please enter valid title</small>
      </div>
      <div className="mb-3">
        <label htmlhtmlfor="description" className="form-label">
          Description
        </label>
        <textarea
          required
          minLength="3"
          onChange={onChange}
          value={note.description}
          className="form-control"
          name="description"
          id="description"
          rows="3"
          placeholder="Enter your description here"
        ></textarea>
        <small id="w2" className="hidden" style={{"color" :"red"}}>Please enter valid description</small>
      </div>
      <div className="mb-3">
        <button onClick={handdleClick} type="submit" className="btn btn-primary mb-3">
          Add Note
        </button>
        
      </div>
      </form>
    </div>
  );
};

export default AddNote;
