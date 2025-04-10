import BaseAPI from "@/api/baseAPIClass"

class educationLevelAPI extends BaseAPI {}

export default function getEducationLevelAPIInstance() {
  return new educationLevelAPI(
    "education-level",
    {
      education_level__icontains: "",
    },
    {},
  )
}
