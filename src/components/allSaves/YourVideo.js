  import React from 'react';
  import Webcam from "react-webcam";
import VideoPlayer from './VideoPlayer';

  const YourVideo= () => {   
    const webcamRef = React.useRef(null);
    const mediaRecorderRef = React.useRef(null);
    const [capturing, setCapturing] = React.useState(false);
    const [recordedChunks, setRecordedChunks] = React.useState([]);
    const [showCam, setShowCam] = React.useState(false);
    const [data, setData] = React.useState({})
    const [heading, setHeading] = React.useState('')
    const [yourVideos, setYourVideos] = React.useState([])

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

    const handleSave = async (event) => {
      event.preventDefault()
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
        formData.append('heading', heading);
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
      } finally{
        setHeading('');
        fetchVideos();
      }
    };
    const fetchVideos = async ()=>{
      const res = await fetch("http://localhost:5000/getvideos", {
        method: "POST",
        body: JSON.stringify({ id: data.id }),
      });

      if (res.ok) {
          setYourVideos(await res.json())
      } else {
        return console.error("Unable to get videos");
      }
    }
    

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
      fetchVideos();
      // eslint-disable-next-line
    }, [])
    

return (
  <>
  <div className='flex  flex-col items-center'>
    <div>
      <button onClick={() => setShowCam(true)} className='mx-4 text-black font-medium  bg-green-600 btn-sm'>Open Camera</button>
      <button onClick={() => setShowCam(false)} className='mx-4 text-white font-medium  bg-red-600 btn-sm'>Close Camera</button>
    </div>
    <div className='mx-10 my-3'>
      {capturing ? (
        <button className='mx-4 text-white font-medium  bg-red-600 btn-lg' onClick={handleStopCaptureClick}>Stop Capture</button>
      ) : (
        <>
          <button title={showCam === true ? '' : 'Open camera first'} disabled={showCam === true ? false : true} className={`mx-4 text-black font-medium  bg-green-600 btn-lg ${showCam === false ? "cursor-not-allowed	" : ""}`} onClick={handleStartCaptureClick}>Start Capture</button>
          <span></span>
        </>
      )}
    </div>
    {showCam && <h3 className='my-3'>Input</h3>}
    {showCam ? (<div className="flex justify-center"><Webcam className='rounded-2xl border-solid border-8 border-red-500 mx-3 w-50'  audio={false} ref={webcamRef} /></div>) : ('')}
    {<VideoPlayer recordedChunks={recordedChunks} />}
    {recordedChunks.length > 0 && (
      <>
        <h3 className='my-3'>Heading</h3>
        <form onSubmit={handleSave}>
          <div className='flex justify-center items-center flex-col'>
          <input required  value={heading} onChange={(e) => setHeading(e.target.value) } type="text" className="form-control" placeholder="My heading" />
          <button  type='submit' className='text-black font-medium mt-3 bg-green-600 btn-sm'>Save</button>
          </div>
        </form>
      </>
    )}
  </div>
  <div>
    <h1>Your Videos</h1>
    {yourVideos[0] ? (
      yourVideos.map((v,i)=>{
        // const audio = document.createElement("video");
        //     audio.src = v.fileName;
        //     audio.downloadFileExtension = "webm";
        //     audio.controls = true;
        return(
          <div key={i} className='flex items-center'>
          <div className='w-25 flex justify-center'>
            <h4 className='font-bold'>{i+1}.</h4>
            <h4>&nbsp;&nbsp;{v.heading}</h4>
          </div>
          <video  id='videoPlayer' className='w-25 rounded-2xl border-solid border-8 border-orange-500 hover: cursor-pointer' loop controls poster="playButton.png"  src={"http://localhost:5000/uploads/"+v.fileName}></video>
          </div>
        )
      })
    ):('No videos available please record one and save it')}
  </div>
  </>
);

  };

  export default YourVideo;
