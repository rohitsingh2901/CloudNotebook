import React from 'react';


const VideoPlayer = ({ recordedChunks }) => {

    
  return (
    <>
    {
      recordedChunks[0] ?
    (
    <><h3 className='my-3'>Output</h3>
    <div className=' w-100 flex justify-center'>
        
           <video id='videoPlayer' className='w-25 rounded-2xl border-solid border-8 border-orange-500 hover: cursor-pointer' loop controls poster="playButton.png"  src={URL.createObjectURL(recordedChunks[0])}></video>
        
    </div></>):('')
}
    </>
  );
};

export default VideoPlayer;
