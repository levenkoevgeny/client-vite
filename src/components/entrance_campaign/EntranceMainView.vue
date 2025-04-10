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
            <router-link class="nav-link" :to="{ name: 'entrance-list' }">
              Список личных дел
            </router-link>
          </li>
        </ul>
      </div>
    </template>
  </navigation-layout>
  <div class="container-fluid">
    <div class="d-flex flex-row justify-content-between mb-3">
      <h2 class="mt-3">КИС "Вступительная кампания"</h2>
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

export default {
  name: "EntranceMainView",
  components: { NavigationLayout },
  data() {
    return {
      currentTime: new Date(),
    }
  },
  async created() {
    setInterval(() => {
      this.currentTime = new Date()
    }, 1000)
  },
  methods: {},
  computed: {},
}
</script>

<style scoped></style>
