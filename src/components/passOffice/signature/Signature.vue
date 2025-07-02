<script>
import WacomGSS from "wacomgss-npm"
import { Button, Point, Rectangle } from "./myUtils.js"
import axios from "axios"

export default {
  data: function () {
    return {
      BTN_TEXT_CANCEL: "Отмена",
      BTN_TEXT_CLEAR: "Стереть",
      BTN_TEXT_OK: "OK",
      MAXRETRIES: 20,
      TIMEOUT_SHORT: 500,
      TIMEOUT_LONG: 1000,

      ctx: "",
      formDiv: "",
      intf: "",
      isDown: "",
      lastPoint: "",
      m_btns: [],
      m_clickBtn: -1,
      m_capability: "",
      m_encodingMode: "",
      m_imgData: "",
      m_inkThreshold: "",
      m_penData: "",
      m_usbDevices: "",
      modalBackground: "",
      protocol: "",
      retry: 0,
      tablet: "",
    }
  },
  props: {
    cadet: { type: Object, required: true },
    cadetAPI: { required: true },
  },
  methods: {
    createModalWindow(width, height) {
      this.$refs.modal.style.display = "block"

      this.$refs.myFormDiv.style.top = window.innerHeight / 2 - height + "px"
      this.$refs.myFormDiv.style.left = window.innerWidth / 2 - width + "px"
      this.$refs.myFormDiv.style.width = width * 2 + "px"
      this.$refs.myFormDiv.style.height = height * 2 + "px"

      this.$refs.canvas.height = this.$refs.myFormDiv.offsetHeight
      this.$refs.canvas.width = this.$refs.myFormDiv.offsetWidth

      this.ctx = this.$refs.canvas.getContext("2d")

      if (this.$refs.canvas.addEventListener) {
        this.$refs.canvas.addEventListener("click", this.onCanvasClick, false)
      } else if (this.$refs.canvas.attachEvent) {
        this.$refs.canvas.attachEvent("onClick", this.onCanvasClick)
      } else {
        this.$refs.canvas["onClick"] = this.onCanvasClick
      }
    },

    onCanvasClick(event) {
      let posX = event.pageX - this.$refs.myFormDiv.offsetLeft
      let posY = event.pageY - this.$refs.myFormDiv.offsetTop
      for (let i = 0; i < this.m_btns.length; i++) {
        if (this.m_btns[i].Bounds.Contains(new Point(posX, posY))) {
          this.m_btns[i].Click()
          break
        }
      }
    },

    checkForSigCaptX() {
      this.retry = this.retry + 1
      if (WacomGSS.STU.isServiceReady()) {
        this.retry = 0
        console.log("SigCaptX Web Service(драйвер): Подключено")
      } else {
        console.log("SigCaptX Web Service(драйвер): не подключено")
        if (this.retry < this.MAXRETRIES) {
          setTimeout(this.checkForSigCaptX, this.TIMEOUT_LONG)
        } else {
          alert("Не удалось подключиться к SigCaptX")
        }
      }
    },

    createModalSignature() {
      let p = new WacomGSS.STU.Protocol()
      let intf
      let m_encH
      let m_encH2

      WacomGSS.STU.isDCAReady()
        .then((message) => {
          if (!message) {
            throw new this.DCANotReady()
          }
          WacomGSS.STU.onDCAtimeout = this.onDCATimeout
          return WacomGSS.STU.getUsbDevices()
        })
        .then((message) => {
          if (message == null || message.length === 0) {
            throw new Error("Устройство для подписи не подключено")
          }

          this.m_usbDevices = message
          return WacomGSS.STU.isSupportedUsbDevice(
            this.m_usbDevices[0].idVendor,
            this.m_usbDevices[0].idProduct,
          )
        })
        .then((message) => {
          intf = new WacomGSS.STU.UsbInterface()
          return intf.Constructor()
        })

        .then((message) => {
          return intf.connect(this.m_usbDevices[0], false)
        })
        .then((message) => {
          console.log("Подключение устройства: " + message.message)
          this.tablet = new WacomGSS.STU.Tablet()
          return this.tablet.Constructor(intf, m_encH, m_encH2)
        })
        .then((message) => {
          intf = null
          return this.tablet.getInkThreshold()
        })
        .then((message) => {
          this.m_inkThreshold = message
          return this.tablet.getCapability()
        })
        .then((message) => {
          this.m_capability = message
          this.createModalWindow(
            this.m_capability.screenWidth,
            this.m_capability.screenHeight,
          )
          return this.tablet.getProductId()
        })
        .then((message) => {
          return WacomGSS.STU.ProtocolHelper.simulateEncodingFlag(
            message,
            this.m_capability.encodingFlag,
          )
        })
        .then((message) => {
          let encodingFlag = message
          if ((encodingFlag & p.EncodingFlag.EncodingFlag_24bit) !== 0) {
            return this.tablet.supportsWrite().then((message) => {
              this.m_encodingMode = message
                ? p.EncodingMode.EncodingMode_24bit_Bulk
                : p.EncodingMode.EncodingMode_24bit
            })
          } else if ((encodingFlag & p.EncodingFlag.EncodingFlag_16bit) !== 0) {
            return this.tablet.supportsWrite().then((message) => {
              this.m_encodingMode = message
                ? p.EncodingMode.EncodingMode_16bit_Bulk
                : p.EncodingMode.EncodingMode_16bit
            })
          } else {
            // assumes 1bit is available
            this.m_encodingMode = p.EncodingMode.EncodingMode_1bit
          }
        })
        .then((message) => {
          return this.tablet.setClearScreen()
        })
        .then((message) => {
          return this.tablet.isSupported(p.ReportId.ReportId_PenDataOptionMode)
        })
        .then((message) => {
          if (message) {
            return this.tablet.getProductId().then((message) => {
              let penDataOptionMode = p.PenDataOptionMode.PenDataOptionMode_None
              switch (message) {
                case WacomGSS.STU.ProductId.ProductId_520A:
                  penDataOptionMode =
                    p.PenDataOptionMode.PenDataOptionMode_TimeCount
                  break
                case WacomGSS.STU.ProductId.ProductId_430:
                case WacomGSS.STU.ProductId.ProductId_530:
                case WacomGSS.STU.ProductId.ProductId_540:
                  penDataOptionMode =
                    p.PenDataOptionMode.PenDataOptionMode_TimeCountSequence
                  break
                default:
                  console.log(
                    "Unknown tablet supporting PenDataOptionMode, setting to None.",
                  )
              }
              return this.tablet.setPenDataOptionMode(penDataOptionMode)
            })
          } else {
            this.m_encodingMode = p.EncodingMode.EncodingMode_1bit
            return this.m_encodingMode
          }
        })
        .then((message) => {
          this.addButtons()
          let canvasImage = this.$refs.canvas.toDataURL("image/jpeg")
          return WacomGSS.STU.ProtocolHelper.resizeAndFlatten(
            canvasImage,
            0,
            0,
            0,
            0,
            this.m_capability.screenWidth,
            this.m_capability.screenHeight,
            this.m_encodingMode,
            1,
            false,
            0,
            true,
          )
        })
        .then((message) => {
          this.m_imgData = message
          return this.tablet.writeImage(this.m_encodingMode, message)
        })
        .then((message) => {
          return this.tablet.setInkingMode(p.InkingMode.InkingMode_On)
        })
        .then((message) => {
          let reportHandler = new WacomGSS.STU.ProtocolHelper.ReportHandler()
          this.lastPoint = { x: 0, y: 0 }
          this.isDown = false
          this.ctx.lineWidth = 1

          let penData = (report) => {
            //console.log("report: " + JSON.stringify(report));
            this.processButtons(report, this.$refs.canvas)
            this.processPoint(report, this.$refs.canvas, this.ctx)
            this.m_penData.push(report)
          }
          let penDataEncryptedOption = (report) => {
            //console.log("reportOp: " + JSON.stringify(report));
            this.processButtons(report.penData[0], this.$refs.canvas)
            this.processPoint(report.penData[0], this.$refs.canvas, this.ctx)
            this.processButtons(report.penData[1], this.$refs.canvas)
            this.processPoint(report.penData[1], this.$refs.canvas, this.ctx)
            this.m_penData.push(report.penData[0], report.penData[1])
          }

          let log = (report) => {
            //console.log("report: " + JSON.stringify(report));
          }

          let decrypted = (report) => {
            //console.log("decrypted: " + JSON.stringify(report));
          }
          this.m_penData = new Array()
          reportHandler.onReportPenData = penData
          reportHandler.onReportPenDataOption = penData
          reportHandler.onReportPenDataTimeCountSequence = penData
          reportHandler.onReportPenDataEncrypted = penDataEncryptedOption
          reportHandler.onReportPenDataEncryptedOption = penDataEncryptedOption
          reportHandler.onReportPenDataTimeCountSequenceEncrypted = penData
          reportHandler.onReportDevicePublicKey = log
          reportHandler.onReportEncryptionStatus = log
          reportHandler.decrypt = decrypted
          return reportHandler.startReporting(this.tablet, true)
        })
        .fail((execute) => {
          console.log(execute)
        })
    },
    processButtons(point, in_canvas) {
      let nextPoint = {}
      nextPoint.x = Math.round(
        (in_canvas.width * point.x) / this.m_capability.tabletMaxX,
      )
      nextPoint.y = Math.round(
        (in_canvas.height * point.y) / this.m_capability.tabletMaxY,
      )
      let isDown2 = this.isDown
        ? !(point.pressure <= this.m_inkThreshold.offPressureMark)
        : point.pressure > this.m_inkThreshold.onPressureMark

      let btn = -1
      for (let i = 0; i < this.m_btns.length; ++i) {
        if (this.m_btns[i].Bounds.Contains(nextPoint)) {
          btn = i
          break
        }
      }

      if (this.isDown && !isDown2) {
        if (btn !== -1 && this.m_clickBtn === btn) {
          this.m_btns[btn].Click()
        }
        this.m_clickBtn = -1
      } else if (btn !== -1 && !this.isDown && isDown2) {
        this.m_clickBtn = btn
      }
      return btn === -1
    },

    addButtons() {
      this.m_btns = new Array(3)
      this.m_btns[0] = new Button()
      this.m_btns[1] = new Button()
      this.m_btns[2] = new Button()
      if (
        this.m_usbDevices[0].idProduct !== WacomGSS.STU.ProductId.ProductId_300
      ) {
        // Place the buttons across the bottom of the screen.
        let w1 = (this.m_capability.screenWidth * 2) / 6
        let w2 = (this.m_capability.screenWidth * 2 - w1) / 2
        let w3 = this.m_capability.screenWidth * 2 - w1 - w2
        let y = (this.m_capability.screenHeight * 2 * 6) / 7
        let h = this.m_capability.screenHeight * 2 - y

        this.m_btns[0].Bounds = new Rectangle(0, y, w1, h)
        this.m_btns[1].Bounds = new Rectangle(w1, y, w2, h)
        this.m_btns[2].Bounds = new Rectangle(w1 + w2, y, w3, h)
      } else {
        // The STU-300 is very shallow, so it is better to utilise
        // the buttons to the side of the display instead.

        let x = (this.m_capability.screenWidth * 3) / 4
        let w = this.m_capability.screenWidth - x

        let h2 = this.m_capability.screenHeight / 3
        let h3 = this.m_capability.screenHeight / 3
        let h1 = this.m_capability.screenHeight - h2 - h3

        this.m_btns[0].Bounds = new Rectangle(x, 0, w, h1)
        this.m_btns[1].Bounds = new Rectangle(x, h1, w, h2)
        this.m_btns[2].Bounds = new Rectangle(x, h1 + h2, w, h3)
      }

      this.m_btns[0].Text = this.BTN_TEXT_OK
      this.m_btns[1].Text = this.BTN_TEXT_CLEAR
      this.m_btns[2].Text = this.BTN_TEXT_CANCEL
      this.m_btns[0].Click = this.btnOk_Click
      this.m_btns[1].Click = this.btnClear_Click
      this.m_btns[2].Click = this.btnCancel_Click
      this.clearCanvas(this.$refs.canvas, this.ctx)
      this.drawButtons()
    },

    clearScreen() {
      this.clearCanvas(this.$refs.canvas, this.ctx)
      this.drawButtons()
      this.m_penData = new Array()
      this.tablet.writeImage(this.m_encodingMode, this.m_imgData)
    },

    btnOk_Click() {
      // You probably want to add additional processing here.
      this.generateImage()
      setTimeout(this.closeModal, 0)
    },

    btnCancel_Click() {
      // You probably want to add additional processing here.
      setTimeout(this.closeModal, 0)
    },

    btnClear_Click() {
      // You probably want to add additional processing here.
      this.clearScreen()
    },

    drawButtons() {
      // This application uses the same bitmap for both the screen and client (window).

      this.ctx.save()
      this.ctx.setTransform(1, 0, 0, 1, 0, 0)

      this.ctx.beginPath()
      this.ctx.lineWidth = 1
      this.ctx.strokeStyle = "black"
      this.ctx.font = "30px Arial"

      // Draw the buttons
      for (let i = 0; i < this.m_btns.length; ++i) {
        //if (useColor)
        {
          this.ctx.fillStyle = "rgba(0, 0, 0, 0)"
          this.ctx.fillRect(
            this.m_btns[i].Bounds.x,
            this.m_btns[i].Bounds.y,
            this.m_btns[i].Bounds.width,
            this.m_btns[i].Bounds.height,
          )
        }

        this.ctx.fillStyle = "black"
        this.ctx.rect(
          this.m_btns[i].Bounds.x,
          this.m_btns[i].Bounds.y,
          this.m_btns[i].Bounds.width,
          this.m_btns[i].Bounds.height,
        )
        let xPos =
          this.m_btns[i].Bounds.x +
          (this.m_btns[i].Bounds.width / 2 -
            this.ctx.measureText(this.m_btns[i].Text).width / 2)
        let yOffset
        if (
          this.m_usbDevices[0].idProduct ===
          WacomGSS.STU.ProductId.ProductId_300
        )
          yOffset = 28
        else if (
          this.m_usbDevices[0].idProduct ===
          WacomGSS.STU.ProductId.ProductId_430
        )
          yOffset = 40
        else yOffset = 40
        this.ctx.fillText(
          this.m_btns[i].Text,
          xPos,
          this.m_btns[i].Bounds.y + yOffset,
        )
      }
      this.ctx.stroke()
      this.ctx.closePath()

      this.ctx.restore()
    },

    processPoint(point, in_canvas, in_ctx) {
      let nextPoint = {}
      nextPoint.x = Math.round(
        (in_canvas.width * point.x) / this.m_capability.tabletMaxX,
      )
      nextPoint.y = Math.round(
        (in_canvas.height * point.y) / this.m_capability.tabletMaxY,
      )
      let isDown2 = this.isDown
        ? !(point.pressure <= this.m_inkThreshold.offPressureMark)
        : point.pressure > this.m_inkThreshold.onPressureMark

      if (!this.isDown && isDown2) {
        this.lastPoint = nextPoint
      }

      if (
        (isDown2 && 10 < this.distance(this.lastPoint, nextPoint)) ||
        (this.isDown && !isDown2)
      ) {
        in_ctx.beginPath()
        in_ctx.moveTo(this.lastPoint.x, this.lastPoint.y)
        in_ctx.lineTo(nextPoint.x, nextPoint.y)
        in_ctx.stroke()
        in_ctx.closePath()
        this.lastPoint = nextPoint
      }

      this.isDown = isDown2
    },

    distance(a, b) {
      return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)
    },

    generateImage() {
      // this.signatureImage = document.getElementById("signatureImage")
      let signatureCanvas = document.createElement("canvas")
      signatureCanvas.id = "signatureCanvas"
      signatureCanvas.height = this.m_capability.screenHeight
      signatureCanvas.width = this.m_capability.screenWidth
      let signatureCtx = signatureCanvas.getContext("2d")

      this.clearCanvas(signatureCanvas, signatureCtx, "rgb(255,255,255,0)")
      signatureCtx.lineWidth = 1.5
      signatureCtx.strokeStyle = "black"
      this.lastPoint = { x: 0, y: 0 }
      this.isDown = false

      for (let i = 0; i < this.m_penData.length; i++) {
        this.processPoint(this.m_penData[i], signatureCanvas, signatureCtx)
      }

      const base64Date = signatureCanvas.toDataURL("image/png").split(",")[1]
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
      this.savePhoto()
    },
    async savePhoto() {
      let formData = new FormData()
      formData.append("sign_image", this.$refs.input.files[0])
      const response = await this.cadetAPI.updatePhotoOrAnyFile(
        this.cadet.id,
        formData,
      )
      this.cadet = {
        ...this.cadet,
        photo: response.data.photo,
      }
    },
    DCANotReady() {
      this.DCANotReady.prototype = new Error()
    },

    closeModal() {
      WacomGSS.STU.onDCAtimeout = null

      this.disconnect()
      this.$refs.modal.style.display = "none"
    },

    onDCATimeout() {
      console.log("DCA Время подключения вышло")
      setTimeout(this.closeModal, 0)
    },

    clearCanvas(in_canvas, in_ctx, color = "white") {
      in_ctx.save()
      in_ctx.setTransform(1, 0, 0, 1, 0, 0)
      in_ctx.fillStyle = color
      in_ctx.fillRect(0, 0, in_canvas.width, in_canvas.height)
      in_ctx.restore()
    },

    disconnect() {
      let deferred = Q.defer()

      if (
        !(
          undefined === this.tablet ||
          null === this.tablet ||
          "" === this.tablet
        )
      ) {
        let p = new WacomGSS.STU.Protocol()
        this.tablet
          .setInkingMode(p.InkingMode.InkingMode_Off)
          .then((message) => {
            return this.tablet.endCapture()
          })
          .then((message) => {
            if (this.m_imgData !== null || this.m_imgData !== "") {
              return this.m_imgData.remove()
            } else {
              return message
            }
          })
          .then((message) => {
            this.m_imgData = null
            return this.tablet.setClearScreen()
          })
          .then((message) => {
            return this.tablet.disconnect()
          })
          .then((message) => {
            this.tablet = null
            this.clearCanvas(this.$refs.canvas, this.ctx)
          })
          .then((message) => {
            deferred.resolve()
          })
          .fail((message) => {
            console.log("disconnect error: " + message)
            deferred.resolve()
          })
      } else {
        deferred.resolve()
      }
      return deferred.promise
    },
    async sendImages() {
      if (!this.signatureImage) {
        console.log("Error")
      } else {
        let user = {
          signImg: this.signatureImage.src,
        }
        const response = await axios.patch(
          "http://172.200.240.2:8001/user/4/set_sign/",
          user,
        )
        console.log(response.data)
      }
      // console.log(this.signatureImage.src)
    },
  },
  created() {
    setTimeout(this.checkForSigCaptX, this.TIMEOUT_SHORT)
  },
}
</script>

