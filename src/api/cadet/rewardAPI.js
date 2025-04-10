import BaseAPI from "@/api/baseAPIClass"

class rewardAPI extends BaseAPI {}

export default function getRewardAPIInstance() {
  return new rewardAPI(
    "reward",
    {
      reward_title__icontains: "",
    },
    { reward_title: "" },
  )
}
