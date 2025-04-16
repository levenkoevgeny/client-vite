<template>
  <base-list-layout
    :is-loading="isLoading"
    :main-list-length="employeeList.count"
    title="Главная"
    :load-more-data="null"
  >
    <template v-slot:modals>
      <div
        class="modal fade"
        id="birthdayTodayModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        ref="birthdayTodayModal"
      >
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                День рождения сегодня
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div class="modal-body">
              <table class="table" v-if="birthDays.length > 0">
                <tbody>
                  <tr v-for="employee in birthDays" :key="employee.id">
                    <td>{{ employee.last_name_rus }}</td>
                    <td>{{ employee.first_name_rus }}</td>
                    <td>{{ employee.patronymic_rus }}</td>
                    <td>{{ employee.get_subdivision }}</td>
                    <td>{{ employee.get_age }} (лет)</td>
                  </tr>
                </tbody>
              </table>
              <p v-else>Список пуст</p>
            </div>
            <div class="modal-footer"></div>
          </div>
        </div>
      </div>
    </template>

    <template v-slot:thead>
      <tr>
        <th scope="col"></th>
        <th scope="col">Фамилия, имя, отчество</th>
        <th scope="col">Дата рождения</th>
        <th scope="col">Звание</th>
        <th scope="col">Должность</th>
      </tr>
    </template>
    <template v-slot:tbody>
      <tr
        class="align-middle"
        v-for="employee in orderedEmployees"
        :key="employee.id"
        @dblclick="
          $router.push({ name: 'employee-update', params: { id: employee.id } })
        "
      >
        <td>
          <img
            v-if="employee.photo"
            :src="employee.photo"
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
        </td>
        <td>
          <router-link
            :to="{
              name: 'employee-view',
              params: { id: employee.id },
            }"
          >
            {{ employee.last_name_rus }}<br />
            {{ employee.first_name_rus }}<br />{{ employee.patronymic_rus }}
          </router-link>
        </td>
        <td>
          {{
            new Date(employee.date_of_birth).toLocaleString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          }}
        </td>
        <td>{{ employee.get_rank }}</td>
        <td>{{ employee.get_position }}</td>
      </tr>
    </template>

    <template v-slot:search-form>
      <div class="mb-3">
        <label for="last_name_rus" class="form-label">Активная запись</label>
        <select
          class="form-select"
          aria-label="Default select example"
          v-model="searchForm.is_active"
        >
          <option selected value="">Все</option>
          <option value="true">Да</option>
          <option value="false">Нет</option>
        </select>
      </div>
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
        <label for="subdivision" class="form-label">Подразделение</label>
        <v-select
          v-model="searchForm.subdivision__in"
          :options="orderedEmployeeSubdivisions"
          label="subdivision_name"
          :reduce="(subdivision) => subdivision.id"
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

    <template v-slot:table-mode-button>
      <button
        type="button"
        class="btn btn-warning"
        title="ДР сегодня"
        @click="showBirthdaysModal"
      >
        <font-awesome-icon :icon="['fas', 'cake-candles']" />
      </button>
    </template>
  </base-list-layout>
</template>

<script>
import { globalEmployeeAPIInstance } from "@/api/employee/employeeAPI"
import BaseListLayout from "@/components/layouts/BaseListLayout.vue"

import { mapGetters } from "vuex"
import BaseListLayoutForCadetUpdate from "@/components/layouts/BaseListLayoutForCadetUpdate.vue"
import { PaginatorView } from "@/components/common"
import { getLoadListFunction } from "../../../utils"
import { debounce } from "lodash/function"

export default {
  name: "EmployeeList",
  components: {
    BaseListLayoutForCadetUpdate,
    BaseListLayout,
    PaginatorView,
  },
  data() {
    return {
      employeeList: { count: 0, results: [], previous: null, next: null },
      birthDays: [],
      isLoading: true,
      isError: false,
      BACKEND_PROTOCOL: import.meta.env.VITE_APP_BACKEND_PROTOCOL,
      BACKEND_HOST: import.meta.env.VITE_APP_BACKEND_HOST,
      BACKEND_PORT: import.meta.env.VITE_APP_BACKEND_PORT,
      employeeAPIInstance: globalEmployeeAPIInstance,
      searchForm: Object.assign({}, globalEmployeeAPIInstance.searchObj),
      employeeNewForm: {
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
        const [employees] = await Promise.all([
          listFunction("employee")(null, null),
        ]).catch(() => (this.isError = true))
        this.employeeList = employees
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    debouncedSearch: debounce(async function () {
      this.isLoading = true
      this.employeeAPIInstance.searchObj = this.searchForm
      try {
        const employeeResponse = await this.employeeAPIInstance.getItemsList()
        this.employeeList = await employeeResponse.data
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    }, 500),

    clearFilter() {
      this.searchForm = Object.assign(
        {},
        this.employeeAPIInstance.searchObjDefault,
      )
    },
    async showBirthdaysModal() {
      const response = await this.$axios.get(
        `${this.BACKEND_PROTOCOL}://${this.BACKEND_HOST}:${this.BACKEND_PORT}/api/birthdays/`,
      )
      this.birthDays = await response.data
      let addModal = this.$refs.birthdayTodayModal
      let myModal = new bootstrap.Modal(addModal, {
        keyboard: false,
      })
      myModal.show()
    },
  },
  computed: {
    orderedEmployees() {
      return this.employeeList.results
    },
    orderedEmployeeSubdivisions() {
      return this.subdivisions.results.filter(
        (subdivision) => subdivision.subdivision_category == "2",
      )
    },
    ...mapGetters({
      subdivisions: "subdivisions/getList",
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
