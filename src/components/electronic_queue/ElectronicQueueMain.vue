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
    <router-view></router-view>
  </div>
</template>

<script>
import NavigationLayout from "@/components/layouts/NavigationLayout.vue"
import getQueueAPIInstance from "@/api/electronic_queue/queueAPI.js"
import { mapGetters } from "vuex"

export default {
  name: "ElectronicQueueMain",
  components: { NavigationLayout },
  data() {
    return {
      mainItemList: { results: [], count: null, next: null, previous: null },
      mainItemAPIInstance: getQueueAPIInstance(),
      currentTime: new Date(),
      timeInterval: null
    }
  },
  async created() {
    this.timeInterval = setInterval(() => {
      this.currentTime = new Date()
    }, 1000)
    await this.loadData()
  },
  unmounted() {
    clearInterval(this.timeInterval)
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
