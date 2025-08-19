import BaseAPI from "@/api/baseAPIClass"
import { axiosInstance as axios } from "@/main.js"

class FPKPRKStudentAPI extends BaseAPI {
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
  async entrance_application_print(itemId) {
    return axios.get(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/${this.baseURL}/${itemId}/entrance_application_print/`,
      { responseType: "blob" },
    )
  }

  async list_export(export_data) {
    return axios.post(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/${this.baseURL}/list_export/`,
      export_data,
      { responseType: "blob" },
    )
  }

  async get_notifies_mag() {
    return axios.get(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/${this.baseURL}/get_notifies_mag/`,
      { responseType: "blob" },
    )
  }

  async notify_export_fpk_filter(export_data) {
    return axios.post(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/${this.baseURL}/notify_export_fpk_filter/`,
      export_data,
      { responseType: "blob" },
    )
  }

  async get_exam_sheet_gu() {
    return axios.get(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/${this.baseURL}/get_exam_sheet_gu/`,
      { responseType: "blob" },
    )
  }

  async get_exam_sheet_yur() {
    return axios.get(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/${this.baseURL}/get_exam_sheet_yur/`,
      { responseType: "blob" },
    )
  }

  async get_title_pages_gu() {
    return axios.get(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/${this.baseURL}/get_title_pages_gu/`,
      { responseType: "blob" },
    )
  }

  async get_title_pages_yur() {
    return axios.get(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/${this.baseURL}/get_title_pages_yur/`,
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
  passport_issue_authority_text__icontains: "",
  identification_number__icontains: "",
  subdivision: "",
  subdivision__in: "",
  current_rank: "",
  current_rank__in: "",
  current_position: "",
  current_position__in: "",
  age_gte: "",
  age_lte: "",
  fpk_mag_choice: "",
  student_record_book_number__icontains: "",
  foreign_language: "",
  group: "",
  group__in: "",
  academy_start_date__gte: "",
  academy_start_date__lte: "",
  academy_end_date__gte: "",
  academy_end_date__lte: "",
  current_speciality: "",
  current_speciality__in: "",
  privilege_1: "",
  privilege_1__in: "",
  speciality_1: "",
  speciality_1__in: "",
  component_organ: "",
  component_organ__in: "",
  entrance_category: "",
  entrance_category__in: "",
  arrived_from_go_rovd: "",
  arrived_from_go_rovd__in: "",
  extra_data__icontains: "",
  comments_on_personal_file__icontains: "",
  score_sum__gte: "",
  score_sum__lte: "",
  application_has_been_printed_date__gte: "",
  application_has_been_printed_date__lte: "",
  application_has_been_printed: "",
  entrance_year__gte: "",
  entrance_year__lte: "",
  ordering: null,
}

export default function getFPKPRKStudentAPIInstance() {
  return new FPKPRKStudentAPI("fpk-mag-student", {
    ...searchObj,
    category__in: [4, 5],
  })
}

export const globalFPKPRKStudentAPIInstance = getFPKPRKStudentAPIInstance()
export const globalFPKPRKStudentAPIInstanceForPassOffice = new FPKPRKStudentAPI(
  "fpk-mag-student",
  searchObj,
)
export const globalFPKPRKStudentAPIForEntranceInstance = new FPKPRKStudentAPI(
  "fpk-mag-student",
  {
    ...searchObj,
    is_active: "",
    category: 3,
  },
)
