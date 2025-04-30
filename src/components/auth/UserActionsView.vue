<template>
  <base-list-layout
    :is-loading="isLoading"
    :main-list-length="mainItemList.count"
    title="Действия пользователей"
    :load-more-data="loadMoreData"
  >
    <template v-slot:modals>
      <!-- add modal-->
    </template>
    <template v-slot:add-button> </template>
    <template v-slot:thead>
      <tr>
        <th>Пользователь</th>
        <th>Вид действия</th>
        <th>Действие</th>
        <th>Таблица БД</th>
        <th>Запись БД</th>
        <th>Дата и время действия</th>
      </tr>
    </template>
    <template v-slot:tbody>
      <tr v-for="action in orderedMainList" :key="action.id">
        <td>{{ action.get_user }}</td>
        <td>{{ action.get_action_type }}</td>
        <td>{{ action.action }}</td>
        <td>{{ action.get_model_verbose_name }}</td>
        <td>{{ action.record_verbose_name }}</td>
        <td>
          {{
            new Date(action.date_time_created).toLocaleString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
            })
          }}
        </td>
      </tr>
    </template>
    <template v-slot:search-form>
      <div class="row">
        <div class="col-12">
          <div class="mb-3">
            <label for="id_action_type_search" class="form-label"
              >Вид действия</label
            >
            <select
              id="id_action_type_search"
              class="form-select"
              v-model="searchForm.action_type"
            >
              <option value="">-----</option>
              <option value="0" key="0">Создание записи</option>
              <option value="1" key="1">Редактирование записи</option>
              <option value="2" key="2">Удаление записи</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="id_user_search" class="form-label">Пользователь</label>
            <select
              id="id_user_search"
              class="form-select"
              v-model="searchForm.user"
            >
              <option value="">-----</option>
              <option
                :value="user.id"
                :key="user.id"
                v-for="user in orderedUsersList"
              >
                {{ user.username }}
              </option>
            </select>
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
import getActionHistoryAPIInstance from "@/api/cadet/actionHistoryAPI.js"
import getUsersAPIInstance from "@/api/auth/usersAPI.js"
import { mapGetters } from "vuex"
import BaseListLayout from "@/components/layouts/BaseListLayout.vue"
import { debounce } from "lodash/function"

export default {
  name: "UserActionsView",
  components: {
    BaseListLayout,
  },
  data() {
    return {
      mainItemAPIInstance: getActionHistoryAPIInstance(),
      usersAPIInstance: getUsersAPIInstance(),
      mainItemList: { count: 0, results: [], previous: null, next: null },
      usersList: { count: 0, results: [], previous: null, next: null },
      isLoading: true,
      BACKEND_PROTOCOL: import.meta.env.VITE_APP_BACKEND_PROTOCOL,
      BACKEND_HOST: import.meta.env.VITE_APP_BACKEND_HOST,
      BACKEND_PORT: import.meta.env.VITE_APP_BACKEND_PORT,
      searchForm: Object.assign({}, getActionHistoryAPIInstance().searchObj),
    }
  },
  async created() {
    await this.loadData()
  },

  methods: {
    async loadData() {
      this.isLoading = true
      try {
        const response = await this.mainItemAPIInstance.getItemsList()
        this.mainItemList = await response.data
        const responseUser = await this.usersAPIInstance.getItemsList()
        this.usersList = await responseUser.data
      } catch (error) {
      } finally {
        this.isLoading = false
      }
    },
    debouncedSearch: debounce(async function () {
      this.isLoading = true
      this.mainItemAPIInstance.searchObj = this.searchForm
      try {
        const userResponse = await this.mainItemAPIInstance.getItemsList()
        this.mainItemList = userResponse.data
      } catch (e) {
      } finally {
        this.isLoading = false
      }
    }, 500),
    clearFilter() {
      this.searchForm = Object.assign(
        {},
        this.mainItemAPIInstance.searchObjDefault,
      )
    },
    async loadMoreData() {
      const listElem = document.getElementById("infinite_list")
      if (
        listElem.scrollTop + listElem.clientHeight >=
        listElem.scrollHeight - 1
      ) {
        if (this.mainItemList.next) {
          try {
            const response = await this.mainItemAPIInstance.updateList(
              this.mainItemList.next,
            )

            const newData = await response.data
            this.mainItemList.results = [
              ...this.mainItemList.results,
              ...newData.results,
            ]
            this.mainItemList.next = newData.next
            this.mainItemList.previous = newData.previous
          } catch (error) {
            this.isError = true
          } finally {
          }
        }
      }
    },
  },
  computed: {
    orderedMainList() {
      return this.mainItemList.results
    },
    orderedUsersList() {
      return this.usersList.results
    },
    ...mapGetters({
      currentAuthUser: "auth/getUser",
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
