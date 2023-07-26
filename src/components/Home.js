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
        <div><h1 className='text-4xl font-black text-center'>Welcome to <span className="text-red-600">India's</span> Number 1 <span className="text-blue-600">Note Making</span> Platform.</h1></div> 
      )}
    </div>
  )
}

export default Home
