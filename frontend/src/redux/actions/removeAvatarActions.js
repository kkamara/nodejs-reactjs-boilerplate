import HttpService from "../../services/HttpService"
import { removeAvatar, } from "../types"

export const removeAvatarFile = () => {
  return async dispatch => {
    const http = new HttpService()

    dispatch({ type: removeAvatar.REMOVE_AVATAR_PENDING, })

    const tokenId = "user-token"
    await http.delData("/user/avatar", tokenId)
      .then(res => {
        dispatch({
          type: removeAvatar.REMOVE_AVATAR_SUCCESS,
          payload: res.data,
        })
      }).catch(error => {
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
          type: removeAvatar.REMOVE_AVATAR_ERROR, 
          payload: message,
        })
      })
  }
}
