import React, { useState } from "react";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";

export default function YourAudio() {
  const [check, setcheck] = useState(false);
  const handleSaveAudio= async  (blob)=>{
      try {
      const formData = new FormData();
      formData.append('audioFile', blob);

      const response = await fetch('http://localhost:5000/upload-audio', {  
        method: 'POST',
        body: formData
      });

      if (response.ok){
        console.log('Audio saved successfully!');
      } else {
        console.error('Failed to save audio.');
      }
    } catch (error) {
      console.error('Error saving audio:', error);
    }
  }
  const recorderControls = useAudioRecorder(
    {
      noiseSuppression: true,
      echoCancellation: true,
    },
    (err) => console.table(err) // onNotAllowedOrFound
  );
  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    const add = document.createElement("button");
    const del = document.createElement("button");
    add.innerHTML = "Save";
    del.innerHTML = "Delete";
    add.classList.add("mx-10");
    add.classList.add("text-white");
    add.classList.add("bg-green-600");
    add.classList.add("btn-sm");
    del.classList.add("mx-10");
    del.classList.add("bg-red-600");
    del.classList.add("btn-sm");
    del.classList.add("text-white");
    audio.classList.add("my-2");
    audio.classList.add("scale-100");
    audio.src = url;
    audio.downloadFileExtension='webm'
    audio.controls = true;
    const ele = document.getElementsByClassName("audio-recorder");
    ele[0].classList.add("pointer-events-none");
    document.getElementById("showAudio").appendChild(audio);
    document.getElementById("showAudio").appendChild(add, audio);
    document.getElementById("showAudio").appendChild(del);
    add.addEventListener('click',() => handleSaveAudio(blob))
    setcheck(true);
  };

  React.useEffect(() => {
    const ele = document.getElementsByClassName("audio-recorder");
    for (let index = 0; index < ele.length; index++) {
      ele[index].style.transform = "scale(2)";
    }
  }, []);

  return (
    <>
      <div
        className="container my-24"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <AudioRecorder
          onRecordingComplete={(blob) => addAudioElement(blob)}
          recorderControls={recorderControls}
          downloadFileExtension="webm"
          showVisualizer={true}
        />

        <div className="my-8">
          <button
            disabled={check === true ? true : false}
            className={`mx-4 text-white  bg-green-600 btn-sm ${
              check === true ? "cursor-not-allowed	" : ""
            }`}
            onClick={recorderControls.startRecording}
          >
            Start recording
          </button>
          <button
            disabled={check === true ? true : false}
            className={`mx-4 text-white  bg-red-600 btn-sm ${
              check === true ? "cursor-not-allowed	" : ""
            }`}
            onClick={recorderControls.stopRecording}
          >
            Stop recording
          </button>
        </div>
        <div className="" id="showAudio"></div>
      </div>
      <div className="container">
        <h1 className="todo">Your Audios</h1>

      </div>
    </>
  );
}
