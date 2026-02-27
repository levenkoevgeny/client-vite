import BaseAPI from "@/api/baseAPIClass"
import { axiosInstance as axios } from "@/main.js"

class GroupAPI extends BaseAPI {
  async makeExamSheet(groupId) {
    return axios.get(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/${this.baseURL}/${groupId}/student_examination_sheet_export/`,
      { responseType: "blob" },
    )
  }

  async makeGroupSheet(groupId) {
    return axios.get(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/${this.baseURL}/${groupId}/student_group_sheet/`,
      { responseType: "blob" },
    )
  }
}

export default function getGroupAPIInstance() {
  return new GroupAPI(
    "group",
    { group_name__icontains: "" },
    { group_name: "" },
  )
}
