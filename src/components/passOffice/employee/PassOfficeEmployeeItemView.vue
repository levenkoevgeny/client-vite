<template>
  <div
    class="modal fade"
    id="itemUpdateModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    ref="itemUpdateModal"
  >
    <div
      class="modal-dialog modal-dialog-centered"
      style="--bs-modal-width: 100%"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-3" id="exampleModalLabel"></h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            ref="cadetCameraModalCloseButton"
          ></button>
        </div>
        <Camera @save-photo-event="savePhoto" />
      </div>
    </div>
  </div>

  <div class="container">
    <div style="height: 30px"></div>
    <h3 class="my-4">
      <router-link class="" :to="{ name: 'pass-office-employees' }">
        Вернуться к списку
      </router-link>
    </h3>
    <div
      v-if="isLoading || isCommonLoading"
      class="d-flex justify-content-center align-items-center"
      style="height: calc(100vh - 200px)"
    >
      <div class="spinner-grow" style="width: 3rem; height: 3rem" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else>
      <h1>Сотрудники и гражданский персонал</h1>
      <div class="card shadow-lg p-3 mb-5 rounded bg-body-secondary-phoenix">
        <div class="card-body">
          <div class="row">
            <div class="col-xxl-8 border-end">
              <h1 class="text-secondary-emphasis fst-italic">
                <font-awesome-icon
                  :icon="['fas', 'address-card']"
                />&nbsp;Сведения о записи
              </h1>
              <h3 class="card-title my-2 text-secondary-emphasis fst-italic">
                Фамилия -
                <span class="fw-bold">{{
                  currentEmployeeData.last_name_rus
                }}</span>
              </h3>
              <h3 class="card-title my-2 text-secondary-emphasis fst-italic">
                Имя -
                <span class="fw-bold">{{
                  currentEmployeeData.first_name_rus
                }}</span>
              </h3>
              <h3 class="card-title my-2 text-secondary-emphasis fst-italic">
                Отчество -
                <span class="fw-bold">{{
                  currentEmployeeData.patronymic_rus
                }}</span>
              </h3>
              <h3 class="card-title my-2 text-secondary-emphasis fst-italic">
                Дата рождения -
                <span v-if="currentEmployeeData.date_of_birth" class="fw-bold">
                  {{
                    new Date(currentEmployeeData.date_of_birth).toLocaleString(
                      "ru-RU",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )
                  }} </span
                ><span v-else class="fw-bold">Нет данных</span>
              </h3>
              <div class="border border-2 my-3"></div>
              <div>
                <PassCard
                  :pass-card-data="passCard"
                  :current-item="currentEmployeeData"
                  category="Сотрудники или гражданский персонал"
                />
              </div>
            </div>
            <div class="col-xxl-4">
              <div>
                <div class="d-flex justify-content-center">
                  <div class="text-center position-relative">
                    <img
                      v-if="currentEmployeeData.photo"
                      :src="currentEmployeeData.photo"
                      class="rounded-2"
                      alt="..."
                      style="width: 250px"
                    />
                    <img
                      v-else
                      src="../../../assets/without_photo.jpg"
                      class="rounded-2"
                      alt="..."
                      style="width: 250px"
                    />
                    <input
                      type="file"
                      v-on:change="uploadPhoto"
                      ref="uploadedPhoto"
                      name="photo_file"
                      accept="image/png, image/jpeg"
                      style="position: absolute; bottom: 10px; left: 20px"
                    />
                  </div>
                </div>

                <div class="d-flex justify-content-center">
                  <button class="btn btn-primary m-3" @click="showItemModal">
                    Сделать фото (камера)
                  </button>
                </div>
              </div>

              <div class="border my-3"></div>

              <div>
                <div class="d-flex justify-content-center">
                  <div class="text-center position-relative">
                    <img
                      v-if="currentEmployeeData.sign_image"
                      :src="currentEmployeeData.sign_image"
                      class="rounded-2"
                      alt="..."
                      style="width: 250px; background-color: #fff"
                    />
                    <img
                      v-else
                      src="../../../assets/without_signature.jpg"
                      class="rounded-2"
                      alt="..."
                      style="width: 250px"
                    />

                    <input
                      type="file"
                      v-on:change="uploadSignature"
                      ref="uploadedSignature"
                      name="photo_file"
                      accept="image/png, image/jpeg"
                      style="position: absolute; bottom: 10px; left: 20px"
                    />
                  </div>
                </div>

                <div class="d-flex justify-content-center">
                  <Signature @save-signature-event="saveSignature" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { globalEmployee3VAPIInstance } from "@/api/employee/employee_3v_API.js"
