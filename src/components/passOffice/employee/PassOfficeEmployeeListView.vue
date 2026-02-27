<template>
  <base-list-layout-for-pass-office
    :is-loading="isLoading"
    :main-list-length="employeeList.count"
    :selected-items-count="0"
    title="Сотрудники и гражданский персонал"
    :load-more-data="loadMoreData"
  >
    <template v-slot:thead>
      <tr ref="thead">
        <th scope="col">Фото</th>
        <th scope="col">Подпись</th>
        <th scope="col">Фамилия</th>
        <th scope="col">Имя</th>
        <th scope="col">Отчество</th>
      </tr>
      <tr>
        <th>
          <select class="form-select" v-model="searchForm.photo_exists">
            <option value="">----</option>
            <option value="true" key="true">Да</option>
            <option value="false" key="false">Нет</option>
          </select>
        </th>
        <th>
          <select class="form-select" v-model="searchForm.sign_image_exists">
            <option value="">----</option>
            <option value="true" key="true">Да</option>
            <option value="false" key="false">Нет</option>
          </select>
        </th>
        <th>
          <input
            type="text"
            class="form-control"
            v-model="searchForm.last_name_rus__icontains"
            style="width: 300px"
          />
        </th>
        <th>
          <input
            type="text"
            class="form-control"
            v-model="searchForm.first_name_rus__icontains"
            style="width: 300px"
          />
        </th>
        <th>
          <input
            type="text"
            class="form-control"
            v-model="searchForm.patronymic_rus__icontains"
            style="width: 300px"
          />
        </th>
      </tr>
    </template>

    <template v-slot:tbody>
      <tr
        class="align-middle"
        v-for="employee in orderedEmployee"
        :key="employee.id"
      >
        <td class="text-center">
          <img
            v-if="employee.photo"
            :src="employee.photo"
            class="img-thumbnail bg-body border-0"
            alt="..."
            style="width: 50px"
          />
          <img
            v-else
            src="../../../assets/without_photo.jpg"
            class="img-thumbnail bg-body border-0"
            alt="..."
            style="width: 50px"
          />
        </td>
        <td class="text-center">
          <span
            v-if="employee.sign_image"
            class="bg-success-subtle p-2 rounded rounded-1"
            >да&nbsp;&nbsp;<font-awesome-icon :icon="['fas', 'check']" /></span
          ><span v-else class="bg-warning-subtle p-2 rounded rounded-1"
            >нет</span
          >
        </td>
        <td>
          <router-link
            :to="{
              name: 'pass-office-employee-update',
              params: { id: employee.id },
            }"
            class="text-decoration-none"
            title="Сделать фото или подпись"
          >
            <font-awesome-icon :icon="['fas', 'camera']" />&nbsp;&nbsp;<span
              class="text-decoration-underline"
              >{{ employee.last_name_rus }}</span
            >
          </router-link>
        </td>
        <td>{{ employee.first_name_rus }}</td>
        <td>{{ employee.patronymic_rus }}</td>
      </tr>
    </template>
    <template v-slot:search-form-clear-button>
      <div class="d-flex flex-row align-items-between align-items-center">
        <div class="me-2">
          <button
            type="button"
            class="btn btn-primary my-4"
            @click="clearFilter"
          >
            <font-awesome-icon :icon="['fas', 'filter']" />&nbsp;&nbsp;Сбросить
            фильтр
          </button>
        </div>
      </div>
    </template>
  </base-list-layout-for-pass-office>
</template>

<script>
import { globalEmployee3VAPIInstance } from "@/api/employee/employee_3v_API.js"
import { mapGetters } from "vuex"
import { debounce } from "lodash/function.js"
import BaseListLayoutForPassOffice from "@/components/layouts/BaseListLayoutForPassOffice.vue"
import Camera from "@/components/passOffice/Camera.vue"

export default {
  name: "PassOfficeEmployeeView",
  components: { Camera, BaseListLayoutForPassOffice },
  data() {
    return {
      employeeList: { count: 0, results: [], previous: null, next: null },
      isLoading: true,
      isError: false,
      employeeAPIInstance: globalEmployee3VAPIInstance,
      searchForm: Object.assign({}, globalEmployee3VAPIInstance.searchObj),
      currentEmployeeForUpdate: {},
      error_list: [],
      lastNameSearch: "",
    }
  },

  async created() {
    await this.loadData()
  },

  methods: {
    async loadData() {
      this.isLoading = true
      const response = await this.employeeAPIInstance.getItemsList()
      this.employeeList = await response.data
      this.isLoading = false
    },
    debouncedSearch: debounce(async function () {
      this.searchForm.limit = 100
      this.employeeAPIInstance.searchObj = this.searchForm
      try {
        const employeeResponse = await this.employeeAPIInstance.getItemsList()
        this.employeeList = await employeeResponse.data
      } catch (e) {
        this.isError = true
      } finally {
      }
    }, 500),
    clearFilter() {
      this.searchForm = Object.assign(
        {},
        this.employeeAPIInstance.searchObjDefault,
      )
    },
    async loadMoreData(entries, observer) {
      if (entries[0].isIntersecting) {
        if (this.employeeList) {
          if (this.employeeList.next) {
            try {
              const response = await this.employeeAPIInstance.updateList(
                this.employeeList.next,
              )

              const newData = await response.data
              this.employeeList.results = [
                ...this.employeeList.results,
                ...newData.results,
              ]
              this.employeeList.next = newData.next
              this.employeeList.previous = newData.previous
              this.setSerialNumbers()
            } catch (error) {
              this.isError = true
            } finally {
            }
          }
        }
      }
    },
  },

  computed: {
    orderedEmployee() {
      return this.employeeList.results
    },
    ...mapGetters({
      isCommonLoading: "common/getIsCommonLoading",
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
