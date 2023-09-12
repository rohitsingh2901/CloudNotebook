import React, { useCallback, useRef, useState } from 'react';
import Webcam from "react-webcam";


const YourImage= () => {   
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [showCam, setShowCam] = useState(false);
  const capture = useCallback(() => {
    if(showCam===false){
      return;
    }
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef,showCam]);
  return (
    <>
    <div className='flex justify-center'>
      <button onClick={() => setShowCam(true)} className='mx-4 text-black font-medium  bg-green-600 btn-sm'>Open Camera</button>
      <button onClick={() => setShowCam(false)} className='mx-4 text-white font-medium  bg-red-600 btn-sm'>Close Camera</button>
    </div>
    <div className="container flex flex-col justify-center items-center">
      <div className="btn-container mx-5 my-3">
        <button className='mx-4 text-black font-medium  bg-green-600 btn-sm' onClick={capture}>Click Photo</button>
      </div>
      {showCam &&
      <>
      Camera Activated
      <div className='flex'>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
      </div>
      <Webcam height={600} width={600} ref={webcamRef} />
      </>
      }
      
    </div>
    { imgSrc && <div className='flex flex-col items-center'><h4 className='text-center'>Captured Image</h4><img src={imgSrc} alt="webcam" /><i
                  onClick={() => {setImgSrc(null)}}
                  className="fa-solid fa-trash-can"
                  style={{
                    color: "#ff0000",
                  }}
                ></i></div>}
    </>
  )
}

export default YourImage