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
            <RewardModalForCadetUpdate
              :main-data="itemForm"
              :reward-list="orderedRewardList"
              :order-owners="orderedOrderOwnerList"
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
            <RewardModalForCadetUpdate
              :main-data="itemForm"
              :reward-list="orderedRewardList"
              :order-owners="orderedOrderOwnerList"
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

  <div class="shadow p-3 mb-3 rounded" id="simple-list-rewards-data">
    <base-list-layout-for-cadet-update
      :is-loading="isLoading"
      :main-list-length="orderedMainList.length"
      title="Награды"
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
          <th>Чем награжден</th>
          <th>За что награжден</th>
          <th>Номер приказа</th>
          <th>Дата приказа</th>
          <th></th>
        </tr>
      </template>
      <template v-slot:tbody>
        <tr
          v-for="reward in orderedMainList"
          :key="reward.id"
          @dblclick.stop="showUpdateMainItemModal(reward.id)"
        >
          <td>
            <div
              class="form-check d-flex align-items-center justify-content-center"
            >
              <input
                type="checkbox"
                class="form-check-input my-0"
                v-model="reward.isSelected"
              />
            </div>
          </td>
          <td>{{ reward.get_reward_str || "Нет данных" }}</td>
          <td>{{ reward.reason || "Нет данных" }}</td>
          <td>{{ reward.order_number || "Нет данных" }}</td>
          <td>{{ reward.reward_date || "Нет данных" }}</td>
          <td>
            <div class="d-flex align-items-end justify-content-end">
              <button
                type="button"
                class="btn btn-outline-danger"
                @click="trashButtonClick(reward.id)"
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
import getRewardAPIInstance from "@/api/cadet/rewardAPI"
import getRewardHistoryAPIInstance from "@/api/cadet/rewardHistoryAPI"
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
import BaseListLayoutForCadetUpdate from "@/components/layouts/BaseListLayoutForCadetUpdate.vue"
import RewardModalForCadetUpdate from "@/components/cadet/reward/modals/RewardModalForCadetUpdate.vue"
import { PaginatorView } from "@/components/common"

export default {
  name: "RewardCadetComponent",
  components: {
    PaginatorView,
    BaseListLayoutForCadetUpdate,
    RewardModalForCadetUpdate,
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
      mainItemList: {
        count: "",
        results: [],
        previous: null,
        next: null,
      },
      rewardList: {
        count: "",
        results: [],
        previous: null,
        next: null,
      },
      mainItemAPIInstance: getRewardHistoryAPIInstance(),
      rewardAPIInstance: getRewardAPIInstance(),
      itemForm: Object.assign({}, getRewardHistoryAPIInstance().formData),
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
        const [rewardHistories, rewards] = await Promise.all([
          listFunction("mainItem")(this.cadetId),
          listFunction("reward")(),
        ])
        this.mainItemList = rewardHistories
        this.rewardList = rewards
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
    orderedRewardList() {
      return this.rewardList.results
    },
    orderedOrderOwnerList() {
      return this.orderOwnersList.results
    },
  },
  watch: {},
}
</script>

<style scoped></style>
