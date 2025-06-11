<template>
  <base-list-layout
    :is-loading="isLoading"
    :main-list-length="studentList.count"
    title="Отчеты"
    :load-more-data="loadMoreData"
  >
    <template v-slot:search-form-horizontal>
      <div class="container">
        <div class="row">
          <div class="col">
            <div class="mb-3">
              <label for="last_name_rus" class="form-label"
                >Активная запись</label
              >
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
          </div>
          <div class="col">
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
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="mb-3">
              <label for="subdivision" class="form-label">Курс</label>
              <select class="form-select" v-model="searchForm.year">
                <option value="">-----</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
          </div>
          <div class="col">
            <div class="mb-3">
              <label for="subdivision" class="form-label">Литера</label>
              <select class="form-select" v-model="searchForm.year_litera">
                <option value="">-----</option>
                <option value="А">А</option>
                <option value="В">В</option>
              </select>
            </div>
          </div>
          <div class="col">
            <div class="mb-3">
              <label for="subdivision" class="form-label">Группа</label>
              <v-select
                v-model="searchForm.group"
                :options="orderedGroups"
                label="group_name"
                :reduce="(group) => group.id"
              />
            </div>
          </div>
        </div>
        <div class="d-flex flex-row">
          <button
            type="button"
            class="btn btn-primary me-2"
            @click="clearFilter"
          >
            Сбросить фильтр
          </button>
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
        </div>
      </div>
    </template>

    <template v-slot:add-button> </template>

    <template v-slot:thead>
      <tr>
        <th scope="col"></th>
        <th scope="col">Фамилия, имя, отчество</th>
        <th scope="col">Группа</th>
        <th scope="col">Курс</th>
        <th scope="col">Литера</th>
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
          <router-link
            :to="{
              name: 'student-update',
              params: { id: student.id },
            }"
          >
            {{ student.last_name_rus }}<br />
            {{ student.first_name_rus }}<br />{{ student.patronymic_rus }}
          </router-link>
        </td>
        <td>{{ student.get_group }}</td>
        <td>{{ student.year }}</td>
        <td>{{ student.year_litera }}</td>
        <td>
          {{ student.academy_start_date }} - <br />
          {{ student.academy_end_date }}
        </td>
      </tr>
    </template>

    <template v-slot:paginator> </template>
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
  name: "StudentDocsMakeView",
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
    async loadMoreData() {
      const listElem = document.getElementById("infinite_list")
      if (
        listElem.scrollTop + listElem.clientHeight >=
        listElem.scrollHeight - 1
      ) {
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
