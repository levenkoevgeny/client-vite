import BaseAPI from "@/api/baseAPIClass"

class GraduationReasonAPI extends BaseAPI {}

export default function getGraduationReasonAPIInstance() {
  return new GraduationReasonAPI(
    "graduation-reason",
    {
      graduation_reason__icontains: "",
    },
    { graduation_reason: "" },
  )
}
