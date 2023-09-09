import React from 'react'
import ToDo from './KanbanBoard/ToDo'
import Doing from './KanbanBoard/Doing'
import Done from './KanbanBoard/Done'

const AllCards = () => {
    const [updateDoing, setUpdateDoing] = React.useState(false);
    const [updateToDo, setUpdateToDo] = React.useState(false);
    const [updateDone, setUpdateDone] = React.useState(false);
  
    return (
      <div id="home" className="my-12">
        <div className="roww">
          <div className="column my-2 border-solid border-2 border-black">
            <ToDo setUpdateDoing={setUpdateDoing} updateToDo={updateToDo} />
          </div>
          <div className="column my-2 border-solid border-2 border-black">
            <Doing updateDoing={updateDoing} setUpdateDone={setUpdateDone} setUpdateToDo={setUpdateToDo}/>
          </div>
          <div className="column my-2 border-solid border-2 border-black">
            <Done updateDone={updateDone} setUpdateDoing={setUpdateDoing} />
          </div>
        </div>
      </div>
    );
}

export default AllCards