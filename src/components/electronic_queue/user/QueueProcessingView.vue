<template>
  <div class="container-fluid">
    <h1 class="my-2">
      {{ currentQueueData.queue_name }}
    </h1>

    <QueueInfo :queue-data="currentQueueData" />

    <div class="row">
      <div class="col-6">
        <TicketsInProcess :ticket-list="processingList" />
      </div>
      <div class="col-6">
        <div>
          <button class="btn btn-primary">Вызвать следующего</button>
        </div>

        <h3 class="my-3">Список выданных талонов</h3>
        <TicketTable :ticket-list="orderedMainList" />
      </div>
    </div>
  </div>
</template>

<script>
import NavigationLayout from "@/components/layouts/NavigationLayout.vue"
import getQueueAPIInstance from "@/api/electronic_queue/queueAPI.js"
import getTicketAPIInstance from "@/api/electronic_queue/ticketAPI.js"
import { mapGetters } from "vuex"

import TicketTable from "@/components/electronic_queue/user/components/TicketTable.vue"
import QueueInfo from "@/components/electronic_queue/user/components/QueueInfo.vue"
import TicketsInProcess from "@/components/electronic_queue/user/components/TicketsInProcess.vue"

export default {
  name: "QueueProcessingView",
  components: { NavigationLayout, TicketTable, QueueInfo, TicketsInProcess },
  data() {
    return {
      currentQueueData: {
        queue_name: "",
        queue_liter: "",
      },
      mainItemList: { results: [], count: null, next: null, previous: null },
      mainItemAPIInstance: getTicketAPIInstance(),
      queueAPIInstance: getQueueAPIInstance(),
      searchForm: Object.assign({}, getTicketAPIInstance().searchObj),
      currentTime: new Date(),
      states: { 0: "В ожидании", 1: "В обработке", 2: "Обработан" },
    }
  },
  async created() {
    setInterval(() => {
      this.currentTime = new Date()
    }, 1000)

    setInterval(async () => {
      await this.loadData()
    }, 3000)

    this.$watch(
      () => this.$route.params.id,
      async (newId, oldId) => {
        await this.loadData(this.$route.params.id)
      },
    )
    await this.loadData(this.$route.params.id)
  },
  methods: {
    async loadData() {
      try {
        const resQueue = await this.queueAPIInstance.getItemData(
          this.$route.params.id,
        )
        this.currentQueueData = resQueue.data
        this.mainItemAPIInstance.searchObj.queue = this.$route.params.id
        const res = await this.mainItemAPIInstance.getItemsList()
        this.mainItemList = await res.data
      } catch (error) {
      } finally {
        this.isLoading = false
      }
    },
  },
  computed: {
    orderedMainList() {
      return this.mainItemList.results
    },
    ...mapGetters({
      user: "auth/getUser",
    }),
    processingList() {
      return this.mainItemList.results.filter(
        (ticket) =>
          ticket.ticket_state === 1 && ticket.operator === this.user.id,
      )
    },
  },
}
</script>

<style scoped></style>
