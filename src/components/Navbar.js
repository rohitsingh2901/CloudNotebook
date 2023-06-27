import React , {useEffect} from 'react'
import { Link , useLocation } from 'react-router-dom'
const Navbar = () => {
  let location = useLocation();
  useEffect(() => {
  }, [location]);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
  <Link className="navbar-brand" to="/">Navbar</Link>
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
      <Link className="btn btn-primary mx-2" to="/login" role="button">Login</Link>
      <Link className="btn btn-primary mx-2" to="/signup" role="button">Sign up</Link>
  </div>
</nav>
    </>
  )
}

export default Navbar
