<template>
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

  <div class="container-fluid">
    <div class="my-3"></div>
    <ul class="nav nav-links my-3 mb-lg-2 mx-n3">
      <li class="nav-item">
        <a class="nav-link active" aria-current="page" href="#"
          ><span>Всего </span
          ><span class="text-body-tertiary fw-semibold"
            >({{ cadetList.count }})</span
          ></a
        >
      </li>
    </ul>
    <div
      class="d-flex flex-row align-items-center justify-content-between mb-4"
    >
      <div class="m-0 p-0"></div>
      <div class="d-flex flex-row">
        <button class="btn btn-secondary me-3" @click="showExportDataModal">
          Экспорт&nbsp;&nbsp;<font-awesome-icon
            :icon="['fas', 'file-export']"
          />
        </button>

        <button class="btn btn-primary" @click="clearFilter">
          Сбросить фильтр
        </button>
      </div>
    </div>

    <div
      style="
        min-height: calc(100vh - 260px);
        max-height: calc(100vh - 260px);
        overflow: auto;
      "
      @scroll="loadMoreData"
      ref="infinite_list"
      id="infinite_list"
    >
      <table class="table table-hover table-responsive" style="overflow: auto">
        <thead ref="thead">
          <tr>
            <th scope="col" class="text-center">№п.п.</th>
            <th scope="col" class="text-center">Учреждение образования</th>
            <th scope="col">
              <div class="d-flex flex-row align-items-center">
                <span class="text-nowrap">Комплектующий орган</span>
                <div class="dropdown">
                  <button
                    class="btn dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  ></button>
                  <ul class="dropdown-menu">
                    <li>
                      <button
                        class="dropdown-item"
                        @click="setOrdering('component_organ__component_name')"
                      >
                        А -> Я
                      </button>
                    </li>
                    <li>
                      <button
                        class="dropdown-item"
                        @click="setOrdering('-component_organ__component_name')"
                      >
                        Я -> А
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </th>
            <th scope="col">
              <div class="d-flex flex-row align-items-center">
                <span class="text-nowrap">Прибыл из ГО-РОВД</span>
                <div class="dropdown">
                  <button
                    class="btn dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  ></button>
                  <ul class="dropdown-menu">
                    <li>
                      <button
                        class="dropdown-item"
                        @click="
                          setOrdering('arrived_from_go_rovd__go_rovd_name')
                        "
                      >
                        А -> Я
                      </button>
                    </li>
                    <li>
                      <button
                        class="dropdown-item"
                        @click="
                          setOrdering('-arrived_from_go_rovd__go_rovd_name')
                        "
                      >
                        Я -> А
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </th>
            <th scope="col">
              <div class="d-flex flex-row align-items-center">
                <span class="text-nowrap">Пол</span>
                <div class="dropdown">
                  <button
                    class="btn dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  ></button>
                  <ul class="dropdown-menu">
                    <li>
                      <button
                        class="dropdown-item"
                        @click="setOrdering('gender')"
                      >
                        А -> Я
                      </button>
                    </li>
                    <li>
                      <button
                        class="dropdown-item"
                        @click="setOrdering('-gender')"
                      >
                        Я -> А
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </th>
            <th scope="col">
              <div class="d-flex flex-row align-items-center">
                <span class="text-nowrap">Фамилия</span>
                <div class="dropdown">
                  <button
                    class="btn dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  ></button>
                  <ul class="dropdown-menu">
                    <li>
                      <button
                        class="dropdown-item"
                        @click="setOrdering('last_name_rus')"
                      >
                        А -> Я
                      </button>
                    </li>
                    <li>
                      <button
                        class="dropdown-item"
                        @click="setOrdering('-last_name_rus')"
                      >
                        Я -> А
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </th>
            <th scope="col">
              <div class="d-flex flex-row align-items-center">
                <span class="text-nowrap">Имя</span>
                <div class="dropdown">
                  <button
                    class="btn dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  ></button>
                  <ul class="dropdown-menu">
                    <li>
                      <button
                        class="dropdown-item"
                        @click="setOrdering('first_name_rus')"
                      >
                        А -> Я
                      </button>
                    </li>
                    <li>
                      <button
                        class="dropdown-item"
                        @click="setOrdering('-first_name_rus')"
                      >
                        Я -> А
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </th>
            <th scope="col">
              <div class="d-flex flex-row align-items-center">
                <span class="text-nowrap">Отчество</span>

                <div class="dropdown">
                  <button
                    class="btn dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  ></button>
                  <ul class="dropdown-menu">
                    <li>
                      <button
                        class="dropdown-item"
                        @click="setOrdering('patronymic_rus')"
                      >
                        А -> Я
                      </button>
                    </li>
                    <li>
                      <button
                        class="dropdown-item"
                        @click="setOrdering('-patronymic_rus')"
                      >
                        Я -> А
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </th>
            <th scope="col">
              <div class="d-flex flex-row align-items-center">
                <span class="text-nowrap">Дата рождения</span>
                <div class="dropdown">
                  <button
                    class="btn dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  ></button>
                  <ul class="dropdown-menu">
                    <li>
                      <button
                        class="dropdown-item"
                        @click="setOrdering('date_of_birth')"
                      >
                        меньш. -> больш.
                      </button>
                    </li>
                    <li>
                      <button
                        class="dropdown-item"
                        @click="setOrdering('-date_of_birth')"
                      >
                        больш. -> меньш.
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </th>
            <th scope="col">
              <div class="d-flex flex-row align-items-center">
                <span class="text-nowrap">Возраст</span>
              </div>
            </th>
            <th scope="col">
              <span class="text-nowrap">Место рождения</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Адрес регистрации</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Адрес места жительства</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Номер телефона</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Номер паспорта</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Паспорт (дата выдачи)</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Паспорт (срок действия)</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Паспорт (орган выдачи)</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Идентификационный номер</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Отец (фамилия)</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Отец (имя)</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Отец (отчество)</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Отец (дата рождекния)</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Отец (место работы)</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Отец (номер телефона)</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Мать (фамилия)</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Мать (имя)</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Мать (отчество)</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Мать (дата рождекния)</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Мать (место работы)</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Мать (номер телефона)</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Иностранный язык (изучал в школе)</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Иностранный язык (будет изучать)</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Снятие с воинского учета</span>
            </th>
            <th scope="col">
              <div class="d-flex flex-row align-items-center">
                <span class="text-nowrap">Военкомат</span>
                <div class="dropdown">
                  <button
                    class="btn dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  ></button>
                  <ul class="dropdown-menu">
                    <li>
                      <button
                        class="dropdown-item"
                        @click="setOrdering('military_office__military_office')"
                      >
                        А -> Я
                      </button>
                    </li>
                    <li>
                      <button
                        class="dropdown-item"
                        @click="
                          setOrdering('-military_office__military_office')
                        "
                      >
                        Я -> А
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </th>
          </tr>
          <tr>
            <th></th>
            <th style="min-width: 200px">
              <v-select
                v-model="searchForm.educational_institution__in"
                :options="orderedEducationalInstitutions"
                label="educational_institution"
                :reduce="(institution) => institution.id"
                multiple
              />
            </th>
            <th>
              <v-select
                v-model="searchForm.component_organ__in"
                :options="orderedComponentOrgans"
                label="component_name"
                :reduce="(component_organ) => component_organ.id"
                multiple
              />
            </th>
            <th>
              <v-select
                v-model="searchForm.arrived_from_go_rovd__in"
                :options="orderedGorovds"
                label="go_rovd_name"
                :reduce="(go_rovd) => go_rovd.id"
                multiple
              />
            </th>
            <th>
              <select class="form-select" v-model="searchForm.gender">
                <option selected value="">-------</option>
                <option value="1" key="1">Мужской</option>
                <option value="0" key="0">Женский</option>
              </select>
            </th>
            <th>
              <input
                type="text"
                class="form-control"
                v-model="searchForm.last_name_rus__icontains"
              />
            </th>
            <th>
              <input
                type="text"
                class="form-control"
                v-model="searchForm.first_name_rus__icontains"
              />
            </th>
            <th>
              <input
                type="text"
                class="form-control"
                v-model="searchForm.patronymic_rus__icontains"
              />
            </th>

            <th>
              <div class="d-flex justify-content-center align-items-center">
                <input
                  type="date"
                  class="form-control me-2"
                  v-model="searchForm.date_of_birth__gte"
                />
                <input
                  type="date"
                  class="form-control"
                  v-model="searchForm.date_of_birth__lte"
                />
              </div>
            </th>
            <th>
              <div class="d-flex justify-content-center align-items-center">
                <input
                  type="text"
                  class="form-control me-2"
                  v-model="searchForm.age_gte"
                />
                <input
                  type="text"
                  class="form-control"
                  v-model="searchForm.age_lte"
                />
              </div>
            </th>
            <th>
              <input
                type="text"
                class="form-control me-2"
                v-model="searchForm.place_of_birth__icontains"
              />
            </th>
            <th>
              <input
                type="text"
                class="form-control me-2"
                v-model="searchForm.address_registration__icontains"
              />
            </th>
            <th>
              <input
                type="text"
                class="form-control me-2"
                v-model="searchForm.address_residence__icontains"
              />
            </th>
            <th>
              <input
                type="text"
                class="form-control me-2"
                v-model="searchForm.phone_number__icontains"
              />
            </th>

            <th>
              <input
                type="text"
                class="form-control me-2"
                v-model="searchForm.passport_number__icontains"
              />
            </th>
            <th>
              <div class="d-flex justify-content-center align-items-center">
                <input
                  type="date"
                  class="form-control me-2"
                  v-model="searchForm.passport_issue_date__gte"
                />
                <input
                  type="date"
                  class="form-control"
                  v-model="searchForm.passport_issue_date__lte"
                />
              </div>
            </th>
            <th>
              <div class="d-flex justify-content-center align-items-center">
                <input
                  type="date"
                  class="form-control me-2"
                  v-model="searchForm.passport_validity_period__gte"
                />
                <input
                  type="date"
                  class="form-control"
                  v-model="searchForm.passport_validity_period__lte"
                />
              </div>
            </th>
            <th>
              <v-select
                v-model="searchForm.passport_issue_authority__in"
                :options="orderedPassportIssueAuthorities"
                label="passport_issue_authority"
                :reduce="
                  (passport_issue_authority) => passport_issue_authority.id
                "
                multiple
              />
            </th>
            <th>
              <input
                type="text"
                class="form-control me-2"
                v-model="searchForm.identification_number__icontains"
              />
            </th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th>
              <select
                class="form-select"
                v-model="searchForm.foreign_language_was"
              >
                <option selected value="">-------</option>
                <option
                  v-for="foreignLanguage in orderedForeignLanguages"
                  :value="foreignLanguage.id"
                  :key="foreignLanguage.id"
                >
                  {{ foreignLanguage.foreign_language }}
                </option>
              </select>
            </th>
            <th>
              <select
                class="form-select"
                v-model="searchForm.foreign_language_will_be"
              >
                <option selected value="">-------</option>
                <option
                  v-for="foreignLanguage in orderedForeignLanguages"
                  :value="foreignLanguage.id"
                  :key="foreignLanguage.id"
                >
                  {{ foreignLanguage.foreign_language }}
                </option>
              </select>
            </th>

            <th>
              <div class="d-flex justify-content-center align-items-center">
                <input
                  type="date"
                  class="form-control me-2"
                  v-model="searchForm.removed_from_military_registration__gte"
                />
                <input
                  type="date"
                  class="form-control"
                  v-model="searchForm.removed_from_military_registration__lte"
                />
              </div>
            </th>
            <th style="min-width: 300px">
              <v-select
                v-model="searchForm.military_office__in"
                :options="orderedMilitaryOffices"
                label="military_office"
                :reduce="(military_office) => military_office.id"
                multiple
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="cadet in orderedMainList"
            :key="cadet.id"
            @dblclick="
              $router.push({
                name: 'entrance-cadet-input-form',
                params: { id: cadet.id },
              })
            "
          >
            <td class="text-center">{{ cadet.serial_number }}</td>
            <td>{{ cadet.get_educational_institution }}</td>
            <td>{{ cadet.get_component_organ }}</td>
            <td>{{ cadet.get_arrived_from_go_rovd }}</td>
            <td>{{ cadet.get_gender }}</td>
            <td>{{ cadet.last_name_rus }}</td>
            <td>{{ cadet.first_name_rus }}</td>
            <td>{{ cadet.patronymic_rus }}</td>
            <td class="text-center">{{ cadet.date_of_birth }}</td>
            <td class="text-center">{{ cadet.get_age }}</td>
            <td>{{ cadet.place_of_birth }}</td>
            <td>{{ cadet.address_registration }}</td>
            <td>{{ cadet.address_residence }}</td>
            <td>{{ cadet.phone_number }}</td>
            <td>{{ cadet.passport_number }}</td>
            <td class="text-center">{{ cadet.passport_issue_date }}</td>
            <td class="text-center">{{ cadet.passport_validity_period }}</td>
            <td>{{ cadet.passport_issue_authority }}</td>
            <td>{{ cadet.identification_number }}</td>
            <td>{{ cadet.father_last_name }}</td>
            <td>{{ cadet.father_first_name }}</td>
            <td>{{ cadet.father_patronymic }}</td>
            <td class="text-center">{{ cadet.father_date_of_birth }}</td>
            <td>{{ cadet.father_place_of_work }}</td>
            <td>{{ cadet.father_phone_number }}</td>
            <td>{{ cadet.mother_last_name }}</td>
            <td>{{ cadet.mother_first_name }}</td>
            <td>{{ cadet.mother_patronymic }}</td>
            <td class="text-center">{{ cadet.mother_date_of_birth }}</td>
            <td>{{ cadet.mother_place_of_work }}</td>
            <td>{{ cadet.mother_phone_number }}</td>
            <td>{{ cadet.get_foreign_language_was }}</td>
            <td>{{ cadet.get_foreign_language_will_be }}</td>
            <td class="text-center">
              {{ cadet.removed_from_military_registration }}
            </td>
            <td>
              <span class="text-nowrap">{{ cadet.get_military_office }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="my-3"></div>
  </div>
</template>

<script>
import NavigationLayout from "@/components/layouts/NavigationLayout.vue"
import { globalCadetAPIForEntranceInstance } from "@/api/cadet/cadetAPI.js"
import { debounce } from "lodash/function"
import { mapGetters } from "vuex"

export default {
  name: "EntranceCadetTableView",
  data() {
    return {
      isLoading: true,
      isError: false,
      fieldsForDataExport: [
        { fieldName: "Фамилия", fieldValue: "last_name_rus" },
        { fieldName: "Имя", fieldValue: "first_name_rus" },
        { fieldName: "Отчество", fieldValue: "patronymic_rus" },
        { fieldName: "Дата рождения", fieldValue: "date_of_birth" },
        { fieldName: "Возраст", fieldValue: "get_age" },
        { fieldName: "Пол", fieldValue: "get_gender" },
        {
          fieldName: "Комплектующий орган",
          fieldValue: "get_component_organ",
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
          fieldName: "Прибыл из ГО-РОВД",
          fieldValue: "get_arrived_from_go_rovd",
        },
      ],
      selectedFieldsForDataExport: ["last_name_rus", "first_name_rus"],
      searchForm: Object.assign(
        {},
        globalCadetAPIForEntranceInstance.searchObj,
      ),
      BACKEND_PROTOCOL: import.meta.env.VITE_APP_BACKEND_PROTOCOL,
      BACKEND_HOST: import.meta.env.VITE_APP_BACKEND_HOST,
      BACKEND_PORT: import.meta.env.VITE_APP_BACKEND_PORT,
      cadetList: { count: 0, results: [], previous: null, next: null },
      cadetAPIInstance: globalCadetAPIForEntranceInstance,
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
      this.setSerialNumbers()
    },
    async loadMoreData() {
      const listElem = this.$refs["infinite_list"]
      if (
        listElem.scrollTop + listElem.clientHeight >=
        listElem.scrollHeight - 1
      ) {
        if (this.cadetList.next) {
          this.isLoading = true
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
            this.isLoading = false
          }
        }
      }
    },
    setSerialNumbers() {
      let i = 1
      this.cadetList.results.forEach((item) => {
        item.serial_number = i
        i++
      })
    },
    debouncedSearch: debounce(async function () {
      this.isLoading = true
      this.cadetAPIInstance.searchObj = Object.assign({}, this.searchForm)
      try {
        const cadetAResponse = await this.cadetAPIInstance.getItemsList()
        this.cadetList = await cadetAResponse.data
        this.setSerialNumbers()
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    }, 500),
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
    clearFilter() {
      this.searchForm = Object.assign(
        {},
        this.cadetAPIInstance.searchObjDefault,
      )
    },
    setOrdering(fieldName) {
      this.searchForm.ordering = fieldName
    },
  },
  computed: {
    orderedMainList() {
      return this.cadetList.results
    },
    orderedComponentOrgans() {
      return this.componentOrgans.results
    },
    orderedPassportIssueAuthorities() {
      return this.passportIssueAuthorities.results
    },
    orderedForeignLanguages() {
      return this.foreignLanguages.results
    },
    orderedMilitaryOffices() {
      return this.militaryOffices.results
    },
    orderedGraduationReasons() {
      return this.graduationReasons.results
    },
    orderedEducationalInstitutions() {
      return this.educationalInstitutions.results
    },
    orderedGorovds() {
      return this.gorovds.results
    },
    ...mapGetters({
      componentOrgans: "componentOrgans/getList",
      passportIssueAuthorities: "passportAuthorities/getList",
      foreignLanguages: "foreignLanguages/getList",
      militaryOffices: "militaryOffices/getList",
      graduationReasons: "graduationReasons/getList",
      educationalInstitutions: "educationalInstitutions/getList",
      gorovds: "gorovds/getList",
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

<style scoped>
#infinite_list th,
td {
  min-width: 200px;
  text-align: start;
  vertical-align: middle;
}

thead {
  position: sticky;
  top: 0;
}

input,
select {
  min-width: 200px;
}

z-index-select {
  z-index: 1000;
}
</style>
