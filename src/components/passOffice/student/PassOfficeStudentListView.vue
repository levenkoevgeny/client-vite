<template>
  <base-list-layout-for-pass-office
    :is-loading="isLoading"
    :main-list-length="cadetList.count"
    :selected-items-count="selectedItemsCount"
    title="Факультет права"
    :load-more-data="loadMoreData"
  >
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
            <li><a class="dropdown-item" href="#">Зачетные книжки</a></li>
            <li><a class="dropdown-item" href="#">Студенческие билеты</a></li>
          </ul>
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

export default {
  name: "PassOfficeStudentListView",
  components: { Camera, BaseListLayoutForPassOffice, PassOfficeCadetItemView },
  data() {
    return {
      cadetList: { count: 0, results: [], previous: null, next: null },
      isLoading: true,
      isError: false,
      cadetAPIInstance: globalStudentAPIInstanceForPassOffice,
      searchForm: Object.assign(
        {},
        globalStudentAPIInstanceForPassOffice.searchObj,
      ),
      currentCadetForUpdate: {},
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
    async updatePhotoMethod(response) {
      this.currentCadetForUpdate = {
        ...this.currentCadetForUpdate,
        photo: response.data.photo,
      }
    },
    async loadMoreData(entries, observer) {
      console.log("loadMoreData")
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
    selectedItemsCount() {
      let counter = 0
      this.cadetList.results.map((item) => {
        if (item.isSelected) {
          counter++
        }
      })
      return counter
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
