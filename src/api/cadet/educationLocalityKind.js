import BaseAPI from "@/api/baseAPIClass"

class educationLocalityKindAPI extends BaseAPI {}

export default function getEducationLocalityKindAPIInstance() {
  return new educationLocalityKindAPI(
    "education-locality-kind",
    {
      education_location_kind__icontains: "",
    },
    {
      education_location_kind: "",
    },
  )
}
