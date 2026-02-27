import BaseAPI from "@/api/baseAPIClass"

class PunishmentKindAPI extends BaseAPI {}

export default function getPunishmentKindAPIInstance() {
  return new PunishmentKindAPI(
    "punishment-kind",
    {
      punishment_kind__icontains: "",
    },
    { punishment_kind: "" },
  )
}
