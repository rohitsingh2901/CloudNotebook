import React from 'react';
import Webcam from "react-webcam";

const YourVideo= () => {   
  const webcamRef = React.useRef(null);
  const mediaRecorderRef = React.useRef(null);
  const [capturing, setCapturing] = React.useState(false);
  const [recordedChunks, setRecordedChunks] = React.useState([]);
  const [showCam, setShowCam] = React.useState(false);

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
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm"
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef,handleDataAvailable]);

  const handleStopCaptureClick = React.useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, setCapturing]);

  const handleDownload = React.useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "react-webcam-stream-capture.webm";
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  return (
    <>
      <div className='flex justify-center'>
        <button onClick={()=>setShowCam(true)} className='mx-4 text-black font-medium  bg-green-600 btn-sm'>Show Camera</button>
        <button onClick={()=>setShowCam(false)} className='mx-4 text-white font-medium  bg-red-600 btn-sm'>Stop Camera</button>
      </div>
      <div className='flex justify-center my-3'>
      {capturing ? (
        <button className='mx-4 text-white font-medium  bg-red-600 btn-lg' onClick={handleStopCaptureClick}>Stop Capture</button>
        ) : (
          <button disabled={showCam===true ? false : true} className={`mx-4 text-black font-medium  bg-green-600 btn-lg ${showCam === false ? "cursor-not-allowed	" : ""
        }`} onClick={handleStartCaptureClick}>Start Capture</button>
        )}
      {recordedChunks.length > 0 && (
        <button onClick={handleDownload}>Download</button>
        )}
      </div>
      {showCam ? (<div className='flex justify-center'><Webcam className='w-25'  audio={false} ref={webcamRef} /></div>):('')}
      {recordedChunks.length > 0 && (
        <div className='flex justify-center'>
          <video controls src={URL.createObjectURL(recordedChunks[0])}></video>
        </div>
      )}
    </>
  );
};

export default YourVideo