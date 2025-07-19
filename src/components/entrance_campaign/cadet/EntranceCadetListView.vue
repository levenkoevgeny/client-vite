<template>
  <base-list-layout
    :is-loading="isLoading"
    :main-list-length="cadetList.count"
    title="Личные дела"
    :load-more-data="loadMoreData"
  >
    <template v-slot:add-button>
      <button class="btn btn-secondary me-3" @click="showExportDataModal">
        Экспорт&nbsp;&nbsp;<font-awesome-icon :icon="['fas', 'file-export']" />
      </button>
      <button class="btn btn-warning" @click="showCadetAddModal">
        Добавить личное дело
      </button>
    </template>

    <template v-slot:table-mode-button>
      <router-link
        :to="{ name: 'entrance-cadet-table-view' }"
        class="fs-3 fw-light link-secondary"
        title="Табличный режим"
      >
        <font-awesome-icon :icon="['fas', 'table']" />
      </router-link>
    </template>

    <template v-slot:modals>
      <div
        class="modal fade"
        id="exportDataModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        ref="exportDataModal"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" v-if="isExporting">
                Идет экспорт данных ...
              </h1>
              <h1 class="modal-title fs-5" v-else>Экспорт данных</h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div>
                <div style="font-size: 1.7rem">
                  <button
                    class="btn btn-link text-primary"
                    style="font-size: inherit"
                    title="Экспорт в Word"
                    @click="exportData('docx')"
                    :disabled="isExporting"
                  >
                    <font-awesome-icon :icon="['far', 'file-word']" />
                  </button>
                  <button
                    class="btn btn-link text-success"
                    style="font-size: inherit; color: inherit"
                    title="Экспорт в Excel"
                    @click="exportData('xlsx')"
                    :disabled="isExporting"
                  >
                    <font-awesome-icon :icon="['far', 'file-excel']" />
                  </button>
                </div>
                <div>
                  <div
                    class="d-flex flex-row align-items-center justify-content-start my-2"
                  >
                    <button
                      class="btn text-primary me-2 p-0"
                      @click="checkAllFieldsForExport"
                    >
                      <font-awesome-icon :icon="['fas', 'list-check']" />
                      Выбрать все поля
                    </button>
                    <button
                      class="btn text-primary m-0 p-0"
                      @click="clearAllFieldsForExport"
                    >
                      Очистить
                      <font-awesome-icon :icon="['far', 'circle-xmark']" />
                    </button>
                  </div>
                  <label class="form-label">Выбор полей для экспорта</label>

                  <v-select
                    v-model="selectedFieldsForDataExport"
                    :options="fieldsForDataExport"
                    label="fieldName"
                    :reduce="(field) => field.fieldValue"
                    multiple
                    style="min-width: 400px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="modal fade"
        id="cadetAddModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        ref="cadetAddModal"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                Добавление личного дела
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <form @submit.prevent="addNewCadetForEntrance">
              <div class="modal-body">
                <div class="mb-3">
                  <label for="id_last_name_rus" class="form-label"
                    >Фамилия</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="id_last_name_rus"
                    v-model="cadetNewForm.last_name_rus"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="id_first_name_rus" class="form-label">Имя</label>
                  <input
                    type="text"
                    class="form-control"
                    id="id_first_name_rus"
                    v-model="cadetNewForm.first_name_rus"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="id_patronymic_rus" class="form-label"
                    >Отчество</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="id_patronymic_rus"
                    v-model="cadetNewForm.patronymic_rus"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="id_date_of_birth" class="form-label"
                    >Дата рождения</label
                  >
                  <input
                    type="date"
                    class="form-control"
                    id="id_date_of_birth"
                    v-model="cadetNewForm.date_of_birth"
                    required
                  />
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                  ref="cadetAddModalCloseButton"
                >
                  Закрыть без сохранения
                </button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="isLoading"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </template>

    <template v-slot:thead>
      <tr>
        <th
          scope="col"
          style="width: 50px; max-width: 50px; min-width: 50px"
        ></th>
        <th scope="col">Фамилия</th>
        <th scope="col">Имя</th>
        <th scope="col">Отчество</th>
        <th scope="col">Дата рождения</th>
        <th scope="col">Комплектующий орган</th>
      </tr>
    </template>
    <template v-slot:tbody>
      <tr
        class="align-middle"
        v-for="cadet in orderedCadets"
        :key="cadet.id"
        @dblclick="
          $router.push({
            name: 'entrance-cadet-input-form',
            params: { id: cadet.id },
          })
        "
      >
        <td class="text-center">
          <font-awesome-icon
            :icon="['fas', 'print']"
            v-if="cadet.application_has_been_printed"
          />
        </td>
        <td>
          {{ cadet.last_name_rus }}
        </td>
        <td>
          {{ cadet.first_name_rus }}
        </td>
        <td>
          {{ cadet.patronymic_rus }}
        </td>
        <td>
          {{
            new Date(cadet.date_of_birth).toLocaleString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          }}
        </td>
        <td>{{ cadet.get_component_organ }}</td>
      </tr>
    </template>

    <template v-slot:search-form>
      <div class="mb-3">
        <label for="last_name_rus" class="form-label">Фамилия</label>
        <input
          type="text"
          id="last_name_rus"
          class="form-control"
          v-model="searchForm.last_name_rus__icontains"
        />
      </div>
    </template>
    <template v-slot:search-form-clear-button>
      <button type="button" class="btn btn-primary" @click="clearFilter">
        Сбросить фильтр
      </button>
    </template>
  </base-list-layout>
