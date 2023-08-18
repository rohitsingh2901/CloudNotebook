import React, { useCallback, useRef, useState } from 'react';
import Webcam from "react-webcam";


const YourImage= () => {   
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef]);
  return (
    <div className="container flex justify-center items-center">
      {imgSrc ? (
        <img src={imgSrc} alt="webcam" />
      ) : (
        <Webcam height={600} width={600} ref={webcamRef} />
      )}
      <div className="btn-container mx-5">
        <button className='mx-4 text-black font-medium  bg-green-600 btn-sm' onClick={capture}>Capture Photo</button>
      </div>
    </div>
  )
}

export default YourImage