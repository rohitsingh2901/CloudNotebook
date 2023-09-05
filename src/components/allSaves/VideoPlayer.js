import React from 'react';


const VideoPlayer = ({ recordedChunks }) => {

    
  return (
    <div className=' w-100 flex justify-center'>
        {
          recordedChunks[0] ? (<video id='videoPlayer' className='w-25 rounded-2xl border-solid border-8 border-orange-500 ' loop controls poster="playButton.png"  src={URL.createObjectURL(recordedChunks[0])}></video>):('')
        }
    </div>
  );
};

export default VideoPlayer;
