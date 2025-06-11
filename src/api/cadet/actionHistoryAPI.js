import BaseAPI from "@/api/baseAPIClass"
import { axiosInstance as axios } from "@/main.js"

class actionHistoryAPI extends BaseAPI {
  async getModelsList() {
    return axios.get(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/${this.baseURL}/get_all_models/`,
    )
  }
}

export default function getActionHistoryAPIInstance() {
  return new actionHistoryAPI(
    "action-history",
    {
      user: "",
      action_type: "",
      record_id: "",
      model_name: "",
      date_time_created__gte: "",
      date_time_created__lte: "",
    },
    {},
  )
}
