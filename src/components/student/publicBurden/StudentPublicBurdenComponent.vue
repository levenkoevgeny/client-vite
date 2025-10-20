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
            <div>
              <div class="row">
                <div class="col-xl-6">
                  <div class="mb-3">
                    <label for="burden_start_date_add" class="form-label"
                      >Начало деятельности</label
                    >
                    <input
                      type="date"
                      class="form-control"
                      id="burden_start_date_add"
                      v-model="itemForm.burden_start_date"
                      required
                    />
                  </div>
                </div>
                <div class="col-xl-6">
                  <div class="mb-3">
                    <label for="burden_end_date_add" class="form-label">
                      Окончание деятельности</label
                    >
                    <input
                      type="date"
                      class="form-control"
                      id="burden_end_date_add"
                      v-model="itemForm.burden_end_date"
                    />
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <label for="burden_kind_data_add" class="form-label"
                  >Вид деятельности</label
                >
                <textarea
                  class="form-control"
                  id="burden_kind_data_add"
                  rows="2"
                  v-model="itemForm.burden_kind_data"
                  required
                />
              </div>
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

        <form @submit.prevent="updateMainItem">
          <div class="modal-body">
            <div>
              <div class="row">
                <div class="col-xl-6">
                  <div class="mb-3">
                    <label for="burden_start_date_add" class="form-label"
                      >Начало деятельности</label
                    >
                    <input
                      type="date"
                      class="form-control"
                      id="burden_start_date_add"
                      v-model="itemForm.burden_start_date"
                      required
                    />
                  </div>
                </div>
                <div class="col-xl-6">
                  <div class="mb-3">
                    <label for="burden_end_date_add" class="form-label">
                      Окончание деятельности</label
                    >
                    <input
                      type="date"
                      class="form-control"
                      id="burden_end_date_add"
                      v-model="itemForm.burden_end_date"
                    />
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <label for="burden_kind_data_add" class="form-label"
                  >Вид деятельности</label
                >
                <textarea
                  class="form-control"
                  id="burden_kind_data_add"
                  rows="2"
                  v-model="itemForm.burden_kind_data"
                  required
                />
              </div>
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
            <button type="submit" class="btn btn-primary">
              Сохранить запись
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="shadow p-3 mb-5 bg-body-tertiary rounded">
    <div class="card border-0">
      <div class="card-body">
        <h4>Общественная нагрузка в период обучения</h4>
        <div class="d-flex flex-row justify-content-end my-3">
          <button
            class="btn btn-warning"
            :disabled="isLoading"
            @click="showAddModal"
            type="button"
          >
            <span class="fas fa-plus me-2"></span>Добавить запись
          </button>
        </div>

        <div v-if="orderedMainList.length">
          <table class="table">
            <thead>
              <tr>
                <th>Начало деятельности (дата)</th>
                <th>Окончание деятельности (дата)</th>
                <th>Вид деятельности (текст)</th>
                <th>Вид деятельности (текст)</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="pub_burden in orderedMainList"
                @dblclick.stop="showUpdateMainItemModal(pub_burden.id)"
              >
                <th>
                  {{
                    new Date(pub_burden.burden_start_date).toLocaleString(
                      "ru-RU",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )
                  }}
                </th>
                <th v-if="pub_burden.burden_end_date">
                  {{
                    new Date(pub_burden.burden_end_date).toLocaleString(
                      "ru-RU",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )
                  }}
                </th>
                <th v-else></th>
                <th>{{ pub_burden.burden_kind_data || "Нет данных" }}</th>
                <th>
                  <div class="d-flex align-items-end justify-content-end">
                    <button
                      type="button"
                      class="btn btn-outline-danger"
                      @click="trashButtonClick(pub_burden.id)"
                      style="padding: 0.25rem 0.5rem"
                    >
                      <font-awesome-icon :icon="['fas', 'trash']" />
                    </button>
                  </div>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else>Записей нет</div>
      </div>
    </div>
  </div>
</template>

<script>
import getPublicBurdenAPIInstance from "@/api/student/publicBurdenAPI"
import EncouragementModalForCadetUpdate from "@/components/cadet/encouragement/modals/EncouragementModalForCadetUpdate.vue"

export default {
  name: "StudentPublicBurdenComponent",
  components: { EncouragementModalForCadetUpdate },
  props: {
    studentId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isLoading: true,
      mainItemList: { count: "", results: [], previous: null, next: null },
      mainItemAPIInstance: getPublicBurdenAPIInstance(),
      itemForm: Object.assign({}, getPublicBurdenAPIInstance().formData),
    }
  },
  async created() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      this.mainItemAPIInstance.searchObj.student = this.studentId
      const response = await this.mainItemAPIInstance.getItemsList()
      this.mainItemList = response.data
      this.isLoading = false
    },
    clearFormData() {
      this.itemForm = Object.assign({}, this.mainItemAPIInstance.formData)
    },
    showAddModal() {
      this.clearFormData()
      let addModal = this.$refs.mainItemAddModal
      let myModal = new bootstrap.Modal(addModal, {
        keyboard: false,
      })
      myModal.show()
    },
    async addNewMainItem() {
      this.isLoading = true
      const response = await this.mainItemAPIInstance.addItem({
        ...this.itemForm,
        student: this.studentId,
      })
      this.mainItemList.results.push(response.data)
      this.mainItemList.count = this.mainItemList.count + 1
      this.$refs.mainItemAddModalCloseButton.click()
      this.isLoading = false
    },
    async showUpdateMainItemModal(id) {
      this.clearFormData()
      const response = await this.mainItemAPIInstance.getItemData(id)
      this.itemForm = await response.data

      let updateModal = this.$refs.mainItemUpdateModal
      let myModal = new bootstrap.Modal(updateModal, {
        keyboard: false,
      })
      myModal.show()
    },
    async updateMainItem() {
      this.isLoading = true

      const response = await this.mainItemAPIInstance.updateItem(this.itemForm)
      const updatedItem = await response.data
      this.mainItemList.results = this.mainItemList.results.map((item) => {
        if (item.id === updatedItem.id) {
          return { ...item, ...updatedItem }
        } else return item
      })
      this.$refs.mainItemUpdateModalCloseButton.click()

      this.isLoading = false
    },
    async trashButtonClick(deleteItemId) {
      this.isLoading = true
      await this.mainItemAPIInstance.deleteItem(deleteItemId)
      await this.loadData()
    },
  },
  computed: {
    orderedMainList() {
      return this.mainItemList.results
    },
  },
}
</script>

<style scoped></style>
