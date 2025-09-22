<template>
  <div class="container">
    <div class="my-4"></div>
    <h1 class="my-4">Навигация по разделам</h1>
    <div class="d-flex flex-row flex-wrap">
      <div class="card me-4 mb-4 border-0" style="width: 24rem">
        <div class="card-body">
          <h5 class="card-title">Курсанты</h5>
          <p class="card-text">
            Фотографирование, изготовление пропусков, зачетных книжек
          </p>
          <router-link
            class="btn btn-primary"
            :to="{ name: 'pass-office-cadet' }"
          >
            Перейти
          </router-link>
        </div>
      </div>
      <div class="card me-4 mb-4 border-0" style="width: 24rem">
        <div class="card-body">
          <h5 class="card-title">Слушатели ФПКиПРК</h5>
          <p class="card-text">
            Фотографирование, изготовление пропусков, зачетных книжек
          </p>
          <router-link
            class="btn btn-primary"
            :to="{ name: 'pass-office-fpk-prk' }"
          >
            Перейти
          </router-link>
        </div>
      </div>
      <div class="card me-4 mb-4 border-0" style="width: 24rem">
        <div class="card-body">
          <h5 class="card-title">Студенты факультета права</h5>
          <p class="card-text">
            Фотографирование, изготовление пропусков, зачетных книжек
          </p>
          <router-link
            class="btn btn-primary"
            :to="{ name: 'pass-office-students' }"
          >
            Перейти
          </router-link>
        </div>
      </div>
      <div class="card me-4 mb-4 border-0" style="width: 24rem">
        <div class="card-body">
          <h5 class="card-title">Сотрудники и гражданский персонал</h5>
          <p class="card-text">
            Фотографирование, изготовление пропусков, зачетных книжек
          </p>
          <router-link class="btn btn-primary"> Перейти </router-link>
        </div>
      </div>
    </div>
    <div class="my-4"></div>
    <!--    <router-view></router-view>-->
  </div>
</template>

<script>
import NavigationLayout from "@/components/layouts/NavigationLayout.vue"

export default {
  name: "PassOfficeNavigation",
  components: { NavigationLayout },
}
</script>

<style scoped>
.card:hover {
  transform: scale(1.05);
}

.card {
  transition: transform 0.5s;
}
</style>
