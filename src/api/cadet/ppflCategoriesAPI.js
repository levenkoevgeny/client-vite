import BaseAPI from "@/api/baseAPIClass"

class ppflCategoriesAPI extends BaseAPI {}

export default function getPPFLCategoriesAPIInstance() {
  return new ppflCategoriesAPI(
    "ppfl-categories",
    {
      category__icontains: "",
    },
    { category: "" },
  )
}
