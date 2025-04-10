import BaseAPI from "@/api/baseAPIClass"

class SubdivisionAPI extends BaseAPI {}

export default function getSubdivisionAPIInstance() {
  return new SubdivisionAPI(
    "subdivision",
    {
      subdivision_name__icontains: "",
    },
    {
      subdivision_name: "",
      subdivision_name_bel: "",
      subdivision_name_en: "",
      subdivision_short_name: "",
      parent_subdivision: "",
      subdivision_category: "",
    },
  )
}
