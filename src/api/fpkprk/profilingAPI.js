import BaseAPI from "@/api/baseAPIClass"

class profilingAPI extends BaseAPI {}

export default function getProfilingAPIInstance() {
  return new profilingAPI(
    "profiling",
    {
      profiling_name__icontains: "",
    },
    {
      profiling_name: "",
    },
  )
}