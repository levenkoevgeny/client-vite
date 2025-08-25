import BaseAPI from "@/api/baseAPIClass.js"

class studentCardBlankAPI extends BaseAPI {}

export default function getCadetCardBlankAPIInstance() {
  return new studentCardBlankAPI(
    "student-card-blank",
    {
      student: "",
      student__last_name_rus__icontains: "",
      blank_number__gte: "",
      blank_number__lte: "",
      date_time_created__gte: "",
      date_time_created__lte: "",
      ordering: null,
    },
    {
      student: "",
      blank_number: null,
    },
  )
}
