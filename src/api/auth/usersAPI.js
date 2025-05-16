import BaseAPI from "@/api/baseAPIClass"
import { axiosInstance as axios } from "@/main.js"

class usersAPI extends BaseAPI {
  async getUserNames(value) {
    return axios.get(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/${this.baseURL}/?username=${value}`,
    )
  }
  async updatePassword(userId, newPassword) {
    return axios.post(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/${this.baseURL}/${userId}/set_password/`,
      newPassword,
    )
  }
}

export default function getUsersAPIInstance() {
  return new usersAPI(
    "users",
    {
      username__icontains: "",
      last_name__icontains: "",
      is_staff: "",
      is_active: "",
      is_superuser: "",
    },
    { username: "", password: "", repeat_password: "" },
  )
}
