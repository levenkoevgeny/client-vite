<!--https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API/Taking_still_photos-->

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
      <router-link class="" :to="{ name: 'pass-office-cadet' }">
        Вернуться к списку курсантов
      </router-link>
    </h3>
    <div
      v-if="isLoading || isCommonLoading"
      class="d-flex justify-content-center align-items-center"
    >
      <div class="spinner-grow" style="width: 3rem; height: 3rem" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else>
      <div class="d-flex flex-row">
        <div class="card d-flex flex-row me-3" style="width: 80rem">
          <div>
            <div class="text-center m-3" style="position: relative">
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
              <input
                type="file"
                v-on:change="uploadPhoto"
                ref="uploadedPhoto"
                name="photo_file"
                accept="image/png, image/jpeg"
                style="position: absolute; bottom: 10px; left: 10px"
              />
            </div>
            <div>
              <button class="btn btn-primary m-3" @click="showItemModal">
                Сделать фото (камера)
              </button>
            </div>
          </div>

          <div>
            <div class="text-center m-3 border" style="position: relative">
              <img
                v-if="currentCadetData.sign_image"
                :src="currentCadetData.sign_image"
                class="rounded-2"
                alt="..."
                style="width: 250px; background-color: #fff"
              />
              <img
                v-else
                src="../../../assets/without_photo.jpg"
                class="rounded-2"
                alt="..."
                style="width: 250px"
              />
            </div>
            <div>
              <!--              <Signature-->
              <!--                :cadet="currentCadetData"-->
              <!--                :cadet-a-p-i="cadetAPIInstance"-->
              <!--              />-->
            </div>
          </div>

          <div class="card-body">
            <h3 class="card-title fw-bold">
              {{ currentCadetData.last_name_rus }}
              {{ currentCadetData.first_name_rus }}
              {{ currentCadetData.patronymic_rus }}
            </h3>
            <h3 class="card-title">
              Факультет -
              <span v-if="currentCadetData.subdivision">{{
                currentCadetData.get_subdivision
              }}</span
              ><span v-else>Нет данных</span>
            </h3>
            <h3 class="card-title">
              Группа -
              <span v-if="currentCadetData.group">{{
                currentCadetData.group
              }}</span
              ><span v-else>Нет данных</span>
            </h3>
            <h3 class="card-title">
              Дата рождения -
              <span v-if="currentCadetData.date_of_birth">{{
                currentCadetData.date_of_birth
              }}</span
              ><span v-else>Нет данных</span>
            </h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { globalCadetAPIInstanceForPassOffice } from "@/api/cadet/cadetAPI.js"
import { mapGetters } from "vuex"
import Camera from "@/components/passOffice/Camera.vue"
import Signature from "@/components/passOffice/signature/Signature.vue"

export default {
  name: "CadetPassOfficeItemView",
  components: { Signature, Camera },

  data() {
    return {
      isLoading: true,
      isDataSaving: false,
      cadetAPIInstance: globalCadetAPIInstanceForPassOffice,
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
