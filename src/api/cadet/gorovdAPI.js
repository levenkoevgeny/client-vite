import BaseAPI from "@/api/baseAPIClass"

class GOROVDAPI extends BaseAPI {}

export default function getGOROVDAPIAPIInstance() {
  return new GOROVDAPI(
    "go-rovd",
    { go_rovd_name__icontains: "" },
    { go_rovd_name: "" },
  )
}
