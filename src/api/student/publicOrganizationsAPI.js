import BaseAPI from "@/api/baseAPIClass"

class publicOrganizationsAPI extends BaseAPI {}

export default function getPublicOrganizationsAPIInstance() {
  return new publicOrganizationsAPI(
    "public-organizations",
    {
      organization_name__icontains: "",
    },
    {
      organization_name: "",
    },
  )
}
