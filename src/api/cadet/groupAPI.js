import BaseAPI from "@/api/baseAPIClass"

class GroupAPI extends BaseAPI {}

export default function getGroupAPIInstance() {
  return new GroupAPI(
    "group",
    { group_name__icontains: "" },
    { group_name: "" },
  )
}
