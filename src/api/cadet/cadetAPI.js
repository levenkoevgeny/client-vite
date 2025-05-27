import BaseAPI from "@/api/baseAPIClass"

class CadetAPI extends BaseAPI {
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

const searchObj = {
  is_active: "true",
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
  student_record_book_number__icontains: "",
  removed_from_military_registration__gte: "",
  removed_from_military_registration__lte: "",
  father_date_of_birth__gte: "",
  father_date_of_birth__lte: "",
  mother_date_of_birth__gte: "",
  mother_date_of_birth__lte: "",
  foreign_language_was: "",
  foreign_language_will_be: "",
  group: "",
  group__in: "",
  academy_start_date__gte: "",
  academy_start_date__lte: "",
  academy_end_date__gte: "",
  academy_end_date__lte: "",
  graduation_reason: "",
  graduation_reason__in: "",
  graduation_reason_article__icontains: "",
  graduation_extra_data__icontains: "",
  specialization: "",
  specialization__in: "",
  direction_ord: "",
  direction_ord__in: "",
  current_speciality: "",
  current_speciality__in: "",
  component_organ: "",
  component_organ__in: "",
  entrance_category: "",
  entrance_category__in: "",
  educational_institution: "",
  educational_institution__in: "",
  arrived_from_go_rovd: "",
  arrived_from_go_rovd__in: "",
  social_status: "",
  social_status_in: "",
  region_for_medical_examination: "",
  region_for_medical_examination__in: "",
  military_office: "",
  military_office__in: "",
  extra_data__icontains: "",
  ordering: null,
}

export default function getCadetAPIInstance() {
  return new CadetAPI("cadet", { ...searchObj, category__in: [4, 5] })
}

export const globalCadetAPIInstance = getCadetAPIInstance()
export const globalCadetAPIForEntranceInstance = new CadetAPI("cadet", {
  ...searchObj,
  category: 3,
})