</template>

<script>
import NavigationLayout from "@/components/layouts/NavigationLayout.vue"
import { globalCadetAPIForEntranceInstance } from "@/api/cadet/cadetAPI.js"
import { debounce } from "lodash/function"
import { mapGetters } from "vuex"
import BaseListLayout from "@/components/layouts/BaseListLayout.vue"
import { getQueryStringFromSearchForm } from "../../../../utils.js"

export default {
  name: "EntranceListView",
  components: { NavigationLayout, BaseListLayout },
  data() {
    return {
      isLoading: true,
      isError: false,
      isExporting: false,
      currentTime: new Date(),
      cadetList: { count: 0, results: [], previous: null, next: null },
      cadetAPIInstance: globalCadetAPIForEntranceInstance,
      searchForm: Object.assign(
        {},
        globalCadetAPIForEntranceInstance.searchObj,
      ),
      cadetNewForm: {
        category: 3,
        last_name_rus: "",
        first_name_rus: "",
        patronymic_rus: "",
        date_of_birth: null,
        entrance_year: new Date().getFullYear(),
      },
      fieldsForDataExport: [
        {
          fieldName: "Статус записи (активна/ неактивна)",
          fieldValue: "is_active",
        },
        { fieldName: "Пол", fieldValue: "get_gender" },
        { fieldName: "Фамилия (рус)", fieldValue: "last_name_rus" },
        { fieldName: "Имя (рус)", fieldValue: "first_name_rus" },
        { fieldName: "Отчество (рус)", fieldValue: "patronymic_rus" },
        { fieldName: "Фамилия (бел)", fieldValue: "last_name_bel" },
        { fieldName: "Имя (бел)", fieldValue: "first_name_bel" },
        { fieldName: "Отчество (бел)", fieldValue: "patronymic_bel" },
        { fieldName: "Дата рождения", fieldValue: "get_date_of_birth" },
        { fieldName: "Место рождения", fieldValue: "place_of_birth" },
        {
          fieldName: "Место жительства (проживания)",
          fieldValue: "address_residence",
        },
        { fieldName: "Номер телефона", fieldValue: "phone_number" },
        {
          fieldName: "Личный номер (жетон)",
          fieldValue: "personal_number_mvd",
        },
        { fieldName: "Семейное положение", fieldValue: "get_marital_status" },
        { fieldName: "Тип паспорта", fieldValue: "get_passport_document_type" },
        { fieldName: "Номер паспорта", fieldValue: "passport_number" },
        {
          fieldName: "Дата выдачи паспорта",
          fieldValue: "passport_issue_date",
        },
        {
          fieldName: "Срок действия паспорта",
          fieldValue: "passport_validity_period",
        },
        {
          fieldName: "Орган выдачи паспорта",
          fieldValue: "get_passport_issue_authority",
        },
        {
          fieldName: "Орган выдачи паспорта (текстом)",
          fieldValue: "passport_issue_authority_text",
        },
        {
          fieldName: "Идентификационный номер",
          fieldValue: "identification_number",
        },
        { fieldName: "Факультет", fieldValue: "get_subdivision" },
        { fieldName: "Звание", fieldValue: "get_rank" },
        { fieldName: "Должность", fieldValue: "get_position" },
        {
          fieldName: "Номер зачетной книжки",
          fieldValue: "student_record_book_number",
        },
        { fieldName: "Отец - фамилия", fieldValue: "father_last_name" },
        { fieldName: "Отец - имя", fieldValue: "father_first_name" },
        { fieldName: "Отец - отчество", fieldValue: "father_patronymic" },
        {
          fieldName: "Отец - дата рождения",
          fieldValue: "get_father_date_of_birth",
        },
        {
          fieldName: "Отец - место работы",
          fieldValue: "father_place_of_work",
        },
        {
          fieldName: "Отец - номер телефона",
          fieldValue: "father_phone_number",
        },
        {
          fieldName: "Отец - место жительства",
          fieldValue: "father_address_residence",
        },
        {
          fieldName: "Отец - место регистрации",
          fieldValue: "father_address_registration",
        },
        { fieldName: "Мать - фамилия", fieldValue: "mother_last_name" },
        { fieldName: "Мать - имя", fieldValue: "mother_first_name" },
        { fieldName: "Мать - отчество", fieldValue: "mother_patronymic" },
        {
          fieldName: "Мать - дата рождения",
          fieldValue: "get_mother_date_of_birth",
        },
        {
          fieldName: "Мать - место работы",
          fieldValue: "mother_place_of_work",
        },
        {
          fieldName: "Мать - номер телефона",
          fieldValue: "mother_phone_number",
        },
        {
          fieldName: "Мать - место жительства",
          fieldValue: "mother_address_residence",
        },
        {
          fieldName: "Мать - место регистрации",
          fieldValue: "mother_address_registration",
        },
        {
          fieldName: "Родители в разводе",
          fieldValue: "parents_is_in_divorce",
        },
        {
          fieldName: "Снят с воинского учета",
          fieldValue: "get_removed_from_military_registration",
        },
        {
          fieldName: "Иностранный язык (изучаемый в школе)",
          fieldValue: "get_foreign_language_was",
        },
        {
          fieldName: "Иностранный язык (будет изучать)",
          fieldValue: "get_foreign_language_will_be",
        },
        { fieldName: "Группа", fieldValue: "get_group" },
        { fieldName: "Примечания для отдела кадров", fieldValue: "extra_data" },
        { fieldName: "Дата поступления", fieldValue: "get_academy_start_date" },
        { fieldName: "Дата окончания", fieldValue: "get_academy_end_date" },
        {
          fieldName: "Причина окончания (Статья)",
          fieldValue: "graduation_reason_article",
        },
        {
          fieldName: "Причина окончания (доп. данные)",
          fieldValue: "graduation_extra_data",
        },
        { fieldName: "Специализация", fieldValue: "get_specialization" },
        { fieldName: "Направление ОРД", fieldValue: "get_direction_ord" },
        {
          fieldName: "Специальность (обучается)",
          fieldValue: "get_speciality",
        },
        { fieldName: "Год набора", fieldValue: "entrance_year" },
        {
          fieldName: "Заявление было отпечатано",
          fieldValue: "application_has_been_printed",
        },
        {
          fieldName: "Дата и время отпечатки заявления",
          fieldValue: "get_application_has_been_printed_date",
        },
        { fieldName: "Комплектующий орган", fieldValue: "get_component_organ" },
        {
          fieldName: "В чьих интересах обучается",
          fieldValue: "get_in_whose_interests",
        },
        {
          fieldName: "Категория поступающего",
          fieldValue: "get_entrance_category",
        },
        {
          fieldName: "Прибыл из ГО-РОВД",
          fieldValue: "get_arrived_from_go_rovd",
        },
        { fieldName: "Социальный статус", fieldValue: "get_social_status" },
        {
          fieldName: "Область (для прохождения мед. комиссии)",
          fieldValue: "get_region_for_medical_examination",
        },
        { fieldName: "Военкомат", fieldValue: "get_military_office" },
        {
          fieldName: "Военкомат (дополнительные данные)",
          fieldValue: "military_office_extra_data",
        },
        {
          fieldName: "Замечания по личному делу",
          fieldValue: "comments_on_personal_file",
        },
        {
          fieldName: "Учреждение образования",
          fieldValue: "get_educational_institution",
        },
        {
          fieldName: "Место службы в армии",
          fieldValue: "military_organization",
        },
        {
          fieldName: "Служба в армии (начало)",
          fieldValue: "get_military_service_start",
        },
        {
          fieldName: "Служба в армии (окончание)",
          fieldValue: "get_military_service_end",
        },
        {
          fieldName: "Служба в армии (должность)",
          fieldValue: "military_position",
        },
        { fieldName: "Служба в МВД", fieldValue: "mvd_organization" },
        {
          fieldName: "Служба в МВД (начало)",
          fieldValue: "get_mvd_service_start",
        },
        {
          fieldName: "Служба в МВД (окончание)",
          fieldValue: "get_mvd_service_end",
        },
        { fieldName: "Служба в МВД (должность)", fieldValue: "mvd_position" },
        {
          fieldName: "Вид учреждения образования",
          fieldValue: "get_education_kind",
        },
        { fieldName: "Уровень образования", fieldValue: "get_education_level" },
        {
          fieldName: "Наименование учебного заведения",
          fieldValue: "education_graduated",
        },
        {
          fieldName: "Год поступления в учебное заведение",
          fieldValue: "education_graduating_start_year",
        },
        {
          fieldName: "Год окончания учебного заведения",
          fieldValue: "education_graduating_end_year",
        },
        { fieldName: "Средний бал", fieldValue: "education_average_score" },
        {
          fieldName: "Вид населенного пункта",
          fieldValue: "get_education_location_kind",
        },
        {
          fieldName: "Номер сертификата по русскому / белорусскому языку",
          fieldValue: "rus_bel_ct_number",
        },
        {
          fieldName: "Русский язык - ЦТ / ЦЭ - количество баллов",
          fieldValue: "rus_score_ct",
        },
        {
          fieldName: "Русский язык - ЦТ / ЦЭ - выбор",
          fieldValue: "rus_ct_choice",
        },
        {
          fieldName: "Белорусский язык - ЦТ / ЦЭ - количество баллов",
          fieldValue: "bel_score_ct",
        },
        {
          fieldName: "Белорусский язык - ЦТ / ЦЭ - выбор",
          fieldValue: "bel_ct_choice",
        },
        {
          fieldName: "Номер сертификата по обществоведению",
          fieldValue: "social_science_ct_number",
        },
        {
          fieldName: "Обществоведение - ЦТ / ЦЭ - количество баллов",
          fieldValue: "social_science_score_ct",
        },
        {
          fieldName: "Обществоведение - ЦТ / ЦЭ - выбор",
          fieldValue: "social_science_ct_choice",
        },
        {
          fieldName: "Номер сертификата по иностранному языку",
          fieldValue: "foreign_lang_ct_number",
        },
        {
          fieldName: "Иностранный язык - ЦТ / ЦЭ - количество баллов",
          fieldValue: "foreign_lang_score_ct",
        },
        {
          fieldName: "Иностранный язык - ЦТ / ЦЭ - выбор",
          fieldValue: "foreign_lang_ct_choice",
        },
        {
          fieldName: "Русский язык - аттестат - количество баллов",
          fieldValue: "rus_score_cert",
        },
        {
          fieldName: "Белорусский язык - аттестат - количество баллов",
          fieldValue: "bel_score_cert",
        },
        {
          fieldName: "Обществоведение - аттестат - количество баллов",
          fieldValue: "social_science_score_cert",
        },
        {
          fieldName: "Иностранный язык - аттестат - количество баллов",
          fieldValue: "foreign_lang_score_cert",
        },
        { fieldName: "Специальность 1", fieldValue: "get_speciality_1" },
        { fieldName: "Специальность 2", fieldValue: "get_speciality_2" },
        { fieldName: "Специальность 3", fieldValue: "get_speciality_3" },
        { fieldName: "Специальность 4", fieldValue: "get_speciality_4" },
        { fieldName: "Специальность 5", fieldValue: "get_speciality_5" },
        { fieldName: "Специальность 6", fieldValue: "get_speciality_6" },
        { fieldName: "Специальность 7", fieldValue: "get_speciality_7" },
        { fieldName: "Специальность 8", fieldValue: "get_speciality_8" },
        { fieldName: "Специальность 9", fieldValue: "get_speciality_9" },
        { fieldName: "Льгота 1", fieldValue: "get_privilege_1" },
        { fieldName: "Льгота 2", fieldValue: "get_privilege_2" },
        { fieldName: "Льгота 3", fieldValue: "get_privilege_3" },
        { fieldName: "Льгота 4", fieldValue: "get_privilege_4" },
        { fieldName: "Льгота 5", fieldValue: "get_privilege_5" },
        { fieldName: "Льгота 6", fieldValue: "get_privilege_6" },
        { fieldName: "Льгота 7", fieldValue: "get_privilege_7" },
        { fieldName: "Льгота 8", fieldValue: "get_privilege_8" },
        { fieldName: "Льгота 9", fieldValue: "get_privilege_9" },
        { fieldName: "Группа здоровья", fieldValue: "get_health_group" },
        {
          fieldName: "Категория профессионального соответствия",
          fieldValue: "get_ppfl_test",
        },
        {
          fieldName: "Медико-возрастная группа",
          fieldValue: "medical_age_group",
        },
        {
          fieldName: "Окончательное медицинское освидетельствование",
          fieldValue: "passed_medical_examination",
        },
        {
          fieldName: "Дата прохождения медицинской комиссии",
          fieldValue: "get_passed_medical_examination_date",
        },
        {
          fieldName: "Медицинская комиссия (доп. данные)",
          fieldValue: "passed_medical_examination_extra_data",
        },
        { fieldName: "Возраст", fieldValue: "get_age" },
      ],
      selectedFieldsForDataExport: [
        "last_name_rus",
        "first_name_rus",
        "get_component_organ",
        "get_arrived_from_go_rovd",
        "comments_on_personal_file",
      ],
    }
  },
  async created() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      this.isLoading = true
      const response = await this.cadetAPIInstance.getItemsList()
      this.cadetList = await response.data
      this.isLoading = false
    },

    async loadMoreData(entries, observer) {
      if (entries[0].isIntersecting) {
        if (this.cadetList) {
          if (this.cadetList.next) {
            try {
              const response = await this.cadetAPIInstance.updateList(
                this.cadetList.next,
              )
              const newData = await response.data
              this.cadetList.results = [
                ...this.cadetList.results,
                ...newData.results,
              ]
              this.cadetList.next = newData.next
              this.cadetList.previous = newData.previous
              this.setSerialNumbers()
            } catch (error) {
              this.isError = true
            } finally {
            }
          }
        }
      }
    },

    showCadetAddModal() {
      let addModal = this.$refs.cadetAddModal
      let myModal = new bootstrap.Modal(addModal, {
        keyboard: false,
      })
      myModal.show()
    },
    async addNewCadetForEntrance() {
      this.isLoading = true
      const response = await this.cadetAPIInstance.addItem(this.cadetNewForm)
      const newItem = response.data
      this.cadetList.results.unshift(newItem)
      this.cadetList.count = this.cadetList.count + 1
      this.$refs.cadetAddModalCloseButton.click()
      this.cadetNewForm = {
        category: 3,
        last_name_rus: "",
        first_name_rus: "",
        patronymic_rus: "",
        date_of_birth: null,
        entrance_year: new Date().getFullYear(),
      }
      this.isLoading = false
    },
    debouncedSearch: debounce(async function () {
      this.isLoading = true
      this.cadetAPIInstance.searchObj = this.searchForm
      const cadetAResponse = await this.cadetAPIInstance.getItemsList()
      this.cadetList = await cadetAResponse.data
      this.isLoading = false
    }, 500),
    clearFilter() {
      this.searchForm = Object.assign(
        {},
        this.cadetAPIInstance.searchObjDefault,
      )
    },
    showExportDataModal() {
      let addModal = this.$refs.exportDataModal
      let myModal = new bootstrap.Modal(addModal, {
        keyboard: false,
      })
      myModal.show()
    },
    checkAllFieldsForExport() {
      this.selectedFieldsForDataExport = []
      this.fieldsForDataExport.map((item) => {
        this.selectedFieldsForDataExport.push(item.fieldValue)
      })
    },
    clearAllFieldsForExport() {
      this.selectedFieldsForDataExport = []
    },
    async exportData(destination) {
      if (this.selectedFieldsForDataExport.length === 0) {
        alert("Выберите хотя бы одно поле для экспорта!")
      } else {
        this.isExporting = true
        let export_data = {}

        export_data.query_string = getQueryStringFromSearchForm(this.searchForm)
        export_data.fields_for_export =
          this.selectedFieldsForDataExport.toString()
        export_data.destination = destination
        if (this.searchForm.ordering) {
          export_data.ordering = this.searchForm.ordering.replace(",id", "")
        }

        this.cadetAPIInstance.list_export(export_data).then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement("a")
          link.href = url
          link.setAttribute("download", `file.${destination}`)
          document.body.appendChild(link)
          link.click()
          this.isExporting = false
        })
      }
    },
  },
  computed: {
    orderedCadets() {
      return this.cadetList.results
    },
    ...mapGetters({}),
  },
  watch: {
    searchForm: {
      handler(newValue, oldValue) {
        this.debouncedSearch()
      },
      deep: true,
    },
  },
}
</script>
<style scoped></style>
