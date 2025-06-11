import BaseAPI from "@/api/baseAPIClass"

class inWhoseInterestsAPI extends BaseAPI {}

export default function getInWhoseInterestsAPIInstance() {
  return new inWhoseInterestsAPI(
    "in-whose-interests",
    {
      in_whose_interests__icontains: "",
    },
    { in_whose_interests: "" },
  )
}
