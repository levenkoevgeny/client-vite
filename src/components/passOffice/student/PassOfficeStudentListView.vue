<template>
  <base-list-layout-for-pass-office
    :is-loading="isLoading"
    :main-list-length="cadetList.count"
    :selected-items-count="selectedItemsCount"
    title="Факультет права"
    :load-more-data="loadMoreData"
  >
    <template v-slot:modals>
      <div
        class="modal fade"
        id="printErrorModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        ref="printErrorModal"
      >
        <div class="modal-dialog modal-dialog-centered modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5">
                Исправте следующие ошибки для формирования документа:
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div style="max-height: 350px; overflow-y: auto">
                <div
                  class="alert alert-danger my-1"
                  v-for="error in error_list"
                >
                  {{ error }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="modal fade"
        id="studentRecordBookModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        ref="studentRecordBookModal"
      >
        <div class="modal-dialog modal-dialog-centered modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-3">
                Заполните номера бланков студенческих билетов
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div style="max-height: 600px; overflow-y: auto">
                <div class="container-fluid">
                  <div class="row my-3">
                    <div class="col-10">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Поиск по фамилии"
                        v-model="lastNameSearch"
                      />
                    </div>
                  </div>
                  <div class="my-1" v-for="cadet in filteredCadetRecordsCards">
                    <CadetRecordsBook :cadet-data="cadet" :key="new Date()" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="modal fade"
        id="studentRecordBookModalForOneStudent"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        ref="studentRecordBookModalForOneStudent"
      >
        <div class="modal-dialog modal-dialog-centered modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-3">
                Номера бланков студенческих билетов
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div style="max-height: 600px; overflow-y: auto">
                <div class="container-fluid">
                  <div
                    class="d-flex justify-content-end align-items-center my-3"
                  >
                    <button
                      class="btn btn-primary"
                      @click="addNewEmptyCardBlank"
                    >
                      <font-awesome-icon
                        :icon="['fas', 'address-card']"
                      />&nbsp;&nbsp;Добавить запись
                    </button>
                  </div>
                  <div
                    class="my-1"
                    v-for="cardRecordBlank in cadetRecordsCardsForOneStudent.results"
                    v-if="cadetRecordsCardsForOneStudent.results.length > 0"
                  >
                    <CardRecordBlank :card-data="cardRecordBlank" />
                  </div>
                  <div v-else>Записей нет</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-slot:thead>
      <tr ref="thead">
        <th scope="col"></th>
        <th scope="col"></th>
        <th scope="col">Фамилия</th>
        <th scope="col">Имя</th>
        <th scope="col">Отчество</th>
        <th scope="col">Группа</th>
        <th scope="col">Номер зачетной книжки</th>
        <th scope="col">Подпись</th>
        <th scope="col">Выданные студенческие билеты</th>
      </tr>
      <tr>
        <th>
          <div
            class="form-check d-flex align-items-center justify-content-center"
          >
            <input
              class="form-check-input"
              type="checkbox"
              @change="checkAllHandler($event)"
            />
          </div>
        </th>
        <th></th>
        <th>
          <input
            type="text"
            class="form-control"
            v-model="searchForm.last_name_rus__icontains"
            style="width: 300px"
          />
        </th>
        <th></th>
        <th></th>
        <th>
          <v-select
            v-model="searchForm.group__in"
            :options="orderedGroups"
            label="group_name"
            :reduce="(group) => group.id"
            multiple
          />
        </th>
        <th>
          <input
            type="text"
            id="last_name_rus_search"
            class="form-control"
            v-model="searchForm.student_record_book_number__icontains"
          />
        </th>
        <th></th>
        <th></th>
      </tr>
    </template>

    <template v-slot:tbody>
      <tr class="align-middle" v-for="cadet in orderedCadets" :key="cadet.id">
        <td>
          <div
            class="form-check d-flex align-items-center justify-content-center"
          >
            <input
              class="form-check-input"
              type="checkbox"
              v-model="cadet.isSelected"
            />
          </div>
        </td>
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
            src="../../../assets/without_photo.jpg"
            class="img-thumbnail bg-body border-0"
            alt="..."
            style="width: 50px"
          />
        </td>
        <td>
          <router-link
            :to="{
              name: 'pass-office-student-update',
              params: { id: cadet.id },
            }"
          >
            {{ cadet.last_name_rus }}
          </router-link>
        </td>
        <td>{{ cadet.first_name_rus }}</td>
        <td>{{ cadet.patronymic_rus }}</td>
        <td>{{ cadet.get_group }}</td>
        <td>{{ cadet.student_record_book_number }}</td>
        <td>
          <span
            v-if="cadet.sign_image"
            class="bg-success-subtle p-2 rounded rounded-1"
            >да</span
          ><span v-else class="bg-warning-subtle p-2 rounded rounded-1"
            >нет</span
          >
        </td>
        <td class="text-center">
          <button class="btn btn-warning" @click="showCardBlanks(cadet.id)">
            <font-awesome-icon :icon="['fas', 'address-card']" />
          </button>
        </td>
      </tr>
    </template>
    <template v-slot:search-form>
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
        <label for="last_name_rus_search" class="form-label"
          >Номер зачетной книжки</label
        >
        <input
          type="text"
          id="last_name_rus_search"
          class="form-control"
          v-model="searchForm.student_record_book_number__icontains"
        />
      </div>
    </template>
    <template v-slot:search-form-clear-button>
      <div class="d-flex flex-row align-items-between align-items-center">
        <div class="me-2">
          <button
            type="button"
            class="btn btn-primary my-4"
            @click="clearFilter"
          >
            Сбросить фильтр
          </button>
        </div>

        <div class="dropdown me-2">
          <button
            class="btn btn-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <font-awesome-icon :icon="['fas', 'print']" />&nbsp;&nbsp;Печать
            документов
          </button>
          <ul class="dropdown-menu">
            <li>
              <a
                class="dropdown-item"
                @click="make_student_record_book()"
                style="cursor: pointer"
                >Сформировать зачетные книжки для выбранных записей</a
              >
            </li>
            <li>
              <a
                class="dropdown-item"
                @click="make_student_card()"
                style="cursor: pointer"
                >Сформировать студенческие билеты для выбранных записей</a
              >
            </li>
          </ul>
        </div>
        <div class="me-2">
          <button
            type="button"
            class="btn btn-warning my-4"
            @click="$router.push({ name: 'pass-office-student-card-blanks' })"
          >
            <font-awesome-icon :icon="['fas', 'address-card']" />&nbsp;&nbsp;
            Список использованных бланков студенческих билетов
          </button>
        </div>
      </div>
    </template>
  </base-list-layout-for-pass-office>
