import BaseAPI from "@/api/baseAPIClass"

class cadetHistoryAPI extends BaseAPI {}

export default function getCadetHistoryAPIInstance() {
  return new cadetHistoryAPI(
    "cadet-history",
    {
      user: "",
      cadet: "",
    },
    {},
  )
}
