<template>
  <base-list-layout-for-pass-office
    :is-loading="isLoading"
    :main-list-length="cardList.count"
    :selected-items-count="0"
    title="Бланки студенческих билетов"
    :load-more-data="loadMoreData"
  >
    <template v-slot:modals>
      <div
        class="modal fade"
        id="cardUpdateModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        ref="cardUpdateModal"
      >
        <div class="modal-dialog modal-dialog-centered modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" v-if="currentCardBlank">
                Редактирование записи -
                {{ currentCardBlank.get_cadet_data }}
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ref="cardUpdateModalCloseButton"
              ></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="saveCurrentCardBlank">
                <div class="row fs-4" v-if="currentCardBlank">
                  <div
                    class="col-lg-4 d-flex align-items-center justify-content-center"
                  >
                    <input
                      type="number"
                      class="form-control form-control-sm fs-5"
                      id="id_blank_number"
                      placeholder="Номер бланка"
                      v-model="currentCardBlank.blank_number"
                      min="1"
                      required
                    />
                  </div>
                  <div class="col-lg-6">
                    <div class="form-text">
                      <span
                        class="bg-success-subtle p-2 w-100"
                        style="width: 100%"
                      >
                        Дата записи -
                        {{
                          new Date(
                            currentCardBlank.date_time_created,
                          ).toLocaleString("ru-RU", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            second: "numeric",
                          })
                        }}
                      </span>
                    </div>
                  </div>
                  <div
                    class="col-lg-2 d-flex align-items-center justify-content-center"
                  >
                    <button class="btn btn-success m-0" type="submit">
                      <font-awesome-icon :icon="['fas', 'floppy-disk']" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-slot:thead>
      <tr ref="thead">
        <th></th>

        <th scope="col">
          <div class="d-flex flex-row align-items-center">
            <span class="text-nowrap">Студент</span>
            <div class="dropdown">
              <button
                class="btn dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              ></button>
              <ul class="dropdown-menu">
                <li>
                  <button
                    class="dropdown-item"
                    @click="setOrdering('cadet__last_name_rus')"
                  >
                    А -> Я
                  </button>
                </li>
                <li>
                  <button
                    class="dropdown-item"
                    @click="setOrdering('-cadet__last_name_rus')"
                  >
                    Я -> А
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </th>
        <th scope="col">
          <div class="d-flex flex-row align-items-center">
            <span class="text-nowrap">Номер бланка</span>
            <div class="dropdown">
              <button
                class="btn dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              ></button>
              <ul class="dropdown-menu">
                <li>
                  <button
                    class="dropdown-item"
                    @click="setOrdering('blank_number')"
                  >
                    меньщ -> больш
                  </button>
                </li>
                <li>
                  <button
                    class="dropdown-item"
                    @click="setOrdering('-blank_number')"
                  >
                    больш -> меньш
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </th>

        <th scope="col">
          <div class="d-flex flex-row align-items-center">
            <span class="text-nowrap">Дата создания записи</span>
            <div class="dropdown">
              <button
                class="btn dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              ></button>
              <ul class="dropdown-menu">
                <li>
                  <button
                    class="dropdown-item"
                    @click="setOrdering('date_time_created')"
                  >
                    меньщ -> больш
                  </button>
                </li>
                <li>
                  <button
                    class="dropdown-item"
                    @click="setOrdering('-date_time_created')"
                  >
                    больш -> меньш
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </th>
        <th></th>
      </tr>
      <tr>
        <th></th>
        <th>
          <input
            type="text"
            class="form-control"
            v-model="searchForm.student__last_name_rus__icontains"
          />
        </th>
        <th>
          <div class="d-flex justify-content-center align-items-center">
            <input
              type="number"
              class="form-control me-2"
              v-model="searchForm.blank_number__gte"
            />
            <input
              type="number"
              class="form-control"
              v-model="searchForm.blank_number__lte"
            />
          </div>
        </th>
        <th>
          <div class="d-flex justify-content-center align-items-center">
            <input
              type="date"
              class="form-control me-2"
              v-model="searchForm.date_time_created__gte"
            />
            <input
              type="date"
              class="form-control"
              v-model="searchForm.date_time_created__lte"
            />
          </div>
        </th>
        <th></th>
      </tr>
    </template>

    <template v-slot:tbody>
      <tr
        class="align-middle"
        v-for="card in orderedCards"
        :key="card.id"
        @dblclick="showCardUpdateModal(card.id)"
      >
        <td></td>
        <td>
          <font-awesome-icon :icon="['fas', 'user']" />&nbsp;&nbsp;
          {{ card.get_student_data }}
        </td>
        <td class="text-start">
          <font-awesome-icon :icon="['fas', 'address-card']" />&nbsp;&nbsp;{{
            card.blank_number
          }}
        </td>
        <td class="text-start">
          <font-awesome-icon :icon="['fas', 'calendar-days']" />&nbsp;&nbsp;
          {{
            new Date(card.date_time_created).toLocaleString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
            })
          }}
        </td>
        <td></td>
      </tr>
    </template>

    <template v-slot:search-form-clear-button>
      <div class="d-flex flex-row align-items-between align-items-center">
        <div class="me-2">
          <button
            type="button"
            class="btn btn-primary my-4"
            @click="clearFilter"
          >
            <font-awesome-icon :icon="['fas', 'filter']" />&nbsp;&nbsp;Сбросить
            фильтр
          </button>
        </div>

        <div class="me-2">
          <button
            type="button"
            class="btn btn-success my-4"
            @click="$router.push({ name: 'pass-office-students' })"
          >
            <font-awesome-icon
              :icon="['fas', 'door-open']"
            />&nbsp;&nbsp;Вернуться к списку студентов
          </button>
        </div>
      </div>
    </template>
  </base-list-layout-for-pass-office>
