import React from 'react'
import Notes from './Notes'
import AddNote from './AddNote'

const Home = () => {
  return (
    <div>
      <AddNote/>
      <h1>Your Notes</h1>
      <Notes/>
    </div>
  )
}

export default Home
