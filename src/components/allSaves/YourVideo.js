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
    const [file, setFile] = React.useState(null);

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
          setRecordedChunks([]);
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
    
    const deleteVideo = (id) =>{
      fetch(`http://localhost:5000/deletevideo/${yourVideos[id].fileName}`, {
      method: "DELETE",
    })
      .then((res) => {
        console.log(res);
        fetchVideos();
      })
      .catch((error) => console.log("Some error occcured.."));
    }

    const handleFileChange = (event) => {
      setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
      if(file){
        if(recordedChunks.length){
          return;
        }
        setRecordedChunks([file]);
      }
      else{
        return;
      }
    }
  

return (
  <>
  <div className='row' style={{minHeight:"20vw"}}>
    <div className='flex col-6 flex-col items-center justify-center'>
      <div>
        <button onClick={() => setShowCam(true)} className='mx-4 text-black font-medium  bg-green-600 btn-sm'>Open Camera</button>
        <button capturing onClick={() => { if(capturing===true){return;} setShowCam(false)}} className={`mx-4 text-white font-medium ${capturing ? 'hover: cursor-not-allowed':''} bg-red-600 btn-sm`}>Close Camera</button>
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
      
    </div>
    <div className="col-6 container flex justify-center items-center">
          <div className="">
            <input type="file" accept="video/*" onChange={handleFileChange} />
            <button
              className={`mx-4 text-black font-medium  bg-green-600 btn-sm ${recordedChunks.length ? 'hover: cursor-not-allowed' : ''}`}
              onClick={handleUpload}
            >
              Upload
            </button>
          </div>
        </div>
  </div>
  <div className='container'>
  {showCam && <h3 className='my-3'>Input</h3>}
        {showCam ? (<div className="flex justify-center"><Webcam className='rounded-2xl border-solid border-8 border-red-500 mx-3 w-50'  audio={false} ref={webcamRef} /></div>) : ('')}
        {<VideoPlayer recordedChunks={recordedChunks} setRecordedChunks={setRecordedChunks} />}

      {recordedChunks.length > 0 && (
        <>
          <h3 className='mt-8 text-center'>Heading</h3>
          <form onSubmit={handleSave}>
            <div className='flex justify-center items-center flex-col'>
            <input required  value={heading} onChange={(e) => setHeading(e.target.value) } type="text" className="form-control w-50" placeholder="My heading" />
            <button  type='submit' className='text-black font-medium mb-8 mt-2 bg-green-600 btn-sm'>Save</button>
            </div>
          </form>
        </>
      )}
  </div>

  <div>
    <h1 className='text-center'>Your Videos</h1>
    {yourVideos[0] ? (
      yourVideos.map((v,idx)=>{
        // const audio = document.createElement("video");
        //     audio.src = v.fileName;
        //     audio.downloadFileExtension = "webm";
        //     audio.controls = true;
        return(
          <div key={idx} className=' flex items-center justify-center'>
          <div className='flex w-25'>
            <h4 className='font-bold'>{idx+1}.</h4>
            <h4>&nbsp;&nbsp;{v.heading}</h4>
          </div>
          <video id='videoPlayerShow' className='w-25 rounded-2xl border-solid border-8 border-orange-500 hover: cursor-pointer' loop controls poster="playButton.png"  src={"http://localhost:5000/uploads/"+v.fileName}></video>
          <i
                  onClick={() =>deleteVideo(idx)}
                  className="fa-solid fa-trash-can w-25"
                  style={{
                    color: "#ff0000",
                    display: "flex",
                    justifyContent: "center",
                    fontSize : "30px"
                  }}
                ></i>
          </div>
        )
      })
    ):(<p className='text-center'>No videos available please record one and save it</p>)}
  </div>
  </>
);

  };

  export default YourVideo;
