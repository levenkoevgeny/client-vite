<script>
export default {
  name: "Camera",
  data() {
    return {
      photoGalleryCount: 0,
      camera: null,
      video: null,
      canvasVideo: null,
      canvasPhoto: null,
      videoTracks: {},
      videoCapabilities: {},
      videoValues: {},
      videoConstraints: {},
      changePositionFlag: false,
      mousePoints: { x: 0, y: 0 },
      borderImage: { x: 0, y: 0, w: 150, h: 150 / 0.75 },
      step: 10,
      rectColor: "#30ff00",
      fieldImage: {
        brightness: { name: "Яркость", img: "sun" },
        contrast: { name: "Контраст", img: "adjust" },
      },
      fieldCamera: {
        pan: { name: "Ось Х", img: "arrows-alt-h" },
        tilt: { name: "Ось Y", img: "arrows-alt-v" },
        zoom: { name: "Zoom", img: "search" },
      },
    }
  },

  async mounted() {
    this.videoValues = [
      { pan: true },
      { tilt: true },
      { zoom: true },
      { brightness: { ideal: 145 } },
      { contrast: { ideal: 145 } },
    ]
    const values = {
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        advanced: this.videoValues,
      },
    }
    this.camera = await navigator.mediaDevices.getUserMedia({
      ...values,
      ...this.videoValues,
    })
    const [videoTracks] = this.camera.getVideoTracks()
    this.videoTracks = videoTracks
    this.videoCapabilities = videoTracks.getCapabilities()
    this.settings = videoTracks.getSettings()

    this.setupParams(this.videoValues)

    this.video = this.$refs.video
    this.canvasVideo = this.$refs.canvasVideo
    this.canvasPhoto = this.$refs.canvasPhoto
    this.canvasVideo.setAttribute("width", this.settings.width / 2)
    this.canvasVideo.setAttribute("height", this.settings.height / 2)
    this.video.srcObject = this.camera
    this.changePosition(
      this.canvasVideo.width / 2 - this.borderImage.w / 2,
      this.canvasVideo.height / 2 - this.borderImage.h / 2,
    )
    this.createMouseEffect()
    window.addEventListener("keydown", this.handleArrowKeys)
    setInterval(() => {
      this.makeVideo()
    }, 0)
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.handleArrowKeys)
  },
  methods: {
    handleArrowKeys(e) {
      switch (e.key) {
        case "ArrowUp":
          this.changePosition(0, -this.step)
          break
        case "ArrowDown":
          this.changePosition(0, this.step)
          break
        case "ArrowLeft":
          this.changePosition(-this.step, 0)
          break
        case "ArrowRight":
          this.changePosition(this.step, 0)
          break
      }
    },
    createMouseEffect() {
      this.canvasVideo.addEventListener("mousedown", (e) => {
        this.changePositionFlag = true
        this.mousePoints.x =
          e.pageX - this.canvasVideo.offsetLeft - this.borderImage.x
        this.mousePoints.y =
          e.pageY - this.canvasVideo.offsetTop - this.borderImage.y

        const onMouseMove = (e) => {
          if (this.changePositionFlag) {
            const x = e.pageX - this.canvasVideo.offsetLeft
            const y = e.pageY - this.canvasVideo.offsetTop
            // console.log(x - this.mousePoints.x, y - this.mousePoints.y)
            this.borderImage.x = x - this.mousePoints.x
            this.borderImage.y = y - this.mousePoints.y
            this.isRangeWindow()
          }
        }
        const onMouseUp = () => {
          this.changePositionFlag = false
          window.removeEventListener("mousemove", onMouseMove)
          window.removeEventListener("mouseup", onMouseUp)
        }
        window.addEventListener("mousemove", onMouseMove)
        window.addEventListener("mouseup", onMouseUp)
      })
      this.canvasVideo.addEventListener("wheel", (e) => {
        e.preventDefault()
        const delta = e.deltaY < 0 ? this.step : -this.step
        this.changeZoom(delta)
      })
    },
    async changeConstraintsInVideoTrack(e) {
      await this.videoTracks.applyConstraints({
        advanced: Object.entries(this.videoValues).map(([key, value]) => ({
          [key]: value,
        })),
      })
    },
    resetConstraintsInVideoTrack() {
      this.videoValues = {
        brightness: 125,
        contrast: 125,
        pan: 0,
        tilt: 0,
        zoom: 100,
      }
      this.changeConstraintsInVideoTrack(1)
    },
    setupParams(values) {
      this.videoValues = {}
      for (let index in values) {
        const key = Object.keys(values[index])[0]
        const capability = this.videoCapabilities[key]
        this.videoValues[key] = this.settings[key]
        if (!Array.isArray(capability)) {
          if (capability.step === undefined) {
            this.videoConstraints[key] = { ...capability, step: 1 }
          } else {
            this.videoConstraints[key] = { ...capability }
          }
        } else {
          this.videoConstraints[key] = capability
        }
      }
    },
    makeVideo() {
      const context = this.canvasVideo.getContext("2d", {
        willReadFrequently: true,
      })
      context.drawImage(
        this.video,
        0,
        0,
        this.canvasVideo.width,
        this.canvasVideo.height,
      )
      context.strokeStyle = this.rectColor
      context.lineWidth = 3
      context.strokeRect(
        this.borderImage.x - 3,
        this.borderImage.y - 3,
        this.borderImage.w + 6,
        this.borderImage.h + 6,
      )
    },
    makePhoto() {
      if (this.$refs.gallery.children.length === 5) {
        this.$refs.gallery.removeChild(this.$refs.gallery.lastChild)
        this.photoGalleryCount -= 1
      }
      this.photoGalleryCount += 1
      const canvas = document.createElement("canvas")
      canvas.width = 150
      canvas.height = 200
      const ctx = canvas.getContext("2d")
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(
        this.canvasVideo,
        this.borderImage.x,
        this.borderImage.y,
        this.borderImage.w,
        this.borderImage.h,
        0,
        0,
        canvas.width,
        canvas.height,
      )
      const imgUrl = canvas.toDataURL("image/png", 1)
      const photoItem = document.createElement("div")
      photoItem.className = "photoItem"
      photoItem.addEventListener("click", this.selectedPhoto)

      const img = document.createElement("img")
      img.src = imgUrl
      photoItem.appendChild(img)
      this.$refs.gallery.prepend(photoItem)
    },
    selectedPhoto(e) {
      const oldElement = this.$refs.gallery.querySelectorAll(".activePhotoItem")
      if (oldElement.length > 0) {
        oldElement.forEach((item) => item.classList.remove("activePhotoItem"))
      }
      e.target.parentElement.classList.add("activePhotoItem")
    },
    changePosition(x = 0, y = 0) {
      this.borderImage.x += x
      this.borderImage.y += y
      this.isRangeWindow()
    },
    isRangeWindow() {
      const x2 = this.borderImage.x + this.borderImage.w
      if (this.borderImage.x <= 0) this.borderImage.x = 0
      if (x2 >= this.canvasVideo.width)
        this.borderImage.x = this.canvasVideo.width - this.borderImage.w

      const y2 = this.borderImage.y + this.borderImage.h
      if (this.borderImage.y <= 0) this.borderImage.y = 0
      if (y2 >= this.canvasVideo.height)
        this.borderImage.y = this.canvasVideo.height - this.borderImage.h
    },
    changeZoom(zoom) {
      const centX = this.borderImage.x + this.borderImage.w / 2
      const centY = this.borderImage.y + this.borderImage.h / 2
      let newW = this.borderImage.w + zoom
      if (newW < 20) newW = 20
      let newH = newW / 0.75

      this.borderImage.x = centX - newW / 2
      this.borderImage.y = centY - newH / 2
      this.borderImage.w = newW
      this.borderImage.h = newH
    },
    uploadPhoto() {
      let item = this.$refs.gallery.querySelectorAll(".activePhotoItem")
      if (item.length === 0) {
        alert("Не выбрана фотография для загрузки")
      } else {
        item = item[0].lastChild
        const base64Date = item.src.split(",")[1]
        const binaryString = atob(base64Date)
        const bytes = new Uint8Array(binaryString.length)

        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }

        const blob = new Blob([bytes], { type: "image/png" })
        const file = new File([blob], "image.png", { type: "image/png" })

        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)

        this.$refs.input.files = dataTransfer.files

        // Отправка на сервер???
        // const formData = new FormData();
        // formData.append('image', file);
        //
        // fetch('/upload', {
        // 	method: 'POST',
        // 	body: formData
        // });
      }
    },
  },
}
</script>

