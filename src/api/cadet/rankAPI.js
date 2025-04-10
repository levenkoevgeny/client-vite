import BaseAPI from "@/api/baseAPIClass"

class RankAPI extends BaseAPI {}

export default function getRankAPIInstance() {
  return new RankAPI(
    "rank",
    {
      rank__icontains: "",
      deadline__gte: "",
      deadline__lte: "",
      rank_group: "",
    },
    { rank: "", deadline: "", rank_group: "" },
  )
}
