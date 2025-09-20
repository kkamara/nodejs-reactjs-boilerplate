import React, { useEffect, useState, } from "react"
import { Helmet, } from "react-helmet"
import { useSelector, useDispatch } from "react-redux"

import Error from "../../layouts/Error"

import "./SettingsComponent.scss"

const defaultFirstNameState = ""
const defaultLastNameState = ""
const defaultEmailState = ""
const defaultPasswordState = ""
const defaultPasswordConfirmationState = ""

export default function SettingsComponent() {
  const state = useSelector(state => ({
    auth: state.auth,
  }))
  const dispatch = useDispatch()
  const [firstName, setFirstName] = useState(defaultFirstNameState)
  const [lastName, setLastName] = useState(defaultLastNameState)
  const [email, setEmail] = useState(defaultEmailState)
  const [password, setPassword] = useState(defaultPasswordState)
  const [passwordConfirmation, setPasswordConfirmation] = useState(defaultPasswordConfirmationState)
  const [avatar, setAvatar] = useState("")

  const [error, setError] = useState("")

  useEffect(() => {
    setFirstName(state.auth.data.user.firstName)
    setLastName(state.auth.data.user.lastName)
    setEmail(state.auth.data.user.email)
  }, [])

  const handleFirstNameChange = e => {
    setFirstName(e.target.value)
  }

  const handleLastNameChange = e => {
    setLastName(e.target.value)
  }

  const handleEmailChange = e => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = e => {
    setPassword(e.target.value)
  }

  const handlePasswordConfirmationChange = e => {
    setPasswordConfirmation(e.target.value)
  }

  const handleFormSubmit = e => {
    e.preventDefault()
  }

  if (state.auth.loading) {
    <div className="container settings-container text-center">
      <Helmet>
        <title>User Settings - {process.env.REACT_APP_NAME}</title>
      </Helmet>
      <p>Loading...</p>
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

          <Error error={error}/>

          <div className="edit-avatar-container">
            <img
              src={state.auth.data.user.avatarPath}
              alt="Avatar Image"
              className="img-fluid avatar-image"
            />
            <br />
            <button className="btn btn-default">Upload</button>
          </div>

          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label htmlFor="firstName">
                First Name:
              </label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                value={firstName}
                onChange={handleFirstNameChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">
                Last Name:
              </label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                value={lastName}
                onChange={handleLastNameChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">
                Email:
              </label>
              <input
                type="text"
                className="form-control"
                id="email"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">
                Password:
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="passwordConfirmation">
                Password Confirmation:
              </label>
              <input
                type="password"
                className="form-control"
                id="passwordConfirmation"
                value={passwordConfirmation}
                onChange={handlePasswordConfirmationChange}
              />
            </div>
            <div className="float-end">
              <input
                type="submit"
                className="btn btn-success"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
