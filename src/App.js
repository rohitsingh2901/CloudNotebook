import "./App.css";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home"
import About from "./components/About";
import NoteState from "./context/note/noteState";
import Alert from "./components/Alerts/AlertAdd";
import Login from "./components/Login";
import Signup from "./components/Signup";
function App() {
  return (
    <>
    <NoteState>
      <Router>
        <Navbar />
        <Alert/>
      <div className="container">
        <Routes>
          <Route  path="/" Component={Home}/>
        </Routes>
        <Routes>
          <Route  path="/about" Component={About}/>
        </Routes>
        <Routes>
          <Route  path="/login" Component={Login}/>
        </Routes>
        <Routes>
          <Route  path="/signup" Component={Signup}/>
        </Routes>
      </div>
      </Router>
    </NoteState>
    </>
  );
}

export default App;
