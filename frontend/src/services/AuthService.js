import HttpService from "./HttpService"

export const RegisterUserService = (data) => {
  const http = new HttpService()
  const tokenId = "user-token"
  return http.postData("/user/register", data)
    .then((response) => {
      localStorage.setItem(tokenId, response.data.data.token)
      return response.data.data
    })
    .catch(err => err)
}

export const LoginUserService = (credentials) => {
  const http = new HttpService()
  const tokenId = "user-token"
  
  return http.postData("/user", credentials)
    .then(response => {
      localStorage.setItem(tokenId, response.data.data.token)
      return response.data.data
    })
    .catch(err => err)
}

export const AuthorizeUserService = () => {
  const http = new HttpService()
  const tokenId = "user-token"
  
  return http.getData("/user/authorize", tokenId)
    .then(response => {
      return response.data.data
    })
    .catch(err => err)
}

export const LogoutUserService = () => {
  const http = new HttpService()
  const tokenId = "user-token"
  return http.getData("/users/logout", tokenId)
    .then((response) => {
      if (localStorage.getItem(tokenId) !== null) {
        localStorage.removeItem(tokenId)
      }
      window.location = "/user/login"
      return response
    })
    .catch(err => err)
}