import BaseAPI from "@/api/baseAPIClass"

class EntranceCategoryAPI extends BaseAPI {}

export default function getEntranceCategoryAPIInstance() {
  return new EntranceCategoryAPI(
    "entrance-category",
    {
      entrance_category_name__icontains: "",
    },
    { entrance_category_name: "" },
  )
}
