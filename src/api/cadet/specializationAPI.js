import BaseAPI from "@/api/baseAPIClass"

class SpecializationAPI extends BaseAPI {}

export default function getSpecializationAPIInstance() {
  return new SpecializationAPI(
    "specialization",
    {
      specialization_name__icontains: "",
      specialization_short_name__icontains: "",
      specialization_code__icontains: "",
    },
    {
      specialization_name: "",
      specialization_short_name: "",
      specialization_code: "",
    },
  )
}
