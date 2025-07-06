<template>
  <base-list-layout
    :is-loading="isLoading"
    :main-list-length="studentList.count"
    title="Главная"
    :load-more-data="loadMoreData"
  >
    <template v-slot:add-button>
      <div class="dropdown">
        <button
          class="btn btn-secondary dropdown-toggle me-2"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Сформировать документ
        </button>
        <ul class="dropdown-menu">
          <li>
            <button class="dropdown-item" @click="get_examination_reports">
              Ведомость
            </button>
          </li>
          <li>
            <button class="dropdown-item" @click="get_group_list">
              Список
            </button>
          </li>
        </ul>
      </div>
      <button class="btn btn-warning" @click="showStudentAddModal">
        Добавить запись
      </button>
    </template>

    <template v-slot:modals>
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
                Добавление записи
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <form @submit.prevent="addNewStudent">
              <div class="modal-body">
                <div class="mb-3">
                  <label for="last_name_rus" class="form-label">Фамилия</label>
                  <input
                    type="text"
                    class="form-control"
                    id="last_name_rus"
                    v-model="studentNewForm.last_name_rus"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="first_name_rus" class="form-label">Имя</label>
                  <input
                    type="text"
                    class="form-control"
                    id="first_name_rus"
                    v-model="studentNewForm.first_name_rus"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="date_of_birth" class="form-label"
                    >Дата рождения</label
                  >
                  <input
                    type="date"
                    class="form-control"
                    id="date_of_birth"
                    v-model="studentNewForm.date_of_birth"
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
        <th scope="col"></th>
        <th scope="col">Фамилия, имя, отчество</th>
        <th scope="col">Группа</th>
        <th scope="col">Период обучения</th>
      </tr>
    </template>
    <template v-slot:tbody>
      <tr
        class="align-middle"
        v-for="student in orderedStudents"
        :key="student.id"
        @dblclick="
          $router.push({ name: 'student-update', params: { id: student.id } })
        "
      >
        <td class="text-start">
          <span v-if="student.is_active">
            <img
              v-if="student.photo"
              :src="student.photo"
              class="img-thumbnail"
              alt="..."
              style="width: 50px"
            />
            <img
              v-else
              src="../../assets/without_photo.jpg"
              class="img-thumbnail"
              alt="..."
              style="width: 50px"
            />
          </span>
          <span v-else style="display: block; width: 50px" class="text-center">
            <font-awesome-icon
              :icon="['fas', 'lock']"
              style="margin-right: auto; margin-left: auto"
            />
          </span>
        </td>
        <td>
          {{ student.last_name_rus }}<br />
          {{ student.first_name_rus }}<br />{{ student.patronymic_rus }}
        </td>
        <td>{{ student.get_group }}</td>
        <td>
          {{ student.academy_start_date }} - <br />
          {{ student.academy_end_date }}
        </td>
      </tr>
    </template>

    <template v-slot:paginator> </template>
    <template v-slot:search-form>
      <div class="mb-3">
        <label for="last_name_rus" class="form-label">Активная запись</label>

        <select
          class="form-select"
          aria-label="Default select example"
          v-model="searchForm.is_active"
        >
          <option selected value="">Все</option>
          <option value="1">Да</option>
          <option value="0">Нет</option>
        </select>
      </div>
      <div class="mb-3">
        <label for="last_name_rus" class="form-label">Фамилия</label>
        <input
          type="text"
          id="last_name_rus"
          class="form-control"
          v-model="searchForm.last_name_rus__icontains"
          autocomplete="false"
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
      <div class="mb-3">
        <label for="subdivision" class="form-label">Группа</label>
        <v-select
          v-model="searchForm.group__in"
          :options="orderedGroups"
          label="group_name"
          :reduce="(group) => group.id"
          multiple
        />
      </div>
      <div class="mb-3">
        <label for="subdivision" class="form-label">Звание</label>
        <v-select
          v-model="searchForm.current_rank__in"
          :options="orderedRanks"
          label="rank"
          :reduce="(rank) => rank.id"
          multiple
        />
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

      <button type="button" class="btn btn-primary" @click="clearFilter">
        Сбросить фильтр
      </button>
    </template>
  </base-list-layout>
