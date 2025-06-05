import BaseAPI from "@/api/baseAPIClass"

class culturalMassEventsAPI extends BaseAPI {}

export default function getCulturalMassEventsAPIInstance() {
  return new culturalMassEventsAPI(
    "cultural-mass-events",
    {
      event_name__icontains: "",
    },
    {
      event_name: "",
    },
  )
}
