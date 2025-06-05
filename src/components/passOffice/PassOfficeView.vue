<!--https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API/Taking_still_photos-->

<template>
  <navigation-layout>
    <template v-slot:menu>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link active" :to="{ name: 'navigation' }">
              Раздел навигации
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'pass-office-main' }">
              Главная
            </router-link>
          </li>
        </ul>
      </div>
    </template>
  </navigation-layout>

  <div class="container-fluid">
    <div class="my-4"></div>

    <div class="card" style="width: 45rem">
      <div class="card-body">
        <h5 class="card-title">Выберите категорию</h5>
        <select class="form-select" @change="categorySelectChange">
          <option selected value="">-----</option>
          <option value="employees">Сотрудники</option>
          <option value="cadets">Курсанты</option>
          <option value="students">Студенты</option>
          <option value="fpk-prk">ФПКиПРК / МАГ</option>
        </select>
      </div>
    </div>
  </div>

  <router-view></router-view>

  <!--  <video ref="video" width="320" @canplay="playVideo">Stream</video>-->

  <!--  <button @click="takePicture">Take a picture</button>-->

  <!--  <canvas ref="canvas"> </canvas>-->
  <!--  <div class="output">-->
  <!--    <img ref="photo" alt="The screen capture will appear in this box." />-->
  <!--  </div>-->
</template>

<script>
import NavigationLayout from "@/components/layouts/NavigationLayout.vue"

export default {
  name: "PassOfficeView",
  components: { NavigationLayout },
  data() {
    return { video: null, canvas: null, photo: null, width: 320 }
  },
  mounted() {
    // this.video = this.$refs.video
    // this.canvas = this.$refs.canvas
    // this.photo = this.$refs.photo
    // this.startCapture()
  },
  methods: {
    categorySelectChange(e) {
      this.$router.push({ path: `/pass-office/${e.target.value}` })
    },

    // startCapture() {
    //   navigator.mediaDevices
    //     .getUserMedia({ video: true, audio: false })
    //     .then((stream) => {
    //       this.video.srcObject = stream
    //       this.video.play()
    //     })
    // },
    // playVideo() {
    //   const height =
    //     (this.video.videoHeight / this.video.videoWidth) * this.width
    //
    //   this.video.setAttribute("width", this.width)
    //   this.video.setAttribute("height", height)
    //   this.canvas.setAttribute("width", this.width)
    //   this.canvas.setAttribute("height", height)
    // },
    // takePicture() {
    //   let width = 320
    //   let height = (this.video.videoHeight / this.video.videoWidth) * width
    //   const context = this.canvas.getContext("2d")
    //   context.drawImage(this.video, 0, 0, width, height)
    //   const data = this.canvas.toDataURL("image/jpeg")
    //   this.photo.setAttribute("src", data)
    // },
    // clearPhoto() {},
  },
}
</script>

<style scoped></style>
