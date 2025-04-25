<template>
  <base-list-layout
    :is-loading="isLoading"
    :main-list-length="mainItemList.count"
    title="Список очередей (админ)"
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
            <form @submit.prevent="addNewItem">
              <div class="modal-body">
                <div class="mb-3">
                  <label for="id_queue_name" class="form-label"
                  >Название очереди</label
                  >
                  <input
                    id="id_queue_name"
                    type="text"
                    class="form-control"
                    v-model="itemForm.queue_name"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="id_queue_liter" class="form-label"
                  >Литера</label
                  >
                  <input
                    id="id_queue_liter"
                    type="text"
                    class="form-control"
                    v-model="itemForm.queue_liter"
                    required
                  />
                </div>
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
                  <label for="id_queue_name_update" class="form-label"
                  >Название очереди</label
                  >
                  <input
                    id="id_queue_name_update"
                    type="text"
                    class="form-control"
                    v-model="selectedItem.queue_name"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="id_queue_liter_update" class="form-label"
                  >Литера</label
                  >
                  <input
                    id="id_queue_liter_update"
                    type="text"
                    class="form-control"
                    v-model="selectedItem.queue_liter"
                  />
                </div>
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


      <!-- clear queue approve modal-->

      <div
        class="modal fade"
        id="clearApproveModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        ref="clearApproveModal"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header border-0">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                Подтверждение обнуления очереди
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              Вы действительно хотите обнулить очередь?
            </div>
            <div class="modal-footer border-0">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                ref="clearApproveModalCloseButton"
              >
                Отмена
              </button>
              <button
                type="button"
                class="btn btn-danger"
                @click="clearQueue"
              >
                обнулить
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
        <th class="text-center">Название очереди</th>
        <th class="text-center">Литера</th>
        <th class="text-center">Количество выданных талонов (всего)</th>
        <th class="text-center">Количество талонов в очереди</th>
        <th class="text-center">Количество обслуженных талонов</th>
        <th class="text-center">Дата создания очереди</th>
        <th class="text-center">Дата последнего редактирования очереди</th>
        <th></th>
        <th></th>
      </tr>
    </template>
    <template v-slot:tbody>
      <tr
        v-for="queue in orderedMainList"
        :key="queue.id"
        @dblclick.stop="showUpdateMainItemModalInList(queue.id)"
      >
        <td>
          <div
            class="form-check d-flex align-items-center justify-content-center"
          >
            <input
              type="checkbox"
              class="form-check-input my-0"
              v-model="queue.isSelected"
            />
          </div>
        </td>
        <td class="text-center">{{ queue.queue_name }}</td>
        <td class="text-center">{{ queue.queue_liter }}</td>
        <td class="text-center">{{ queue.get_ticket_pending }}</td>
        <td class="text-center">{{ queue.get_ticket_processed }}</td>
        <td class="text-center">{{ queue.get_ticket_fulfilled }}</td>

        <td class="text-center">
          {{
            new Date(queue.date_time_created).toLocaleString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
            })
          }}
        </td>
        <td class="text-center">
          {{
            new Date(queue.date_time_updated).toLocaleString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
            })
          }}
        </td>
        <td>
          <div class="d-flex align-items-end justify-content-end">
            <button
              type="button"
              class="btn btn-outline-danger"
              @click="trashButtonClick(queue.id)"
              style="padding: 0.25rem 0.5rem"
            >
              <font-awesome-icon :icon="['fas', 'trash']" />
            </button>
          </div>
        </td>

        <td>
          <div class="d-flex align-items-end justify-content-end">
          <button
            type="button"
            class="btn btn-outline-danger"
            @click="showClearQueueModal(queue.id)"
            style="padding: 0.25rem 0.5rem"
          >
            Обнулить очередь
          </button>
        </div>
        </td>
      </tr>
    </template>
    <template v-slot:search-form>
      <div class="row">
        <div class="col-12">
          <div class="mb-3">
            <label for="queue_name__icontains" class="form-label"
            >Название очереди</label
            >
            <input
              type="text"
              class="form-control"
              id="queue_name__icontains"
              v-model="searchForm.queue_name__icontains"
            />
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
import BaseListLayout from "@/components/layouts/BaseListLayout.vue"
import getQueueAPIInstance from "@/api/electronic_queue/queueAPI.js"

