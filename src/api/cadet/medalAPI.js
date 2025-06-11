import BaseAPI from "@/api/baseAPIClass"

class MedalAPI extends BaseAPI {}

export default function getMedalAPIInstance() {
  return new MedalAPI(
    "medals",
    { medal_kind__icontains: "" },
    { medal_kind: "" },
  )
}
