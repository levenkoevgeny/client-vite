<template>
  <div>
    <h1 class="text-secondary-emphasis fst-italic">
      Данные пропуска в Академию
    </h1>
    <div v-if="passCardData">
      <h3 class="card-title my-2 text-secondary-emphasis fst-italic">
        UID карты -
        <span class="fw-bold">{{ passCardData.card_uuid }}</span>
      </h3>
    </div>
    <div v-else>
      <h3>Для данной записи не найдены привязанные карты пропуска</h3>
    </div>
    <div style="height: 50px"></div>

    <div>
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label"
          >UID карты приложенной к считывателю</label
        >
        <input type="text" class="form-control" v-model="cardUID" disabled />
      </div>
      <div>
        <button class="btn btn-success me-2" @click="readCardUIDAndCheck">
          <span v-if="isCardReading">... Считывание карты</span>
          <span v-else>Считать карту</span>
        </button>
        <button
          class="btn btn-primary"
          @click="writePassCard"
          :disabled="cardUID.length === 0 || this.isCardWriting"
        >
          <span v-if="isCardWriting">... Запись карты</span>
          <span v-else>Записать карту</span>
        </button>
      </div>

      <div v-if="foundCard && getPassCardOwner" class="my-4">
        <div
          v-if="getPassCardOwner.id === currentItem.id"
          class="alert alert-success"
        >
          Считанная карта привязана к данной записи
        </div>

        <div v-else class="alert alert-danger">
          Считанная карта уже привязана к
          {{ getPassCardOwner.last_name_rus }}
          {{ getPassCardOwner.first_name_rus }}
          {{ getPassCardOwner.patronymic_rus }} (категория -
          {{ getPassCardOwner.category }})
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import getPassCardAPIInstance from "@/api/passOffice/passCardAPI.js"
import getStudentAPIInstance from "@/api/student/studentAPI.js"

export default {
  name: "PassCard",
  props: {
    passCardData: { type: Object, required: false },
    currentItem: { type: Object, required: true },
    category: { type: String, required: true },
  },
  data() {
    return {
      cardUID: "",
      isCardReading: false,
      isCardWriting: false,
      passCardAPIInstance: getPassCardAPIInstance(),
      studentAPIInstance: getStudentAPIInstance(),
      passCardSearchForm: Object.assign({}, getPassCardAPIInstance().searchObj),
      foundCard: null,
    }
  },
  methods: {
    async connected() {
      try {
        let port = await navigator.serial.getPorts()
        if (!port.length) {
          port = [await navigator.serial.requestPort()]
        }
        await port[0].open({
          baudRate: 9600,
          dataBits: 8,
          stopBits: 1,
          parity: "none",
          bufferSize: 1024,
        })
        const reader = await port[0].readable.getReader()
        const writer = await port[0].writable.getWriter()
        const encoder = new TextEncoder()
        await writer.write(encoder.encode("R"))
        let data_chunk = new Uint8Array([])
        while (true) {
          const { done, value } = await reader.read()
          data_chunk = new Uint8Array([...data_chunk, ...value])
          if (data_chunk.at(-2) === 13 && data_chunk.at(-1) === 10) {
            reader.releaseLock()
            writer.releaseLock()
            break
          }
        }
        port[0].close()
        return data_chunk
      } catch (e) {
        console.log(e)
      }
    },
    splitCard(uid) {
      return uid.match(/..?/g).reverse().join("")
    },
    async readCardUID() {
      // let data_chunk = await this.connected()
      // const decoder = new TextDecoder()
      // data_chunk = decoder.decode(data_chunk)
      // const regex = /\[(.*?)\]/.exec(data_chunk)
      // this.cardUID = regex
      //   ? "0000" + this.splitCard(regex[1])
      //   : "Карта не найдена"
      this.cardUID = "FF000"

      this.foundCard = { card_uuid: this.cardUID }
    },

    async readCardUIDAndCheck() {
      if (this.cardUID !== "") {
        this.isCardReading = true
        await this.readCardUID()

        this.passCardAPIInstance.searchObj.card_uuid = this.cardUID
        const passCardsListResponse =
          await this.passCardAPIInstance.getItemsList()

        const foundPassCardData = passCardsListResponse.data

        if (foundPassCardData.results) {
          if (foundPassCardData.results.length > 0) {
            this.foundCard = foundPassCardData.results[0]
          }
        }
        this.isCardReading = false
      }
    },

    async writePassCard() {
      this.isCardWriting = true

      const response = await this.passCardAPIInstance.savePassCard(
        this.foundCard.card_uuid,
        this.category,
        this.currentItem.id,
      )

      this.foundCard = response.data
      this.isCardWriting = false
    },
  },
  computed: {
    getPassCardOwner() {
      if (this.foundCard) {
        if (this.foundCard.cadet) {
          return { ...this.foundCard.cadet, category: "Курсант" }
        } else if (this.foundCard.student) {
          return { ...this.foundCard.student, category: "Студент" }
        } else if (this.foundCard.employee) {
          return {
            ...this.foundCard.employee,
            category: "Сотрудник или гражданский персонал",
          }
        } else if (this.foundCard.fpk_prk) {
          return {
            ...this.foundCard.fpk_prk,
            category: "ФПКиПРК / Магистратура",
          }
        } else return undefined
      } else return undefined
    },
  },
}
</script>

<style scoped></style>
