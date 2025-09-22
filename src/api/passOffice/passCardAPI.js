import BaseAPI from "@/api/baseAPIClass"
import { axiosInstance as axios } from "@/main.js"

class passCardAPI extends BaseAPI {
  async savePassCard(pass_card_uid, category, item_id) {
    return axios.post(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/${this.baseURL}/save_pass_card/`,
      { pass_card_uid, category, item_id },
    )
  }
}

export default function getPassCardAPIInstance() {
  return new passCardAPI(
    "pass-card",
    {
      card_number: "",
      card_uuid: "",
    },
    { card_number: "", card_uuid: "" },
  )
}
