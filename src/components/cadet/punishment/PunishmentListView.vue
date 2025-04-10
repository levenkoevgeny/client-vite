<template xmlns="http://www.w3.org/1999/html">
  <base-list-layout
    :is-loading="isLoading"
    :main-list-length="mainItemList.count"
    title="Взыскания"
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
                    <template #search="{ attributes, events }">
                      <input
                        class="vs__search"
                        :required="!selectedCadet.length"
                        v-bind="attributes"
                        v-on="events"
                      />
                    </template>
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

                <PunishmentModalForCadetUpdate
                  :main-data="itemForm"
                  :punishment-kind-list="orderedPunishmentKinds"
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
                    <template #search="{ attributes, events }">
                      <input
                        class="vs__search"
                        :required="!selectedCadet.length"
                        v-bind="attributes"
                        v-on="events"
                      />
                    </template>
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

                <PunishmentModalForCadetUpdate
                  :main-data="itemForm"
                  :punishment-kind-list="orderedPunishmentKinds"
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
        <th>Взыскание</th>
        <th>Дата начала действия</th>
        <th>Номер приказа о наложении</th>
        <th>Дата приказа о наложении</th>
        <th>Чей приказ</th>
        <th>Фабула</th>
        <th>Дата окончания действия</th>
        <th>Дата приказа о снятии</th>
        <th>Чей приказ</th>
        <th>Фабула</th>
        <th></th>
      </tr>
    </template>
    <template v-slot:tbody>
      <tr
        v-for="punishment in orderedMainList"
        :key="punishment.id"
        @dblclick.stop="showUpdateMainItemModalInList(punishment.id)"
      >
        <td>
          <div
            class="form-check d-flex align-items-center justify-content-center"
          >
            <input
              type="checkbox"
              class="form-check-input my-0"
              v-model="punishment.isSelected"
            />
          </div>
        </td>
        <td>
          <nobr>{{ punishment.get_cadet_str }}</nobr>
        </td>
        <td>
          {{ punishment.get_punishment_kind_str || "Нет данных" }}
        </td>
        <td>{{ punishment.punishment_start_date }}</td>
        <td>{{ punishment.punishment_start_order_number }}</td>
        <td>{{ punishment.punishment_start_order_date }}</td>
        <td>{{ punishment.get_punishment_start_order_owner }}</td>
        <td>{{ punishment.punishment_start_extra_data }}</td>
        <td>{{ punishment.punishment_expiration_date }}</td>
        <td>{{ punishment.punishment_expiration_order_number }}</td>
        <td>{{ punishment.get_punishment_expiration_order_owner }}</td>
        <td>{{ punishment.punishment_expiration_extra_data }}</td>
        <td>
          <div class="d-flex align-items-end justify-content-end">
            <button
              type="button"
              class="btn btn-outline-danger"
              @click="trashButtonClick(punishment.id)"
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
        <label for="subdivision" class="form-label">Вид взыскания</label>
        <select
          class="form-select"
          aria-label="Default select example"
          v-model="searchForm.punishment_kind"
        >
          <option selected value="">--------</option>
          <option
            v-for="punishmentKind in orderedPunishmentKinds"
            :key="punishmentKind.id"
            :value="punishmentKind.id"
          >
            {{ punishmentKind.punishment_kind }}
          </option>
        </select>
      </div>

      <div class="shadow p-3 mb-2 bg-body-tertiary rounded">
        <!--      наложение-->
        <div class="row">
          <div class="col-6">
            <div class="mb-3">
              <label for="punishment_start_date__gte" class="form-label"
                >Дата наложения (с)</label
              >
              <input
                type="date"
                class="form-control"
                id="punishment_start_date__gte"
                v-model="searchForm.punishment_start_date__gte"
              />
            </div>
          </div>
          <div class="col-6">
            <div class="mb-3">
              <label for="punishment_start_date__lte" class="form-label"
                >Дата наложения (по)</label
              >
              <input
                type="date"
                class="form-control"
                id="punishment_start_date__lte"
                v-model="searchForm.punishment_start_date__lte"
              />
            </div>
          </div>
        </div>
        <div class="mb-3">
          <label for="punishment_order_owner" class="form-label"
            >Чей приказ</label
          >
          <select
            id="punishment_order_owner"
            class="form-select"
            aria-label="Default select example"
            v-model="searchForm.punishment_order_owner"
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
              <label for="punishment_start_order_date__gte" class="form-label"
                >Дата приказа о наложении (с)</label
              >
              <input
                type="date"
                class="form-control"
                id="punishment_start_order_date__gte"
                v-model="searchForm.punishment_start_order_date__gte"
              />
            </div>
          </div>
          <div class="col-6">
            <div class="mb-3">
              <label for="punishment_start_order_date__lte" class="form-label"
                >Дата приказа о наложении (по)</label
              >
              <input
                type="date"
                class="form-control"
                id="punishment_start_order_date__lte"
                v-model="searchForm.punishment_start_order_date__lte"
              />
            </div>
          </div>
        </div>
        <div class="mb-3">
          <label
            for="punishment_start_order_number__icontains"
            class="form-label"
            >Номер приказа о наложении (содержит)</label
          >
          <input
            type="text"
            class="form-control"
            id="punishment_start_order_number__icontains"
            v-model="searchForm.punishment_start_order_number__icontains"
          />
        </div>
        <div class="mb-3">
          <label for="punishment_start_extra_data__icontains" class="form-label"
            >Фабула приказа о наложении (содержит)</label
          >
          <input
            type="text"
            class="form-control"
            id="punishment_start_extra_data__icontains"
            v-model="searchForm.punishment_start_extra_data__icontains"
          />
        </div>
      </div>

      <div class="shadow p-3 mb-2 bg-body-tertiary rounded">
        <div class="row">
          <div class="col-6">
            <div class="mb-3">
              <label for="punishment_start_date__gte" class="form-label"
                >Дата снятия (с)</label
              >
              <input
                type="date"
                class="form-control"
                id="punishment_start_date__gte"
                v-model="searchForm.punishment_start_date__gte"
              />
            </div>
          </div>
          <div class="col-6">
            <div class="mb-3">
              <label for="punishment_expiration_date__lte" class="form-label"
                >Дата снятия (по)</label
              >
              <input
                type="date"
                class="form-control"
                id="punishment_expiration_date__lte"
                v-model="searchForm.punishment_expiration_date__lte"
              />
            </div>
          </div>
        </div>
        <div class="mb-3">
          <label for="punishment_expiration_order_owner" class="form-label"
            >Чей приказ</label
          >
          <select
            id="punishment_expiration_order_owner"
            class="form-select"
            aria-label="Default select example"
            v-model="searchForm.punishment_expiration_order_owner"
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
              <label
                for="punishment_expiration_order_date__gte"
                class="form-label"
                >Дата приказа (с)</label
              >
              <input
                type="date"
                class="form-control"
                id="punishment_expiration_order_date__gte"
                v-model="searchForm.punishment_expiration_order_date__gte"
              />
            </div>
          </div>
          <div class="col-6">
            <div class="mb-3">
              <label
                for="punishment_expiration_order_date__lte"
                class="form-label"
                >Дата приказа (по)</label
              >
              <input
                type="date"
                class="form-control"
                id="punishment_expiration_order_date__lte"
                v-model="searchForm.punishment_expiration_order_date__lte"
              />
            </div>
          </div>
        </div>
        <div class="mb-3">
          <label
            for="punishment_expiration_order_number__icontains"
            class="form-label"
            >Номер приказа о снятии (содержит)</label
          >
          <input
            type="text"
            class="form-control"
            id="punishment_expiration_order_number__icontains"
            v-model="searchForm.punishment_expiration_order_number__icontains"
          />
        </div>
        <div class="mb-3">
          <label
            for="punishment_expiration_extra_data__icontains"
            class="form-label"
            >Фабула приказа о снятии (содержит)</label
          >
          <input
            type="text"
            class="form-control"
            id="punishment_expiration_extra_data__icontains"
            v-model="searchForm.punishment_expiration_extra_data__icontains"
          />
        </div>
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
import getPunishmentAPIInstance from "@/api/cadet/punishmentAPI"
import getCadetAPIInstance from "@/api/cadet/cadetAPI"

import { PaginatorView } from "@/components/common"
import { debounce } from "lodash/function"

import BaseListLayout from "@/components/layouts/BaseListLayout.vue"
import PunishmentModalForCadetUpdate from "@/components/cadet/punishment/modals/PunishmentModalForCadetUpdate.vue"

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
import { mapGetters } from "vuex"

export default {
  name: "PunishmentListView",
  components: {
    BaseListLayout,
    PaginatorView,
    PunishmentModalForCadetUpdate,
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
      mainItemAPIInstance: getPunishmentAPIInstance(),
      cadetAPIInstance: getCadetAPIInstance(),
      itemForm: Object.assign({}, getPunishmentAPIInstance().formData),
      searchForm: Object.assign({}, getPunishmentAPIInstance().searchObj),
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
        const [punishments] = await Promise.all([
          listFunction("mainItem")(this.cadetId),
        ])
        this.mainItemList = punishments
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
    orderedPunishmentKinds() {
      return this.punishmentKinds.results
    },
    orderedCadets() {
      return this.cadetList.results
    },
    orderedOrderOwners() {
      return this.orderOwners.results
    },
    ...mapGetters({
      orderOwners: "orderOwners/getList",
      punishmentKinds: "punishmentKinds/getList",
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
