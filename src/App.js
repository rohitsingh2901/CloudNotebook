import "./App.css";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Navbar from "./components/Navbar";
import YourNotes from "./components/allSaves/YourNotes"
import About from "./components/About";
import NoteState from "./context/note/noteState";
import Alert from "./components/Alert";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { useState } from "react";
import Home from "./components/Home";
import Saves from "./components/Saves";




function App() {
  const [alert, setalert] = useState(null);
  function ShowAlert(msg,type){
      setalert({msg,type});
      setTimeout(() => {
        setalert(null)
      }, 3000);
  }


  return (
    <>
    <NoteState>
      <Router>
        <Navbar />
        <Alert alert={alert}/>
      <div className="">
        <Routes>
          <Route   path="/" element={<Home ShowAlert={ShowAlert}/>}/>
        </Routes>
        <Routes>
          <Route   path="/saves" element={<Saves ShowAlert={ShowAlert}/>}/>
        </Routes>
        <Routes>
          <Route   path="/saves/notes" element={<YourNotes ShowAlert={ShowAlert}/>}/>
        </Routes>
        <Routes>
          <Route  path="/about" element={<About />}/>
        </Routes>
        <Routes>
          <Route  path="/login" element={<Login ShowAlert={ShowAlert}/>}/>
        </Routes>
        <Routes>
          <Route  path="/signup" element={<Signup ShowAlert={ShowAlert} />}/>
        </Routes>
      </div>
      </Router>
    </NoteState>
    </>
  );
}

export default App;
