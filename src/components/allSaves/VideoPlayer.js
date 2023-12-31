import React from 'react';


const VideoPlayer = ({ recordedChunks,setRecordedChunks }) => {

    
  return (
    <div className='flex justify-center flex-col'>
    {
      recordedChunks[0] ?
    (
    <><h3 className='my-3 text-center'>Output</h3>
    <div className=' w-100 flex justify-center items-center'>
        
           <video id='videoPlayer' className='w-50  rounded-2xl border-solid border-8 border-orange-500 hover: cursor-pointer' loop controls poster="playButton.png"  src={URL.createObjectURL(recordedChunks[0])}></video>
    </div><i
                  onClick={() => setRecordedChunks([])}
                  className="fa-solid fa-trash-can mt-2"
                  style={{
                    color: "#ff0000",
                    display: "flex",
                    justifyContent: "center",
                    fontSize : "25px"
                  }}
                ></i></>):('')
}
    </div>
  );
};

export default VideoPlayer;
