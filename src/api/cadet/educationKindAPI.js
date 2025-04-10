import BaseAPI from "@/api/baseAPIClass"

class educationKindAPI extends BaseAPI {}

export default function getEducationKindAPIInstance() {
  return new educationKindAPI(
    "education-kind",
    {
      education__icontains: "",
    },
    {},
  )
}
