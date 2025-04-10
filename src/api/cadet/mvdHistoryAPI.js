import BaseAPI from "@/api/baseAPIClass"

class mvdHistoryAPI extends BaseAPI {}

export default function getMVDHistoryAPIInstance() {
  return new mvdHistoryAPI(
    "mvd-history-cadet",
    {
      cadet: "",
      mvd_organization__icontains: "",
      mvd_service_start__gte: "",
      mvd_service_start__lte: "",
      mvd_service_end__gte: "",
      mvd_service_end__lte: "",
      position__icontains: "",
      order_owner: "",
      order_date__gte: "",
      order_date__lte: "",
      order_number__icontains: "",
    },
    {
      cadet: "",
      mvd_organization: "",
      mvd_service_start: null,
      mvd_service_end: null,
      position: "",
      order_owner: "",
      order_date: null,
      order_number: "",
    },
  )
}
