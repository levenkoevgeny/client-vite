import BaseAPI from "@/api/baseAPIClass"

class educationFormAPI extends BaseAPI {}

export default function getEducationFormAPIInstance() {
  return new educationFormAPI(
    "education-form",
    {
      education_form__icontains: "",
    },
    {
      education_form: "",
    },
  )
}
