import BaseAPI from "@/api/baseAPIClass"

class EncouragementKindAPI extends BaseAPI {}

export default function getEncouragementKindAPIInstance() {
  return new EncouragementKindAPI(
    "encouragement-kind",
    {
      encouragement_kind__icontains: "",
    },
    { encouragement_kind: "" },
  )
}
