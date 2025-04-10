import BaseAPI from "@/api/baseAPIClass"

class ForeignLanguageLevelAPI extends BaseAPI {}

export default function getForeignLanguageLevelAPIInstance() {
  return new ForeignLanguageLevelAPI(
    "foreign-language-level",
    {
      foreign_language_level__icontains: "",
    },
    { foreign_language_level: "" },
  )
}
