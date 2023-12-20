import React, { useCallback, useEffect, useRef, useState } from 'react';
import Webcam from "react-webcam";


const YourImage= () => {   
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [file, setFile] = useState(null);
  const [showCam, setShowCam] = useState(false);
  const [checkImg, setCheckImg] = useState(false);
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

  const dataURLtoBlob = (dataURL) => {
    if(dataURL.indexOf('base64')>-1){
      setCheckImg(false)
      const parts = dataURL.split(';base64,');
      console.log(parts)
      // eslint-disable-next-line
      const contentType = parts[0].split(':')[1];
      const raw = window.atob(parts[1]);
      const rawLength = raw.length;
      const uInt8Array = new Uint8Array(rawLength);
  
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
      }
      return new Blob([uInt8Array], { type: 'image/png' });
    }
    else{
      setCheckImg(true)
      return new Blob([dataURL], { type: 'image/png' });
    }
  };

  const handleSubmit = async(e) =>{
    e.preventDefault();
    if(imgSrc){
      try {
        const blob = dataURLtoBlob(imgSrc);

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob, 'image/png');
    // link.download = 'capturedImage.png';
    // link.click();
        // const blob = new Blob([img], { type: 'image/png' });
        console.log(link);
      const formData = new FormData();
      formData.append('imageFile', blob); 
        formData.append('name', data.Name);
        formData.append('email', data.Email);
        formData.append('id', data._id);
        formData.append('heading', heading);
        for (const key of formData.keys()) {
          console.log(key, formData.get(key));
        }
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

  const deleteImage = async (index)=>{
    try {
      const res = await fetch(`http://localhost:5000/deleteImage/${Images[index].fileName}`,{
      method: "DELETE",
          headers: {
            "auth-token": `${localStorage.getItem("token")}`,
          },
    })
    if(res.ok){
      console.log('Image deleted successfully');
      fetchImages();
    }
    else{
      console.log('Failed to delete image');
    }
    } catch (error) {
      console.error("An error occurred while deleting image:", error);
    }
    
  }

  const handleUpload = ()=>{
    const fileURL = URL.createObjectURL(file);
    setImgSrc(fileURL);
  }
  


  return (
    <>
    <div className='row'>
      <div className='col-6 container flex justify-center items-center flex-col'>
    <div className='flex justify-center mt-32'>
      <button onClick={() => setShowCam(true)} disabled = {imgSrc ? true : false} title={imgSrc ? 'PLease handle captured image' : 'Click to open camera'} className={`mx-4 text-black font-medium  bg-green-600 btn-sm ${imgSrc ? 'cursor-not-allowed':''}`}>Open Camera</button>
      <button onClick={() => setShowCam(false)} className='mx-4 text-white font-medium  bg-red-600 btn-sm'>Close Camera</button>
    </div>
    <div className="btn-container mx-5 my-3">
        <button className='mx-4 text-black font-medium  bg-green-600 btn-sm' onClick={capture}>Click Photo</button>
      </div>
    </div>
    <div className="col-6 container flex justify-center items-center">
          <div className="mt-32">
            <input type="file" accept="image/*" onChange={(e)=>{setFile(e.target.files[0])}} />
            <button
              disabled = {imgSrc ? true : false}
              title={imgSrc ? 'PLease handle captured image' : 'Click to upload'}
              className={`mx-4 text-black font-medium  bg-green-600 btn-sm ${imgSrc ? 'cursor-not-allowed':''}`}
              onClick={handleUpload}
            >
              Upload
            </button>
          </div>
        </div>
    </div>
    <div style={showCam && imgSrc ? {height:"42vw"} : {height:"25vw"}}>
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
          <form onSubmit={handleSubmit}>
            <div className='flex justify-center items-center flex-col mt-2'>
              <div className='flex justify-center items-center'> 
              
            <input required  value={heading} onChange={(e) => {setHeading(e.target.value)} } type="text" className="form-control" placeholder="My heading" />
            <button  type='submit' className='text-black font-medium ml-2 bg-green-600 btn-sm'>Save</button>
              </div>
            </div>
          </form></div>}

    </div>




          <div className='container'>
            <h2 className="font-bold text-center">Your Images</h2>
            {
              Images.length ? (
                Images.map((img,indx)=>{
                  console.log(img)
                  return(
                    <>
                    <h5>{img.headin}</h5>
                    <img height={300} width={300} key={indx}  src={checkImg ?  `${imgSrc}`:"http://localhost:5000/uploads/"+img.fileName} alt="webcam" />
                    <i
                  onClick={() => {deleteImage(indx)}}
                  className="fa-solid fa-trash-can mt-2 mb-8"
                  style={{
                    color: "#ff0000",
                  }}
                ></i>
                    </>
                    
                  )
                })
              ) : ('No images saved yet')
            }
          </div>

    </>
  )
}

export default YourImage