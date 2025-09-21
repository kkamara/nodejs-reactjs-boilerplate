import React, {
  useEffect,
  useState,
  useRef,
} from "react"
import { useNavigate, } from "react-router-dom"
import { useDispatch, useSelector, } from "react-redux"
import { Helmet, } from "react-helmet"
import { register, authorize, } from "../../../redux/actions/authActions"
import Error from "../../layouts/Error"

import "./RegisterComponent.scss"

const defaultFirstNameState = ""
const defaultLastNameState = ""
const defaultEmailState = ""
const defaultPasswordState = ""
const defaultPasswordConfirmationState = ""

export default function RegisterComponent() {
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState(defaultFirstNameState)
  const [lastName, setLastName] = useState(defaultLastNameState)
  const [email, setEmail] = useState(defaultEmailState)
  const [password, setPassword] = useState(defaultPasswordState)
  const [passwordConfirmation, setPasswordConfirmation] = useState(defaultPasswordConfirmationState)
  const avatarFile = useRef(null)
  const [avatar, setAvatar] = useState("")

  const [error, setError] = useState("")

  const dispatch = useDispatch()
  const authState = useSelector(state => (state.auth))

  useEffect(() => {
    if (localStorage.getItem("user-token")) {
      return navigate("/")
    } else if (authState.loading) {
      dispatch(authorize())
    }
    if (authState.error && "Token not set." !== authState.error) {
      setError(authState.error)
    }
  }, [authState])

  const onFormSubmit = (e) => {
    e.preventDefault()

    dispatch(register({
      firstName,
      lastName,
      email,
      password,
      passwordConfirmation,
    }))

    setFirstName("")
    setLastName("")
    setEmail("")
    setPassword("")
    setPasswordConfirmation("")
  }

  const onFirstNameChange = (e) => {
    setFirstName(e.target.value)
  }

  const onLastNameChange = (e) => {
    setLastName(e.target.value)
  }

  const onEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const onPasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const onPasswordConfirmationChange = (e) => {
    setPasswordConfirmation(e.target.value)
  }
  
  const handleAvatarFileChange = e => {
    setError("")
    const err = imageError(e)
    if (false !== err) {
      return setError(err)
    }
    setAvatar(e.target.files[0])
  }

  const imageError = e => {
    if (1 !== e.target.files.length) {
      return "Please select 1 image file."
    } else if (null === e.target.files[0].type.match(/(jpg|jpeg|png|webp)$/i)) {
      return "Invalid file extension. We take JPG, JPEG, PNG, and WEBP."
    }
    return false
  }

  const handleUploadFileBtnClick = () => {
    avatarFile.current.click()
  }

  const handleRemoveFileBtnClick = () => {
    setAvatar("")
  }

  if (authState.loading) {
    return <div className="container register-container text-center">
      <Helmet>
        <title>Register - {process.env.REACT_APP_NAME}</title>
      </Helmet>
      <p>Loading...</p>
    </div>
  }

  return <div className="container register-container text-start">
    <Helmet>
      <title>Register - {process.env.REACT_APP_NAME}</title>
    </Helmet>
    <div className="col-md-4 offset-md-4">
      <h1 className="register-lead fw-bold">Register</h1>
      <div>
        <Error error={error} />

        <div className="edit-avatar-container">
          <img
            src={process.env.REACT_APP_API_ROOT+"/images/profile/default-avatar.webp"}
            alt="Avatar Image"
            className="img-fluid avatar-image"
          />
          <input
            type="file"
            id="avatarFile"
            ref={avatarFile}
            style={{display: "none"}}
            onChange={handleAvatarFileChange}
          />
          <br />
          <button
            className="btn btn-default"
            onClick={handleUploadFileBtnClick}
          >
            Upload
          </button>
          <br />
          <button
            className="btn btn-danger btn-sm"
            onClick={handleRemoveFileBtnClick}
          >
            Remove Photo
          </button>
        </div>
        <form method="post" onSubmit={onFormSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First Name*:</label>
            <input 
              name="firstName" 
              className="form-control"
              id="firstName"
              value={firstName}
              onChange={onFirstNameChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name*:</label>
            <input 
              name="lastName" 
              className="form-control"
              id="lastName"
              value={lastName}
              onChange={onLastNameChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email*:</label>
            <input 
              name="email" 
              className="form-control"
              id="email"
              value={email}
              onChange={onEmailChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password*:</label>
            <input 
              type="password"
              name="password" 
              className="form-control"
              id="password"
              value={password}
              onChange={onPasswordChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="passwordConfirmation">Password Confirmation*:</label>
            <input 
              type="password"
              name="passwordConfirmation" 
              id="passwordConfirmation"
              className="form-control"
              value={passwordConfirmation}
              onChange={onPasswordConfirmationChange}
            />
          </div>
          <div className="register-buttons-container mt-4 text-end">
            <a 
              href="/user/login" 
              className="btn btn-primary"
            >
              Sign In
            </a>
            <input 
              type="submit" 
              className="btn btn-success register-submit-button ms-4" 
            />
          </div>
        </form>
      </div>
    </div>
  </div>
}
