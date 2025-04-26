<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-2">
        <div style="max-height: calc(100vh - 220px); overflow-y: auto">
          <div class="list-group">
            <router-link
              v-for="queue in orderedMainList"
              :key="queue.id"
              class="list-group-item list-group-item-action rounded-1"
              :to="{ name: 'queue-list-processing', params: { id: queue.id } }"
            >
              {{ queue.queue_name }}
            </router-link>
            <br />
          </div>
        </div>
      </div>
      <div class="col-10">
        <h1 class="mb-3">Ваше рабочее место - {{ user.workplace }}</h1>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import NavigationLayout from "@/components/layouts/NavigationLayout.vue"
import getQueueAPIInstance from "@/api/electronic_queue/queueAPI.js"
import { mapGetters } from "vuex"

export default {
  name: "QueueListUser",
  components: { NavigationLayout },
  data() {
    return {
      currentQueueData: {
        queue_name: "",
        queue_liter: "",
      },
      mainItemList: { results: [], count: null, next: null, previous: null },
      mainItemAPIInstance: getQueueAPIInstance(),
      searchForm: Object.assign({}, getQueueAPIInstance().searchObj),
    }
  },
  async created() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      this.isLoading = true
      const response = await this.mainItemAPIInstance.getItemsList()
      this.mainItemList = await response.data
      this.isLoading = false
    },
  },
  computed: {
    orderedMainList() {
      return this.mainItemList.results
    },
    ...mapGetters({
      user: "auth/getUser",
    }),
  },
}
</script>

<style scoped></style>
