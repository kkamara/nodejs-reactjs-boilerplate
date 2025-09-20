import React from "react"
import { useSelector, } from "react-redux"
import { Link, } from "react-router-dom"

import "./Header.scss"

export default function Header(props) {
  const authResponse = useSelector(state=>state.auth)

  const renderNavLinks = () => {
    if(null !== authResponse.data) {
      return <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle active" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          <img
            className="header-user-avatar"
            src={authResponse.data.user.avatarPath}
          />
          User
        </a>
        <ul className="dropdown-menu">
          <li>
            <Link
              className="dropdown-item" 
              to="/user/logout"
            >
              Sign Out
            </Link>
          </li>
        </ul>
      </li>
    } else {
      return <>
        <li className="nav-item">
          <Link
            className="nav-link active" 
            aria-current="page" 
            to="/user/login"
          >
            Sign In
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className="nav-link active" 
            aria-current="page" 
            to="/user/register"
          >
            Register
          </Link>
        </li>
      </>
    }
  }
  return <nav className="navbar navbar-expand-lg mb-4 bg-primary header-container" data-bs-theme="dark">
    <div className="container">
      <Link className="navbar-brand" to="/">
        {process.env.REACT_APP_NAME}
      </Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link className="nav-link active" aria-current="page" to="/">Home</Link>
          </li>
        </ul>
        <ul className="navbar-nav">
          {renderNavLinks()}
        </ul>
      </div>
    </div>
  </nav>
}
