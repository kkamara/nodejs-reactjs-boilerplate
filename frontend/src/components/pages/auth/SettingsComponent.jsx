import React from "react"
import { Helmet, } from "react-helmet"
import { useSelector, useDispatch } from "react-redux"

export default function SettingsComponent() {
  const state = useSelector(state => ({
    auth: state.auth,
  }))
  const dispatch = useDispatch()

  if (state.auth.loading) {
    <div className="container settings-container">
      <Helmet>
        <title>User Settings - {process.env.REACT_APP_NAME}</title>
      </Helmet>
    </div>
  }

  return (
    <div className="container settings-container">
      <Helmet>
        <title>User Settings - {process.env.REACT_APP_NAME}</title>
      </Helmet>
      <div className="row">
        <div className="col-md-4 offset-md-4">
          <h1>User Settings</h1>
        </div>
      </div>
    </div>
  )
}
