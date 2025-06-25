<template>
  <div class="container-fluid">
    <h3 class="my-4">Разделы для ООИТ</h3>
    <div style="width: 50rem">
      <div class="card my-4">
        <div class="card-body">
          <h3 class="card-title">Журнал регистрации</h3>
          <p class="card-text">
            Формирование ежедневного журнала поданных заявлений
          </p>
          <div class="d-flex flex-row align-items-end justify-content-between">
            <div style="width: 30%">
              <label for="id_journalDateFrom" class="form-label"
                >Дата (c)</label
              >
              <input
                type="date"
                class="form-control"
                v-model="journalDateFrom"
                id="id_journalDateFrom"
              />
            </div>
            <div style="width: 30%">
              <label for="id_journalDateTill" class="form-label"
                >Дата (по)</label
              >
              <input
                type="date"
                class="form-control"
                v-model="journalDateTill"
                id="id_journalDateTill"
              />
            </div>

            <button
              type="button"
              class="btn btn-primary"
              @click="getJournal"
              :disabled="isJournalProcessing"
              style="width: 30%"
            >
              <span v-if="isJournalProcessing"> Loading ... </span>
              <span v-else> Сформировать файл</span>
            </button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <h3 class="card-title">Мониторинг вступительной кампании</h3>
          <p class="card-text">
            Выберите дату и время на которые необходимо сформировать файл для
            загрузки в мониторинг.
          </p>
          <p class="card-text fw-bold fs-4">
            !!!! Данные мониторинга в локальной сети обновлятся в соответствии с
            выбранными датой и временем !!!!
          </p>
          <div class="d-flex flex-row align-items-end justify-content-between">
            <div style="width: 30%">
              <label for="id_monitoringDate" class="form-label">Дата</label>
              <input
                type="date"
                class="form-control"
                v-model="monitoringDate"
                id="id_monitoringDate"
              />
            </div>
            <div style="width: 30%">
              <label for="id_monitoringTime" class="form-label">Время</label>
              <input
                type="time"
                class="form-control"
                v-model="monitoringTime"
                id="id_monitoringTime"
              />
            </div>

            <button
              type="button"
              class="btn btn-primary"
              @click="getMonitoringFile"
              :disabled="isMonitoringProcessing"
              style="width: 30%"
            >
              <span v-if="isMonitoringProcessing"> Loading ... </span>
              <span v-else> Сформировать файл</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import getOOITAPIInstance from "@/api/cadet/ooitAPI.js"

export default {
  name: "OOITView",
  data() {
    return {
      ooitAPIInstance: getOOITAPIInstance(),
      monitoringDate: "",
      monitoringTime: "",
      journalDateFrom: "",
      journalDateTill: "",
      isMonitoringProcessing: false,
      isJournalProcessing: false,
    }
  },
  mounted() {
    this.setCurrentTime()
    this.monitoringDate = new Date().toISOString().split("T")[0]
    this.journalDateFrom = new Date().toISOString().split("T")[0]
    this.journalDateTill = new Date().toISOString().split("T")[0]
  },
  methods: {
    setCurrentTime() {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, "0")
      const minutes = String(now.getMinutes()).padStart(2, "0")
      const seconds = String(now.getSeconds()).padStart(2, "0")
      this.monitoringTime = `${hours}:${minutes}:${seconds}`
    },

    getMonitoringFile() {
      this.isMonitoringProcessing = true
      this.ooitAPIInstance
        .monitoring_data_export_in_file(
          this.monitoringDate,
          this.monitoringTime,
        )
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement("a")
          link.href = url
          link.setAttribute("download", `monitoring_data.json`)
          document.body.appendChild(link)
          link.click()
          this.isMonitoringProcessing = false
        })
    },
    getJournal() {
      this.isJournalProcessing = true
      this.ooitAPIInstance
        .entrance_applications_journal(
          this.journalDateFrom,
          this.journalDateTill,
        )
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement("a")
          link.href = url
          link.setAttribute("download", `journal.json`)
          document.body.appendChild(link)
          link.click()
          this.isJournalProcessing = false
        })
    },
  },
}
</script>

<style scoped></style>
