import HttpService from "../../services/HttpService"
import { updateUserSettings, } from "../types"

export const updateSettings = payload => {
  return async dispatch => {
    const http = new HttpService()

    dispatch({ type: updateUserSettings.UPDATE_USER_SETTINGS_PENDING, })

    const tokenId = "user-token"
    await http.putData(
      "/user",
      payload,
      tokenId,
    )
      .then(res => {
        dispatch({
          type: updateUserSettings.UPDATE_USER_SETTINGS_SUCCESS,
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
          type: updateUserSettings.UPDATE_USER_SETTINGS_ERROR, 
          payload: message,
        })
      })
  }
}
