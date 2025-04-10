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
              <router-link class="nav-link" :to="{ name: 'dictionaries-main' }">
                Главная
              </router-link>
            </li>
          </ul>
        </div>
      </template>
    </navigation-layout>

    <div
      v-if="isCommonLoading"
      style="height: calc(100vh - 60px)"
      class="d-flex justify-content-center align-items-center"
    >
      <div class="spinner-grow" style="width: 3rem; height: 3rem" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div class="container-fluid" v-else>
      <h2 class="mt-3">Словари</h2>

      <div class="row">
        <div class="col-2">
          <div style="max-height: calc(100vh - 180px); overflow-y: auto">
            <div class="list-group">
              <router-link
                class="list-group-item list-group-item-action rounded-1"
                :to="{ name: 'dictionaries-person-categories' }"
              >
                Категории сотрудников, курсантов, студентов
              </router-link>

              <router-link
                class="list-group-item list-group-item-action rounded-1"
                :to="{ name: 'dictionaries-ranks' }"
              >
                Звания
              </router-link>

              <router-link
                class="list-group-item list-group-item-action rounded-1"
                :to="{ name: 'dictionaries-rank-groups' }"
              >
                Категории званий
              </router-link>

              <router-link
                class="list-group-item list-group-item-action rounded-1"
                :to="{ name: 'dictionaries-groups' }"
              >
                Группы
              </router-link>

              <router-link
                class="list-group-item list-group-item-action rounded-1"
                :to="{ name: 'dictionaries-encouragements' }"
              >
                Поощрения
              </router-link>

              <router-link
                class="list-group-item list-group-item-action rounded-1"
                :to="{ name: 'dictionaries-punishments' }"
              >
                Взыскания
              </router-link>

              <router-link
                class="list-group-item list-group-item-action rounded-1"
                :to="{ name: 'dictionaries-subdivisions' }"
              >
                Подразделения
              </router-link>

              <router-link
                class="list-group-item list-group-item-action rounded-1"
                :to="{ name: 'dictionaries-positions' }"
              >
                Должности
              </router-link>

              <router-link
                class="list-group-item list-group-item-action rounded-1"
                :to="{ name: 'order-owners' }"
              >
                Чей приказ
              </router-link>

              <router-link
                class="list-group-item list-group-item-action rounded-1"
                :to="{ name: 'dictionaries-militaryoffices' }"
              >
                Военкоматы
              </router-link>

              <router-link
                class="list-group-item list-group-item-action rounded-1"
                :to="{ name: 'dictionaries-go-rovd' }"
              >
                ГО-РОВД
              </router-link>

              <router-link
                class="list-group-item list-group-item-action rounded-1"
                :to="{ name: 'dictionaries-component-organ' }"
              >
                Комплектующие органы
              </router-link>

              <router-link
                class="list-group-item list-group-item-action rounded-1"
                :to="{ name: 'dictionaries-rewards' }"
              >
                Награды
              </router-link>

              <router-link
                class="list-group-item list-group-item-action rounded-1"
                :to="{ name: 'dictionaries-speciality' }"
              >
                Специальности
              </router-link>

              <router-link
                class="list-group-item list-group-item-action rounded-1"
                :to="{ name: 'dictionaries-specializations' }"
              >
                Специализации
              </router-link>

              <router-link
                class="list-group-item list-group-item-action rounded-1"
                :to="{ name: 'dictionaries-ord-directions' }"
              >
                Направления ОРД
              </router-link>

              <router-link
                class="list-group-item list-group-item-action rounded-1"
                :to="{ name: 'dictionaries-marital-statuses' }"
              >
                Семейные положения
              </router-link>

              <router-link
                class="list-group-item list-group-item-action rounded-1"
                :to="{ name: 'dictionaries-passport-authorities' }"
              >
                Органы выдачи паспорта
              </router-link>

              <router-link
                class="list-group-item list-group-item-action rounded-1"
                :to="{ name: 'dictionaries-foreign-languages' }"
              >
                Иностранные языки
              </router-link>

              <router-link
                class="list-group-item list-group-item-action rounded-1"
                :to="{ name: 'dictionaries-foreign-language-levels' }"
              >
                Уровни владения и.я.
              </router-link>

              <router-link
                class="list-group-item list-group-item-action rounded-1"
                :to="{ name: 'dictionaries-graduation-reasons' }"
              >
                Причины отчисления
              </router-link>

              <router-link
                class="list-group-item list-group-item-action rounded-1"
                :to="{ name: 'dictionaries-education-forms' }"
              >
                Формы обучения
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
  </div>
</template>

<script>
import NavigationLayout from "@/components/layouts/NavigationLayout.vue"
import { mapGetters } from "vuex"

export default {
  name: "DictionaryMainView",
  components: { NavigationLayout },
  computed: {
    ...mapGetters({
      isCommonLoading: "common/getIsCommonLoading",
    }),
  },
}
</script>

<style scoped></style>
