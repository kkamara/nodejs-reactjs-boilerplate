import React, { useEffect, } from "react"
import { Outlet, } from "react-router"
import { useSelector, } from "react-redux"

const AuthRoute = ({ redirectPath, }) => {
  const state = useSelector(state => ({
    auth: state.auth,
  }))

  useEffect(() => {
    if (state.auth.error) {
      localStorage.removeItem("user-token")
      if (redirectPath) {
        window.location.href = redirectPath
      } else {
        window.location.href = "/user/login"
      }
    }
  }, [state.auth])

  return <Outlet/>
}

export default AuthRoute