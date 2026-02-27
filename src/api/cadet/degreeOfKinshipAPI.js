import BaseAPI from "@/api/baseAPIClass"

class degreeOfKinshipAPI extends BaseAPI {}

export default function getDegreeOfKinshipAPIInstance() {
  return new degreeOfKinshipAPI("degree-of-kinship", {
    degree_of_kinship__icontains: "",
  })
}
