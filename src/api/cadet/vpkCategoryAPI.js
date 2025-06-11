import BaseAPI from "@/api/baseAPIClass"

class vpkCategoriesAPI extends BaseAPI {}

export default function getVpkCategoriesAPIInstance() {
  return new vpkCategoriesAPI(
    "vpk-categories",
    {
      category__icontains: "",
    },
    { category: "" },
  )
}
