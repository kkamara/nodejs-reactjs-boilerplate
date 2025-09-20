import HttpService from "../../services/HttpService"
import { avatar, } from "../types"

export const uploadAvatar = payload => {
  return async dispatch => {
    const http = new HttpService()

    dispatch({ type: avatar.UPLOAD_AVATAR_PENDING, })

    const tokenId = "user-token"
    await http.postFormData(
      "/user/avatar",
      payload,
      tokenId,
    )
      .then(res => {
        dispatch({
          type: avatar.UPLOAD_AVATAR_SUCCESS,
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
          type: avatar.UPLOAD_AVATAR_ERROR, 
          payload: message,
        })
      })
  }
}
