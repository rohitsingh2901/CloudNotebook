import React, { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from "react-webcam";


const YourImage= () => {   
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [showCam, setShowCam] = useState(false);
  const [heading, setHeading] = useState('');
  const [data, setData] = React.useState({})
  const [Images, setImages] = React.useState([])
  const capture = useCallback(() => {
    if(showCam===false){
      return;
    }
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef,showCam]);

  const handleSubmit = async(e) =>{
    e.preventDefault();
    if(imgSrc){
      try {
        console.log(imgSrc)
        const binaryData = atob(imgSrc);
        // Create an array to hold the binary data
        const byteArray = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
          byteArray[i] = binaryData.charCodeAt(i);
        }
      
        // Create a Blob from the binary data
        const blob = new Blob([byteArray], { type: 'image/png' });
      const formData = new FormData();
      formData.append('imageFile', blob); 
        formData.append('name', data.Name);
        formData.append('email', data.Email);
        formData.append('id', data._id);
        formData.append('heading', heading);
      const response = await fetch('http://localhost:5000/upload-image', {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          console.log('image saved successfully!');
          const res = await response.json();
          console.log(res);
        } else {
          console.error('Failed to save image.');
        }
      } catch (error) {
        console.error('Error saving image:', error);
      } finally{
        setHeading('');
        fetchImages();
      }
    }
  }

  const fetchImages = async()=>{
    const res = await fetch("http://localhost:5000/getImages", {
      method: "POST",
      body: JSON.stringify({ id: data.id }),
    });

    if (res.ok) {
        setImages(await res.json())
    } else {
      return console.error("Unable to get images");
    }
  }

  useEffect(() => {
    const run2 = async () => {
      const response = await fetch("http://localhost:5000/getuser", {
        method: "POST",
        headers: { 'auth-token': `${localStorage.getItem('token')}` }
      });

      if (response.ok) {
        setData(await response.json());
      } else {
        console.error("Please login first");
      }
    }
    run2()
    fetchImages();
    // eslint-disable-next-line
  }, [])
  


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
          <div className='container'>
            <h2 className="font-bold text-center">Your Images</h2>
            {
              Images.length ? (
                Images.map((img,indx)=>{
                  console.log(img)
                  return(
                    <img height={300} width={300} key={indx}  src={"http://localhost:5000/uploads/"+img.fileName} alt="webcam" />
                  )
                })
              ) : ('No images saved yet')
            }
          </div>

    </>
  )
}

export default YourImage