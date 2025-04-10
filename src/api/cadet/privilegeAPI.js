import BaseAPI from "@/api/baseAPIClass"

class privilegeAPI extends BaseAPI {}

export default function getPrivilegeAPIInstance() {
  return new privilegeAPI(
    "privileges",
    {
      privilege__icontains: "",
    },
    { privilege: "" },
  )
}
