import {
  LoginUserService,
  AuthorizeUserService,
  LogoutUserService,
  RegisterUserService,
} from "../../services/AuthService"
import { auth, } from "../types"

export const login = creds => {
  return dispatch => {

    dispatch({ type: auth.AUTH_LOGIN_PENDING, })

    LoginUserService(creds).then(res => {
      dispatch({
        type: auth.AUTH_LOGIN_SUCCESS,
        payload: res,
      })

    }, error => {
      let message
      if ("ERR_NETWORK" === error.code) {
        message = "Server unavailable."
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.error
      ) {
        message = error.response.data.error
      } else {
        message = "Something went wrong. Please come back later."
      }
      dispatch({
        type: auth.AUTH_LOGIN_ERROR,
        payload: message,
      })
    })
  }
}

export const authorize = () => {
  return dispatch => {

    dispatch({ type: auth.AUTH_AUTHORIZE_PENDING, })
    const tokenId = "user-token"
    if (localStorage.getItem(tokenId) === null) {
      return dispatch({
        type: auth.AUTH_AUTHORIZE_ERROR,
        payload: "Token not set.",
      })
    }

    AuthorizeUserService().then(res => {
      dispatch({
        type: auth.AUTH_AUTHORIZE_SUCCESS,
        payload: res,
      })

    }, error => {
      if (error.response.status === 401) {
        localStorage.removeItem(tokenId)
        window.location = "/"
      }
      let message
      if ("ERR_NETWORK" === error.code) {
        message = "Server unavailable."
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.error
      ) {
        message = error.response.data.error
      } else {
        message = "Something went wrong. Please come back later."
      }
      dispatch({
        type: auth.AUTH_AUTHORIZE_ERROR,
        payload: message,
      })
    })
  }
}

export const logout = () => {
  return dispatch => {
    dispatch({ type: auth.AUTH_LOGOUT_PENDING, })

    LogoutUserService().then(res => {
      dispatch({
        type: auth.AUTH_LOGOUT_SUCCESS,
        payload: null,
      })

    }, error => {
      let message
      if ("ERR_NETWORK" === error.code) {
        message = "Server unavailable."
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.error
      ) {
        message = error.response.data.error
      } else {
        message = "Something went wrong. Please come back later."
      }
      dispatch({
        type: auth.AUTH_LOGOUT_ERROR,
        payload: message,
      })
    })
  }
}

export const register = data => {
  return dispatch => {

    dispatch({ type: auth.AUTH_REGISTER_PENDING, })

    RegisterUserService(data).then(res => {
      dispatch({
        type: auth.AUTH_REGISTER_SUCCESS,
        payload: res,
      })
    }, error => {
      let message
      if ("ERR_NETWORK" === error.code) {
        message = "Server unavailable."
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.error
      ) {
        message = error.response.data.error
      } else {
        message = "Something went wrong. Please come back later."
      }
      dispatch({
        type: auth.AUTH_REGISTER_ERROR,
        payload: message,
      })
    })
  }
}