</template>

<script>
import getCadetCardBlankAPIInstance from "@/api/student/studentCardBlankAPI.js"
import BaseListLayoutForPassOffice from "@/components/layouts/BaseListLayoutForPassOffice.vue"
import CadetRecordsBook from "@/components/passOffice/student/components/CadetRecordsBook.vue"
import CardRecordBlank from "@/components/passOffice/student/components/CardRecordBlank.vue"
import { debounce } from "lodash/function.js"

export default {
  name: "StudentCardBlanksView",
  components: {
    CardRecordBlank,
    CadetRecordsBook,
    BaseListLayoutForPassOffice,
  },
  data() {
    return {
      cardList: { count: 0, results: [], previous: null, next: null },
      isLoading: true,
      isError: false,
      cadetCardBlankAPIInstance: getCadetCardBlankAPIInstance(),
      searchForm: Object.assign({}, getCadetCardBlankAPIInstance().searchObj),
      currentCardBlank: null,
    }
  },
  async created() {
    await this.loadData()
  },

  methods: {
    async loadData() {
      this.isLoading = true
      const response = await this.cadetCardBlankAPIInstance.getItemsList()
      this.cardList = await response.data
      this.isLoading = false
    },
    debouncedSearch: debounce(async function () {
      this.searchForm.limit = 100

      let correctedDateTimeCreatedGTE = ""
      let correctedDateTimeCreatedLTE = ""

      if (this.searchForm.date_time_created__gte !== "") {
        correctedDateTimeCreatedGTE =
          this.searchForm.date_time_created__gte + " 00:00:00"
      }

      if (this.searchForm.date_time_created__lte !== "") {
        correctedDateTimeCreatedLTE =
          this.searchForm.date_time_created__lte + " 23:59:59.59"
      }

      this.cadetCardBlankAPIInstance.searchObj = {
        ...this.searchForm,
        date_time_created__gte: correctedDateTimeCreatedGTE,
        date_time_created__lte: correctedDateTimeCreatedLTE,
      }

      try {
        const response = await this.cadetCardBlankAPIInstance.getItemsList()
        this.cardList = await response.data
      } catch (e) {
        this.isError = true
      } finally {
      }
    }, 500),
    clearFilter() {
      this.searchForm = Object.assign(
        {},
        this.cadetCardBlankAPIInstance.searchObjDefault,
      )
    },
    async loadMoreData(entries, observer) {
      if (entries[0].isIntersecting) {
        if (this.cardList) {
          if (this.cardList.next) {
            try {
              const response = await this.cadetCardBlankAPIInstance.updateList(
                this.cardList.next,
              )

              const newData = await response.data
              this.cardList.results = [
                ...this.cardList.results,
                ...newData.results,
              ]
              this.cardList.next = newData.next
              this.cardList.previous = newData.previous
            } catch (error) {
              this.isError = true
            } finally {
            }
          }
        }
      }
    },
    async showCardUpdateModal(cardId) {
      try {
        const response =
          await this.cadetCardBlankAPIInstance.getItemData(cardId)
        this.currentCardBlank = response.data
      } catch (e) {
      } finally {
      }
      let cardUpdateModal = this.$refs.cardUpdateModal
      let myModal = new bootstrap.Modal(cardUpdateModal, {
        keyboard: false,
      })
      myModal.show()
    },
    async saveCurrentCardBlank() {
      try {
        const response = await this.cadetCardBlankAPIInstance.updateItem(
          this.currentCardBlank,
        )

        const updatedItem = await response.data
        this.cardList.results = this.cardList.results.map((item) => {
          if (item.id === updatedItem.id) {
            return { ...item, ...updatedItem }
          } else return item
        })
        this.$refs.cardUpdateModalCloseButton.click()
      } catch (e) {
      } finally {
      }
    },
    setOrdering(fieldName) {
      this.searchForm.ordering = fieldName + ",id"
    },
  },
  computed: {
    orderedCards() {
      return this.cardList.results
    },
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
