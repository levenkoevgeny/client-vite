import BaseAPI from "@/api/baseAPIClass"

class admissionQuotaAPI extends BaseAPI {}

export default function getAdmissionQuotaAPIInstance() {
  return new admissionQuotaAPI(
    "admission-quota",
    {
      subdivision: "",
      speciality: "",
      in_whose_interests: "",
      gender: "",
      quota__gte: "",
      quota__lte: "",
      quota_verbose_name__icontains: "",
    },
    {},
  )
}
