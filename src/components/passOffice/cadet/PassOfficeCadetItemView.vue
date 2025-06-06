<!--https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API/Taking_still_photos-->

<template>
  <div class="container">
    <div>
      <button>up</button>
    </div>

    <input
      type="range"
      @change="setScale"
      :min="minZoom"
      :max="maxZoom"
      :step="zoomStep"
      :value="(maxZoom + minZoom) / 2"
    />

    <input
      type="range"
      @change="setPan"
      :min="minPan"
      :max="maxPan"
      :step="panStep"
      :value="(maxPan + minPan) / 2"
    />
    <div class="row">
      <div class="col-12">
        <div class="row">
          <div class="col-6">
            <div class="mb-3 border border-1 p-3 rounded-2">
              <h3>Камера</h3>
              <video ref="video" autoplay @canplay="playVideo"></video>
              <br />
              <br />
              <br />
              <button
                id="start-button"
                class="btn btn-secondary"
                @click="takePicture"
                v-if="streaming"
              >
                Сделать фото
              </button>
            </div>
            <div class="mb-3 border border-1 p-3 rounded-2">
              <h3>Снимок</h3>
              <canvas ref="canvas" style="transform: rotate(90deg)"> </canvas>
            </div>
          </div>
          <div class="col-6">
            <h3>Текущее фото</h3>
            <img
              v-if="currentCadet.photo"
              :src="currentCadet.photo"
              class="rounded-2"
              alt="..."
              style="width: 100%"
            />
            <img
              v-else
              src="../../../assets/without_photo.jpg"
              class="rounded-2"
              alt="..."
              style="width: 100%"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-6">
            <div class="d-flex flex-row">
              <button class="btn btn-primary me-4" @click="startCapture">
                <font-awesome-icon
                  :icon="['fas', 'camera']"
                />&nbsp;&nbsp;Включить камеру
              </button>
              <button class="btn btn-primary me-4">
                <font-awesome-icon
                  :icon="['fas', 'floppy-disk']"
                />&nbsp;&nbsp;Сохранить фото
              </button>
            </div>
          </div>
          <div class="col-6">
            <div class="d-flex flex-row">
              <label for="uploadedPhoto" class="btn btn-primary"
                ><font-awesome-icon
                  :icon="['fas', 'image']"
                />&nbsp;&nbsp;Загрузить фото с диска</label
              >
              <input
                type="file"
                class="btn btn-primary"
                v-on:change="uploadPhoto"
                ref="uploadedPhoto"
                id="uploadedPhoto"
                name="photo_file"
                accept="image/*"
                style="display: none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { globalCadetAPIInstanceForPassOffice } from "@/api/cadet/cadetAPI.js"

export default {
  name: "CadetPassOfficeItemView",
  props: {
    currentCadet: {
      type: Object,
      required: true,
    },
    updatePhotoMethod: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      cadetAPIInstance: globalCadetAPIInstanceForPassOffice,
      video: null,
      canvas: null,
      photo: null,
      streaming: false,
      width: 400,
      camera: null,
      videoTrack: [],
      capabilities: null,
      settings: null,

      minZoom: 1,
      maxZoom: 1,
      zoomStep: 1,
      minPan: 1,
      maxPan: 1,
      panStep: 1,
      minTilt: 1,
      maxTilt: 1,
      tiltStep: 1,

      panValue: 0,
    }
  },
  async mounted() {
    this.video = this.$refs.video
    this.canvas = this.$refs.canvas
    this.photo = this.$refs.photo

    this.camera = await navigator.mediaDevices.getUserMedia({
      video: true,
    })

    const [videoTrack] = this.camera.getVideoTracks()
    this.videoTrack = videoTrack
    console.log(videoTrack)
    console.log(this.videoTrack)
    this.capabilities = this.videoTrack.getCapabilities()
    console.log(this.capabilities)
    this.settings = this.videoTrack.getSettings()
    this.panValue = this.settings.pan
    this.minZoom = this.capabilities.zoom.min
    this.maxZoom = this.capabilities.zoom.max
    this.zoomStep = this.capabilities.zoom.step
    this.minPan = this.capabilities.pan.min
    this.maxPan = this.capabilities.pan.max
    this.panStep = this.capabilities.pan.step
    this.video.srcObject = this.camera

    this.camera = await navigator.mediaDevices.getUserMedia({
      video: { pan: true, tilt: true, zoom: true },
    })
    this.video.srcObject = this.camera
    this.video.play()

    document.addEventListener("keydown", async function (event) {
      if (event.key === "ArrowUp") {
        console.log("Up arrow key pressed")
        // Add your logic for up arrow action
      } else if (event.key === "ArrowDown") {
        console.log("Down arrow key pressed")
        // Add your logic for down arrow action
      } else if (event.key === "ArrowLeft") {
        this.panValue = this.panValue - this.panStep
        await this.videoTrack.applyConstraints({
          advanced: [{ pan: this.panValue }],
        })
      } else if (event.key === "ArrowRight") {
        console.log("Right arrow key pressed")
        // Add your logic for right arrow action
      }
    })
  },
  methods: {
    async setScale(e) {
      await this.videoTrack.applyConstraints({
        advanced: [{ zoom: e.target.value }],
      })
    },
    async setPan(e) {
      await this.videoTrack.applyConstraints({
        advanced: [{ pan: e.target.value }],
      })
    },
    startCapture() {
      try {
        navigator.mediaDevices
          .getUserMedia({
            video: { pan: true, tilt: true, zoom: 270 },
          })
          .then((stream) => {
            this.video.srcObject = stream
            this.videoTrack = stream.getVideoTracks()
            this.capabilities = this.videoTrack.getCapabilities()
            this.video.play()
          })
          .catch(() => {
            alert("Ошибка подключения камеры!")
          })
      } catch (error) {
        alert(error)
      }
    },
    playVideo() {
      if (!this.streaming) {
        const height =
          (this.video.videoHeight / this.video.videoWidth) * this.width
        this.video.setAttribute("width", this.width)
        this.video.setAttribute("height", height)
        this.canvas.setAttribute("width", this.width)
        this.canvas.setAttribute("height", height)
        this.streaming = true
      }
    },
    takePicture() {
      let height = (this.video.videoHeight / this.video.videoWidth) * this.width
      const context = this.canvas.getContext("2d")
      context.drawImage(this.video, 0, 0, this.width, height)
      // const data = this.canvas.toDataURL("image/jpeg")
      // this.photo.setAttribute("src", data)
    },
    async uploadPhoto() {
      let formData = new FormData()
      formData.append("photo", this.$refs.uploadedPhoto.files[0])

      const response = await this.cadetAPIInstance.updatePhotoOrAnyFile(
        this.currentCadet.id,
        formData,
      )
      this.updatePhotoMethod(response)
    },
  },
}
</script>

<style scoped></style>
