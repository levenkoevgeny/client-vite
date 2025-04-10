<template>
  <base-list-layout
    :is-loading="isLoading"
    :main-list-length="mainItemList.count"
    title="Перевод на специальности"
  >
    <template v-slot:modals>
      <!-- add modal-->
      <div
        class="modal fade"
        id="mainItemAddModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        ref="mainItemAddModal"
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
            <form @submit.prevent="addNewMainItemInList">
              <div class="modal-body">
                <div class="mb-3">
                  <label for="id_encouragement_kind" class="form-label"
                    >Курсант (курсанты)</label
                  >
                  <v-select
                    multiple
                    v-model="selectedCadet"
                    :options="orderedCadets"
                    label="get_full_name"
                    :filterable="false"
                    @search="onSearch"
                  >
                    <template slot="no-options"> Поиск по фамилии...</template>
                    <template slot="option" slot-scope="option">
                      <div class="d-center">
                        {{ option }}
                      </div>
                    </template>
                    <template slot="selected-option" slot-scope="option">
                      <div class="selected d-center">
                        {{ option }}
                      </div>
                    </template>
                  </v-select>
                </div>

                <SpecialityModalForCadetUpdate
                  :main-data="itemForm"
                  :speciality-list="orderedSpecialities"
                  :order-owners="orderedOrderOwners"
                />
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                  ref="mainItemAddModalCloseButton"
                >
                  Закрыть
                </button>
                <button type="submit" class="btn btn-primary">
                  Добавить запись
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!--      update modal-->
      <div
        class="modal fade"
        id="mainItemUpdateModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        ref="mainItemUpdateModal"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                Редактирование записи
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <form @submit.prevent="updateMainItemInList">
              <div class="modal-body">
                <div class="mb-3">
                  <label for="id_encouragement_kind" class="form-label"
                    >Курсант</label
                  >
                  <v-select
                    v-model="selectedCadet"
                    :options="orderedCadets"
                    label="get_full_name"
                    :filterable="false"
                    @search="onSearch"
                  >
                    <template slot="no-options"> Поиск по фамилии...</template>
                    <template slot="option" slot-scope="option">
                      <div class="d-center">
                        {{ option }}
                      </div>
                    </template>
                    <template slot="selected-option" slot-scope="option">
                      <div class="selected d-center">
                        {{ option }}
                      </div>
                    </template>
                  </v-select>
                </div>

                <SpecialityModalForCadetUpdate
                  :main-data="itemForm"
                  :speciality-list="orderedSpecialities"
                  :order-owners="orderedOrderOwners"
                />
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                  ref="mainItemUpdateModalCloseButton"
                >
                  Закрыть
                </button>
                <button type="submit" class="btn btn-primary">Сохранить</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- delete approve modal-->

      <div
        class="modal fade"
        id="deleteApproveModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        ref="deleteApproveModal"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header border-0">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                Подтверждение удаления
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              Вы действительно хотите удалить запись?
            </div>
            <div class="modal-footer border-0">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                ref="deleteApproveModalCloseButton"
              >
                Отмена
              </button>
              <button
                type="button"
                class="btn btn-danger"
                @click="deleteItemHandler"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- delete approve multiple modal-->

      <div
        class="modal fade"
        id="deleteApproveMultipleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        ref="deleteApproveMultipleModal"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header border-0">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                Подтверждение удаления
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              Вы действительно хотите удалить данные записи -
              {{ checkedForDeleteCount }} ?
            </div>
            <div class="modal-footer border-0">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                ref="deleteApproveModalMultipleCloseButton"
              >
                Отмена
              </button>
              <button
                type="button"
                class="btn btn-danger"
                @click="deleteCheckedItemsHandler"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-slot:add-button>
      <button
        class="btn btn-warning"
        :disabled="isLoading"
        @click="showAddNewMainItemModal"
      >
        Добавить запись
      </button>
    </template>
    <template v-slot:delete-selected-button>
      <button
        @click="deleteMultipleClick"
        class="btn btn-outline-danger"
        v-if="checkedForDeleteCount"
      >
        Удалить ({{ checkedForDeleteCount }})
      </button>
    </template>
    <template v-slot:table-mode-button></template>
    <template v-slot:thead>
      <tr>
        <th>
          <div
            class="form-check d-flex align-items-center justify-content-center"
          >
            <input
              type="checkbox"
              class="form-check-input my-0"
              @change="checkAllHandler($event)"
            />
          </div>
        </th>
        <th>Курсант</th>
        <th>Специальность</th>
        <th>Приказ о назначении</th>
        <th>Дата приказа</th>
        <th>Чей приказ</th>
        <th>Дополнительная информация</th>
        <th></th>
      </tr>
    </template>
    <template v-slot:tbody>
      <tr
        v-for="speciality in orderedMainList"
        :key="speciality.id"
        @dblclick.stop="showUpdateMainItemModalInList(speciality.id)"
      >
        <td>
          <div
            class="form-check d-flex align-items-center justify-content-center"
          >
            <input
              type="checkbox"
              class="form-check-input my-0"
              v-model="speciality.isSelected"
            />
          </div>
        </td>
        <td>{{ speciality.get_cadet_str }}</td>
        <td>
          {{ speciality.get_speciality_str }}
        </td>
        <td>{{ speciality.speciality_order_number }}</td>
        <td>{{ speciality.speciality_order_date }}</td>
        <td>{{ speciality.get_speciality_order_owner_str }}</td>
        <td>{{ speciality.speciality_extra_data }}</td>

        <td>
          <div class="d-flex align-items-end justify-content-end">
            <button
              type="button"
              class="btn btn-outline-danger"
              @click="trashButtonClick(speciality.id)"
              style="padding: 0.25rem 0.5rem"
            >
              <font-awesome-icon :icon="['fas', 'trash']" />
            </button>
          </div>
        </td>
      </tr>
    </template>
    <template v-slot:search-form>
      <div class="mb-3">
        <label for="id_encouragement_kind" class="form-label">Курсант</label>
        <v-select
          v-model="searchForm.cadet"
          :options="orderedCadets"
          :reduce="(cadet) => cadet.id"
          label="get_full_name"
          :filterable="false"
          @search="onSearch"
        >
          <template slot="no-options"> Поиск по фамилии...</template>
          <template slot="option" slot-scope="option">
            <div class="d-center">
              {{ option }}
            </div>
          </template>
          <template slot="selected-option" slot-scope="option">
            <div class="selected d-center">
              {{ option }}
            </div>
          </template>
        </v-select>
      </div>
      <div class="mb-3">
        <label for="subdivision" class="form-label">Специальность</label>
        <select
          class="form-select"
          aria-label="Default select example"
          v-model="searchForm.speciality"
        >
          <option selected value="">--------</option>
          <option
            v-for="speciality in orderedSpecialities"
            :key="speciality.id"
            :value="speciality.id"
          >
            {{ speciality.speciality_name }}
          </option>
        </select>
      </div>

      <div class="mb-3">
        <label for="speciality_order_owner" class="form-label"
          >Чей приказ</label
        >
        <select
          id="speciality_order_owner"
          class="form-select"
          aria-label="Default select example"
          v-model="searchForm.speciality_order_owner"
        >
          <option selected value="">--------</option>
          <option
            v-for="orderOwner in orderedOrderOwners"
            :key="orderOwner.id"
            :value="orderOwner.id"
          >
            {{ orderOwner.order_owner }}
          </option>
        </select>
      </div>

      <div class="row">
        <div class="col-6">
          <div class="mb-3">
            <label for="speciality_order_date__gte" class="form-label"
              >Дата приказа (с)</label
            >
            <input
              type="date"
              class="form-control"
              id="speciality_order_date__gte"
              v-model="searchForm.speciality_order_date__gte"
            />
          </div>
        </div>
        <div class="col-6">
          <div class="mb-3">
            <label for="speciality_order_date__lte" class="form-label"
              >Дата приказа (по)</label
            >
            <input
              type="date"
              class="form-control"
              id="speciality_order_date__lte"
              v-model="searchForm.speciality_order_date__lte"
            />
          </div>
        </div>
      </div>

      <div class="mb-3">
        <label for="speciality_order_number__icontains" class="form-label"
          >Номер приказа (содержит)</label
        >
        <input
          type="text"
          class="form-control"
          id="speciality_order_number__icontains"
          v-model="searchForm.speciality_order_number__icontains"
        />
      </div>
      <div class="mb-3">
        <label for="speciality_extra_data__icontains" class="form-label">
          Доп. информация (содержит)</label
        >
        <input
          type="text"
          class="form-control"
          id="speciality_extra_data__icontains"
          v-model="searchForm.speciality_extra_data__icontains"
        />
      </div>
      <button type="button" class="btn btn-primary" @click="clearFilter">
        Сбросить фильтр
      </button>
    </template>
    <template v-slot:paginator>
      <PaginatorView
        :update-paginator="updatePaginator"
        :list-next="mainItemList.next"
        :list-previous="mainItemList.previous"
        v-if="mainItemList.previous || mainItemList.next"
      />
    </template>
  </base-list-layout>
