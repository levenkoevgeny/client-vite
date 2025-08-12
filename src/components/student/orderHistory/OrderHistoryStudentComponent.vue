<template>
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
            <OrderHistoryModalForStudent :main-data="itemForm" />
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
            <OrderHistoryModalForStudent :main-data="itemForm" />
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
          Вы действительно хотите удалить данные записи?
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

  <div class="shadow p-3 mb-3 rounded" id="simple-list-punishments-data">
    <base-list-layout-for-cadet-update
      :is-loading="isLoading"
      :main-list-length="orderedMainList.length"
      title="Приказы"
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
          <!--          <th>-->
          <!--            <div-->
          <!--              class="form-check d-flex align-items-center justify-content-center"-->
          <!--            >-->
          <!--              <input-->
          <!--                type="checkbox"-->
          <!--                class="form-check-input my-0"-->
          <!--                @change="checkAllHandler($event)"-->
          <!--              />-->
          <!--            </div>-->
          <!--          </th>-->
          <th>Номер приказа</th>
          <th>Дата приказа</th>
          <th>Дата начала действия приказа</th>
          <th>Доп. информация</th>
          <!--          <th></th>-->
        </tr>
      </template>
      <template v-slot:tbody>
        <tr
          v-for="order in orderedMainList"
          :key="order.id"
          @dblclick.stop="showUpdateMainItemModal(order.id)"
        >
          <!--          <td>-->
          <!--            <div-->
          <!--              class="form-check d-flex align-items-center justify-content-center"-->
          <!--            >-->
          <!--              <input-->
          <!--                type="checkbox"-->
          <!--                class="form-check-input my-0"-->
          <!--                v-model="order.isSelected"-->
          <!--              />-->
          <!--            </div>-->
          <!--          </td>-->
          <td>{{ order.order_number || "Нет данных" }}</td>
          <td>
            {{
              new Date(order.order_date).toLocaleString("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }) || "Нет данных"
            }}
          </td>
          <td>
            {{
              new Date(order.order_start_date).toLocaleString("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }) || "Нет данных"
            }}
          </td>
          <td>
            {{ order.order_extra_data || "Нет данных" }}
          </td>
          <!--          <td>-->
          <!--            <div class="d-flex align-items-end justify-content-end">-->
          <!--              <button-->
          <!--                type="button"-->
          <!--                class="btn btn-outline-danger"-->
          <!--                @click="trashButtonClick(order.id)"-->
          <!--                style="padding: 0.25rem 0.5rem"-->
          <!--              >-->
          <!--                <font-awesome-icon :icon="['fas', 'trash']" />-->
          <!--              </button>-->
          <!--            </div>-->
          <!--          </td>-->
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
import getOrderHistoryAPIInstance from "@/api/student/orderHisoryAPI.js"
import {
  showAddNewMainItemModal,
  showUpdateMainItemModal,
  showDeleteApproveModal,
  showDeleteApproveMultipleModal,
  updatePaginator,
  checkAllHandler,
  clearFormData,
  checkedForDeleteCount,
  deleteItemHandler,
  deleteCheckedItemsHandler,
} from "../../../../utils"
import OrderHistoryModalForStudent from "@/components/student/orderHistory/modals/OrderHistoryModalForStudent.vue"
import BaseListLayoutForCadetUpdate from "@/components/layouts/BaseListLayoutForCadetUpdate.vue"
import PaginatorView from "@/components/common/PaginatorView.vue"

export default {
  name: "OrderHistoryStudentComponent",
  components: {
    OrderHistoryModalForStudent,
    BaseListLayoutForCadetUpdate,
    PaginatorView,
  },
  props: {
    studentId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isLoading: true,
      mainItemList: {
        count: "",
        results: [],
        previous: null,
        next: null,
      },
      mainItemAPIInstance: getOrderHistoryAPIInstance(),
      itemForm: Object.assign({}, getOrderHistoryAPIInstance().formData),
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
      try {
        this.mainItemAPIInstance.searchObj.student = this.studentId
        const response = await this.mainItemAPIInstance.getItemsList()
        this.mainItemList = response.data
      } catch (e) {
      } finally {
        this.isLoading = false
      }
    },
    showAddNewMainItemModal,
    showUpdateMainItemModal,
    showDeleteApproveModal,
    showDeleteApproveMultipleModal,
    async addNewMainItem() {
      this.isLoading = true
      this.isError = false
      try {
        const response = await this.mainItemAPIInstance.addItem({
          ...this.itemForm,
          student: this.studentId,
        })
        const newItemData = await response.data
        this.mainItemList.results.push(newItemData)
        this.$refs.mainItemAddModalCloseButton.click()
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    async updateMainItem() {
      this.isLoading = true
      this.isError = false
      try {
        const response = await this.mainItemAPIInstance.updateItem(
          this.itemForm,
        )
        const updatedItem = await response.data
        this.mainItemList.results = this.mainItemList.results.map((item) => {
          if (item.id === updatedItem.id) {
            return { ...item, ...updatedItem }
          } else return item
        })
        this.$refs.mainItemUpdateModalCloseButton.click()
      } catch (e) {
        console.log(e)
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
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
  },
}
</script>

<style scoped></style>
