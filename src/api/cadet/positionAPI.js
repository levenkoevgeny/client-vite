import BaseAPI from "@/api/baseAPIClass"

class PositionAPI extends BaseAPI {}

export default function getPositionAPIInstance() {
  return new PositionAPI(
    "position",
    {
      position__icontains: "",
      position_category: "",
    },
    { position: "", position_category: "" },
  )
}
