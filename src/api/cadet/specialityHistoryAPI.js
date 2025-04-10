import BaseAPI from "@/api/baseAPIClass"

class SpecialityHistoryAPI extends BaseAPI {}

export default function getSpecialityHistoryAPIInstance() {
  return new SpecialityHistoryAPI(
    "speciality-history",
    {
      cadet: "",
      speciality: "",
      speciality_order_date__gte: "",
      speciality_order_date__lte: "",
      speciality_order_number__icontains: "",
      speciality_order_owner: "",
      speciality_extra_data__icontains: "",
    },
    {
      cadet: "",
      speciality: "",
      speciality_order_date: null,
      speciality_order_number: "",
      speciality_order_owner: "",
      speciality_extra_data: "",
    },
  )
}
