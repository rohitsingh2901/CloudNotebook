import React, { useCallback, useRef, useState } from "react";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";

export default function YourAudio() {
  const [check, setcheck] = useState(false);
  const [data, setData] = useState({});
  const [heading, setHeading] = useState("");
  const mounted = useRef(false);
  const headingRef = useRef("");
  const headingInput = (event) => {
    setHeading(event.target.value);
    headingRef.current = event.target.value;
  };

  const handleSaveAudio = useCallback(
    async (blob, url) => {
      const heading = headingRef.current;
      if (heading === "") {
        return;
      }
      try {
        const formData = new FormData();
        const audioBlob = new Blob([blob], { type: blob.type });
        formData.append("audioFile", audioBlob, "audio.webm");
        formData.append("name", data.Name);
        formData.append("email", data.Email);
        formData.append("id", data._id);
        formData.append("heading", heading);
        for (const key of formData.keys()) {
          console.log(key, formData.get(key));
        }
        const response = await fetch("http://localhost:5000/upload-audio", {
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          console.log("Audio saved successfully!");
          const res = await response.json();
          const audio = document.createElement("audio");
          audio.classList.add("my-2");
          audio.classList.add("scale-100");
          audio.src = url;
          audio.downloadFileExtension = "webm";
          audio.controls = true;
          const head = document.createElement("h5");
          const del = document.createElement("button");
          del.classList.add("bg-red-600");
          del.classList.add("btn-sm");
          del.classList.add("text-white");
          del.classList.add("mx-3");
          del.innerHTML = "Remove";
          del.addEventListener("click", () =>
            handleDeleteAudioFromDb(
              `http://localhost:5000/deleteaudio/${res.filename}`,
              audio
            )
          );
          head.innerHTML = "&rarr;  " + heading;
          const containerin = document.createElement("div");
          containerin.classList.add("flex");
          containerin.classList.add("items-center");
          containerin.appendChild(audio);
          containerin.appendChild(del);
          document.getElementById("showAudio2").appendChild(head);
          document.getElementById("showAudio2").appendChild(containerin);
          document.getElementById("save").disabled = true;
          document.getElementById("save").classList.add("cursor-not-allowed");
        } else {
          console.error("Failed to save audio.");
        }
      } catch (error) {
        console.error("Error saving audio:", error);
      }
    },
    [data._id, data.Email, data.Name]
  );

  const handleDeleteAudio = (blob, url) => {
    const audioElement = document.getElementById("showAudio"); // Replace '.my-2' with your appropriate selector

    // Check if the audio element exists before trying to remove it
    if (audioElement) {
      // Remove the audio element from the DOM
      const a = document.getElementById("audio");
      const s = document.getElementById("save");
      const d = document.getElementById("delete");
      audioElement.removeChild(a);
      audioElement.removeChild(s);
      audioElement.removeChild(d);
      setcheck(false);
    }
  };
  const handleDeleteAudioFromDb = async (audioUrl, audio) => {
    try {
      // Find the audio element using the provided audio URL
      const audioElements = document.querySelectorAll(`[src="${audioUrl}"]`);

      // Check if any matching audio elements were found
      if (audioElements.length > 0) {
        const audioElement = audioElements[0];

        // Remove the audio element from the DOM
        audioElement.parentNode.removeChild(audioElement);
      } else {
        console.log("Audio element not found in the DOM");
      }

      // Extract the audio filename from the URL
      const filename = audioUrl.substring(audioUrl.lastIndexOf("/") + 1);

      // Send a request to the server to delete the audio
      console.log(filename);
      const response = await fetch(
        `http://localhost:5000/deleteaudio/${filename}`,
        {
          method: "DELETE",
          headers: {
            "auth-token": `${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const dbtn = audio.nextElementSibling;
        audio.parentNode.removeChild(audio);
        dbtn.innerHTML = "Removed";
        dbtn.disabled = true;
        dbtn.classList.add("cursor-not-allowed");

        console.log("Audio deleted successfully");
      } else {
        console.error("Failed to delete audio");
      }
    } catch (error) {
      console.error("An error occurred while deleting audio:", error);
    }
  };

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
    add.setAttribute("id", "save");
    add.classList.add("text-white");
    add.classList.add("bg-green-600");
    add.classList.add("btn-sm");
    del.classList.add("mx-10");
    del.setAttribute("id", "delete");
    audio.setAttribute("id", "audio");
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

    add.addEventListener("click", () => handleSaveAudio(blob, url));
    del.addEventListener("click", () => handleDeleteAudio(blob, url));
    setcheck(true);
  };

  const fetchAudio = async (audioFileUrl) => {
    console.log(audioFileUrl);
    try {
      const response = await fetch(audioFileUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch audio.");
      }
      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      // console.log("Fetched audio Blob:", audioBlob);
      return url;
    } catch (error) {
      console.error("Error fetching audio:", error);
      return null;
    }
  };
  const handleUpload = async () => {
    if(file){
      addAudioElement(file);
    }
    else{
      return;
    }
    
  };
  React.useEffect(() => {
    if (mounted.current) {
      return;
    }

    console.log("i am triggered");
    const run2 = async () => {
      const response = await fetch("http://localhost:5000/getuser", {
        method: "POST",
        headers: { "auth-token": `${localStorage.getItem("token")}` },
      });

      if (response.ok) {
        setData(await response.json());
      } else {
        console.error("Please login first");
      }
    };
    run2();
    const run = async () => {
      const res = await fetch("http://localhost:5000/getaudio", {
        method: "POST",
        body: JSON.stringify({ id: data.id }),
      });

      if (res.ok) {
        const x = await res.json();
        const ele = document.getElementsByClassName("audio-recorder");
        for (let index = 0; index < ele.length; index++) {
          ele[index].style.transform = "scale(2)";
        }
        // Fetch and add audio elements for each user
        x.forEach(async (user, index) => {
          // console.log(user)
          const url = await fetchAudio(
            `http://localhost:5000/uploads/${user.fileName}`
          );
          if (url) {
            const audio = document.createElement("audio");
            const head = document.createElement("h5");
            const del = document.createElement("button");
            del.classList.add("bg-red-600");
            del.classList.add("btn-sm");
            del.classList.add("text-white");
            del.classList.add("mx-3");
            del.innerHTML = "Remove";
            head.innerHTML = "&rarr;  " + user.heading;
            audio.src = url;
            audio.downloadFileExtension = "webm";
            audio.controls = true;
            console.log(audio);
            del.addEventListener("click", () => {
              var audioUrl = `http://localhost:5000/uploads/${user.fileName}`;
              handleDeleteAudioFromDb(audioUrl, audio);
            });
            const container = document.createElement("div");
            const containerin = document.createElement("div");
            container.classList.add("my-2");
            containerin.classList.add("flex");
            containerin.classList.add("items-center");
            container.appendChild(head);
            containerin.appendChild(audio);
            containerin.appendChild(del);
            // console.log(audio);
            document.getElementById("showAudio2").appendChild(container);
            document.getElementById("showAudio2").appendChild(containerin);
          }
        });
      } else {
        return console.error("Unable to get audio");
      }
    };
    run();
    return () => {
      mounted.current = true;
    };
  }, [data.id, handleSaveAudio]);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

 

  return (
    <>
      <div className="row">
        <div
          className="container mt-24 flex justify-center items-center col-6"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <AudioRecorder
            onRecordingComplete={(blob) => {
              addAudioElement(blob);
            }}
            recorderControls={recorderControls}
            downloadFileExtension="webm"
            showVisualizer={true}
          />
          <div className="my-8">
            <button
              disabled={check === true ? true : false}
              className={`mx-4 text-black font-medium  bg-green-600 btn-sm ${
                check === true ? "cursor-not-allowed	" : ""
              }`}
              onClick={recorderControls.startRecording}
            >
              Start recording
            </button>
            <button
              disabled={check === true ? true : false}
              className={`mx-4 text-white font-medium bg-red-600 btn-sm ${
                check === true ? "cursor-not-allowed	" : ""
              }`}
              onClick={recorderControls.stopRecording}
            >
              Stop recording
            </button>
          </div>

          

          
        </div>
        <div className="col-6 container flex justify-center items-center">
          <div className="mt-32">
            <input type="file" accept="audio/*" onChange={handleFileChange} />
            <button
              className="mx-4 text-black font-medium  bg-green-600 btn-sm"
              onClick={handleUpload}
            >
              Upload
            </button>
          </div>
        </div>
      </div>
      
      <div className="container flex justify-center items-center flex-col mb-8 h-48">
      {check ? (
            <>
              <h3 className="font-bold mb-3">Heading</h3>
              <div className="input-group w-25">
                <input
                  value={heading}
                  onChange={headingInput}
                  type="text"
                  className="form-control"
                  placeholder="My heading"
                />
              </div>
              <div className="h-5">
                {heading === "" && (
                  <p style={{ color: "red" }}>Field is required</p>
                )}
              </div>
            </>
          ) : null}
          <div className="" id="showAudio"></div>
      </div>
      <div className="container">
        <h1 className="todo">Your Audios</h1>
        <div className="" id="showAudio2"></div>
      </div>
    </>
  );
}