</template>

<script>
import getSpecialityHistoryAPIInstance from "@/api/cadet/specialityHistoryAPI"
import getCadetAPIInstance from "@/api/cadet/cadetAPI"

import BaseListLayout from "@/components/layouts/BaseListLayout.vue"
import SpecialityModalForCadetUpdate from "@/components/cadet/speciality/modals/SpecialityModalForCadetUpdate.vue"
import { PaginatorView } from "@/components/common"
import { debounce } from "lodash/function"

import {
  getLoadListFunction,
  showAddNewMainItemModal,
  showUpdateMainItemModalInList,
  showDeleteApproveModal,
  showDeleteApproveMultipleModal,
  updatePaginator,
  checkAllHandler,
  checkedForDeleteCount,
  deleteItemHandler,
  deleteCheckedItemsHandler,
  clearFormData,
  addNewMainItemInList,
  updateMainItemInList,
} from "../../../../utils"
import RankHistoryModalForCadetUpdate from "@/components/cadet/rank/modals/RankHistoryModalForCadetUpdate.vue"
import { mapGetters } from "vuex"

export default {
  name: "EncouragementListView",
  components: {
    RankHistoryModalForCadetUpdate,
    BaseListLayout,
    PaginatorView,
    SpecialityModalForCadetUpdate,
  },
  data() {
    return {
      isLoading: true,
      isError: false,
      selectedCadet: [],
      mainItemList: {
        count: 0,
        results: [],
        previous: null,
        next: null,
      },
      cadetList: { count: "", results: [], previous: null, next: null },
      mainItemAPIInstance: getSpecialityHistoryAPIInstance(),
      cadetAPIInstance: getCadetAPIInstance(),
      itemForm: Object.assign({}, getSpecialityHistoryAPIInstance().formData),
      searchForm: Object.assign(
        {},
        getSpecialityHistoryAPIInstance().searchObj,
      ),
      selectedItems: [],
      deleteItemId: "",
    }
  },
  async created() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      this.isLoading = true
      this.isError = false
      const listFunction = getLoadListFunction.bind(this)
      this.isLoading = true
      this.isError = false
      try {
        const [specialityHistories] = await Promise.all([
          listFunction("mainItem")(this.cadetId),
        ])
        this.mainItemList = specialityHistories
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    async onSearch(search, loading) {
      if (search.length) {
        loading(true)
        this.cadetAPIInstance.searchObj = Object.assign(
          {},
          { last_name_rus__icontains: search },
        )
        try {
          const cadetResponse = await this.cadetAPIInstance.getItemsList()
          this.cadetList = await cadetResponse.data
        } catch (e) {
          this.isError = true
        } finally {
          loading(false)
        }
      }
    },
    addNewMainItemInList,
    showAddNewMainItemModal,
    showUpdateMainItemModalInList,
    showDeleteApproveModal,
    showDeleteApproveMultipleModal,
    updatePaginator,
    trashButtonClick(id) {
      this.deleteItemId = id
      this.showDeleteApproveModal()
    },
    deleteMultipleClick() {
      this.showDeleteApproveMultipleModal()
    },
    checkAllHandler,
    clearFormData,
    deleteItemHandler,
    deleteCheckedItemsHandler,
    debouncedSearch: debounce(async function () {
      this.isLoading = true
      this.mainItemAPIInstance.searchObj = Object.assign({}, this.searchForm)
      try {
        const encouragementResponse =
          await this.mainItemAPIInstance.getItemsList()
        this.mainItemList = await encouragementResponse.data
      } catch (e) {
        this.isError = true
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
    updateMainItemInList,
  },
  computed: {
    checkedForDeleteCount,
    orderedMainList() {
      return this.mainItemList.results
    },
    orderedSpecialities() {
      return this.specialities.results
    },
    orderedCadets() {
      return this.cadetList.results
    },
    orderedOrderOwners() {
      return this.orderOwners.results
    },
    ...mapGetters({
      orderOwners: "orderOwners/getList",
      specialities: "specialities/getList",
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
