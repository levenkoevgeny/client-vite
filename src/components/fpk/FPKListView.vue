<template>
  <base-list-layout
    :is-loading="isLoading"
    :main-list-length="fpk_mag_List.count"
    title="Главная"
    :load-more-data="loadMoreData"
  >
    <template v-slot:add-button>
      <button class="btn btn-warning" @click="showCadetAddModal">
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

            <form @submit.prevent="addNewCadet">
              <div class="modal-body">
                <div class="mb-3">
                  <label for="last_name_rus" class="form-label">Фамилия</label>
                  <input
                    type="text"
                    class="form-control"
                    id="last_name_rus"
                    v-model="cadetNewForm.last_name_rus"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="first_name_rus" class="form-label">Имя</label>
                  <input
                    type="text"
                    class="form-control"
                    id="first_name_rus"
                    v-model="cadetNewForm.first_name_rus"
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
      <tr ref="thead">
        <th scope="col"></th>
        <th scope="col">Фамилия, имя, отчество</th>
        <th scope="col">Факультет</th>
        <th scope="col">Группа</th>
        <th scope="col">Специальность</th>
        <th scope="col">Период обучения</th>
      </tr>
    </template>
    <template v-slot:tbody>
      <tr
        class="align-middle"
        v-for="cadet in orderedCadets"
        :key="cadet.id"
        @dblclick="
          $router.push({ name: 'fpk-mag-update', params: { id: cadet.id } })
        "
      >
        <td>
          <img
            v-if="cadet.photo"
            :src="cadet.photo"
            class="img-thumbnail bg-body border-0"
            alt="..."
            style="width: 50px"
          />
          <img
            v-else
            src="../../assets/without_photo.jpg"
            class="img-thumbnail bg-body border-0"
            alt="..."
            style="width: 50px"
          />
        </td>
        <td>
          {{ cadet.last_name_rus }}<br />
          {{ cadet.first_name_rus }}<br />{{ cadet.patronymic_rus }}

          <!--          <router-link-->
          <!--            :to="{-->
          <!--              name: 'cadet-view',-->
          <!--              params: { id: cadet.id },-->
          <!--            }"-->
          <!--          >-->
          <!--            {{ cadet.last_name_rus }}<br />-->
          <!--            {{ cadet.first_name_rus }}<br />{{ cadet.patronymic_rus }}-->
          <!--          </router-link>-->
        </td>
        <td>{{ cadet.get_subdivision }}</td>
        <td>{{ cadet.get_group }}</td>
        <td>{{ cadet.get_speciality }}</td>
        <td>
          {{ cadet.academy_start_date }} - <br />
          {{ cadet.academy_end_date }}
        </td>
      </tr>
    </template>

    <template v-slot:search-form>
      <div class="mb-3">
        <label for="gender_search" class="form-label">Категория</label>
        <select
          class="form-select"
          v-model="searchForm.fpk_mag_choice"
          id="gender_search"
        >
          <option selected value="">--------</option>
          <option value="1">ФПКиПРК</option>
          <option value="2">Магистратура</option>
        </select>
      </div>

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
        <label for="last_name_rus_search" class="form-label">Фамилия</label>
        <input
          type="text"
          id="last_name_rus_search"
          class="form-control"
          v-model="searchForm.last_name_rus__icontains"
        />
      </div>
      <div class="mb-3">
        <label for="gender_search" class="form-label">Пол</label>
        <select
          class="form-select"
          v-model="searchForm.gender"
          id="gender_search"
        >
          <option selected value="">--------</option>
          <option value="1">Мужской</option>
          <option value="0">Женский</option>
        </select>
      </div>
      <div class="mb-3">
        <label for="group_search" class="form-label">Группа</label>
        <v-select
          v-model="searchForm.group__in"
          :options="orderedGroups"
          label="group_name"
          :reduce="(group) => group.id"
          multiple
        />
      </div>
      <div class="mb-3">
        <label for="rank_search" class="form-label">Звание</label>
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
            <label for="age_gte_search" class="form-label">Возраст (с)</label>
            <input
              id="age_gte_search"
              type="number"
              class="form-control"
              v-model="searchForm.age_gte"
            />
          </div>
        </div>
        <div class="col-6">
          <div class="mb-3">
            <label for="age_lte_search" class="form-label">Возраст (по)</label>
            <input
              type="number"
              class="form-control"
              id="age_lte_search"
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
import { globalFPKPRKStudentAPIInstance } from "@/api/fpkprk/fpk_prk_studentAPI.js"
import BaseListLayout from "@/components/layouts/BaseListLayout.vue"
import { PaginatorView } from "@/components/common"
import { debounce } from "lodash/function"
import { mapGetters } from "vuex"

