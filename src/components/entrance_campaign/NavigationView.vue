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
    <h1 class="my-4">Навигация по подразделам</h1>
    <div class="d-flex flex-row flex-wrap">
      <router-link
        class="text-decoration-none"
        :to="{ name: 'entrance-cadet-list' }"
      >
        <div class="card hover-card me-4 mb-4 border-0" style="width: 24rem">
          <div class="card-body">
            <h5 class="card-title">Переменный состав</h5>
          </div>
        </div>
      </router-link>

      <router-link
        class="text-decoration-none"
        :to="{ name: 'entrance-fpk-prk-mag-list' }"
      >
        <div class="card hover-card me-4 mb-4 border-0" style="width: 24rem">
          <div class="card-body">
            <h5 class="card-title">ФПКПРК, Магистратура</h5>
          </div>
        </div>
      </router-link>

      <router-link
        class="text-decoration-none disabled"
        :to="{ name: 'entrance-student-list' }"
      >
        <div class="card hover-card me-4 mb-4 border-0" style="width: 24rem">
          <div class="card-body">
            <h5 class="card-title">Факультет права</h5>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import NavigationLayout from "@/components/layouts/NavigationLayout.vue"

export default {
  name: "NavigationView",
  components: { NavigationLayout },
  data() {
    return {
      currentTime: new Date(),
      timeInterval: null,
    }
  },
  async created() {
    this.timeInterval = setInterval(() => {
      this.currentTime = new Date()
    }, 1000)
  },
  unmounted() {
    clearInterval(this.timeInterval)
  },
}
</script>

<style scoped>
.hover-card {
  transition: all 0.2s ease-in-out;
}

.hover-card:hover {
  transform: scale(1.05);
}
</style>
