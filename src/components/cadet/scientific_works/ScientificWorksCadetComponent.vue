<template>
  <div
    class="shadow p-3 mb-3 bg-body-tertiary rounded"
    id="simple-list-scientific-works-data"
  >
    <base-list-layout-for-cadet-update
      :is-loading="isLoading"
      :main-list-length="orderedMainList.length"
      title="Научные труды и изобретения"
    >
      <template v-slot:add-button>
        <button class="btn btn-warning" :disabled="isLoading" type="button">
          <span class="fas fa-plus me-2"></span>Добавить запись
        </button>
      </template>
      <template v-slot:thead>
        <tr>
          <!--          <th>Язык</th>-->
          <!--          <th>Уровень владения</th>-->
        </tr>
      </template>
      <template v-slot:tbody>
        <!--        <tr v-for="forLang in orderedMainList" :key="forLang.id">-->
        <!--          <td>-->
        <!--            {{ forLang.get_foreign_language_str || "Нет данных" }}-->
        <!--          </td>-->
        <!--          <td>-->
        <!--            {{ forLang.get_foreign_language_level_str || "Нет данных" }}-->
        <!--          </td>-->
        <!--        </tr>-->
      </template>
      <template v-slot:paginator></template>
    </base-list-layout-for-cadet-update>
  </div>
</template>

<script>
import BaseListLayoutForCadetUpdate from "@/components/layouts/BaseListLayoutForCadetUpdate.vue"

export default {
  name: "ScientificWorksCadetComponent",
  components: { BaseListLayoutForCadetUpdate },
  props: {
    cadetId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isLoading: true,
      isError: false,
      // cadetForeignLanguageLevelList: {
      //   count: "",
      //   results: [],
      //   previous: null,
      //   next: null,
      // },
      // cadetForeignLanguageLevelAPIInstance:
      //   getCadetForeignLanguageLevelAPIInstance(),
    }
  },
  async created() {
    // await this.loadData()
  },
  methods: {
    // async loadData() {
    //   const listFunction = getLoadListFunction.bind(this)
    //   this.isLoading = true
    //   this.isError = false
    //   try {
    //     const [
    //       cadetForeignLanguageLevels,
    //       foreignLanguages,
    //       foreignLanguageLevels,
    //     ] = await Promise.all([
    //       listFunction("cadetForeignLanguageLevel")(this.cadetId),
    //       listFunction("foreignLanguage")(),
    //       listFunction("foreignLanguageLevel")(),
    //     ])
    //     this.cadetForeignLanguageLevelList = cadetForeignLanguageLevels
    //     this.foreignLanguageList = foreignLanguages
    //     this.foreignLanguageLevelList = foreignLanguageLevels
    //   } catch (e) {
    //     this.isError = true
    //   } finally {
    //     this.isLoading = false
    //   }
    // },
    // showAddNewForeignLanguageModal() {
    //   let addModal = this.$refs.foreignLanguageAddModal
    //   let myModal = new bootstrap.Modal(addModal, {
    //     keyboard: false,
    //   })
    //   myModal.show()
    // },
    // async updatePaginator(url) {},
  },
  computed: {
    orderedMainList() {
      return []
    },
    // orderedForeignLanguageList() {
    //   return this.foreignLanguageList.results
    // },
    // orderedForeignLanguageLevelList() {
    //   return this.foreignLanguageLevelList.results
    // },
  },
  watch: {},
}
</script>

<style scoped></style>
