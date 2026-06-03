<template>
  <div class="container-fluid">
    <div v-if="isLoading">...loading</div>
    <div v-else>
      <h3 class="mb-3">
        Журнал по уч. дисциплине -
        <span class="fw-bold">{{ subject.subject_name }}</span
        >, группа -
      </h3>
      <div class="d-flex flex-row align-items-center my-3">
        <div>
          <button class="btn btn-success me-3">Текущая неделя</button>
          <button class="btn btn-warning me-3">Текущий день</button>
        </div>

        <div class="d-flex flex-row align-items-center">
          <input class="form-control me-3" type="date" />
          <input class="form-control me-3" type="date" />
        </div>
      </div>

      <table class="table table-striped">
        <thead>
          <tr>
            <th>Фамилия</th>
            <th v-for="date in dateList">
              {{ date.toLocaleDateString("ru-RU") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cadet in orderedCadets" :key="cadet.id">
            <td>{{ cadet.last_name_rus }}</td>
            <td v-for="date in dateList"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import getCadetAPIInstance from "@/api/cadet/cadetAPI.js"
import getSubjectAPIInstance from "@/api/journal/subjectAPI.js"
export default {
  name: "Journal",
  data() {
    return {
      isLoading: true,
      cadetList: { count: 0, results: [], previous: null, next: null },
      subject: null,
      cadetAPIInstance: getCadetAPIInstance(),
      subjectAPIInstance: getSubjectAPIInstance(),
      dateList: [],
    }
  },
  async created() {
    await this.loadData()
  },
  methods: {
    fillDateArray() {
      let curr = new Date() // текущая дата
      let week = []

      let firstDay =
        curr.getDate() - (curr.getDay() === 0 ? 6 : curr.getDay() - 1)

      for (let i = 0; i < 7; i++) {
        let nextDay = new Date(curr.setDate(firstDay + i))
        week.push(nextDay)
        // week.push(nextDay.toLocaleDateString("ru-RU")) // Формат ДД.ММ.ГГГГ
      }
      this.dateList = week
    },
    async loadData() {
      this.isLoading = true
      this.fillDateArray()
      try {
        this.cadetAPIInstance.searchObj.category__in = [4]
        this.cadetAPIInstance.searchObj.group = this.$route.query.group
        const cadetResponse = await this.cadetAPIInstance.getItemsList()
        this.cadetList = cadetResponse.data
        const subjectResponse = await this.subjectAPIInstance.getItemData(
          this.$route.query.subject,
        )
        this.subject = subjectResponse.data
      } catch (e) {
      } finally {
        this.isLoading = false
      }
    },
  },
  watch: {
    "$route.query": {
      async handler(newValue, oldValue) {
        await this.loadData()
      },
      deep: true,
    },
  },
  computed: {
    orderedCadets() {
      return this.cadetList.results
    },
  },
}
</script>
