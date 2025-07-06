<template>
  <div class="container-fluid">
    <h3 class="my-4">Разделы для ООИТ</h3>
    <div style="width: 70rem">
      <div class="card my-4">
        <div class="card-body">
          <h3 class="card-title">Журнал регистрации</h3>
          <p class="card-text">
            Формирование ежедневного журнала поданных заявлений
          </p>
          <div class="d-flex flex-row align-items-end justify-content-between">
            <div>
              <label class="form-label" for="id_speciality"
                >Специальность (квота)</label
              >
              <select
                id="id_speciality"
                class="form-select"
                v-model="specialityForJournal"
              >
                <option value="">---------</option>
                <option
                  :value="quota.id"
                  v-for="quota in orderedAdmissionQuotes"
                >
                  {{ quota.quota_verbose_name }}
                </option>
              </select>
            </div>

            <div>
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
            <div>
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
            <div style="width: 60%">
              <label for="id_monitoringDateTime" class="form-label"
                >Дата и время</label
              >
              <input
                type="datetime-local"
                class="form-control"
                id="id_monitoringDateTime"
                v-model="monitoringDateTime"
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
import { mapGetters } from "vuex"

export default {
  name: "OOITView",
  data() {
    return {
      ooitAPIInstance: getOOITAPIInstance(),
      monitoringDateTime: "",
      specialityForJournal: "",
      journalDateFrom: "",
      journalDateTill: "",
      isMonitoringProcessing: false,
      isJournalProcessing: false,
    }
  },
  mounted() {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    this.monitoringDateTime = now.toISOString().slice(0, 16)
    this.journalDateFrom = now.toISOString().slice(0, 10)
    this.journalDateTill = now.toISOString().slice(0, 10)
  },
  methods: {
    getMonitoringFile() {
      const dateObject = new Date(this.monitoringDateTime)
      this.isMonitoringProcessing = true
      this.ooitAPIInstance
        .monitoring_data_export_in_file(dateObject.toISOString())
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
      if (this.specialityForJournal) {
        this.isJournalProcessing = true
        this.ooitAPIInstance
          .entrance_applications_journal(
            this.specialityForJournal,
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
      } else {
        alert("Выберите специальность!")
      }
    },
  },
  computed: {
    orderedAdmissionQuotes() {
      return this.admissionQuota.results
        .filter((quota) => quota.ownership_category === "1")
        .sort((a, b) => {
          const admission_codeA = a.admission_code
          const admission_codeB = b.admission_code
          if (admission_codeA < admission_codeB) {
            return -1
          }
          if (admission_codeA > admission_codeB) {
            return 1
          }
          return 0
        })
    },
    ...mapGetters({
      admissionQuota: "admissionQuota/getList",
    }),
  },
}
</script>

<style scoped></style>
