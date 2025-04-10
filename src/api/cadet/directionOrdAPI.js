import BaseAPI from "@/api/baseAPIClass"

class DirectionOrdAPI extends BaseAPI {}

export default function getDirectionOrdAPIInstance() {
  return new DirectionOrdAPI(
    "direction-ord",
    {
      direction_name__icontains: "",
      direction_short_name__icontains: "",
    },
    { direction_name: "", direction_short_name: "" },
  )
}
