import React, { useEffect, useState } from "react";
import '../index.css'



const Home = () => {
    const [currentText, setCurrentText] = useState("");
    
     useEffect(() => {
      const allElements= {
        1 : "Record Audio🎤"  ,
        2 : "Save Notes📝",
        3 : "Save Video🎥" ,
        7 : "Save Links🔗" ,
        5 : "Save Images🖼️" , 
        6 : "Set Events & Reminders📅",
        4 : "Create To-Do Lists📋",
        8 : "Geotag Your Notes🌍"
    }
        const textArray = Object.values(allElements); // Convert the object values to an array
        let currentIndex = 0;
        // let currentText = "";
        let char = 0;
        let timeouts = []; // Array to store the timeouts
      
        const typewriterInterval = () => {
          if (char+1 === textArray[currentIndex].length) {
            // Text for the current element has been fully typed
            const timeout = setTimeout(() => {
              setCurrentText(""); // Clear the current text after a short delay
              currentIndex = (currentIndex + 1) % textArray.length; // Move to the next element in the array
              char = -1; // Reset the character index for the new element
              typewriterInterval(); // Start typing the next element
            }, 1500); // Delay between typing different elements
      
            timeouts.push(timeout); // Store the timeout reference
          } else {
            // Continue typing the current element
            setCurrentText((prevText) => prevText + textArray[currentIndex][char]);
            char++;
            let timeout
            if(char+2===textArray[currentIndex].length){
                timeout = setTimeout(typewriterInterval, 0); // Type the next character after a short delay
            }
            else{
                timeout = setTimeout(typewriterInterval, 100); // Type the next character after a short delay
            }
      
            timeouts.push(timeout); // Store the timeout reference
          }
        };
      
        // Start the typewriter effect when the component mounts
        typewriterInterval();
      
        // Clean up any running timeouts when the component unmounts
        return () => {
          timeouts.forEach((timeout) => clearTimeout(timeout));
        };
      }, []);
      
       
      
  


  return (
    <>
    <div className="flex justify-center">
      <div className="flex flex-col items-end">
        <h1 className="text-5xl font-black text-center mt-12">
          Welcome to <span className="text-red-600">India's</span> Number 1{" "}
          <span className="text-green-600">Note Making</span> Platform.
        </h1>
        <p className="text-center font-bold text-gray-600"><i className="fa fa-leaf cursor-default	" style={{"fontSize":"24px","color":"green"}}></i>Go Green with Online Notes: Save Trees, Save Ideas.<i className="fa fa-leaf cursor-default" style={{"fontSize":"24px","color":"green"}}></i></p>
      </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="col-6 flex flex-col items-center">
          <div className="text-center w-100 mt-2">
            <h1 className=" font-black">CLOUD <span className="text-red-600">NOTEBOOK</span></h1>
          </div>
          <div className="text-center w-100 mt-2">
            <h3 className=" font-bold  text-gray-700">With our all-in-one platform you can</h3>
          </div>
          <div className="text-center w-100 mt-2 ">
            <h3 className=" font-bold text-gray-700"><span className=" text-green-600 font-bold" id="typewriter">{currentText}</span></h3>
          </div>
          <div className="text-center w-100 mt-2">
            <button className="btn btn-light mx-2">Get started</button>
          </div>
        </div>
        <div className="col-6">
          <img className="GirlImg" src="/young-girl-her-tablet.png" alt="PhoneImg"></img>
        </div>
      </div>
    </>
  );
};

export default Home;
