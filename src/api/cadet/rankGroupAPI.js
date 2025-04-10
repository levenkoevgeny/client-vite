import BaseAPI from "@/api/baseAPIClass"

class RankGroupAPI extends BaseAPI {}

export default function getRankGroupAPIInstance() {
  return new RankGroupAPI(
    "rank-group",
    { rank_group__icontains: "" },
    { rank_group: "" },
  )
}
