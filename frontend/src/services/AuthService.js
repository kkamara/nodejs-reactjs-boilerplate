import HttpService from "./HttpService"

export const RegisterUserService = (data) => {
  const http = new HttpService()
  return http.postData("/user/register", data)
    .then((response) => {
      return response.data
    })
    .catch(err => { throw err })
}

export const LoginUserService = (credentials) => {
  const http = new HttpService()
  const tokenId = "user-token"
  
  return http.postData("/user", credentials)
    .then(response => {
      localStorage.setItem(tokenId, response.data.data.authToken)
      return response.data
    })
    .catch(err => { throw err })
}

export const AuthorizeUserService = () => {
  const http = new HttpService()
  const tokenId = "user-token"
  
  return http.getData("/user/authorise", tokenId)
    .then(response => {
      return response.data
    })
    .catch(err => { throw err })
}

export const LogoutUserService = () => {
  const http = new HttpService()
  const tokenId = "user-token"
  return http.delData("/user", tokenId)
    .then((response) => {
      if (null !== localStorage.getItem(tokenId)) {
        localStorage.removeItem(tokenId)
      }
      window.location = "/user/login"
      return response.data
    })
    .catch(err => { throw err })
}