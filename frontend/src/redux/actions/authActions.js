
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
      if (error.code && "ERR_NETWORK" === error.code) {
        dispatch({
          type: auth.AUTH_LOGIN_ERROR, 
          payload: "Server unavailable.",
        })
      } else if (error.response.data && error.response.data.error) {
        dispatch({
          type: auth.AUTH_LOGIN_ERROR, 
          payload: error.response.data.error,
        })
      } else {
        dispatch({
          type: auth.AUTH_LOGIN_ERROR,
          payload: error.message,
        })
      }
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
        } else {
          if (error.code && "ERR_NETWORK" === error.code) {
            dispatch({
              type: auth.AUTH_AUTHORIZE_ERROR, 
              payload: "Server unavailable.",
            })
          } else {
            dispatch({
              type: auth.AUTH_AUTHORIZE_ERROR,
              payload: error,
            })
          }
        }
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
      if (error.code && "ERR_NETWORK" === error.code) {
        dispatch({
          type: auth.AUTH_LOGOUT_ERROR, 
          payload: "Server unavailable.",
        })
      } else if (error.response.data && error.response.data.error) {
        dispatch({
          type: auth.AUTH_LOGOUT_ERROR, 
          payload: error.response.data.error,
        })
      } else {
        dispatch({
          type: auth.AUTH_LOGOUT_ERROR,
          payload: error.message,
        })
      }
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
      if (error.response.data && error.response.data.error) {
        dispatch({
          type: auth.AUTH_REGISTER_ERROR, 
          payload: error.response.data.error,
        })
      } else {
        dispatch({
          type: auth.AUTH_REGISTER_ERROR,
          payload: error.message,
        })
      }
    })
  }
}