import BaseAPI from "@/api/baseAPIClass"

class relativesAPI extends BaseAPI {}

export default function getRelativesAPIInstance() {
  return new relativesAPI(
    "relatives-cadet",
    {
      cadet: "",
      degree_of_kinship: "",
      kinship_data__icontains: "",
      date_of_birth__gte: "",
      date_of_birth__lte: "",
      place_of_birth__icontains: "",
      document_data__icontains: "",
    },
    {
      cadet: "",
      degree_of_kinship: "",
      kinship_data: "",
      date_of_birth: "",
      place_of_birth: "",
      document_data: "",
    },
  )
}