import {
  showAddNewMainItemModal,
  showDeleteApproveModal,
  showDeleteApproveMultipleModal,
  checkAllHandler,
  checkedForDeleteCount,
  clearFormData,
} from "../../../../utils"
import { mapGetters } from "vuex"
import { debounce } from "lodash/function.js"

export default {
  name: "ElectronicQueueListAdmin",
  components: { BaseListLayout },
  data() {
    return {
      mainItemList: {results: [], count: null, next: null, previous: null},
      isLoading: false,
      isError: false,
      mainItemAPIInstance: getQueueAPIInstance(),
      itemForm: Object.assign({}, getQueueAPIInstance().formData),
      searchForm: Object.assign({}, getQueueAPIInstance().searchObj),
      selectedItem: Object.assign({}, getQueueAPIInstance().formData),
      deleteItemId: "",
      deleteQueueId: "",
    }
  },
  async created() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      this.isLoading = true
      const response = await this.mainItemAPIInstance.getItemsList()
      this.mainItemList = await response.data
      this.isLoading = false
    },
    checkAllHandler,
    showAddNewMainItemModal,
    clearFormData,
    showDeleteApproveModal,
    showDeleteApproveMultipleModal,
    async addNewItem() {
      try {
        await this.mainItemAPIInstance.addItem(this.itemForm)
        const response = await this.mainItemAPIInstance.getItemsList()
        this.mainItemList = await response.data

      } catch (error) {
      } finally {
        this.clearFormData()
        this.$refs.mainItemAddModalCloseButton.click()
      }
    },
    async showUpdateMainItemModalInList(id) {
      try {
        const response = await this.mainItemAPIInstance.getItemData(id)
        this.selectedItem = await response.data
        let updateModal = this.$refs.mainItemUpdateModal
        let myModal = new bootstrap.Modal(updateModal, {
          keyboard: false,
        })
        myModal.show()
      } catch (error) {}
    },
    async updateMainItemInList() {
      try {
        await this.mainItemAPIInstance.updateItem(this.selectedItem)
        const response = await this.mainItemAPIInstance.getItemsList()
        this.mainItemList = await response.data
      } catch (error) {
      } finally {
        this.$refs.mainItemUpdateModalCloseButton.click()
      }
    },
    debouncedSearch: debounce(async function () {
      this.isLoading = true
      this.mainItemAPIInstance.searchObj = this.searchForm
      try {
        const response = await this.mainItemAPIInstance.getItemsList()
        this.mainItemList = response.data
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    }, 500),
    trashButtonClick(id) {
      this.deleteItemId = id
      this.showDeleteApproveModal()
    },
    deleteMultipleClick() {
      this.showDeleteApproveMultipleModal()
    },

    async deleteItemHandler() {
      try {
        await this.mainItemAPIInstance.deleteItem(this.deleteItemId)
        const response = await this.mainItemAPIInstance.getItemsList()
        this.mainItemList = response.data
      } catch (error) {
      } finally {
        this.$refs.deleteApproveModalCloseButton.click()
      }
    },
    async deleteCheckedItemsHandler() {
      this.mainItemList.results.map(async (item) => {
        if (item.isSelected) {
          const resp = await this.mainItemAPIInstance.deleteItem(item.id)
          this.mainItemList.results = this.mainItemList.results.filter(item => item.id !== resp.data.id)
        }
      })
      this.$refs.deleteApproveModalMultipleCloseButton.click()

    },
    showClearQueueModal(queueId) {
      this.deleteQueueId = queueId
      let deleteQueueModal = this.$refs.clearApproveModal
      let myModal = new bootstrap.Modal(deleteQueueModal, {
        keyboard: false,
      })
      myModal.show()
    },
    async clearQueue(){
      try {
        await this.mainItemAPIInstance.clearQueue(this.deleteQueueId)
        const response = await this.mainItemAPIInstance.getItemsList()
        this.mainItemList = response.data
      } catch (error) {
      } finally {
        this.$refs.clearApproveModalCloseButton.click()
      }
    },
    clearFilter() {
      this.searchForm = Object.assign(
        {},
        this.mainItemAPIInstance.searchObjDefault,
      )
    },
  },
  computed: {
    checkedForDeleteCount,
    orderedMainList() {
      return this.mainItemList.results
    },
    ...mapGetters({
      mainItemList: "directionsORD/getList",
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
