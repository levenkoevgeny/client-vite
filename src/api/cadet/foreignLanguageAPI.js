import BaseAPI from "@/api/baseAPIClass"

class ForeignLanguageAPI extends BaseAPI {}

export default function getForeignLanguageAPIInstance() {
  return new ForeignLanguageAPI(
    "foreign-language",
    {
      foreign_language__icontains: "",
    },
    { foreign_language: "" },
  )
}
