import { useState } from "react";
import notecontext from "./noteContext";



const NoteState = (props)=>{

    
    const notess = []
    const [notes, setnote] = useState(notess)


    const getnotes = ()=>{
      fetch('http://localhost:5000/getnotes', {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "auth-token" : localStorage.getItem('token')
        }
      })
      .then(response => response.json())
      .then((json) => {
        setnote(json)
      })
      .catch(err => console.log(err))
    }

    //Add a note
    const addnote = async  (title,description)=>{

      await fetch('http://localhost:5000/createnote', {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "auth-token" : localStorage.getItem('token')
        },
        body: JSON.stringify({title,description})
      })
      .then(response => response.json())
      .then((json) => {
        if(json.user){
          setnote(notes.concat(json))
        }
        else{
          console.log('Undefined title or description')
        }
      })
      .catch((err) => {
        console.log(err)
      })

    }
    //Update a note
    const updatenote = async (id,title,description)=>{
      await fetch(`http://localhost:5000/updatenote/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          "auth-token" : localStorage.getItem('token')
        },
        body: JSON.stringify({title,description})
      })
      .then(response => response.json())
      .then((json) => {
        console.log(json)
      })
      .catch((err) => {
        console.log(err)
      })
      const newNotes = JSON.parse(JSON.stringify(notes));
      for (let index = 0; index < newNotes.length; index++) {
        const element = newNotes[index];
        if(element._id===id){
          element.title = title;
          element.description = description
          break;
        }
      }
      console.log(newNotes)
      setnote(newNotes)
    }
    //Delete a note
    const deletenote = (id)=>{


      

      fetch(`http://localhost:5000/deletenote/${id}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          "auth-token" : localStorage.getItem('token')
        }
      })
      .then(response => response.json())
      .then((json) => {
        console.log(json) 
      })
      .catch(err => console.log(err))

      const fnotes = notes.filter((n)=>{return n._id!==id})
      setnote(fnotes)
    }
    return(
        <notecontext.Provider value={{notes,addnote,updatenote,deletenote,getnotes,setnote}}>
            {props.children}
        </notecontext.Provider>
    )
}

export default NoteState