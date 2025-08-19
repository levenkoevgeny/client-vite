import BaseAPI from "@/api/baseAPIClass"

class cadetCardBlankAPI extends BaseAPI {}

export default function getCadetCardBlankAPIInstance() {
  return new cadetCardBlankAPI(
    "cadet-card-blank",
    {
      cadet: "",
      cadet__last_name_rus__icontains: "",
      card_blank_number__gte: "",
      card_blank_number__lte: "",
      date_time_created__gte: "",
      date_time_created__lte: "",
    },
    {
      cadet: "",
      card_blank_number: null,
    },
  )
}
