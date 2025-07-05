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

  <div class="container-fluid">
    <div style="height: 30px"></div>
    <h3 class="my-4">
      <router-link class="" :to="{ name: 'pass-office-fpk-prk' }">
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
      <div class="row">
        <div class="col-xxl-8 border">
          <h1>Сведения о записи</h1>
          <h3 class="card-title my-2">
            Фамилия -
            <span class="fw-bold">{{ currentCadetData.last_name_rus }}</span>
          </h3>
          <h3 class="card-title my-2">
            Имя -
            <span class="fw-bold">{{ currentCadetData.first_name_rus }}</span>
          </h3>
          <h3 class="card-title my-2">
            Отчество -
            <span class="fw-bold">{{ currentCadetData.patronymic_rus }}</span>
          </h3>
          <h3 class="card-title my-2">
            Группа -
            <span v-if="currentCadetData.group" class="fw-bold">{{
              currentCadetData.group
            }}</span
            ><span v-else class="fw-bold">Нет данных</span>
          </h3>
          <h3 class="card-title my-2">
            Дата рождения -
            <span v-if="currentCadetData.date_of_birth" class="fw-bold">{{
              currentCadetData.date_of_birth
            }}</span
            ><span v-else class="fw-bold">Нет данных</span>
          </h3>
        </div>
        <div class="col-xxl-4">
          <div class="border">
            <div class="text-center m-3">
              <img
                v-if="currentCadetData.photo"
                :src="currentCadetData.photo"
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
            </div>
            <div class="d-flex justify-content-end align-items-center">
              <input
                type="file"
                v-on:change="uploadPhoto"
                ref="uploadedPhoto"
                name="photo_file"
                accept="image/png, image/jpeg"
              />
              <button class="btn btn-primary m-3" @click="showItemModal">
                Сделать фото (камера)
              </button>
            </div>
          </div>

          <div class="border">
            <div class="text-center m-3">
              <img
                v-if="currentCadetData.sign_image"
                :src="currentCadetData.sign_image"
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
            </div>

            <div class="d-flex justify-content-end align-items-center">
              <Signature @save-signature-event="saveSignature" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { globalFPKPRKStudentAPIInstanceForPassOffice } from "@/api/fpkprk/fpk_prk_studentAPI.js"
import { mapGetters } from "vuex"
import Camera from "@/components/passOffice/Camera.vue"
import Signature from "@/components/passOffice/signature/Signature.vue"

export default {
  components: { Signature, Camera },
  data() {
    return {
      isLoading: true,
      isDataSaving: false,
      cadetAPIInstance: globalFPKPRKStudentAPIInstanceForPassOffice,
      currentCadetData: {
        id: "",
        is_active: "",
        last_name_rus: "",
        first_name_rus: "",
        patronymic_rus: "",
        photo: "",
        sign_image: "",
        group: "",
        date_of_birth: "",
      },
    }
  },
  async created() {
    await this.loadData(this.$route.params.id)
  },
  methods: {
    async loadData(cadetId) {
      try {
        const res = await this.cadetAPIInstance.getItemData(cadetId)
        this.currentCadetData = await res.data
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
      const response = await this.cadetAPIInstance.updatePhotoOrAnyFile(
        this.currentCadetData.id,
        formData,
      )
      this.currentCadetData = {
        ...this.currentCadetData,
        photo: response.data.photo,
      }
      this.$refs.cadetCameraModalCloseButton.click()
    },

    async saveSignature(signFile) {
      let formData = new FormData()
      formData.append("sign_image", signFile)
      const response = await this.cadetAPIInstance.updatePhotoOrAnyFile(
        this.currentCadetData.id,
        formData,
      )
      this.currentCadetData = {
        ...this.currentCadetData,
        sign_image: response.data.sign_image,
      }
    },

    async uploadPhoto() {
      let formData = new FormData()
      formData.append("photo", this.$refs.uploadedPhoto.files[0])
      const response = await this.cadetAPIInstance.updatePhotoOrAnyFile(
        this.currentCadetData.id,
        formData,
      )
      this.currentCadetData = {
        ...this.currentCadetData,
        photo: response.data.photo,
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
