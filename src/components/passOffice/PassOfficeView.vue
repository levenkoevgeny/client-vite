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
            <router-link class="nav-link" :to="{ name: 'pass-office-main' }">
              Главная
            </router-link>
          </li>
        </ul>
      </div>
    </template>
  </navigation-layout>

  <div class="container-fluid">
    <div class="my-4"></div>

    <div class="card" style="width: 45rem">
      <div class="card-body">
        <h5 class="card-title">Выберите категорию</h5>
        <select
          class="form-select"
          @change="categorySelectChange"
          v-model="currentPath"
        >
          <option selected value="">-----</option>
          <option value="employees">Сотрудники</option>
          <option value="cadets">Курсанты</option>
          <option value="students">Студенты</option>
          <option value="fpk-prk">ФПКиПРК / МАГ</option>
        </select>
      </div>
    </div>
    <div class="my-4"></div>
    <router-view></router-view>
  </div>
</template>

<script>
import NavigationLayout from "@/components/layouts/NavigationLayout.vue"

export default {
  name: "PassOfficeView",
  components: { NavigationLayout },
  data() {
    return {
      currentPath: "",
    }
  },
  created() {
    let fullPath = this.$router.currentRoute.value.path.toString()
    if (fullPath === "/pass-office") {
      this.currentPath = ""
    } else this.currentPath = fullPath.slice(fullPath.lastIndexOf("/") + 1)
  },
  methods: {
    categorySelectChange(e) {
      this.$router.push({ path: `/pass-office/${e.target.value}` })
    },
  },
}
</script>

<style scoped></style>