<template>
  <div class="mainContainer">
    <div class="cameraSection">
      <h2 class="sectionTitle">
        <font-awesome-icon :icon="['fas', 'camera']" /> Предпросмотр камеры
      </h2>
      <div class="videoContainer">
        <video class="d-none" ref="video" autoplay></video>
        <canvas id="canvasVideo" ref="canvasVideo"></canvas>
      </div>
      <div class="w-100">
        <h2 class="galleryTitle">Галерея фотографий</h2>
        <div class="photosContainer" ref="gallery"></div>
      </div>
      <div class="divSaveButton" v-if="photoGalleryCount > 0">
        <button
          @click="uploadPhoto"
          class="mainBtn"
          style="display: inline; margin-top: 15px"
        >
          <font-awesome-icon :icon="['fas', 'floppy-disk']" />
          Сохранить выбранную фотографию
        </button>
        <div>
          <input type="file" ref="input" />
        </div>
      </div>
    </div>
    <div class="controlsSection">
      <h2 class="sectionTitle">
        <font-awesome-icon :icon="['fas', 'sliders']" /> Управление областью
        фотографирования
      </h2>

      <div class="ptzControls">
        <div></div>
        <button class="ptzBtn" @click="changePosition(0, -step)">
          <font-awesome-icon :icon="['fas', 'arrow-up']" />
        </button>
        <div class="ptzZoom">
          <button
            class="ptzBtn"
            style="background-color: transparent; border: 0px"
            @click="changeZoom(step)"
          >
            <font-awesome-icon :icon="['fas', 'search-plus']" />
          </button>
          <button
            class="ptzBtn"
            style="background-color: transparent; border: 0px"
            @click="changeZoom(-step)"
          >
            <font-awesome-icon :icon="['fas', 'search-minus']" />
          </button>
        </div>

        <button class="ptzBtn" @click="changePosition(-step, 0)">
          <font-awesome-icon :icon="['fas', 'arrow-left']" />
        </button>
        <div class="divStep">
          <h2
            class="sectionTitle"
            style="margin: 0 0 10px 0; font-size: 1.5rem"
          >
            Шаг рамки
          </h2>
          <input class="inputStep" type="number" v-model="step" min="0" />
        </div>
        <button class="ptzBtn" @click="changePosition(step, 0)">
          <font-awesome-icon :icon="['fas', 'arrow-right']" />
        </button>
        <div></div>
        <button class="ptzBtn" @click="changePosition(0, step)">
          <font-awesome-icon :icon="['fas', 'arrow-down']" />
        </button>
      </div>

      <div class="controlGroup">
        <div class="controlTitle">
          <font-awesome-icon :icon="['fas', 'sun']" />

          <span>Настройки изображения</span>
        </div>
        <template v-for="(object, key) in fieldImage">
          <div v-if="videoConstraints[key]" class="sliderContainer">
            <span style="color: #81d4fa; flex: 1">
              <!--              <i class="fas" :class="object.img"></i>-->
              <font-awesome-icon :icon="['fas', object.img]" />
              {{ object.name }}:
            </span>
            <input
              @input="changeConstraintsInVideoTrack"
              :name="key"
              :min="videoConstraints[key].min"
              :max="videoConstraints[key].max"
              :step="videoConstraints[key].step"
              v-model="videoValues[key]"
              type="range"
              class="slider"
            />
            <div class="valueDisplay" id="brightness-display">
              {{ videoValues[key] }}
            </div>
          </div>
        </template>
      </div>

      <div class="controlGroup">
        <div class="controlTitle">
          <font-awesome-icon :icon="['fas', 'arrows-alt']" />

          <span>Положение камеры</span>
        </div>
        <template v-for="(object, key) in fieldCamera">
          <div v-if="videoConstraints[key]" class="sliderContainer">
            <span style="color: #81d4fa; flex: 1">
              <font-awesome-icon :icon="['fas', object.img]" />
              {{ object.name }}:
            </span>

            <input
              type="range"
              @input="changeConstraintsInVideoTrack"
              :name="key"
              :min="videoConstraints[key].min"
              :max="videoConstraints[key].max"
              :step="videoConstraints[key].step"
              v-model="videoValues[key]"
              class="slider"
            />
            <div class="valueDisplay" id="pan-display">
              {{ videoValues[key] }}
            </div>
          </div>
        </template>
      </div>

      <div class="actionButtons">
        <button class="mainBtn" @click="makePhoto" id="capture-btn">
          <font-awesome-icon :icon="['fas', 'camera']" />
          Сделать снимок
        </button>
        <button
          class="mainBtn"
          @click="resetConstraintsInVideoTrack"
          id="reset-btn"
        >
          <font-awesome-icon :icon="['fas', 'redo']" />
          Сбросить настройки
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.mainContainer {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  justify-content: center;
  max-width: 1500px;
  margin: 0 auto;
  width: 100%;
  animation: slideUp 0.8s ease;
}

