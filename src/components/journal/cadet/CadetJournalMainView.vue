<template>
  <div class="container-fluid">
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
            <router-link class="nav-link active" :to="{ name: 'navigation' }">
              Раздел навигации
            </router-link>
            <li class="nav-item">
              <router-link
                class="nav-link active"
                :to="{ name: 'journal-navigation' }"
              >
                Электронный журнал (главная страница)
              </router-link>
            </li>
          </ul>
        </div>
      </template>
    </navigation-layout>
    <div class="container-fluid">
      <!--      <h2 class="mt-3">Курсанты</h2>-->

      <div class="row flex-nowrap">
        <div class="col">
          <div class="d-flex justify-content-end">
            <a
              href="#"
              data-bs-target="#sidebar"
              data-bs-toggle="collapse"
              class="rounded-3 p-1 text-decoration-none fs-3 filter-icon-color"
              ><font-awesome-icon :icon="['fas', 'filter']"
            /></a>
          </div>
          <div>
            <router-view></router-view>
          </div>
        </div>

        <div class="col-auto">
          <div class="navbar navbar-expand-lg">
            <div id="sidebar" class="collapse collapse-horizontal border-start">
              <div
                id="sidebar-nav"
                class="list-group border-0 rounded-0 text-sm-start"
                style="width: 500px"
              >
                <div
                  style="max-height: calc(100vh - 290px); overflow-y: auto"
                  class="p-3"
                >
                  <div class="my-3">
                    <h3>Выберите предмет и группу</h3>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Группа</label>
                    <v-select
                      v-model="searchForm.group"
                      :options="orderedGroups"
                      label="group_name"
                      :reduce="(group) => group.id"
                    />
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Учебная дисциплина</label>
                    <v-select
                      v-model="searchForm.subject"
                      :options="orderedSubjects"
                      label="subject_name"
                      :reduce="(subject) => subject.id"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavigationLayout from "@/components/layouts/NavigationLayout.vue"
import { mapGetters } from "vuex"
import getSubjectAPIInstance from "@/api/journal/subjectAPI.js"
import { debounce } from "lodash/function.js"
export default {
  name: "CadetJournalMainView",
  components: { NavigationLayout },
  data() {
    return {
      isLoading: true,
      subjectList: { count: 0, results: [], previous: null, next: null },
      searchForm: { group: "", subject: "" },
      subjectAPIInstance: getSubjectAPIInstance(),
    }
  },
  async created() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      const response = await this.subjectAPIInstance.getItemsList()
      this.subjectList = response.data
    },
    toJournal() {
      this.$router.push({ name: "journal", query: { ...this.searchForm } })
    },
    debouncedSearch: debounce(async function () {
      this.isLoading = true
      try {
        this.toJournal()
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    }, 500),
  },
  computed: {
    orderedGroups() {
      return this.groups.results
    },
    orderedSubjects() {
      return this.subjectList.results
    },
    ...mapGetters({ groups: "groups/getList" }),
  },
  watch: {
    searchForm: {
      handler(newValue, oldValue) {
        if (this.searchForm.group && this.searchForm.subject) {
          this.debouncedSearch()
        }
      },
      deep: true,
    },
  },
}
</script>
