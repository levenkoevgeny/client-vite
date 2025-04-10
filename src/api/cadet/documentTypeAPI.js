import BaseAPI from "@/api/baseAPIClass"

class documentTypeAPI extends BaseAPI {}

export default function getDocumentTypeAPIInstance() {
  return new documentTypeAPI(
    "document-types",
    {
      document_type__icontains: "",
    },
    { document_type: "" },
  )
}