.cameraSection {
  flex: 2;
  min-width: 600px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(79, 195, 247, 0.3);
}

.controlsSection {
  flex: 1;
  min-width: 500px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(79, 195, 247, 0.3);
}

.videoContainer {
  position: relative;
  width: 100%;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 25px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

#canvasVideo {
  width: 100%;
  object-fit: cover;
  transition:
    transform 0.3s ease,
    filter 0.3s ease;
}

.sectionTitle {
  font-size: 1.8rem;
  margin-bottom: 25px;
  text-align: center;
  color: #4fc3f7;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.ptzControls {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 15px;
  height: 300px;
  margin-bottom: 30px;
}

.ptzZoom {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin: 18px 10px;
}

.ptzBtn {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: #4fc3f7;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.ptzBtn:hover {
  background: rgba(79, 195, 247, 0.2);
  transform: scale(1.05);
}

.ptzBtn:active {
  transform: scale(0.95);
}

.controlGroup {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 25px;
}

.controlTitle {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  font-size: 1.2rem;
  color: #81d4fa;
}

.sliderContainer {
  display: flex;
  align-items: center;
  gap: 15px;
}

.sliderContainer:nth-child(n + 1) {
  margin-top: 15px;
}

.slider {
  flex: 2;
  height: 10px;
  -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  outline: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #4fc3f7;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 0 10px rgba(79, 195, 247, 0.5);
}

