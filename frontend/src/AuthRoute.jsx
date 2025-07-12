import React, { useEffect, } from "react"
import { Outlet, } from "react-router"
import { useSelector, } from "react-redux"
import { Navigate, } from "react-router"

const AuthRoute = ({ redirectPath, }) => {
  const state = useSelector(state => ({
    auth: state.auth,
  }))

  const userStorage = localStorage.getItem("user-token")
  if (state.auth.error || null === userStorage) {
    if (null !== userStorage) {
      localStorage.removeItem("user-token")
    }
    if (redirectPath) {
      return <Navigate to={redirectPath}/>
    } else {
      return <Navigate to={"/user/login"}/>
    }
  }

  return <Outlet/>
}

export default AuthRoute