import PassCard from "@/components/passOffice/common/PassCard.vue"
import Signature from "@/components/passOffice/signature/Signature.vue"
import Camera from "@/components/passOffice/Camera.vue"
import getPassCardAPIInstance from "@/api/passOffice/passCardAPI.js"
import { mapGetters } from "vuex"

export default {
  name: "PassOfficeEmployeeItemView",
  components: { PassCard, Signature, Camera },
  data() {
    return {
      isLoading: true,
      isDataSaving: false,
      employeeAPIInstance: globalEmployee3VAPIInstance,
      currentEmployeeData: {
        id: "",
        is_active: "",
        last_name_rus: "",
        first_name_rus: "",
        patronymic_rus: "",
        photo: "",
        sign_image: "",
        date_of_birth: "",
      },
      passCard: null,
      passCardAPIInstance: getPassCardAPIInstance(),
      passCardSearchForm: Object.assign({}, getPassCardAPIInstance().searchObj),
    }
  },
  async created() {
    await this.loadData(this.$route.params.id)
  },
  methods: {
    async loadData(employeeId) {
      try {
        const res = await this.employeeAPIInstance.getItemData(employeeId)
        this.currentEmployeeData = await res.data
        if (this.currentEmployeeData.pass_card) {
          const passCardResponse = await this.passCardAPIInstance.getItemData(
            this.currentEmployeeData.pass_card,
          )
          this.passCard = passCardResponse.data
        }
      } catch (error) {
      } finally {
        this.isLoading = false
      }
    },

    async showItemModal(itemId) {
      let itemModal = this.$refs.itemUpdateModal
      let myModal = new bootstrap.Modal(itemModal, {
        keyboard: false,
      })
      myModal.show()
    },
    async savePhoto(photoFile) {
      let formData = new FormData()
      formData.append("photo", photoFile)
      const response = await this.employeeAPIInstance.updatePhotoOrAnyFile(
        this.currentEmployeeData.id,
        formData,
      )
      this.currentEmployeeData = {
        ...this.currentEmployeeData,
        photo: response.data.photo,
      }
      this.$refs.cadetCameraModalCloseButton.click()
    },

    async saveSignature(signFile) {
      let formData = new FormData()
      formData.append("sign_image", signFile)
      const response = await this.employeeAPIInstance.updatePhotoOrAnyFile(
        this.currentEmployeeData.id,
        formData,
      )
      this.currentEmployeeData = {
        ...this.currentEmployeeData,
        sign_image: response.data.sign_image,
      }
    },

    async uploadPhoto() {
      let formData = new FormData()
      formData.append("photo", this.$refs.uploadedPhoto.files[0])
      const response = await this.employeeAPIInstance.updatePhotoOrAnyFile(
        this.currentEmployeeData.id,
        formData,
      )
      this.currentEmployeeData = {
        ...this.currentEmployeeData,
        photo: response.data.photo,
      }
    },
    async uploadSignature() {
      let formData = new FormData()
      formData.append("sign_image", this.$refs.uploadedSignature.files[0])
      const response = await this.employeeAPIInstance.updatePhotoOrAnyFile(
        this.currentEmployeeData.id,
        formData,
      )
      this.currentEmployeeData = {
        ...this.currentEmployeeData,
        sign_image: response.data.sign_image,
      }
    },
  },
  computed: {
    ...mapGetters({
      isCommonLoading: "common/getIsCommonLoading",
    }),
  },
}
</script>

<style scoped></style>
