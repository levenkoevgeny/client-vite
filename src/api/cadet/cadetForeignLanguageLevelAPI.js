import BaseAPI from "@/api/baseAPIClass"

class CadetForeignLanguageLevelAPI extends BaseAPI {}

export default function getCadetForeignLanguageLevelAPIInstance() {
  return new CadetForeignLanguageLevelAPI(
    "foreign-language-level-cadet",
    {
      cadet: "",
      foreign_language: "",
      foreign_language_level: "",
      extra_data__icontains: "",
    },
    {
      cadet: "",
      foreign_language: "",
      foreign_language_level: "",
      extra_data: "",
    },
  )
}
