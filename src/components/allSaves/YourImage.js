import React, { useCallback, useRef, useState } from 'react';
import Webcam from "react-webcam";


const YourImage= () => {   
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [showCam, setShowCam] = useState(false);
  const [heading, setHeading] = useState('');
  const capture = useCallback(() => {
    if(showCam===false){
      return;
    }
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef,showCam]);
  
  const handleSubmit = (e) =>{
    e.preventDefault();
    if(imgSrc){
      console.log(imgSrc,heading)
    }
  }


  return (
    <>
    <div className='row'>
      <div className='col-6 container flex justify-center items-center flex-col'>
    <div className='flex justify-center mt-32'>
      <button onClick={() => setShowCam(true)} className='mx-4 text-black font-medium  bg-green-600 btn-sm'>Open Camera</button>
      <button onClick={() => setShowCam(false)} className='mx-4 text-white font-medium  bg-red-600 btn-sm'>Close Camera</button>
    </div>
    <div className="btn-container mx-5 my-3">
        <button className='mx-4 text-black font-medium  bg-green-600 btn-sm' onClick={capture}>Click Photo</button>
      </div>
    </div>
    <div className="col-6 container flex justify-center items-center">
          <div className="mt-32">
            <input type="file" accept="image/*" onChange={()=>{}} />
            <button
              className="mx-4 text-black font-medium  bg-green-600 btn-sm"
              onClick={()=>{}}
            >
              Upload
            </button>
          </div>
        </div>
    </div>
    <div className="container flex flex-col justify-center items-center">
      
      {showCam &&
      <>
      Camera Activated
      <div className='flex'>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
      </div>
      <Webcam height={300} width={300} ref={webcamRef} />
      </>
      }
      
    </div>  
    { imgSrc && <div className='flex flex-col items-center'><h4 className='text-center'>Captured Image</h4><img height={300} width={300}   src={imgSrc} alt="webcam" /><i
                  onClick={() => {setImgSrc(null)}}
                  className="fa-solid fa-trash-can mt-2"
                  style={{
                    color: "#ff0000",
                  }}
                ></i>
    <h3 className='mt-8 text-center'>Heading</h3>
          <form onSubmit={handleSubmit}>
            <div className='flex justify-center items-center flex-col'>
            <input required  value={heading} onChange={(e) => {setHeading(e.target.value)} } type="text" className="form-control" placeholder="My heading" />
            <button  type='submit' className='text-black font-medium mb-8 mt-2 bg-green-600 btn-sm'>Save</button>
            </div>
          </form></div>}
    </>
  )
}

export default YourImage