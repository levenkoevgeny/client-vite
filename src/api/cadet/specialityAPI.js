import BaseAPI from "@/api/baseAPIClass"

class SpecialityAPI extends BaseAPI {}

export default function getSpecialityAPIInstance() {
  return new SpecialityAPI(
    "speciality",
    {
      is_active: "",
      speciality_name__icontains: "",
      speciality_short_name__icontains: "",
      speciality_code__icontains: "",
    },
    {
      is_active: true,
      speciality_name: "",
      speciality_short_name: "",
      speciality_code: "",
    },
  )
}
