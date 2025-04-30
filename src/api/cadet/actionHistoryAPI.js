import BaseAPI from "@/api/baseAPIClass"

class actionHistoryAPI extends BaseAPI {}

export default function getActionHistoryAPIInstance() {
  return new actionHistoryAPI(
    "action-history",
    {
      user: "",
      action_type: "",
      record_id: "",
      model_name: "",
    },
    {},
  )
}
