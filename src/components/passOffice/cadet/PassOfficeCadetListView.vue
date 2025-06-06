<template>
  <base-list-layout-for-pass-office
    :is-loading="isLoading"
    :main-list-length="cadetList.count"
    title="Курсанты"
    :load-more-data="loadMoreData"
  >
    <template v-slot:modals>
      <div
        class="modal fade"
        id="itemUpdateModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        ref="itemUpdateModal"
      >
        <div class="modal-dialog modal-dialog-centered modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-3" id="exampleModalLabel">
                {{ currentCadetForUpdate.last_name_rus || "Нет данных" }}
                {{ currentCadetForUpdate.first_name_rus || "Нет данных" }}
                {{ currentCadetForUpdate.patronymic_rus || "Нет данных" }}
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <PassOfficeCadetItemView
                :current-cadet="this.currentCadetForUpdate"
                :update-photo-method="updatePhotoMethod"
              />
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
      </tr>
    </template>

    <template v-slot:tbody>
      <tr
        class="align-middle"
        v-for="cadet in orderedCadets"
        :key="cadet.id"
        @dblclick="showItemModal(cadet.id)"
      >
        <td>
          <div
            class="form-check d-flex align-items-center justify-content-center"
          >
            <input
              class="form-check-input"
              type="checkbox"
              :value="cadet.checked"
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
        <td>{{ cadet.last_name_rus }}</td>
        <td>{{ cadet.first_name_rus }}</td>
        <td>{{ cadet.patronymic_rus }}</td>
        <td>{{ cadet.get_group }}</td>
        <td>{{ cadet.student_record_book_number }}</td>
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
      <button type="button" class="btn btn-primary" @click="clearFilter">
        Сбросить фильтр
      </button>
    </template>
  </base-list-layout-for-pass-office>
</template>

<script>
import { globalCadetAPIInstanceForPassOffice } from "@/api/cadet/cadetAPI.js"
import { mapGetters } from "vuex"
import { debounce } from "lodash/function.js"
import BaseListLayoutForPassOffice from "@/components/layouts/BaseListLayoutForPassOffice.vue"
import PassOfficeCadetItemView from "@/components/passOffice/cadet/PassOfficeCadetItemView.vue"

export default {
  name: "PassOfficeCadetView",
  components: { BaseListLayoutForPassOffice, PassOfficeCadetItemView },
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
      this.isLoading = true
      this.cadetAPIInstance.searchObj = this.searchForm
      try {
        const cadetAResponse = await this.cadetAPIInstance.getItemsList()
        this.cadetList = await cadetAResponse.data
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
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
    async loadMoreData() {
      const listElem = document.getElementById("infinite_list")
      if (
        listElem.scrollTop + listElem.clientHeight >=
        listElem.scrollHeight - 1
      ) {
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
    },
    async showItemModal(itemId) {
      const response = await this.cadetAPIInstance.getItemData(itemId)
      this.currentCadetForUpdate = response.data
      let itemModal = this.$refs.itemUpdateModal
      let myModal = new bootstrap.Modal(itemModal, {
        keyboard: false,
      })
      myModal.show()
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
