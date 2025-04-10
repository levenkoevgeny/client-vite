<template>
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

        <form @submit.prevent="addNewMainItem">
          <div class="modal-body">
            <RankHistoryModalForCadetUpdate
              :main-data="itemForm"
              :order-owners="orderedOrderOwners"
              :ranks="orderedRanks"
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

  <!-- update modal-->
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

        <form @submit.prevent="updateMainItem">
          <div class="modal-body">
            <RankHistoryModalForCadetUpdate
              :main-data="itemForm"
              :order-owners="orderedOrderOwners"
              :ranks="orderedRanks"
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
        <div class="modal-body">Вы действительно хотите удалить запись?</div>
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

  <!--  main content-->
  <div class="shadow p-3 mb-3 rounded" id="simple-list-rank-data">
    <base-list-layout-for-cadet-update
      :is-loading="isLoading"
      :main-list-length="orderedMainList.length"
      title="Присвоение званий"
    >
      <template v-slot:add-button>
        <button
          class="btn btn-warning"
          :disabled="isLoading"
          @click="showAddNewMainItemModal"
          type="button"
        >
          <span class="fas fa-plus me-2"></span>Добавить запись
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
          <th>Звание</th>
          <th>С какого числа присвоено звание</th>
          <th>Дата приказа</th>
          <th>Номер приказа</th>
          <th>Чей приказ</th>
          <th>Доп. информация</th>
          <th></th>
        </tr>
      </template>
      <template v-slot:tbody>
        <tr
          v-for="rankHistory in orderedMainList"
          :key="rankHistory.id"
          @dblclick.stop="showUpdateMainItemModal(rankHistory.id)"
        >
          <td>
            <div
              class="form-check d-flex align-items-center justify-content-center"
            >
              <input
                type="checkbox"
                class="form-check-input my-0"
                v-model="rankHistory.isSelected"
              />
            </div>
          </td>
          <td>
            {{ rankHistory.get_rank_str || "Нет данных" }}
          </td>
          <td>{{ rankHistory.rank_date }}</td>
          <td>
            {{ rankHistory.rank_order_date || "Нет данных" }}
          </td>
          <td>{{ rankHistory.rank_order_number }}</td>
          <td>{{ rankHistory.get_rank_order_owner_str }}</td>
          <td>{{ rankHistory.rank_extra_data || "Нет данных" }}</td>
          <td>
            <div class="d-flex align-items-end justify-content-end">
              <button
                type="button"
                class="btn btn-outline-danger"
                @click="trashButtonClick(rankHistory.id)"
                style="padding: 0.25rem 0.5rem"
              >
                <font-awesome-icon :icon="['fas', 'trash']" />
              </button>
            </div>
          </td>
        </tr>
      </template>
      <template v-slot:paginator>
        <PaginatorView
          :update-paginator="updatePaginator"
          :list-next="mainItemList.next"
          :list-previous="mainItemList.previous"
          v-if="mainItemList.previous || mainItemList.next"
        />
      </template>
    </base-list-layout-for-cadet-update>
  </div>
</template>

<script>
import getRankHistoryAPIInstance from "@/api/cadet/rankHistoryAPI"
import {
  getLoadListFunction,
  showAddNewMainItemModal,
  showUpdateMainItemModal,
  showDeleteApproveModal,
  showDeleteApproveMultipleModal,
  addNewMainItem,
  updateMainItem,
  updatePaginator,
  checkAllHandler,
  clearFormData,
  checkedForDeleteCount,
  deleteItemHandler,
  deleteCheckedItemsHandler,
} from "../../../../utils"
import RankHistoryModalForCadetUpdate from "@/components/cadet/rank/modals/RankHistoryModalForCadetUpdate.vue"
import BaseListLayoutForCadetUpdate from "@/components/layouts/BaseListLayoutForCadetUpdate.vue"
import { PaginatorView } from "@/components/common"
import { mapGetters } from "vuex"

export default {
  name: "RankHistoryCadetComponent",
  components: {
    BaseListLayoutForCadetUpdate,
    RankHistoryModalForCadetUpdate,
    PaginatorView,
  },
  props: {
    cadetId: {
      type: String,
      required: true,
    },
    orderOwnersList: {
      type: Object,
      required: true,
      default: { count: "", results: [], previous: null, next: null },
    },
  },
  data() {
    return {
      isLoading: true,
      isError: false,
      mainItemList: { count: "", results: [], previous: null, next: null },
      mainItemAPIInstance: getRankHistoryAPIInstance(),
      itemForm: Object.assign({}, getRankHistoryAPIInstance().formData),
      selectedItems: [],
      deleteItemId: "",
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
        const [rankHistories] = await Promise.all([
          listFunction("mainItem")(this.cadetId, null),
        ]).catch((e) => (this.isError = true))
        this.mainItemList = rankHistories
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    showAddNewMainItemModal,
    showUpdateMainItemModal,
    showDeleteApproveModal,
    showDeleteApproveMultipleModal,
    addNewMainItem,
    updateMainItem,
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
  },
  computed: {
    checkedForDeleteCount,
    orderedMainList() {
      return this.mainItemList.results
    },
    orderedRanks() {
      return this.ranks.results
    },
    orderedOrderOwners() {
      return this.orderOwnersList.results
    },
    ...mapGetters({
      ranks: "ranks/getList",
      token: "auth/getToken",
    }),
  },

  watch: {},
}
</script>

<style scoped></style>
