<template>
  <base-list-layout
    :is-loading="isLoading"
    :main-list-length="mainItemList.count"
    title="В чьих интересах"
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
                  <label for="id_in_whose_interests" class="form-label"
                    >В чьих интересах</label
                  >
                  <input
                    id="id_in_whose_interests"
                    type="text"
                    class="form-control"
                    v-model="itemForm.in_whose_interests"
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
                  <label for="id_in_whose_interests_update" class="form-label"
                    >В чьих интересах</label
                  >
                  <input
                    id="id_in_whose_interests_update"
                    type="text"
                    class="form-control"
                    v-model="selectedItem.in_whose_interests"
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
        <th>В чьих интересах</th>
        <th>Дата добавления записи</th>
        <th>Дата последнего редактирования записи</th>
        <th></th>
      </tr>
    </template>
    <template v-slot:tbody>
      <tr
        v-for="in_whose_interest in orderedMainList"
        :key="in_whose_interest.id"
        @dblclick.stop="showUpdateMainItemModalInList(in_whose_interest.id)"
      >
        <td>
          <div
            class="form-check d-flex align-items-center justify-content-center"
          >
            <input
              type="checkbox"
              class="form-check-input my-0"
              v-model="in_whose_interest.isSelected"
            />
          </div>
        </td>
        <td>{{ in_whose_interest.in_whose_interests }}</td>
        <td>
          {{
            new Date(in_whose_interest.date_time_created).toLocaleString(
              "ru-RU",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              },
            )
          }}
        </td>
        <td>
          {{
            new Date(in_whose_interest.date_time_updated).toLocaleString(
              "ru-RU",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              },
            )
          }}
        </td>
        <td>
          <div class="d-flex align-items-end justify-content-end">
            <button
              type="button"
              class="btn btn-outline-danger"
              @click="trashButtonClick(in_whose_interest.id)"
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
            <label for="rank__icontains" class="form-label"
              >Комплектующий орган</label
            >
            <input
              type="text"
              class="form-control"
              id="rank__icontains"
              v-model="searchForm.component_name__icontains"
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
import getInWhoseInterestsAPIInstance from "@/api/cadet/inWhoseInterestsAPI.js"
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
  name: "InWhoseInterestsListView",
  components: {
    BaseListLayout,
  },
  data() {
    return {
      isLoading: false,
      isError: false,
      mainItemAPIInstance: getInWhoseInterestsAPIInstance(),
      itemForm: Object.assign({}, getInWhoseInterestsAPIInstance().formData),
      searchForm: Object.assign({}, getInWhoseInterestsAPIInstance().searchObj),
      selectedItem: Object.assign(
        {},
        getInWhoseInterestsAPIInstance().formData,
      ),
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
          "inWhoseInterests/actionGetList",
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
        await this.$store.dispatch("inWhoseInterests/actionAddNewItem", {
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
        await this.$store.dispatch("inWhoseInterests/actionUpdateItem", {
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
          "inWhoseInterests/actionDeleteItem",
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
          await this.$store.dispatch(
            "inWhoseInterests/actionDeleteItem",
            item.id,
          )
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
      mainItemList: "inWhoseInterests/getList",
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
