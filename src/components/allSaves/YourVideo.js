import React from 'react';
import Webcam from "react-webcam";

const YourVideo= () => {   
  const webcamRef = React.useRef(null);
  const mediaRecorderRef = React.useRef(null);
  const [capturing, setCapturing] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);
  const [showCam, setShowCam] = React.useState(false);
  const [data, setData] = React.useState({})

  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStartCaptureClick = React.useCallback(() => {
    setCapturing(true);
    const constraints = {
      audio: true,
      video: true,
    };
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        webcamRef.current.srcObject = stream;
        mediaRecorderRef.current = new MediaRecorder(stream, {
          mimeType: "video/webm"
        });
        mediaRecorderRef.current.addEventListener("dataavailable", handleDataAvailable);
        mediaRecorderRef.current.start();
      });
  }, [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable]);

  const handleStopCaptureClick = React.useCallback(() => {
    mediaRecorderRef.current.stop();
    webcamRef.current.srcObject.getTracks().forEach(track => track.stop());
    setCapturing(false);
  }, [mediaRecorderRef, setCapturing]);

  // const handleDownload = React.useCallback(() => {
  //   if (recordedChunks.length) {
  //     const blob = new Blob(recordedChunks, {
  //       type: "video/webm"
  //     });
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     document.body.appendChild(a);
  //     a.style = "display: none";
  //     a.href = url;
  //     a.download = "react-webcam-stream-capture.webm";
  //     a.click();
  //     window.URL.revokeObjectURL(url);
  //     setRecordedChunks([]);
  //   }
  // }, [recordedChunks]);

  const handleSave = async () => {
    if (recordedChunks.length === 0) {
      return;
    }
  
    try {
      const formData = new FormData();
      const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
      formData.append('videoFile', videoBlob, 'video.webm'); 
      formData.append('name', data.Name);
      formData.append('email', data.Email);
      formData.append('id', data._id);
  
      for (const key of formData.keys()) {
        console.log(key, formData.get(key));
      }
  
      const response = await fetch('http://localhost:5000/upload-video', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        console.log('Video saved successfully!');
        const res = await response.json();
        console.log(res);
      } else {
        console.error('Failed to save video.');
      }
    } catch (error) {
      console.error('Error saving video:', error);
    }
  };
  

  React.useEffect(() => {
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
  }, [])
  

  return (
    <>
      <div>
        <button onClick={()=>setShowCam(true)} className='mx-4 text-black font-medium  bg-green-600 btn-sm'>Open Camera</button>
        <button onClick={()=>setShowCam(false)} className='mx-4 text-white font-medium  bg-red-600 btn-sm'>Close Camera</button>
      </div>
      <div className='mx-10 my-3'>
      {capturing ? (
        <button className='mx-4 text-white font-medium  bg-red-600 btn-lg' onClick={handleStopCaptureClick}>Stop Capture</button>
        ) : (
          <>
          <button title={showCam===true ? '' : 'Open camera first'} disabled={showCam===true ? false : true} className={`mx-4 text-black font-medium  bg-green-600 btn-lg ${showCam === false ? "cursor-not-allowed	" : ""}`} onClick={handleStartCaptureClick}>Start Capture</button>
          <span></span>
          </>
        )}
      </div>
      {showCam ? (<div><Webcam className='border-solid border-8 border-red-500 mx-3 w-25'  audio={false} ref={webcamRef} /></div>):('')}
      {recordedChunks.length > 0 && (
        <div className='my-3 mx-3'>
          {/* {recordedChunks.length > 0 && (
        <button className='text-black font-medium  bg-green-600 btn-sm' onClick={handleDownload}>Download</button>
        )} */}
          {recordedChunks.length > 0 && (
        <button className='text-black font-medium  bg-green-600 btn-sm' onClick={handleSave}>Save</button>
        )}
          <video className='w-25' controls src={URL.createObjectURL(recordedChunks[0])}></video>
        </div>
      )}
    </>
  );
};

export default YourVideo;
