import BaseAPI from "@/api/baseAPIClass"

class PublicBurdenAPI extends BaseAPI {}

export default function getPublicBurdenAPIInstance() {
  return new PublicBurdenAPI(
    "student-public-burden",
    {
      student: "",
      student__last_name_rus__icontains: "",
      burden_start_date__gte: "",
      burden_start_date__lte: "",
      burden_end_date__gte: "",
      burden_end_date__lte: "",
    },
    {
      student: "",
      burden_start_date: null,
      burden_end_date: null,
      burden_kind_data: null,
    },
  )
}
