import BaseAPI from "@/api/baseAPIClass"

class countryRegionAPI extends BaseAPI {}

export default function getCountryRegionAPIInstance() {
  return new countryRegionAPI(
    "country-regions",
    {
      country_region__icontains: "",
    },
    { country_region: "" },
  )
}
