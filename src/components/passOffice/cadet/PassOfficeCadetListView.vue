<template>
  <base-list-layout-for-pass-office
    :is-loading="isLoading"
    :main-list-length="cadetList.count"
    :selected-items-count="selectedItemsCount"
    title="Курсанты"
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

      <!--      <div-->
      <!--        class="modal fade"-->
      <!--        id="cadetAddModal"-->
      <!--        tabindex="-1"-->
      <!--        aria-labelledby="exampleModalLabel"-->
      <!--        aria-hidden="true"-->
      <!--        ref="cadetAddModal"-->
      <!--      >-->
      <!--        <div class="modal-dialog modal-dialog-centered">-->
      <!--          <div class="modal-content">-->
      <!--            <div class="modal-header">-->
      <!--              <h1 class="modal-title fs-5" id="exampleModalLabel">-->
      <!--                Добавление личного дела-->
      <!--              </h1>-->
      <!--              <button-->
      <!--                type="button"-->
      <!--                class="btn-close"-->
      <!--                data-bs-dismiss="modal"-->
      <!--                aria-label="Close"-->
      <!--              ></button>-->
      <!--            </div>-->

      <!--            <form @submit.prevent="addNewCadetForEntrance">-->
      <!--              <div class="modal-body">-->
      <!--                <div class="mb-3">-->
      <!--                  <label for="id_last_name_rus" class="form-label"-->
      <!--                  >Фамилия</label-->
      <!--                  >-->
      <!--                  <input-->
      <!--                    type="text"-->
      <!--                    class="form-control"-->
      <!--                    id="id_last_name_rus"-->
      <!--                    v-model="cadetNewForm.last_name_rus"-->
      <!--                    required-->
      <!--                  />-->
      <!--                </div>-->
      <!--                <div class="mb-3">-->
      <!--                  <label for="id_first_name_rus" class="form-label">Имя</label>-->
      <!--                  <input-->
      <!--                    type="text"-->
      <!--                    class="form-control"-->
      <!--                    id="id_first_name_rus"-->
      <!--                    v-model="cadetNewForm.first_name_rus"-->
      <!--                    required-->
      <!--                  />-->
      <!--                </div>-->
      <!--                <div class="mb-3">-->
      <!--                  <label for="id_patronymic_rus" class="form-label"-->
      <!--                  >Отчество</label-->
      <!--                  >-->
      <!--                  <input-->
      <!--                    type="text"-->
      <!--                    class="form-control"-->
      <!--                    id="id_patronymic_rus"-->
      <!--                    v-model="cadetNewForm.patronymic_rus"-->
      <!--                    required-->
      <!--                  />-->
      <!--                </div>-->
      <!--                <div class="mb-3">-->
      <!--                  <label for="id_date_of_birth" class="form-label"-->
      <!--                  >Дата рождения</label-->
      <!--                  >-->
      <!--                  <input-->
      <!--                    type="date"-->
      <!--                    class="form-control"-->
      <!--                    id="id_date_of_birth"-->
      <!--                    v-model="cadetNewForm.date_of_birth"-->
      <!--                    required-->
      <!--                  />-->
      <!--                </div>-->
      <!--              </div>-->
      <!--              <div class="modal-footer">-->
      <!--                <button-->
      <!--                  type="button"-->
      <!--                  class="btn btn-secondary"-->
      <!--                  data-bs-dismiss="modal"-->
      <!--                  ref="cadetAddModalCloseButton"-->
      <!--                >-->
      <!--                  Закрыть без сохранения-->
      <!--                </button>-->
      <!--                <button-->
      <!--                  type="submit"-->
      <!--                  class="btn btn-primary"-->
      <!--                  :disabled="isLoading"-->
      <!--                >-->
      <!--                  Сохранить-->
      <!--                </button>-->
      <!--              </div>-->
      <!--            </form>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </div>-->
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
              name: 'pass-office-cadet-update',
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

        <div class="dropdown">
          <button
            class="btn btn-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Печать документов
          </button>
          <ul class="dropdown-menu">
            <li>
              <a
                class="dropdown-item"
                @click="make_student_record_book()"
                style="cursor: pointer"
                >Зачетные книжки</a
              >
            </li>
            <li>
              <a
                class="dropdown-item"
                @click="make_student_card()"
                style="cursor: pointer"
                >Студенческие билеты</a
              >
            </li>
          </ul>
        </div>
      </div>
    </template>
  </base-list-layout-for-pass-office>
</template>

<script>
import { globalCadetAPIInstanceForPassOffice } from "@/api/cadet/cadetAPI.js"
import { mapGetters } from "vuex"
import { debounce } from "lodash/function.js"
import BaseListLayoutForPassOffice from "@/components/layouts/BaseListLayoutForPassOffice.vue"
import PassOfficeCadetItemView from "@/components/passOffice/cadet/PassOfficeCadetItemView.vue"
import Camera from "@/components/passOffice/Camera.vue"

export default {
  name: "PassOfficeCadetView",
  components: { Camera, BaseListLayoutForPassOffice, PassOfficeCadetItemView },
  data() {
    return {
      cadetList: { count: 0, results: [], previous: null, next: null },
      isLoading: true,
      isError: false,
      cadetAPIInstance: globalCadetAPIInstanceForPassOffice,
      searchForm: Object.assign(
        {},

        globalCadetAPIInstanceForPassOffice.searchObj,
      ),
      currentCadetForUpdate: {},
      error_list: [],
    }
  },
  async created() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      this.isLoading = true
      const response = await this.cadetAPIInstance.getItemsList()
      this.cadetList = await response.data
      this.isLoading = false
    },
    debouncedSearch: debounce(async function () {
      this.searchForm.limit = 100
      this.cadetAPIInstance.searchObj = this.searchForm
      try {
        const cadetAResponse = await this.cadetAPIInstance.getItemsList()
        this.cadetList = await cadetAResponse.data
      } catch (e) {
        this.isError = true
      } finally {
      }
    }, 500),
    clearFilter() {
      this.searchForm = Object.assign(
        {},
        this.cadetAPIInstance.searchObjDefault,
      )
    },

    async make_student_record_book() {
      this.error_list = []
      if (this.selectedItems.length) {
        let items_array = []
        this.selectedItems.map((item) => items_array.push(item.id))
        await this.cadetAPIInstance.makeStudentRecordBook(items_array)
      } else {
        alert("Не выбрано ни одной записи!")
      }
    },

    async make_student_card() {
      this.error_list = []
      if (!this.selectedItems.length) {
        alert("Не выбрано ни одной записи!")
      } else {
        let items_array = []
        this.selectedItems.map((item) => items_array.push(item.id))
        const response =
          await this.cadetAPIInstance.makeStudentCard(items_array)
        console.log(response)
        if (response.data.error_list) {
          console.log(response.data.error_list)
          this.error_list = response.data.error_list
          let errorModal = this.$refs.printErrorModal
          let myModal = new bootstrap.Modal(errorModal, {
            keyboard: false,
          })
          myModal.show()
        } else {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement("a")
          link.href = url
          link.setAttribute("download", "students_cards.pdf")
          document.body.appendChild(link)
          link.click()
        }
      }
    },

    async loadMoreData(entries, observer) {
      if (entries[0].isIntersecting) {
        if (this.cadetList) {
          if (this.cadetList.next) {
            try {
              const response = await this.cadetAPIInstance.updateList(
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
      return this.selectedItems.length
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
