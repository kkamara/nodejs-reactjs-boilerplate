import { combineReducers, } from "redux"
import authReducer from "./authReducer"
import usersReducer from "./usersReducer"
import avatarReducer from "./avatarReducer"

export default combineReducers({
  auth: authReducer,
  users: usersReducer,
  avatar: avatarReducer,
})
