<template>
  <div>
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
              <router-link class="nav-link" :to="{ name: 'fpk-mag-list' }">
                Главная
              </router-link>
            </li>
          </ul>
        </div>
      </template>
    </navigation-layout>
    <div class="container-fluid">
      <h2 class="mt-3">КИС "КИС ФПКиПРК / Магистратура"</h2>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import NavigationLayout from "@/components/layouts/NavigationLayout.vue"
export default {
  name: "FPKMainView",
  components: { NavigationLayout },
}
</script>

<style scoped></style>
