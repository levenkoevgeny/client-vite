import BaseAPI from "@/api/baseAPIClass"

class EducationalInstitutionsAPI extends BaseAPI {}

export default function getEducationalInstitutionsAPIInstance() {
  return new EducationalInstitutionsAPI(
    "educational-institutions",
    {
      educational_institution__icontains: "",
    },
    { educational_institution: "" },
  )
}
