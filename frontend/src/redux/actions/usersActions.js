
import HttpService from "../../services/HttpService"
import { users, } from "../types"

export const getUsers = page => {
  return async dispatch => {
    const http = new HttpService()

    dispatch({ type: users.GET_USERS_PENDING, })

    const tokenId = "user-token"
    const path = page ? "/users/?page="+page : "/users"
    await http.getData(path, tokenId)
      .then(res => {
        dispatch({
          type: users.GET_USERS_SUCCESS,
          payload: res.data,
        })
      }).catch(error => {
        if (error.code && "ERR_NETWORK" === error.code) {
          dispatch({
            type: auth.AUTH_LOGIN_ERROR, 
            payload: "Server unavailable.",
          })
        } else {
          dispatch({
            type : users.GET_USERS_ERROR, 
            payload: error.message,
          })
        }
      })
  }
}