</template>

<script>
import { globalStudentAPIInstanceForPassOffice } from "@/api/student/studentAPI.js"
import { mapGetters } from "vuex"
import { debounce } from "lodash/function.js"
import BaseListLayoutForPassOffice from "@/components/layouts/BaseListLayoutForPassOffice.vue"
import PassOfficeCadetItemView from "@/components/passOffice/cadet/PassOfficeCadetItemView.vue"
import Camera from "@/components/passOffice/Camera.vue"
import CadetRecordsBook from "@/components/passOffice/student/components/CadetRecordsBook.vue"
import CardRecordBlank from "@/components/passOffice/student/components/CardRecordBlank.vue"
import getCadetCardBlankAPIInstance from "@/api/student/studentCardBlankAPI.js"

export default {
  name: "PassOfficeStudentListView",
  components: {
    Camera,
    CadetRecordsBook,
    CardRecordBlank,
    BaseListLayoutForPassOffice,
    PassOfficeCadetItemView,
  },
  data() {
    return {
      cadetList: { count: 0, results: [], previous: null, next: null },
      isLoading: true,
      isError: false,
      studentAPIInstance: globalStudentAPIInstanceForPassOffice,
      searchForm: Object.assign(
        {},
        globalStudentAPIInstanceForPassOffice.searchObj,
      ),
      currentCadetForUpdate: {},
      error_list: [],
      cadetRecordsCards: [],
      cadetRecordsCardsForOneStudent: { results: [] },
      currentCadetForRecordsCardsForOneStudent: null,
      lastNameSearch: "",
      cadetCardBlankAPIInstance: getCadetCardBlankAPIInstance(),
    }
  },
  async created() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      this.isLoading = true
      const response = await this.studentAPIInstance.getItemsList()
      this.cadetList = await response.data
      this.isLoading = false
    },
    debouncedSearch: debounce(async function () {
      this.searchForm.limit = 100
      this.studentAPIInstance.searchObj = this.searchForm
      try {
        const cadetAResponse = await this.studentAPIInstance.getItemsList()
        this.cadetList = await cadetAResponse.data
      } catch (e) {
        this.isError = true
      } finally {
      }
    }, 500),
    clearFilter() {
      this.searchForm = Object.assign(
        {},
        this.studentAPIInstance.searchObjDefault,
      )
    },
    async updatePhotoMethod(response) {
      this.currentCadetForUpdate = {
        ...this.currentCadetForUpdate,
        photo: response.data.photo,
      }
    },
    async loadMoreData(entries, observer) {
      if (entries[0].isIntersecting) {
        if (this.cadetList) {
          if (this.cadetList.next) {
            try {
              const response = await this.studentAPIInstance.updateList(
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
      }
    },
    checkAllHandler(e) {
      if (e.target.checked) {
        this.cadetList.results = this.cadetList.results.map((item) => ({
          ...item,
          isSelected: true,
        }))
      } else {
        this.cadetList.results = this.cadetList.results.map((item) => ({
          ...item,
          isSelected: false,
        }))
      }
    },
    async make_student_record_book() {
      this.error_list = []
      this.cadetRecordsCards = []
      if (!this.selectedItems.length) {
        alert("Не выбрано ни одной записи!")
      } else {
        let items_array = []
        this.selectedItems.map((item) => items_array.push(item.id))
        const validationResponse =
          await this.studentAPIInstance.validateDataBeforeMakingStudentRecordBook(
            items_array,
          )
        if (validationResponse.data.error_list.length) {
          this.error_list = validationResponse.data.error_list
          let errorModal = this.$refs.printErrorModal
          let myModal = new bootstrap.Modal(errorModal, {
            keyboard: false,
          })
          myModal.show()
        } else {
          const response =
            await this.studentAPIInstance.makeStudentRecordBook(items_array)
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement("a")
          link.href = url
          link.setAttribute("download", "students_records_books.pdf")
          document.body.appendChild(link)
          link.click()
        }
      }
    },
    async make_student_card() {
      this.error_list = []
      if (!this.selectedItems.length) {
        alert("Не выбрано ни одной записи!")
      } else {
        let items_array = []
        this.selectedItems.map((item) => items_array.push(item.id))

        const validationResponse =
          await this.studentAPIInstance.validateDataBeforeMakingStudentCard(
            items_array,
          )
        if (validationResponse.data.error_list.length) {
          this.error_list = validationResponse.data.error_list
          let errorModal = this.$refs.printErrorModal
          let myModal = new bootstrap.Modal(errorModal, {
            keyboard: false,
          })
          myModal.show()
        } else {
          const response =
            await this.studentAPIInstance.makeStudentCard(items_array)
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement("a")
          link.href = url
          link.setAttribute("download", "students_cards.pdf")
          document.body.appendChild(link)
          link.click()
          this.cadetList.results.forEach((value, index, array) => {
            array[index].init = true
          })
          this.cadetRecordsCards = this.cadetList.results.filter((cadet) =>
            items_array.includes(cadet.id),
          )
          let studentRecordBookModal = this.$refs.studentRecordBookModal
          let myModal = new bootstrap.Modal(studentRecordBookModal, {
            keyboard: false,
          })
          myModal.show()
        }
      }
    },
    async showCardBlanks(studentId) {
      this.currentCadetForRecordsCardsForOneStudent = studentId
      try {
        this.cadetRecordsCardsForOneStudent = { results: [] }
        this.cadetCardBlankAPIInstance.searchObj.student = studentId
        const response = await this.cadetCardBlankAPIInstance.getItemsList()
        this.cadetRecordsCardsForOneStudent = response.data

        console.log(this.cadetRecordsCardsForOneStudent)

        let studentRecordBookModalForOneStudent =
          this.$refs.studentRecordBookModalForOneStudent
        let myModal = new bootstrap.Modal(studentRecordBookModalForOneStudent, {
          keyboard: false,
        })
        myModal.show()
      } catch (e) {
      } finally {
      }
    },
    addNewEmptyCardBlank() {
      this.cadetRecordsCardsForOneStudent.results.push({
        student: this.currentCadetForRecordsCardsForOneStudent,
        blank_number: "",
      })
    },
  },
  computed: {
    orderedCadets() {
      return this.cadetList.results
    },
    orderedGroups() {
      return this.groups.results
    },
    orderedRanks() {
      return this.ranks.results
    },
    orderedSubdivisions() {
      return this.subdivisions.results.filter(
        (subdivision) => subdivision.subdivision_category === "1",
      )
    },
    selectedItems() {
      return this.cadetList.results.filter((item) => item.isSelected)
    },
    selectedItemsCount() {
      let counter = 0
      this.cadetList.results.map((item) => {
        if (item.isSelected) {
          counter++
        }
      })
      return counter
    },
    filteredCadetRecordsCards() {
      return this.cadetRecordsCards.filter((record) =>
        record.last_name_rus
          .toLowerCase()
          .includes(this.lastNameSearch.toLowerCase()),
      )
    },
    ...mapGetters({
      groups: "groups/getList",
      ranks: "ranks/getList",
      subdivisions: "subdivisions/getList",
      isCommonLoading: "common/getIsCommonLoading",
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
