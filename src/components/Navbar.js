import React , {useContext, useEffect} from 'react'
import { Link , useLocation, useNavigate } from 'react-router-dom'
import notecontext from "../context/note/noteContext";

const Navbar = () => {
  const allNotes = useContext(notecontext);
  const { setnote } = allNotes;
  const navigate = useNavigate();
  let location = useLocation();
  useEffect(() => {
  }, [location]);

  function handdleLogout(){
    localStorage.removeItem('token')
    setnote([])
    navigate('/login')
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark">
  <Link className="navbar-brand" to="/"><img className='w-20 ml-6 mr-2' src='cloud.png' alt='logo'></img></Link>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>

  <div className="collapse navbar-collapse" id="navbarSupportedContent">
    <ul className="navbar-nav mr-auto">
      <li className={`navbar-brand ${location.pathname==='/' ? 'active' : '' }`}>
        <Link className="nav-link" to="/">Home <span className="sr-only">(current)</span></Link>
      </li>
      <li className={`navbar-brand ${location.pathname==='/about' ? 'active' : '' }`}>
        <Link className="nav-link" to="/about">About</Link>
      </li>
    </ul>
      {localStorage.getItem('token') ? '' : <Link className="btn btn-light mx-2" to="/login" role="button">Login</Link>}
      {localStorage.getItem('token') ? <button onClick={handdleLogout} className="btn btn-light mx-2">Logout</button> : <Link className="btn btn-light mx-2" to="/signup" role="button">Sign up</Link>}
  </div>
</nav>
    </>
  )
}

export default Navbar
