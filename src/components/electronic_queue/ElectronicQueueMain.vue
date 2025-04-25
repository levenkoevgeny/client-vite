<template>
  <navigation-layout>
    <template v-slot:menu>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link active" :to="{ name: 'navigation' }">
              Раздел навигации
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'queue-list' }">
              Главная
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'queue-list-admin' }">
              Администрирование очередей
            </router-link>
          </li>
        </ul>
      </div>
    </template>
  </navigation-layout>
  <div class="container-fluid">
    <div class="d-flex flex-row justify-content-between mb-3">
      <h2 class="mt-3">Электронная очередь</h2>
      <div class="m-3 text-end fs-2">
        {{
          new Date(currentTime).toLocaleString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        }}
        {{
          new Date(currentTime).toLocaleString("ru-RU", {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          })
        }}
      </div>
    </div>



    <div class="row">
      <div class="col-2">
        <div style="max-height: calc(100vh - 220px); overflow-y: auto">
          <div class="list-group">
            <router-link
              v-for="queue in orderedMainList"
              :key="queue.id"
              class="list-group-item list-group-item-action rounded-1"
              :to="{ name: 'queue-list-processing', params: {id: queue.id} }"
            >
              {{ queue.queue_name }}
            </router-link>
            <br />
          </div>
        </div>
      </div>
      <div class="col-10">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import NavigationLayout from "@/components/layouts/NavigationLayout.vue"
import getQueueAPIInstance from "@/api/electronic_queue/queueAPI.js"

export default {
  name: "ElectronicQueueMain",
  components: { NavigationLayout },
  data() {
    return {
      mainItemList: {results: [], count: null, next: null, previous: null},
      mainItemAPIInstance: getQueueAPIInstance(),
      currentTime: new Date(),
    }
  },
  async created() {
    setInterval(() => {
      this.currentTime = new Date()
    }, 1000)
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
  },

}
</script>

<style scoped></style>
