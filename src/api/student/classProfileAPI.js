import BaseAPI from "@/api/baseAPIClass"

class classProfileAPI extends BaseAPI {}

export default function getClassProfileAPIInstance() {
  return new classProfileAPI(
    "class-profiles",
    {
      class_profile_name__icontains: "",
    },
    {
      class_profile_name: "",
    },
  )
}
