import BaseAPI from "@/api/baseAPIClass"
import { axiosInstance as axios } from "@/main.js"

class StudentAPI extends BaseAPI {
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

  async title_page_print(itemId) {
    return axios.get(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/${this.baseURL}/${itemId}/title_page_print/`,
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

  async csv_export(export_data) {
    return axios.post(
      `${import.meta.env.VITE_APP_BACKEND_PROTOCOL}://${import.meta.env.VITE_APP_BACKEND_HOST}:${import.meta.env.VITE_APP_BACKEND_PORT}/api/${this.baseURL}/make_csv/`,
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
  student_record_book_number__icontains: "",
  father_last_name__icontains: "",
  father_date_of_birth__gte: "",
  father_date_of_birth__lte: "",
  father_place_of_work__icontains: "",
  father_is_employee: "",
  mother_last_name__icontains: "",
  mother_date_of_birth__gte: "",
  mother_date_of_birth__lte: "",
  mother_place_of_work__icontains: "",
  mother_is_employee: "",
  group: "",
  group__in: "",
  year: "",
  year_litera: "",
  contract_number: "",
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
  speciality: "",
  speciality__in: "",
  entrance_year__gte: "",
  entrance_year__lte: "",
  foreign_language_was: "",
  foreign_language_will_be: "",
  education_form: "",
  health_group: "",
  ppfl_test: "",
  ppfl_test__in: "",
  education_tab_extra_data__icontains: "",
  personal_information_tab_extra_data__icontains: "",
  parents_tab_extra_data__icontains: "",
  questionary_tab_extra_data__icontains: "",
  residence_region: "",
  residence_region__in: "",
  residence_location_kind: "",
  residence_location_kind__in: "",
  social_status: "",
  social_status__in: "",
  is_class_vpn: "",
  class_vpn_extra_data__icontains: "",
  is_class_pn: "",
  class_pn_extra_data__icontains: "",
  is_class_other: "",
  class_other_extra_data__icontains: "",
  has_achievements_in_sports: "",
  has_achievements_in_sports_extra_data__icontains: "",
  is_olympiad_winner: "",
  olympiad_winner_extra_data__icontains: "",
  has_intellectual_and_scientific_research_events: "",
  has_intellectual_and_scientific_research_events_extra_data__icontains: "",
  is_from_large_family: "",
  from_large_family_extra_data__icontains: "",
  is_from_low_income_families: "",
  from_low_income_families_extra_data__icontains: "",
  have_dependent_children_parents: "",
  have_dependent_children_parents_extra_data__icontains: "",
  victims_of_the_Chernobyl_disaster: "",
  victims_of_the_Chernobyl_disaster_extra_data__icontains: "",
  education_kind: "",
  education_kind__in: "",
  education_level: "",
  education_level__in: "",
  education_graduated__icontains: "",
  education_graduating_start_year__gte: "",
  education_graduating_start_year__lte: "",
  education_graduating_end_year__gte: "",
  education_graduating_end_year__lte: "",
  education_average_score__gte: "",
  education_average_score__lte: "",
  education_location_kind: "",
  education_location_kind__in: "",
  is_located_in_Minsk: "",
  rus_score_ct__gte: "",
  rus_score_ct__lte: "",
  rus_ct_choice: "",
  bel_score_ct__gte: "",
  bel_score_ct__lte: "",
  bel_ct_choice: "",
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
  speciality_1: "",
  speciality_1__in: "",
  privilege_1: "",
  privilege_1__in: "",
  application_has_been_printed: "",
  application_has_been_printed_date: "",
  application_has_been_printed_date__gte: "",
  application_has_been_printed_date__lte: "",
  department__icontains: "",
  place_of_work__icontains: "",
  position__icontains: "",
  rank__icontains: "",
  from_single_parent_family: "",
  from_single_parent_family_extra_data__icontains: "",
  has_passion_for_vocals: "",
  has_passion_for_vocals_extra_data__icontains: "",
  has_passion_for_choreography: "",
  has_passion_for_choreography_extra_data__icontains: "",
  has_passion_for_kvn: "",
  has_passion_for_kvn_extra_data__icontains: "",
  has_other_cultural_and_mass_hobbies: "",
  has_other_cultural_and_mass_hobbies_extra_data__icontains: "",
  is_brsm_member: "",
  is_brsm_member_extra_data__icontains: "",
  is_member_of_other_public_organizations: "",
  is_member_of_other_public_organizations_extra_data__icontains: "",
  is_orphan: "",
  is_orphan_extra_data__icontains: "",
  is_disabled: "",
  is_disabled_extra_data__icontains: "",
  is_children_left_without_parental_care: "",
  is_children_left_without_parental_care_extra_data__icontains: "",
  has_own_family: "",
  has_own_family_extra_data__icontains: "",
  vpk__in: "",
  vpk_data__icontains: "",
  education_graduating_end_year: "",
  medal__in: "",
  has_3_ct: "",
  has_2_ce: "",
  is_enrolled: "",
  extra_data__icontains: "",
  ordering: null,
}

export default function getStudentAPIInstance() {
  return new StudentAPI("student", {
    ...searchObj,
    is_active: "",
    category__in: [4, 5],
  })
}
export const globalStudentAPIInstance = getStudentAPIInstance()
export const globalStudentAPIInstanceForPassOffice = new StudentAPI(
  "student",
  searchObj,
)
export const globalStudentAPIForEntranceInstance = new StudentAPI("student", {
  ...searchObj,
  category: 3,
})
