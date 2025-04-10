import BaseAPI from "@/api/baseAPIClass"

class SocialStatusAPI extends BaseAPI {}

export default function getSocialStatusAPIInstance() {
  return new SocialStatusAPI(
    "social_statuses",
    {
      social_status__icontains: "",
    },
    { social_status: "" },
  )
}
