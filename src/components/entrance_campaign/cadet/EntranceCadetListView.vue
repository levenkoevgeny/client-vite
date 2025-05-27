<template>
  <base-list-layout
    :is-loading="isLoading"
    :main-list-length="cadetList.count"
    title="Личные дела"
    :load-more-data="null"
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
              <h1 class="modal-title fs-5">Экспорт данных</h1>
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
                  >
                    <font-awesome-icon :icon="['far', 'file-word']" />
                  </button>
                  <button
                    class="btn btn-link text-success"
                    style="font-size: inherit; color: inherit"
                    title="Экспорт в Excel"
                    @click="exportData('xlsx')"
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
                <button type="submit" class="btn btn-primary">Сохранить</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </template>

    <template v-slot:thead>
      <tr>
        <th scope="col">Фамилия, имя, отчество</th>
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
      <div class="mb-3">
        <label for="subdivision" class="form-label">Комплектующий орган</label>
        <v-select
          v-model="searchForm.component_organ__in"
          :options="orderedComponentOrgans"
          label="component_name"
          :reduce="(orderedComponentOrgan) => orderedComponentOrgan.id"
          multiple
        />
      </div>
      <div class="mb-3">
        <label for="category" class="form-label">Пол</label>
        <select
          class="form-select"
          aria-label="Default select example"
          v-model="searchForm.gender"
        >
          <option selected value="">--------</option>
          <option value="1">Мужской</option>
          <option value="0">Женский</option>
        </select>
      </div>

      <div class="row">
        <div class="col-6">
          <div class="mb-3">
            <label for="date_of_birth__gte" class="form-label"
              >Дата рождения (с)</label
            >
            <input
              type="date"
              class="form-control"
              id="date_of_birth__gte"
              v-model="searchForm.date_of_birth__gte"
            />
          </div>
        </div>
        <div class="col-6">
          <div class="mb-3">
            <label for="date_of_birth__lte" class="form-label"
              >Дата рождения (по)</label
            >
            <input
              type="date"
              class="form-control"
              id="date_of_birth__lte"
              v-model="searchForm.date_of_birth__lte"
            />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <div class="mb-3">
            <label for="date_of_birth__gte" class="form-label"
              >Возраст (с)</label
            >
            <input
              type="number"
              class="form-control"
              id="date_of_birth__gte"
              v-model="searchForm.age_gte"
            />
          </div>
        </div>
        <div class="col-6">
          <div class="mb-3">
            <label for="date_of_birth__lte" class="form-label"
              >Возраст (по)</label
            >
            <input
              type="number"
              class="form-control"
              id="date_of_birth__lte"
              v-model="searchForm.age_lte"
            />
          </div>
        </div>
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

