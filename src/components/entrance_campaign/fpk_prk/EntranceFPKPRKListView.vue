<template>
  <base-list-layout
    :is-loading="isLoading"
    :main-list-length="fpk_prk_mag_List.count"
    title="Личные дела"
    :load-more-data="null"
  >
    <template v-slot:add-button>
      <button class="btn btn-warning" @click="showFPKAddModal">
        Добавить личное дело
      </button>
    </template>
    <template v-slot:modals>
      <div
        class="modal fade"
        id="fpkAddModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        ref="fpkAddModal"
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

            <form @submit.prevent="addNewFPKPRKForEntrance">
              <div class="modal-body">
                <div class="mb-3">
                  <label for="id_last_name_rus" class="form-label"
                    >Фамилия</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="id_last_name_rus"
                    v-model="fpkNewForm.last_name_rus"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="id_first_name_rus" class="form-label">Имя</label>
                  <input
                    type="text"
                    class="form-control"
                    id="id_first_name_rus"
                    v-model="fpkNewForm.first_name_rus"
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
                    v-model="fpkNewForm.patronymic_rus"
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
                    v-model="fpkNewForm.date_of_birth"
                    required
                  />
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                  ref="fpkAddModalCloseButton"
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
        v-for="fpk in orderedFPKPRK"
        :key="fpk.id"
        @dblclick="
          $router.push({
            name: 'entrance-fpk-prk-mag-input-form',
            params: { id: fpk.id },
          })
        "
      >
        <td>
          {{ fpk.last_name_rus }}
        </td>
        <td>
          {{ fpk.first_name_rus }}
        </td>
        <td>
          {{ fpk.patronymic_rus }}
        </td>
        <td>{{ fpk.date_of_birth }}</td>
        <td>{{ fpk.get_component_organ }}</td>
      </tr>
    </template>

    <template v-slot:search-form>
      <div class="mb-3">
        <label for="id_fpk_mag_choice" class="form-label">ФПКиПРК / МАГ</label>
        <select
          class="form-select"
          id="id_fpk_mag_choice"
          v-model="searchForm.fpk_mag_choice"
        >
          <option value="">-----</option>
          <option value="1">ФПК и ПРК</option>
          <option value="2">МАГ</option>
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
        <label class="form-label">Комплектующий орган</label>
        <v-select
          v-model="searchForm.component_organ__in"
          :options="orderedComponentOrgans"
          label="component_name"
          :reduce="(orderedComponentOrgan) => orderedComponentOrgan.id"
          multiple
        />
      </div>
      <div class="mb-3">
        <label class="form-label">Пол</label>
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
            <label for="age_gte" class="form-label">Возраст (с)</label>
            <input
              type="number"
              class="form-control"
              id="age_gte"
              v-model="searchForm.age_gte"
            />
          </div>
        </div>
        <div class="col-6">
          <div class="mb-3">
            <label for="age_lte" class="form-label">Возраст (по)</label>
            <input
              type="number"
              class="form-control"
              id="age_lte"
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
import { globalFPKPRKStudentAPIForEntranceInstance } from "@/api/fpkprk/fpk_prk_studentAPI.js"
import { debounce } from "lodash/function"
import { mapGetters } from "vuex"
import BaseListLayout from "@/components/layouts/BaseListLayout.vue"
export default {
  name: "EntranceFPKPRKListView",
  components: { NavigationLayout, BaseListLayout },
  data() {
    return {
      isLoading: true,
      isError: false,
      currentTime: new Date(),
      BACKEND_PROTOCOL: import.meta.env.VITE_APP_BACKEND_PROTOCOL,
      BACKEND_HOST: import.meta.env.VITE_APP_BACKEND_HOST,
      BACKEND_PORT: import.meta.env.VITE__APP_BACKEND_PORT,
      fpk_prk_mag_List: { count: 0, results: [], previous: null, next: null },
      fpk_prk_studentAPIInstance: globalFPKPRKStudentAPIForEntranceInstance,
      searchForm: Object.assign(
        {},
        globalFPKPRKStudentAPIForEntranceInstance.searchObj,
      ),
      fpkNewForm: {
        category: 3,
        last_name_rus: "",
        first_name_rus: "",
        patronymic_rus: "",
        date_of_birth: null,
        entrance_year: new Date().getFullYear(),
      },
    }
  },
  async created() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      this.isLoading = true
      const response = await this.fpk_prk_studentAPIInstance.getItemsList()
      this.fpk_prk_mag_List = await response.data
      this.isLoading = false
    },
    showFPKAddModal() {
      let addModal = this.$refs.fpkAddModal
      let myModal = new bootstrap.Modal(addModal, {
        keyboard: false,
      })
      myModal.show()
    },
    async addNewFPKPRKForEntrance() {
      this.isLoading = true
      const response = await this.fpk_prk_studentAPIInstance.addItem(
        this.fpkNewForm,
      )
      const newItem = response.data
      this.fpk_prk_mag_List.results.unshift(newItem)
      this.fpk_prk_mag_List.count = this.fpk_prk_mag_List.count + 1
      this.$refs.fpkAddModalCloseButton.click()
      this.fpkNewForm = {
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
      this.fpk_prk_studentAPIInstance.searchObj = this.searchForm
      const response = await this.fpk_prk_studentAPIInstance.getItemsList()
      this.fpk_prk_mag_List = await response.data
      this.isLoading = false
    }, 500),
    clearFilter() {
      this.searchForm = Object.assign(
        {},
        this.fpk_prk_studentAPIInstance.searchObjDefault,
      )
    },
  },
  computed: {
    orderedFPKPRK() {
      return this.fpk_prk_mag_List.results
    },
    orderedComponentOrgans() {
      return this.componentOrgans.results
    },
    ...mapGetters({
      groups: "groups/getList",
      profiling: "profiling/getList",
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

<style scoped>
>>> {
  --vs-controls-color: #664cc3;
  --vs-border-color: #664cc3;

  --vs-dropdown-bg: #282c34;
  --vs-dropdown-color: #cc99cd;
  --vs-dropdown-option-color: #cc99cd;

  --vs-selected-bg: #664cc3;
  --vs-selected-color: #eeeeee;

  --vs-search-input-color: #eeeeee;

  --vs-dropdown-option--active-bg: #664cc3;
  --vs-dropdown-option--active-color: #eeeeee;
}
</style>
