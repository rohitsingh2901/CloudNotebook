import React, { useCallback, useRef, useState } from "react";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";

export default function YourAudio() {
  const [check, setcheck] = useState(false);
  const [data, setData] = useState({})
  // const [mounted, setMounted] = useState(false);  
  
  const mounted = useRef(false)
  const handleSaveAudio = useCallback(async (blob,url) => {
    try {
      const formData = new FormData();
      const audioBlob = new Blob([blob], { type: blob.type });
      formData.append("audioFile", audioBlob, "audio.webm");
      formData.append('name', data.Name);
      formData.append('email', data.Email);
      formData.append('id', data._id);
      for (const key of formData.keys()) {
        console.log(key, formData.get(key));
      }
      const response = await fetch("http://localhost:5000/upload-audio", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Audio saved successfully!");
        const audio = document.createElement("audio");
        audio.classList.add("my-2");
    audio.classList.add("scale-100");
    audio.src = url;
    audio.downloadFileExtension = "webm";
    audio.controls = true;
    document.getElementById('showAudio2').appendChild(audio);
    document.getElementById('save').disabled = true;
    document.getElementById('save').style.hover = true;

      } else {
        console.error("Failed to save audio.");
      }
    } catch (error) {
      console.error("Error saving audio:", error);
    }
  },[data._id,data.Email,data.Name]);
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
    add.setAttribute('id',"save");
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
    audio.downloadFileExtension = "webm";
    audio.controls = true;
    const ele = document.getElementsByClassName("audio-recorder");
    ele[0].classList.add("pointer-events-none");
    document.getElementById("showAudio").appendChild(audio);
    document.getElementById("showAudio").appendChild(add, audio);
    document.getElementById("showAudio").appendChild(del);
    add.addEventListener("click", () => handleSaveAudio(blob,url));
    setcheck(true);
  };


  const fetchAudio = async (audioFileUrl) => {
    console.log(audioFileUrl)
    try {
      const response = await fetch(audioFileUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch audio.");
      }
      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      console.log("Fetched audio Blob:", audioBlob);
      return url;
    } catch (error) {
      console.error("Error fetching audio:", error);
      return null;
    }
  };



  React.useEffect(() => {
    if (mounted.current) {
      return
    }
    const run2 = async()=>{
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
    const run = async () => {
      const res = await fetch("http://localhost:5000/getaudio", {
        method: "POST",
        body: JSON.stringify({id :data.id}),
      });

      if (res.ok) {
        const x = await res.json();
        const ele = document.getElementsByClassName("audio-recorder");
    for (let index = 0; index < ele.length; index++) {
      ele[index].style.transform = "scale(2)";
    }

    // Fetch and add audio elements for each user
    x.forEach(async (user) => {
      // console.log(user)
      const url = await fetchAudio(`http://localhost:5000/uploads/${user.fileName}`);
      if (url) {
        const audio = document.createElement("audio");
        audio.src = url;
        audio.downloadFileExtension = "webm";
        audio.controls = true;

        const container = document.createElement("div");
        container.classList.add("my-2");
        container.appendChild(audio);
         console.log(audio)
        document.getElementById("showAudio2").appendChild(container);
      }
    }); 
      } else {
        return console.error("Unable to get audio");
      }
    }
    run()
    return()=>{
      mounted.current=true;
    }

  }, [data.id]);
  // React.useEffect(()=>{
    
  // },[audioUsers])

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
            className={`mx-4 text-white  bg-green-600 btn-sm ${check === true ? "cursor-not-allowed	" : ""
              }`}
            onClick={recorderControls.startRecording}
          >
            Start recording
          </button>
          <button
            disabled={check === true ? true : false}
            className={`mx-4 text-white  bg-red-600 btn-sm ${check === true ? "cursor-not-allowed	" : ""
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
        <div className="" id="showAudio2"></div>
      </div>
    </>
  );
}
