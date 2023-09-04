import React from 'react';


const VideoPlayer = ({ recordedChunks }) => {

    
  return (
    <div className='my-3 mx-3'>
      <div style={{ width: "100vw", height: "20vw" }}>
        {
          recordedChunks[0] ? (<video className='w-25 h-75' loop controls poster="playButton.png"  src={URL.createObjectURL(recordedChunks[0])}></video>):('')
        }
      </div>
    </div>
  );
};

export default VideoPlayer;
