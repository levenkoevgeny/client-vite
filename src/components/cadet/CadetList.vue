<template>
  <base-list-layout
    :is-loading="isLoading"
    :main-list-length="cadetList.count"
    title="Главная"
    :load-more-data="loadMoreData"
  >
    <template v-slot:add-button>
      <button class="btn btn-warning" @click="showCadetAddModal">
        Добавить запись
      </button>
    </template>
    <template v-slot:table-mode-button>
      <router-link
        :to="{ name: 'cadet-full' }"
        class="fs-3 fw-light link-secondary"
        title="Табличный режим"
      >
        <font-awesome-icon :icon="['fas', 'table']" />
      </router-link>
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
          $router.push({ name: 'cadet-update', params: { id: cadet.id } })
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
        <label for="category_search" class="form-label">Категория</label>
        <select
          id="category_search"
          class="form-select"
          aria-label="Default select example"
          v-model="searchForm.category"
        >
          <option selected value="">--------</option>
          <option
            v-for="category in orderedCadetCategories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.category }}
          </option>
        </select>
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
        <label for="subdivision_search" class="form-label">Факультет</label>
        <v-select
          v-model="searchForm.subdivision__in"
          :options="orderedSubdivisions"
          label="subdivision_short_name"
          :reduce="(subdivision) => subdivision.id"
          multiple
        />
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
      <div class="mb-3">
        <label for="speciality_search" class="form-label">Специальность</label>
        <v-select
          v-model="searchForm.current_speciality__in"
          :options="orderedSpecialities"
          label="speciality_name"
          :reduce="(speciality) => speciality.id"
          multiple
        />
      </div>
      <div class="mb-3">
        <label for="position_search" class="form-label">Должность</label>
        <v-select
          v-model="searchForm.current_position__in"
          :options="orderedPositions"
          label="position"
          :reduce="(position) => position.id"
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
      <div class="row">
        <div class="col-6">
          <div class="mb-3">
            <label for="academy_start_date__gte" class="form-label"
              >Дата поступления (с)</label
            >
            <input
              type="date"
              max="2100"
              class="form-control"
              id="academy_start_date__gte"
              v-model="searchForm.academy_start_date__gte"
            />
          </div>
        </div>
        <div class="col-6">
          <div class="mb-3">
            <label for="academy_start_date__lte" class="form-label"
              >Дата поступления (по)</label
            >
            <input
              type="date"
              class="form-control"
              id="academy_start_date__lte"
              v-model="searchForm.academy_start_date__lte"
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
import { globalCadetAPIInstance } from "@/api/cadet/cadetAPI"
import BaseListLayout from "@/components/layouts/BaseListLayout.vue"
import { PaginatorView } from "@/components/common"
import { debounce } from "lodash/function"
import { mapGetters } from "vuex"

export default {
  name: "CadetList",
  components: {
    BaseListLayout,
    PaginatorView,
  },
  data() {
    return {
      cadetList: { count: 0, results: [], previous: null, next: null },
      isLoading: true,
      isError: false,
      BACKEND_PROTOCOL: import.meta.env.VITE_APP_BACKEND_PROTOCOL,
      BACKEND_HOST: import.meta.env.VITE_APP_BACKEND_HOST,
      BACKEND_PORT: import.meta.env.VITE_APP_BACKEND_PORT,
      cadetAPIInstance: globalCadetAPIInstance,
      searchForm: Object.assign(
        {},

        globalCadetAPIInstance.searchObj,
      ),
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
      const response = await this.cadetAPIInstance.getItemsList()
      this.cadetList = await response.data
      this.isLoading = false
    },
    async updatePaginator(url) {
      this.isLoading = true
      try {
        const response = await this.cadetAPIInstance.updateList(url)
        this.cadetList = await response.data
      } catch (error) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    debouncedSearch: debounce(async function () {
      this.isLoading = true
      this.cadetAPIInstance.searchObj = this.searchForm
      try {
        const cadetAResponse = await this.cadetAPIInstance.getItemsList()
        this.cadetList = await cadetAResponse.data
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    }, 500),
    clearFilter() {
      this.searchForm = Object.assign(
        {},
        this.cadetAPIInstance.searchObjDefault,
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
        const response = await this.cadetAPIInstance.addItem(this.cadetNewForm)
        const newItem = await response.data
        this.cadetList.results.unshift(newItem)
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
        (subdivision) => subdivision.subdivision_category === "1",
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
        (position) => position.position_category === "1",
      )
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
