import React, { useEffect, } from "react"
import { Outlet, Navigate, } from "react-router"
import { useSelector, useDispatch, } from "react-redux"
import { authorise, } from "./redux/actions/authActions"

const AuthRoute = ({ redirectPath, }) => {
  const dispatch = useDispatch()
  const state = useSelector(state => ({
    auth: state.auth,
  }))

  useEffect(() => {
    dispatch(authorise())
  }, [])

  if (state.auth.loading) {
    return null
  }

  const tokenId = "user-token"
  const userStorage = localStorage.getItem(tokenId)
  if (state.auth.error || null === userStorage) {
    if (null !== userStorage) {
      localStorage.removeItem(tokenId)
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