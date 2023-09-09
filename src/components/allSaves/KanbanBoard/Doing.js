import React, { useEffect, useState } from 'react'

const Doing = ({updateDoing, setUpdateToDo, setUpdateDone}) => {
  const [Cards, setCards] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [utitle, setuTitle] = useState("");
  const [udescription, setuDescription] = useState("");
  const [i, seti] = useState(null);
  const [di, setDi] = useState(null);
  const [check, setCheck] = useState(false);
  const [direction, setDirection] = useState('right');
  const [direction2, setDirection2] = useState('left');


  useEffect   (() => {
    fetchCards();
  }, [updateDoing,]);
  useEffect(() => {
    const handleResize = () => {
      setDirection(window.innerWidth <= 750 ? 'down' : 'right');
      setDirection2(window.innerWidth <= 750 ? 'up' : 'left');
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const fetchCards = async () => {
    setCheck(false)
    try {
      const response = await fetch("http://localhost:5000/doing-cards");
      const data = await response.json();
      setCheck(true)
      setCards(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  const deleteCard = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/doing-cards/${Cards[di]._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      console.log(data)
      fetchCards();
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const editCard = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/doingcards/edit/${Cards[i]._id}`,
        {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: utitle, description: udescription, column: "doing" }),
        }
      );  
      const data = await response.json();
      console.log(data)
      fetchCards();
    } catch (error) {
      console.error("Error:", error);
    }
  };




  const titleChange = (event)=>{
      setTitle(event.target.value);
  }
  const descriptionChange = (event)=>{
      setDescription(event.target.value);
  }
  const utitleChange = (event)=>{
      setuTitle(event.target.value);
  }
  const udescriptionChange = (event)=>{
      setuDescription(event.target.value);
  }
  const createCard = async(event,column)=>{
    if(title!=="" && description!==""){
    event.preventDefault()
    try {
      const response = await fetch('http://localhost:5000/create-doingcard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, column}),
      });
      const data = await response.json();
      console.log('Card added:', data);
      fetchCards()
      document.getElementById('doingTitle').value=""
      document.getElementById('doingDesc').value=""
      setTitle("")
      setDescription("")
    } catch (error) {
      console.error('Error:', error);
    }
  }
  }

  const moveCardToDo = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/move-to-todo/${id}`, {
        method: 'PUT',
      });
  
      if (response.status === 200) {
        console.log('Card moved to "Todo" successfully');
        fetchCards()
        setUpdateToDo(prev => !prev);
        setUpdateDone(prev=>!prev);
      } else if (response.status === 404) {
        console.error('Card not found');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const moveCardToDone = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/move-to-done/${id}`, {
        method: 'PUT',
      });
  
      if (response.status === 200) {
        console.log('Card moved to "Todo" successfully');
        fetchCards()
        setUpdateDone(prev=>!prev);
      } else if (response.status === 404) {
        console.error('Card not found');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
    <h1 className="text-center font-extrabold text-yellow-800">Doing</h1>
          {check ? (Cards.map((c, i) => (
            <div key={i} className="flex justify-center">
              <div
                className="card text-black border-danger mb-3"
                style={{  width: "80%",background:"#F0E68C" }}
              >
                <div className="card-header font-bold text-center">
                  {c.title}
                </div>
                <div className="card-body">
                  <p className="card-text">{c.description}</p>
                  <div className="flex justify-end">
                  <i title='Move to ToDo' onClick={()=>{moveCardToDo(c._id)}} className={`fa fa-arrow-${direction2} mx-2 cursor-pointer`}></i>
                    <i
                    title='Delete Card'
                      onClick={() => setDi(i)}
                      data-toggle="modal" data-target="#exampleModalCenterDeleteCheck2"
                      className="fa-solid fa-trash mx-2 cursor-pointer"
                    ></i>
                    <i title='Edit Card' data-toggle="modal"
            data-target="#exampleModalCenterDoingUpdate" onClick={()=>{seti(i) 
            setuTitle(Cards[i].title)
            setuDescription(Cards[i].description)}} className="fa-solid fa-pen-to-square mx-2 cursor-pointer"></i>
                    <i title='Move to done' onClick={()=>{moveCardToDone(c._id)}} className={`fa fa-arrow-${direction} cursor-pointer`}></i>
                  </div>
                </div>
              </div>
            </div>
          ))):(<div className="flex flex-col justify-center items-center my-4">
          <div className="loader "></div>
          <h5>Please Wait</h5>
          </div>)}
          <h6
            title='Add new card'
            data-toggle="modal"
            data-target="#exampleModalCenterDoing"
            className="cursor-pointer text-center"
          >
            Create Card <i className="fa-solid fa-plus"></i>
          </h6>
          <div className="modal fade" id="exampleModalCenterDeleteCheck2" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title font-bold" id="exampleModalLongTitle">Are you sure you want to delete this card</h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
        <button onClick={deleteCard} type="button" data-dismiss="modal" className="btn btn-danger">Delete</button>
      </div>
    </div>
  </div>
</div>

          <div
            className="modal fade"
            id="exampleModalCenterDoingUpdate"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
            <form>
              <div className="modal-content" style={{minWidth:"30rem"}}>
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLongTitle">
                    Update Card
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
                <div className="modal-body">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">Title</label>
                      <input
                        required
                        value={utitle}
                        type="text"
                        className="form-control"
                        onChange={utitleChange}
                        placeholder="This is a titile"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="exampleInputPassword1">Description</label>
                      <input
                        required
                        value={udescription}
                        type="text"
                        className="form-control"
                        onChange={udescriptionChange}
                        placeholder="This is a description"
                      />
                    </div>
                  
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    id="cancel"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="submit" onClick={editCard} {...(utitle && udescription ? { "data-dismiss": "modal" } : {})} className="btn btn-primary">
                    Update Card
                  </button>
                </div>
              </div>
              </form>
            </div>
          </div>



          <div
            className="modal fade"
            id="exampleModalCenterDoing"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
            <form>
              <div className="modal-content" style={{minWidth:"30rem"}}>
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLongTitle">
                    Add Card in Doing list
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
                <div className="modal-body">
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail1">Title</label>
                      <input
                        required
                        type="text"
                        className="form-control"
                        id="doingTitle"
                        onChange={titleChange}
                        placeholder="This is a titile"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="exampleInputPassword1">Description</label>
                      <input
                        required
                        type="text"
                        id="doingDesc"
                        className="form-control"
                        onChange={descriptionChange}
                        placeholder="This is a description"
                      />
                    </div>
                  
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    id="cancel"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="submit" onClick={(event)=>{createCard(event,"doing")}} {...(title && description ? { "data-dismiss": "modal" } : {})} className="btn btn-primary">
                    Add Card
                  </button>
                </div>
              </div>
              </form>
            </div>
          </div>
          </>
  )
}

export default Doing