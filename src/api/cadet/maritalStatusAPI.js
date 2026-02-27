import BaseAPI from "@/api/baseAPIClass"

class MaritalStatusAPI extends BaseAPI {}

export default function getMaritalStatusAPIInstance() {
  return new MaritalStatusAPI(
    "marital-status",
    {
      marital_status__icontains: "",
    },
    { marital_status: "" },
  )
}
