import BaseAPI from "@/api/baseAPIClass"
import { axiosInstance as axios } from "@/main.js"

class CadetAPI extends BaseAPI {
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
  async entrance_application_print(itemId) {
    return axios.get(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/${this.baseURL}/${itemId}/entrance_application_print/`,
      { responseType: "blob" },
    )
  }

  async get_journal_number(itemId) {
    return axios.get(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/${this.baseURL}/${itemId}/get_journal_number/`,
    )
  }

  async list_export(export_data) {
    return axios.post(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/${this.baseURL}/list_export/`,
      export_data,
      { responseType: "blob" },
    )
  }

  async notify_export(export_data) {
    return axios.post(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/${this.baseURL}/notify_export/`,
      export_data,
      { responseType: "blob" },
    )
  }

  async notify_export_all() {
    return axios.get(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/${this.baseURL}/notify_export_all/`,
      { responseType: "blob" },
    )
  }
  async getJournal(speciality_1, subdivision) {
    return axios.get(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/${this.baseURL}/?category=3&quota_1_speciality=${speciality_1}&quota_1_subdivision=${subdivision}&has_visited=true&ordering=has_visited_date_time&limit=10000`,
    )
  }

  async validateDataBeforeMakingStudentRecordBook(items) {
    return axios.post(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/${this.baseURL}/validate_data_before_making_student_record_book/`,
      { selected_items: items },
    )
  }

  async makeStudentRecordBook(items) {
    return axios.post(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/${this.baseURL}/make_student_record_book/`,
      { selected_items: items },
      { responseType: "blob" },
    )
  }

  async txt_export(export_data) {
    return axios.post(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/${this.baseURL}/make_txt/`,
      export_data,
      { responseType: "blob" },
    )
  }

  async make_library_card(items) {
    return axios.post(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/${this.baseURL}/make_library_card/`,
      { selected_items: items },
      { responseType: "blob" },
    )
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
  parents_is_in_divorce: "",
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
  rus_bel_ct_number__icontains: "",
  rus_score_ct__gte: "",
  rus_score_ct__lte: "",
  bel_score_ct__gte: "",
  bel_score_ct__lte: "",
  rus_ct_choice: "",
  social_science_ct_number__icontains: "",
  social_science_score_ct__gte: "",
  social_science_score_ct__lte: "",
  social_science_ct_choice: "",
  foreign_lang_ct_number__icontains: "",
  foreign_lang_score_ct__gte: "",
  foreign_lang_score_ct__lte: "",
  foreign_lang_ct_choice: "",
  rus_score_cert__gte: "",
  rus_score_cert__lte: "",
  bel_score_cert__gte: "",
  bel_score_cert__lte: "",
  social_science_score_cert__gte: "",
  social_science_score_cert__lte: "",
  foreign_lang_score_cert__gte: "",
  foreign_lang_score_cert__lte: "",
  education_average_score__gte: "",
  education_average_score__lte: "",
  who_created: "",
  speciality_1__in: "",
  speciality_2__in: "",
  speciality_3__in: "",
  speciality_4__in: "",
  speciality_5__in: "",
  speciality_6__in: "",
  speciality_7__in: "",
  speciality_8__in: "",
  speciality_9__in: "",
  education_kind__in: "",
  privilege_1__in: "",
  privilege_2__in: "",
  privilege_3__in: "",
  privilege_4__in: "",
  privilege_5__in: "",
  privilege_6__in: "",
  privilege_7__in: "",
  privilege_8__in: "",
  privilege_9__in: "",
  education_kind__inppfl_test__in: "",
  ppfl_test__in: "",
  health_group: "",
  medical_age_group: "",
  is_risk_group: "",
  has_gusb_check: "",
  is_orphan: "",
  application_has_been_printed_date__gte: "",
  application_has_been_printed_date__lte: "",
  application_has_been_printed: "",
  has_visited: "",
  has_visited_date__gte: "",
  has_visited_date__lte: "",
  vpk__in: "",
  aims_to_graduate_with_honors: "",
  is_class_vpn: "",
  is_class_pn: "",
  has_achievements_in_sports: "",
  is_class_other: "",
  is_olympiad_winner: "",
  passed_medical_examination: "",
  fit_for_service: "",
  has_dactocard: "",
  is_enrolled_1: "",
  is_enrolled_2: "",
  enrolled_speciality__in: "",
  enrolled_privilege__in: "",
  enrolled_speciality_2__in: "",
  enrolled_privilege_2__in: "",
  is_reserve: "",
  took_documents: "",
  passed_medical_examination_date__gte: "",
  passed_medical_examination_date__lte: "",
  photo_exists: "",
  sign_image_exists: "",
  sign_image: "",
  entrance_year__gte: "",
  entrance_year__lte: "",
  ordering: null,
}

export default function getCadetAPIInstance() {
  return new CadetAPI("cadet", { ...searchObj, category__in: [4, 5] })
}

export const globalCadetAPIInstance = getCadetAPIInstance()
export const globalCadetAPIInstanceForPassOffice = new CadetAPI(
  "cadet",
  searchObj,
)
export const globalCadetAPIForEntranceInstance = new CadetAPI("cadet", {
  ...searchObj,
  category: 3,
  is_active: "true",
  educational_institution__in: [1, 2],
})