<template>
  <!--  <div class="d-flex flex-row row-cols-2">-->
  <!--    <div class="d-flex flex-row">-->
  <!--      <div class="p-5 text-center">-->
  <!--        <strong>Кнопки:</strong>-->
  <!--        <div class="d-flex flex-column">-->
  <!--          <button class="btn btn-secondary" @click="createModalSignature">-->
  <!--            Подписать-->
  <!--          </button>-->
  <!--          <button class="mt-1 btn btn-secondary" @click="sendImages">-->
  <!--            Сохранить в фото-->
  <!--          </button>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--      <div class="p-5">-->
  <!--        <img-->
  <!--          style="border: 1px solid black"-->
  <!--          :height="m_capability.screenHeight"-->
  <!--          :width="m_capability.screenWidth"-->
  <!--          id="signatureImage"-->
  <!--          src="#"-->
  <!--        />-->
  <!--      </div>-->
  <!--    </div>-->
  <!--  </div>-->
  <div>
    <div style="display: none" class="active" ref="modal">
      <div class="myFormDiv" ref="myFormDiv">
        <canvas ref="canvas" class="myCanvas"></canvas>
      </div>
    </div>
    <input class="d-none" type="file" ref="input" />
    <button class="btn btn-primary m-3" @click="createModalSignature">
      Сделать подпись
    </button>
  </div>
</template>

<style scoped>
.myCanvas {
  border: 1px solid rgba(79, 195, 247, 0.3);
  border-radius: 15px;
  box-shadow: 15px 15px 30px rgba(0, 0, 0, 1);
}
.myFormDiv {
  position: absolute;
}
.active {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.4);
}
</style>
