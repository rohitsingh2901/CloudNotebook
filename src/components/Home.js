import React from 'react'
import Notes from './Notes'
import AddNote from './AddNote'

const Home = (props) => {
  
  return (
    <div>
      {localStorage.getItem('token') ? (
        <>
          <AddNote ShowAlert={props.ShowAlert} />
          <h1>Your Notes</h1>
          <Notes ShowAlert={props.ShowAlert} />
        </>
      ) : (
        <div><h1>Welcome to India's Number 1 Note making Platform</h1></div> 
      )}
    </div>
  )
}

export default Home
