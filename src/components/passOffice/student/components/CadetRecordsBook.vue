<template>
  <form @submit.prevent="saveCadetCardForm">
    <div class="border-top border-2 py-3">
      <div class="row fs-4">
        <div class="col-lg-2 d-flex align-items-center justify-content-center">
          {{ cadetData.last_name_rus }}
        </div>
        <div class="col-lg-2 d-flex align-items-center justify-content-center">
          {{ cadetData.first_name_rus }}
        </div>
        <div class="col-lg-2 d-flex align-items-center justify-content-center">
          {{ cadetData.patronymic_rus }}
        </div>
        <div class="col-lg-4 d-flex align-items-center justify-content-center">
          <input
            type="number"
            class="form-control form-control-sm fs-5"
            id="id_blank_number"
            placeholder="Номер бланка"
            v-model="newCadetCardForm.blank_number"
            min="1"
            required
          />
        </div>
        <div class="col-lg-1 d-flex align-items-center justify-content-center">
          <button
            class="btn btn-success m-0"
            type="submit"
            :disabled="isSaving"
          >
            <font-awesome-icon :icon="['fas', 'floppy-disk']" />
          </button>
        </div>
      </div>
      <div class="row">
        <div
          class="col-lg-2 d-flex align-items-center justify-content-center"
        ></div>
        <div
          class="col-lg-2 d-flex align-items-center justify-content-center"
        ></div>
        <div
          class="col-lg-2 d-flex align-items-center justify-content-center"
        ></div>
        <div class="col-lg-4">
          <div class="form-text" v-if="newCadetCardForm.date_time_created">
            <span class="bg-success-subtle p-2 w-100" style="width: 100%">
              Дата записи -
              {{
                new Date(newCadetCardForm.date_time_created).toLocaleString(
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
            </span>
          </div>
          <div class="form-text" v-else>
            <span class="bg-warning-subtle my-1 p-2">Запись не сохранена</span>
          </div>
        </div>
        <div class="col-lg-1"></div>
      </div>
    </div>
  </form>
</template>

<script>
import getCadetCardBlankAPIInstance from "@/api/student/studentCardBlankAPI.js"
export default {
  name: "CadetRecordsBook",
  props: {
    cadetData: { type: Object, required: true },
  },
  data() {
    return {
      isSaving: false,
      isError: false,
      newCadetCardForm: {
        student: this.cadetData.id,
        blank_number: "",
      },
      cadetCardBlankAPIInstance: getCadetCardBlankAPIInstance(),
    }
  },
  methods: {
    async saveCadetCardForm(e) {
      this.isSaving = true
      try {
        if (this.newCadetCardForm.date_time_created) {
          const response = await this.cadetCardBlankAPIInstance.updateItem(
            this.newCadetCardForm,
          )
          this.newCadetCardForm = { ...this.newCadetCardForm, ...response.data }
        } else {
          const response = await this.cadetCardBlankAPIInstance.addItem(
            this.newCadetCardForm,
          )
          this.newCadetCardForm = { ...this.newCadetCardForm, ...response.data }
        }
      } catch (e) {
        console.log(e)
        this.isError = true
      } finally {
        this.isSaving = false
      }
    },
  },
}
</script>

<style scoped></style>
