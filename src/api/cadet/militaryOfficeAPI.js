import BaseAPI from "@/api/baseAPIClass"

class MilitaryOfficeAPI extends BaseAPI {}

export default function getMilitaryOfficeAPIInstance() {
  return new MilitaryOfficeAPI(
    "military-office",
    {
      military_office__icontains: "",
    },
    { military_office: "" },
  )
}