export default {
  name: "EntranceListView",
  components: { NavigationLayout, BaseListLayout },
  data() {
    return {
      isLoading: true,
      isError: false,
      currentTime: new Date(),
      BACKEND_PROTOCOL: import.meta.env.VITE_APP_BACKEND_PROTOCOL,
      BACKEND_HOST: import.meta.env.VITE_APP_BACKEND_HOST,
      BACKEND_PORT: import.meta.env.VITE_APP_BACKEND_PORT,
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
        { fieldName: "Фамилия", fieldValue: "last_name_rus" },
        { fieldName: "Имя", fieldValue: "first_name_rus" },
        { fieldName: "Отчество", fieldValue: "patronymic_rus" },
        { fieldName: "Дата рождения", fieldValue: "date_of_birth" },
        { fieldName: "Возраст", fieldValue: "get_age" },
        { fieldName: "Пол", fieldValue: "get_gender" },
        {
          fieldName: "Факультет",
          fieldValue: "get_subdivision",
        },
        {
          fieldName: "Группа",
          fieldValue: "get_group",
        },
        {
          fieldName: "Звание",
          fieldValue: "get_rank",
        },
        {
          fieldName: "Должность",
          fieldValue: "get_position",
        },
        {
          fieldName: "Специализация",
          fieldValue: "get_specialization",
        },
        {
          fieldName: "Направление ОРД",
          fieldValue: "get_direction_ord",
        },
        {
          fieldName: "Специальность",
          fieldValue: "get_speciality",
        },
        {
          fieldName: "Комплектующий орган",
          fieldValue: "get_component_organ",
        },
        {
          fieldName: "Личный номер (жетон)",
          fieldValue: "personal_number_mvd",
        },
        {
          fieldName: "Дата поступления",
          fieldValue: "academy_start_date",
        },
        {
          fieldName: "Дата окончания",
          fieldValue: "academy_end_date",
        },
        {
          fieldName: "Военкомат",
          fieldValue: "get_military_office",
        },

        { fieldName: "Место рождения", fieldValue: "place_of_birth" },
        {
          fieldName: "Место жительства (проживания)",
          fieldValue: "address_residence",
        },
        {
          fieldName: "Место жительства (регистрация)",
          fieldValue: "address_registration",
        },
        {
          fieldName: "Номер телефона",
          fieldValue: "phone_number",
        },
        {
          fieldName: "Семейное положение",
          fieldValue: "marital_status",
        },
        {
          fieldName: "Номер паспорта",
          fieldValue: "passport_number",
        },
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
          fieldName: "Идентификационный номер",
          fieldValue: "identification_number",
        },
        {
          fieldName: "Снят с воинского учета",
          fieldValue: "removed_from_military_registration",
        },
        {
          fieldName: "Причина окончания",
          fieldValue: "get_graduation_reason",
        },
        {
          fieldName: "Причина окончания (Статья)",
          fieldValue: "graduation_reason_article",
        },
        {
          fieldName: "Причина окончания (доп. данные)",
          fieldValue: "graduation_extra_data",
        },
        {
          fieldName: "Прибыл из ГО-РОВД",
          fieldValue: "get_arrived_from_go_rovd",
        },
        {
          fieldName: "Замечания по личному делу",
          fieldValue: "comments_on_personal_file",
        },
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
      let queryString = "?"
      for (let key in this.searchForm) {
        if (key.includes("__in")) {
          if (typeof this.searchForm[key] === "object") {
            const valArray = this.searchForm[key]
            let keyVal = ""
            valArray.forEach((val) => {
              keyVal = keyVal + `${key}=${val}&`
            })
            queryString = queryString + keyVal
          }
        } else {
          queryString = queryString + `${key}=${this.searchForm[key]}&`
        }
      }
      queryString =
        queryString + `fields_for_export=${this.selectedFieldsForDataExport}`
      queryString = queryString + `&destination=${destination}`

      console.log(
        `${this.BACKEND_PROTOCOL}://${this.BACKEND_HOST}:${this.BACKEND_PORT}/api/list-export/${queryString}`,
      )

      this.$axios
        .get(
          `${this.BACKEND_PROTOCOL}://${this.BACKEND_HOST}:${this.BACKEND_PORT}/api/list-export/${queryString}`,
          { responseType: "blob" },
        )
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement("a")
          link.href = url
          link.setAttribute("download", `file.${destination}`)
          document.body.appendChild(link)
          link.click()
        })
    },
  },
  computed: {
    orderedCadetCategories() {
      return this.categories.results
    },
    orderedCadets() {
      return this.cadetList.results
    },
    orderedSubdivisions() {
      return this.subdivisions.results.filter(
        (subdivision) => subdivision.subdivision_category == "1",
      )
    },
    orderedGroups() {
      return this.groups.results
    },
    orderedRanks() {
      return this.ranks.results
    },
    orderedSpecialities() {
      return this.specialities.results
    },
    orderedPositions() {
      return this.positions.results.filter(
        (position) => position.position_category == "1",
      )
    },
    orderedComponentOrgans() {
      return this.componentOrgans.results
    },
    ...mapGetters({
      groups: "groups/getList",
      ranks: "ranks/getList",
      subdivisions: "subdivisions/getList",
      specialities: "specialities/getList",
      positions: "positions/getList",
      categories: "personCategories/getList",
      componentOrgans: "componentOrgans/getList",
      token: "auth/getToken",
    }),
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
