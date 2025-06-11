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
          <div class="mb-3 mx-2">
            <label for="searchInput" class="form-label"
              >Поиск по названию</label
            >
            <input
              type="text"
              class="form-control"
              id="searchInput"
              v-model="dictionaryItemsSearchInput"
            />
          </div>
          <div style="max-height: calc(100vh - 220px); overflow-y: auto">
            <div class="list-group">
              <router-link
                v-for="dictItem in filteredDictionaries"
                :key="dictItem.itemUrl"
                class="list-group-item list-group-item-action rounded-1"
                :to="{ name: dictItem.itemUrl }"
              >
                {{ dictItem.itemTitle }}
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
  data() {
    return {
      dictionaryItemsSearchInput: "",
      dictionaryItemsList: [
        {
          itemTitle: "Категории сотрудников, курсантов, студентов",
          itemUrl: "dictionaries-person-categories",
        },
        {
          itemTitle: "Звания",
          itemUrl: "dictionaries-ranks",
        },
        {
          itemTitle: "Категории званий",
          itemUrl: "dictionaries-rank-groups",
        },
        {
          itemTitle: "Группы",
          itemUrl: "dictionaries-groups",
        },
        {
          itemTitle: "Поощрения",
          itemUrl: "dictionaries-encouragements",
        },
        {
          itemTitle: "Взыскания",
          itemUrl: "dictionaries-punishments",
        },
        {
          itemTitle: "Подразделения",
          itemUrl: "dictionaries-subdivisions",
        },
        {
          itemTitle: "Должности",
          itemUrl: "dictionaries-positions",
        },
        {
          itemTitle: "Чей приказ",
          itemUrl: "order-owners",
        },
        {
          itemTitle: "Военкоматы",
          itemUrl: "dictionaries-militaryoffices",
        },
        {
          itemTitle: "ГО-РОВД",
          itemUrl: "dictionaries-go-rovd",
        },
        {
          itemTitle: "Комплектующие органы",
          itemUrl: "dictionaries-component-organ",
        },
        {
          itemTitle: "Награды",
          itemUrl: "dictionaries-rewards",
        },
        {
          itemTitle: "Специальности",
          itemUrl: "dictionaries-speciality",
        },

        {
          itemTitle: "Специализации",
          itemUrl: "dictionaries-specializations",
        },
        {
          itemTitle: "Направления ОРД",
          itemUrl: "dictionaries-ord-directions",
        },
        {
          itemTitle: "Семейные положения",
          itemUrl: "dictionaries-marital-statuses",
        },
        {
          itemTitle: "Органы выдачи паспорта",
          itemUrl: "dictionaries-passport-authorities",
        },
        {
          itemTitle: "Иностранные языки",
          itemUrl: "dictionaries-foreign-languages",
        },
        {
          itemTitle: "Уровни владения иностранными языками",
          itemUrl: "dictionaries-foreign-language-levels",
        },
        {
          itemTitle: "Причины отчисления",
          itemUrl: "dictionaries-graduation-reasons",
        },
        {
          itemTitle: "Формы обучения",
          itemUrl: "dictionaries-education-forms",
        },
        {
          itemTitle: "Категории поступающих",
          itemUrl: "dictionaries-entrance-categories",
        },
        {
          itemTitle: "Социальные статусы",
          itemUrl: "dictionaries-social-statuses",
        },
        {
          itemTitle: "Виды учреждений образования",
          itemUrl: "dictionaries-education-kinds",
        },
        {
          itemTitle: "Уровни образования",
          itemUrl: "dictionaries-education-levels",
        },
        {
          itemTitle: "Виды населенных пунктов",
          itemUrl: "dictionaries-education-location-kinds",
        },
        {
          itemTitle: "ВПК категории",
          itemUrl: "dictionaries-vpk-categories",
        },
        {
          itemTitle: "Категории профессионального соответствия",
          itemUrl: "dictionaries-pfl-categories",
        },
        {
          itemTitle: "Льготы",
          itemUrl: "dictionaries-privileges",
        },
        {
          itemTitle: "Виды документа",
          itemUrl: "dictionaries-document-types",
        },
        {
          itemTitle: "В чьих интересах",
          itemUrl: "dictionaries-in-whose-interests",
        },
        {
          itemTitle: "Группы предназначения",
          itemUrl: "dictionaries-health-groups",
        },
      ],
    }
  },
  computed: {
    ...mapGetters({
      isCommonLoading: "common/getIsCommonLoading",
    }),
    orderedDictionaryList() {
      return this.dictionaryItemsList.sort((a, b) =>
        a.itemTitle > b.itemTitle ? 1 : b.itemTitle > a.itemTitle ? -1 : 0,
      )
    },

    filteredDictionaries() {
      return this.orderedDictionaryList.filter((item) =>
        item.itemTitle
          .toLowerCase()
          .includes(this.dictionaryItemsSearchInput.toLowerCase()),
      )
    },
  },
}
</script>

<style scoped></style>