export default {
  name: "FPKListView",
  components: { BaseListLayout, PaginatorView },
  data() {
    return {
      fpk_mag_List: { count: 0, results: [], previous: null, next: null },
      isLoading: true,
      isError: false,
      BACKEND_PROTOCOL: import.meta.env.VITE_APP_BACKEND_PROTOCOL,
      BACKEND_HOST: import.meta.env.VITE_APP_BACKEND_HOST,
      BACKEND_PORT: import.meta.env.VITE_APP_BACKEND_PORT,
      fpk_mag_APIInstance: globalFPKPRKStudentAPIInstance,
      searchForm: Object.assign({}, globalFPKPRKStudentAPIInstance.searchObj),
      cadetNewForm: {
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
      this.isLoading = true
      const response = await this.fpk_mag_APIInstance.getItemsList()
      this.fpk_mag_List = await response.data
      this.isLoading = false
    },
    async updatePaginator(url) {
      this.isLoading = true
      try {
        const response = await this.fpk_mag_APIInstance.updateList(url)
        this.fpk_mag_List = await response.data
      } catch (error) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    debouncedSearch: debounce(async function () {
      this.isLoading = true
      this.fpk_mag_APIInstance.searchObj = this.searchForm
      try {
        const cadetAResponse = await this.fpk_mag_APIInstance.getItemsList()
        this.fpk_mag_List = await cadetAResponse.data
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    }, 500),
    clearFilter() {
      this.searchForm = Object.assign(
        {},
        this.fpk_mag_APIInstance.searchObjDefault,
      )
    },
    showCadetAddModal() {
      let addModal = this.$refs.cadetAddModal
      let myModal = new bootstrap.Modal(addModal, {
        keyboard: false,
      })
      myModal.show()
    },
    async addNewCadet() {
      try {
        const response = await this.fpk_mag_APIInstance.addItem(
          this.cadetNewForm,
        )
        const newItem = await response.data
        this.fpk_mag_List.results.unshift(newItem)
        this.$refs.cadetAddModalCloseButton.click()
        this.cadetNewForm = {
          last_name_rus: "",
          first_name_rus: "",
          date_of_birth: null,
        }
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    async loadMoreData() {
      const listElem = document.getElementById("infinite_list")
      if (
        listElem.scrollTop + listElem.clientHeight >=
        listElem.scrollHeight - 1
      ) {
        if (this.fpk_mag_List.next) {
          try {
            const response = await this.fpk_mag_APIInstance.updateList(
              this.fpk_mag_List.next,
            )

            const newData = await response.data
            this.fpk_mag_List.results = [
              ...this.fpk_mag_List.results,
              ...newData.results,
            ]
            this.fpk_mag_List.next = newData.next
            this.fpk_mag_List.previous = newData.previous
            this.setSerialNumbers()
          } catch (error) {
            this.isError = true
          } finally {
          }
        }
      }
    },
  },
  computed: {
    orderedCadets() {
      return this.fpk_mag_List.results
    },
    orderedSubdivisions() {
      return this.subdivisions.results.filter(
        (subdivision) => subdivision.subdivision_category === "1",
      )
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
      subdivisions: "subdivisions/getList",
      specialities: "specialities/getList",
      positions: "positions/getList",
      categories: "personCategories/getList",
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

<style scoped>

</style>
