import BaseAPI from "@/api/baseAPIClass"

class EmployeeAPI extends BaseAPI {
  getQueryStringFromSearchObj() {
    let queryString = "?"
    for (let key in this.searchObj) {
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
    return queryString
  }
}

export default function getEmployeeAPIInstance() {
  return new EmployeeAPI("employee-3v", {
    last_name_rus__icontains: "",
    first_name_rus__icontains: "",
    patronymic_rus__icontains: "",
  })
}
export const globalEmployee3VAPIInstance = getEmployeeAPIInstance()