.slider::-webkit-slider-thumb:hover {
  background: #81d4fa;
  transform: scale(1.1);
}

.valueDisplay {
  width: 70px;
  text-align: center;
  font-weight: bold;
  background: rgba(191, 228, 244, 0.2);
  padding: 8px;
  border-radius: 10px;
  font-size: 1.1rem;
}

.inputStep {
  padding: 10px 15px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
  background-color: #e1e1e1;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  width: 75%;
  outline: none;
  text-align: center;
}

.inputStep:focus {
  border-color: #2c7be5;
  box-shadow: 0 0 0 3px rgba(44, 123, 229, 0.25);
}

/* Стили для кнопок увеличения/уменьшения в WebKit браузерах */
.inputStep::-webkit-inner-spin-button,
.inputStep::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Альтернативный вариант для Firefox */
.inputStep {
  -moz-appearance: textfield;
}

.divStep {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.actionButtons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.mainBtn {
  background: linear-gradient(to right, #4fc3f7, #29b6f6);
  color: #fff;
  border: none;
  padding: 15px 30px;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 220px;
}
.mainBtn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}
#capture-btn {
  background: linear-gradient(to right, #66bb6a, #43a047);
}

#reset-btn {
  background: linear-gradient(to right, #ef5350, #e53935);
}

.galleryTitle {
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 20px;
  color: #ffcc00;
}

.photosContainer {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.photoItem {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
  transition: all 0.3s;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.photoItem:hover {
  transform: scale(1.05);
  border-color: #ffcc00;
}

.photoItem img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.activePhotoItem {
  border: 2px solid rgba(255, 0, 0, 0.4) !important;
}
.activePhotoItem:hover {
  transform: scale(1.05);
  border-color: rgb(250, 2, 2) !important;
}
.divSaveButton {
  width: 100%;
  text-align: center;
}
</style>
