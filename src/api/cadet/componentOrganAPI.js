import BaseAPI from "@/api/baseAPIClass"

class ComponentOrganAPI extends BaseAPI {}

export default function getComponentOrganAPIInstance() {
  return new ComponentOrganAPI(
    "component-organ",
    {
      component_name__icontains: "",
      component_short_name__icontains: "",
    },
    { component_name: "", component_short_name: "" },
  )
}
