import React, {useState } from "react";
import YourNotes from "./allSaves/YourNotes";
import YourAudio from "./allSaves/YourAudio";
import YourVideo from "./allSaves/YourVideo";
import YourImage from "./allSaves/YourImage";
import GeoNotes from "./allSaves/GeoNotes";
import AllCards from "./allSaves/AllCards";
import Links from "./allSaves/Links";

const Saves = (props) => {
  const [show, setShow] = useState(null)
  const handleClick = (indx)=>{
    if(indx===1){
      setShow(<YourNotes ShowAlert={props.ShowAlert}/>);  
    }
    else if(indx===2){
      setShow(<YourAudio/>);  
    }
    else if(indx===3){
      setShow(<YourVideo/>);  
    }
    else if(indx===4){
      setShow(<Links/>);  
    }
    else if(indx===5){
      setShow(<YourImage/>);  
    }
    else if(indx===6){
      setShow(<YourNotes/>);  
    }
    else if(indx===7){
      setShow(<AllCards/>);  
    }
    else if(indx===8){
      setShow(<GeoNotes/>);  
    }
  }

  return (
    <div style={{ height: "78vh" }}>
      {


      localStorage.getItem("token") ? (
        <>
      <div className="flex justify-center my-8">
        <button onClick={()=>handleClick(1)} className="btn btn-lg btn-light mx-2">Notes📝</button>
        <button onClick={()=>handleClick(2)} className="btn btn-lg btn-light mx-2">Audio🎤</button>
        <button onClick={()=>handleClick(3)} className="btn btn-lg btn-light mx-2">Video🎥</button>
        <button onClick={()=>handleClick(4)} className="btn btn-lg btn-light mx-2">Links🔗</button>
        <button onClick={()=>handleClick(5)} className="btn btn-lg btn-light mx-2">Images🖼️</button>
        <button onClick={()=>handleClick(6)} className="btn btn-lg btn-light mx-2">Events & Reminders📅</button>
        <button onClick={()=>handleClick(7)} className="btn btn-lg btn-light mx-2">To-Do Lists📋</button>
        <button onClick={()=>handleClick(8)} className="btn btn-lg btn-light mx-2">Geotag Notes🌍</button>
      </div>
      {show}
      </>
      
      

      







      ) : (<div>
        <h1 className="text-4xl font-black text-center">
          Please login first...
        </h1>
      </div>)
    }
    </div>
  );
};

export default Saves;
