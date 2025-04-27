<template>
  <div class="container-fluid">
    <div class="d-flex flex-row">
      <div></div>
      <div></div>
      <h3>
        {{ currentQueueData.queue_name }}

        <QueueInfo :queue-data="currentQueueData" />
      </h3>
    </div>

    <div class="row">
      <div class="col-6"></div>
      <div class="col-6">
        <button
          class="btn btn-primary"
          :class="{
            disabled:
              currentQueueData.get_ticket_pending === 0 ||
              !user.workplace ||
              nextTicketToProcessButtonDisabled,
          }"
          @click="getNextFreeTicketToProcess"
        >
          Вызвать следующего
        </button>
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <h3 class="my-3">Обслуживаются на Вашем рабочем месте</h3>
        <TicketsInProcess
          :ticket-list="processingList"
          @finishTicketProcess="finishTicketProcess"
        />
      </div>
      <div class="col-6">
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
      nextTicketToProcessButtonDisabled: false,
    }
  },
  async created() {
    setInterval(() => {
      this.currentTime = new Date()
    }, 1000)

    setInterval(async () => {
      await this.loadData(this.$route.params.id)
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
    async loadData(queueId) {
      if (queueId) {
        try {
          const resQueue = await this.queueAPIInstance.getItemData(queueId)
          this.currentQueueData = resQueue.data
          this.mainItemAPIInstance.searchObj.queue = queueId
          const res = await this.mainItemAPIInstance.getItemsList()
          this.mainItemList = await res.data
        } catch (error) {
        } finally {
          this.isLoading = false
        }
      }
    },
    async getNextFreeTicketToProcess() {
      this.nextTicketToProcessButtonDisabled = true
      try {
        await this.queueAPIInstance.getNextTicketToProcess(
          this.currentQueueData.id,
        )
        await this.loadData(this.$route.params.id)
      } catch (error) {
      } finally {
        this.nextTicketToProcessButtonDisabled = false
      }
    },
    async finishTicketProcess(ticketData) {
      try {
        await this.mainItemAPIInstance.updateItem({
          ...ticketData,
          ticket_state: 2,
        })
        await this.loadData(this.$route.params.id)
      } catch (error) {
      } finally {
      }
    },
  },
  computed: {
    orderedMainList() {
      return this.mainItemList.results.sort(
        (a, b) => a.ticket_state - b.ticket_state,
      )
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
