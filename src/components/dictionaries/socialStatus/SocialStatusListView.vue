<template>
  <base-list-layout
    :is-loading="isLoading"
    :main-list-length="mainItemList.count"
    title="Социальные статусы"
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
                  <label for="id_social_status_create" class="form-label"
                    >Социальный статус</label
                  >
                  <input
                    id="id_social_status_create"
                    type="text"
                    class="form-control"
                    v-model="itemForm.social_status"
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
                  <label for="id_social_status_update" class="form-label"
                    >Социальный статус</label
                  >
                  <input
                    id="id_social_status_update"
                    type="text"
                    class="form-control"
                    v-model="selectedItem.social_status"
                    required
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
        <th>Социальный статус</th>
        <th>Дата добавления записи</th>
        <th>Дата последнего редактирования записи</th>
        <th></th>
      </tr>
    </template>
    <template v-slot:tbody>
      <tr
        v-for="socialStatus in orderedMainList"
        :key="socialStatus.id"
        @dblclick.stop="showUpdateMainItemModalInList(socialStatus.id)"
      >
        <td>
          <div
            class="form-check d-flex align-items-center justify-content-center"
          >
            <input
              type="checkbox"
              class="form-check-input my-0"
              v-model="socialStatus.isSelected"
            />
          </div>
        </td>
        <td>{{ socialStatus.social_status }}</td>
        <td>
          {{
            new Date(socialStatus.date_time_created).toLocaleString("ru-RU", {
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
          {{
            new Date(socialStatus.date_time_updated).toLocaleString("ru-RU", {
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
              @click="trashButtonClick(socialStatus.id)"
              style="padding: 0.25rem 0.5rem"
            >
              <font-awesome-icon :icon="['fas', 'trash']" />
            </button>
          </div>
        </td>
      </tr>
    </template>
    <template v-slot:search-form>
      <div class="row">
        <div class="col-12">
          <div class="mb-3">
            <label for="social_status__icontains" class="form-label"
              >Социальный статус</label
            >
            <input
              type="text"
              class="form-control"
              id="social_status__icontains"
              v-model="searchForm.social_status__icontains"
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
import getSocialStatusAPIInstance from "@/api/cadet/socialStatuses.js"
import { mapGetters } from "vuex"
import BaseListLayout from "@/components/layouts/BaseListLayout.vue"
import {
  showAddNewMainItemModal,
  showDeleteApproveModal,
  showDeleteApproveMultipleModal,
  checkAllHandler,
  checkedForDeleteCount,
  clearFormData,
} from "../../../../utils"
import { debounce } from "lodash/function"

export default {
  name: "SocialStatusListView",
  components: {
    BaseListLayout,
  },
  data() {
    return {
      isLoading: false,
      isError: false,
      mainItemAPIInstance: getSocialStatusAPIInstance(),
      itemForm: Object.assign({}, getSocialStatusAPIInstance().formData),
      searchForm: Object.assign({}, getSocialStatusAPIInstance().searchObj),
      selectedItem: Object.assign({}, getSocialStatusAPIInstance().formData),
      deleteItemId: "",
    }
  },
  methods: {
    trashButtonClick(id) {
      this.deleteItemId = id
      this.showDeleteApproveModal()
    },
    deleteMultipleClick() {
      this.showDeleteApproveMultipleModal()
    },
    checkAllHandler,
    showAddNewMainItemModal,
    clearFormData,
    showDeleteApproveModal,
    showDeleteApproveMultipleModal,
    debouncedSearch: debounce(async function () {
      try {
        await this.$store.dispatch(
          "socialStatus/actionGetList",
          this.searchForm,
        )
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    }, 500),
    async addNewItem() {
      try {
        await this.$store.dispatch("socialStatus/actionAddNewItem", {
          ...this.itemForm,
        })
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
        await this.$store.dispatch("socialStatus/actionUpdateItem", {
          ...this.selectedItem,
        })
      } catch (error) {
      } finally {
        this.$refs.mainItemUpdateModalCloseButton.click()
      }
    },
    async deleteItemHandler() {
      try {
        await this.$store.dispatch(
          "socialStatus/actionDeleteItem",
          this.deleteItemId,
        )
      } catch (error) {
      } finally {
        this.$refs.deleteApproveModalCloseButton.click()
      }
    },
    async deleteCheckedItemsHandler() {
      this.mainItemList.results.map(async (item) => {
        if (item.isSelected) {
          await this.$store.dispatch("socialStatus/actionDeleteItem", item.id)
        }
      })
      this.$refs.deleteApproveModalMultipleCloseButton.click()
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
      mainItemList: "socialStatus/getList",
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
