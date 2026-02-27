import BaseAPI from "@/api/baseAPIClass"

class EmployeeAPI extends BaseAPI {
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

export default function getEmployeeAPIInstance() {
  return new EmployeeAPI("employee", {
    is_active: "",
    category: "",
    category__in: "",
    gender: "",
    last_name_rus__icontains: "",
    first_name_rus__icontains: "",
    patronymic_rus__icontains: "",
    last_name_bel__icontains: "",
    first_name_bel__icontains: "",
    last_name_en__icontains: "",
    first_name_en__icontains: "",
    date_of_birth__gte: "",
    date_of_birth__lte: "",
    place_of_birth__icontains: "",
    address_residence__icontains: "",
    address_registration__icontains: "",
    phone_number__icontains: "",
    personal_number_mvd__icontains: "",
    marital_status: "",
    marital_status__in: "",
    passport_number__icontains: "",
    passport_issue_date__gte: "",
    passport_issue_date__lte: "",
    passport_validity_period__gte: "",
    passport_validity_period__lte: "",
    passport_issue_authority: "",
    passport_issue_authority__in: "",
    identification_number__icontains: "",
    subdivision: "",
    subdivision__in: "",
    current_rank: "",
    current_rank__in: "",
    current_position: "",
    current_position__in: "",
    age_gte: "",
    age_lte: "",
    contract_start_date__gte: "",
    contract_start_date__lte: "",
  })
}
export const globalEmployeeAPIInstance = getEmployeeAPIInstance()
