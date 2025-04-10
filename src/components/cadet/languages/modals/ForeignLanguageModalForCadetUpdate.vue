<template>
  <div>
    <div class="mb-3">
      <label for="id_foreign_language" class="form-label"
        >Иностранный язык</label
      >
      <select
        id="id_foreign_language"
        class="form-select"
        v-model="mainData.foreign_language"
        required
      >
        <option value="">-------</option>
        <option
          v-for="foreignLanguage in foreignLanguages"
          :value="foreignLanguage.id"
          :key="foreignLanguage.id"
        >
          {{ foreignLanguage.foreign_language }}
        </option>
      </select>
    </div>
    <div class="mb-3">
      <label for="id_foreign_language_level" class="form-label"
        >Уровень владения</label
      >
      <select
        id="id_foreign_language_level"
        class="form-select"
        v-model="mainData.foreign_language_level"
        required
      >
        <option value="">-------</option>
        <option
          v-for="foreignLanguageLevel in foreignLanguageLevels"
          :value="foreignLanguageLevel.id"
          :key="foreignLanguageLevel.id"
        >
          {{ foreignLanguageLevel.foreign_language_level }}
        </option>
      </select>
    </div>
    <div class="mb-3">
      <label for="id_extra_data" class="form-label"
        >Дополнительные сведения</label
      >
      <textarea
        id="id_extra_data"
        class="form-control"
        v-model="mainData.extra_data"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "ForeignLanguageModalForCadetUpdate",
  props: {
    mainData: { type: Object, required: true },
    foreignLanguages: { type: Object, required: true },
    foreignLanguageLevels: { type: Object, required: true },
  },
  components: {},
  data() {
    return {}
  },
  async created() {},
  methods: {},
  computed: {},
}
</script>

<style scoped></style>