</template>

<script>
import { globalStudentAPIInstance } from "@/api/student/studentAPI"

import getSubdivisionAPIInstance from "@/api/cadet/subdivisionAPI"
import getGroupAPIInstance from "@/api/cadet/groupAPI"
import getRankAPIInstance from "@/api/cadet/rankAPI"
import getSpecialityAPIInstance from "@/api/cadet/specialityAPI"
import getPositionAPIInstance from "@/api/cadet/positionAPI"
import BaseListLayout from "@/components/layouts/BaseListLayout.vue"
import { debounce } from "lodash/function"
import { getLoadListFunction } from "../../../utils"
import BaseListLayoutForCadetUpdate from "@/components/layouts/BaseListLayoutForCadetUpdate.vue"

import { mapGetters } from "vuex"

export default {
  name: "StudentList",
  components: {
    BaseListLayoutForCadetUpdate,
    BaseListLayout,
  },
  data() {
    return {
      studentList: { count: "", results: [], previous: null, next: null },
      isLoading: true,
      isError: false,
      BACKEND_PROTOCOL: import.meta.env.VITE_APP_BACKEND_PROTOCOL,
      BACKEND_HOST: import.meta.env.VITE_APP_BACKEND_HOST,
      BACKEND_PORT: import.meta.env.VITE_APP_BACKEND_PORT,
      studentAPIInstance: globalStudentAPIInstance,
      subdivisionAPIInstance: getSubdivisionAPIInstance(),
      groupAPIInstance: getGroupAPIInstance(),
      rankAPIInstance: getRankAPIInstance(),
      specialityAPIInstance: getSpecialityAPIInstance(),
      positionAPIInstance: getPositionAPIInstance(),
      searchForm: Object.assign({}, globalStudentAPIInstance.searchObj),
      studentNewForm: {
        last_name_rus: "",
        first_name_rus: "",
        date_of_birth: null,
      },
    }
  },
  async created() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      const listFunction = getLoadListFunction.bind(this)
      this.isLoading = true
      this.isError = false
      try {
        const [students] = await Promise.all([listFunction("student")()]).catch(
          () => (this.isError = true),
        )
        this.studentList = students
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    debouncedSearch: debounce(async function () {
      this.isLoading = true
      this.studentAPIInstance.searchObj = this.searchForm
      try {
        const studentResponse = await this.studentAPIInstance.getItemsList()
        this.studentList = await studentResponse.data
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    }, 500),
    clearFilter() {
      this.searchForm = Object.assign(
        {},
        this.studentAPIInstance.searchObjDefault,
      )
    },

    async loadMoreData(entries, observer) {
      if (entries[0].isIntersecting) {
        if (this.studentList) {
          if (this.studentList.next) {
            try {
              const response = await this.studentAPIInstance.updateList(
                this.studentList.next,
              )

              const newData = await response.data
              this.studentList.results = [
                ...this.studentList.results,
                ...newData.results,
              ]
              this.studentList.next = newData.next
              this.studentList.previous = newData.previous
              this.setSerialNumbers()
            } catch (error) {
              this.isError = true
            } finally {
            }
          }
        }
      }
    },

    get_examination_reports(destination) {
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
      window.open(
        `${this.BACKEND_PROTOCOL}://${this.BACKEND_HOST}:${this.BACKEND_PORT}/api/student-list-export/${queryString}`,
        "_blank",
      )
    },
  },

  computed: {
    orderedStudents() {
      return this.studentList.results
    },
    orderedGroups() {
      return this.groups.results
    },
    orderedRanks() {
      return this.ranks.results
    },
    ...mapGetters({
      groups: "groups/getList",
      ranks: "ranks/getList",
      positions: "positions/getList",
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
