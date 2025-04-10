import BaseAPI from "@/api/baseAPIClass"

class rewardHistoryAPI extends BaseAPI {}

export default function getRewardHistoryAPIInstance() {
  return new rewardHistoryAPI(
    "reward-history-cadet",
    {
      cadet: "",
      reward: "",
      reward_date__gte: "",
      reward_date__lte: "",
      order_number: "",
      order_owner: "",
      reason__icontains: "",
    },
    {
      cadet: "",
      reward: "",
      reward_date: null,
      reason: "",
      order_owner: "",
      order_number: "",
    },
  )
}
