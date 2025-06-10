import axios from "axios"

axios.defaults.withCredentials = true
axios.defaults.withXSRFToken = false

export default class HttpService
{
  _domain = null
  _url = null
  _timeout = 5000

  constructor() {
    this.domain = process.env.REACT_APP_API_ROOT
    this.url = this.domain
  }

  set domain(newDomain) {
    return this._domain = newDomain
  }

  get domain() {
    return this._domain
  }

  set url(newDomain) {
    return this._url = newDomain+"/api/v1/web"
  }

  get url() {
    return this._url
  }

  get timeout() {
    return this._timeout;
  }

  postData = (path, item, tokenId="") => {
    let requestOptions = this.postRequestOptions({ item, })
    let token
    if (tokenId.length) {
      token = localStorage.getItem(tokenId)
      requestOptions = this.postRequestOptions({ token, item, })
    }
    let url = this.url+path
    if (null !== path.match(/http/g)) {
      url = path
    }
    return axios.post(
      url, 
      requestOptions.data, 
      { headers: requestOptions.headers, timeout: this.timeout, },
    )
  }

  getData = (path, tokenId="") => {
    let requestOptions = this.getRequestOptions()
    let token
    if (tokenId.length) {
      token = localStorage.getItem(tokenId)
      requestOptions = this.getRequestOptions(token)
    }
    let url = this.url+path
    if (null !== path.match(/http/g)) {
      url = path
    }
    return axios.get(
      url, 
      { headers: requestOptions.headers, timeout: this.timeout, },
    )
  }

  getRequestOptions = (token) => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-type" : "application/json", }
    }
    if (token) {
      requestOptions.headers.Authorization = "Bearer " +token
    }
    return requestOptions
  }

  postRequestOptions = ({ token, item, }) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-type" : "application/json", },
      data : item || undefined,
    }
    if (token) {
      requestOptions.headers.Authorization = "Bearer " +token
    }
    return requestOptions
  }
}
