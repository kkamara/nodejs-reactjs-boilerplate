import React, { useEffect, } from "react"
import { useDispatch, useSelector, } from "react-redux"
import { Helmet, } from "react-helmet"
import { logout, } from "../../../redux/actions/authActions"

export default function LogoutComponent() {
  const dispatch = useDispatch()
  const authState = useSelector(state => state.auth)

  useEffect(() => {
    if (null === localStorage.getItem("user-token")) {
      return navigate("/user/login")
    }
  }, [])

  useEffect(() => {
    if (false === authState.loading && authState.data) {
      dispatch(logout())
    }
  }, [authState])

  if (authState.loading) {
    return <div className="container logout-container text-center">
      <Helmet>
        <title>Log Out - {process.env.REACT_APP_NAME}</title>
      </Helmet>
      <p>Loading...</p>
    </div>
  }

  return null
}
