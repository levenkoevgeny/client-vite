import BaseAPI from "@/api/baseAPIClass"
import { axiosInstance as axios } from "@/main.js"

class SubjectAPI extends BaseAPI {
  getQueryStringFromSearchObj() {
    let queryString = "?"
    for (let key in this.searchObj) {
      if (this.searchObj[key]) {
        if (key.includes("__in")) {
          if (typeof this.searchObj[key] === "object") {
            const valArray = this.searchObj[key]
            let keyVal = ""
            valArray.forEach((val) => {
              keyVal = keyVal + `${key}=${val}&`
            })
            queryString = queryString + keyVal
          }
        } else {
          queryString = queryString + `${key}=${this.searchObj[key]}&`
        }
      }
    }
    return queryString
  }
}
const searchObj = {}

export default function getSubjectAPIInstance() {
  return new SubjectAPI("subjects", { ...searchObj })
}
