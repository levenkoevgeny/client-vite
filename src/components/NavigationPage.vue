<template>
  <navigation-layout></navigation-layout>

  <div
    v-if="isCommonLoading"
    style="height: calc(100vh - 58px)"
    class="d-flex justify-content-center align-items-center"
  >
    <div class="spinner-grow" style="width: 3rem; height: 3rem" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <div v-else>
    <div class="container">
      <h1 class="my-4">Навигация по разделам</h1>
      <div class="d-flex flex-row flex-wrap">
        <div class="card me-4 mb-4 border-0" style="width: 24rem">
          <div class="card-body">
            <h5 class="card-title">КИС Курсант</h5>
            <p class="card-text">
              Комплексная информационная система "Курсант"
            </p>
            <router-link class="btn btn-primary" :to="{ name: 'cadet' }">
              Перейти
            </router-link>
          </div>
        </div>
        <div class="card me-4 mb-4 border-0" style="width: 24rem">
          <div class="card-body">
            <h5 class="card-title">КИС Сотрудники</h5>
            <p class="card-text">
              Комплексная информационная система "Сотрудники и гражданский
              персонал"
            </p>
            <router-link class="btn btn-primary" :to="{ name: 'employee' }">
              Перейти
            </router-link>
          </div>
        </div>
        <div class="card me-4 mb-4 border-0" style="width: 24rem">
          <div class="card-body">
            <h5 class="card-title">КИС Студент</h5>
            <p class="card-text">
              Комплексная информационная система "Студент"
            </p>
            <router-link class="btn btn-primary" :to="{ name: 'student' }">
              Перейти
            </router-link>
          </div>
        </div>

        <div class="card me-4 mb-4 border-0" style="width: 24rem">
          <div class="card-body">
            <h5 class="card-title">КИС ФПКиПРК / Магистратура</h5>
            <p class="card-text">
              Комплексная информационная система "КИС ФПКиПРК / Магистратура"
            </p>
            <router-link class="btn btn-primary" :to="{ name: 'fpk-mag-list' }">
              Перейти
            </router-link>
          </div>
        </div>

        <div class="card me-4 mb-4 border-0" style="width: 24rem">
          <div class="card-body">
            <h5 class="card-title">КИС Идеология</h5>
            <p class="card-text">
              Комплексная информационная система "Идеология"
            </p>
            <router-link class="btn btn-primary" :to="{ name: 'navigation' }">
              Перейти
            </router-link>
          </div>
        </div>
        <div class="card me-4 mb-4 border-0" style="width: 24rem">
          <div class="card-body">
            <h5 class="card-title">КИС Научная деятельность</h5>
            <p class="card-text">
              Комплексная информационная система "Научная деятельность"
            </p>
            <router-link class="btn btn-primary" :to="{ name: 'navigation' }">
              Перейти
            </router-link>
          </div>
        </div>
        <div class="card me-4 mb-4 border-0" style="width: 24rem">
          <div class="card-body">
            <h5 class="card-title">КИС Вступительная кампания</h5>
            <p class="card-text">
              Комплексная информационная система "Вступительная кампания"
            </p>
            <router-link
              class="btn btn-primary"
              :to="{ name: 'entrance-navigation' }"
            >
              Перейти
            </router-link>
          </div>
        </div>

        <div class="card me-4 mb-4 border-0" style="width: 24rem">
          <div class="card-body">
            <h5 class="card-title">Словари</h5>
            <p class="card-text">Наполнение выпадающих меню</p>
            <router-link
              class="btn btn-primary"
              :to="{ name: 'dictionaries-main' }"
            >
              Перейти
            </router-link>
          </div>
        </div>
        <div class="card me-4 mb-4 border-0" style="width: 24rem">
          <div class="card-body">
            <h5 class="card-title">Пользователи</h5>
            <p class="card-text">Администрирование пользователей</p>
            <router-link class="btn btn-primary" :to="{ name: 'users-list' }">
              Перейти
            </router-link>
          </div>
        </div>
        <div class="card me-4 mb-4 border-0" style="width: 24rem">
          <div class="card-body">
            <h5 class="card-title">Электронная очередь</h5>
            <p class="card-text">Администрирование электронной очереди</p>
            <router-link class="btn btn-primary" :to="{ name: 'queue-list' }">
              Перейти
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavigationLayout from "@/components/layouts/NavigationLayout.vue"
import { mapGetters } from "vuex"
export default {
  name: "NavigationPage",
  components: { NavigationLayout },
  computed: {
    ...mapGetters({
      isCommonLoading: "common/getIsCommonLoading",
    }),
  },
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
