<template>
  <div>
    <div class="mb-3">
      <label for="id_education_kind" class="form-label"
        >Вид учреждения образования</label
      >
      <select
        id="id_education_kind"
        class="form-select"
        v-model="mainData.education_kind"
        required
      >
        <option value="">-------</option>
        <option
          v-for="educationKind in educationKinds"
          :value="educationKind.id"
          :key="educationKind.id"
        >
          {{ educationKind.education }}
        </option>
      </select>
    </div>
    <div class="mb-3">
      <label for="id_education_level" class="form-label"
        >Уровень образования</label
      >
      <select
        id="id_education_level"
        class="form-select"
        v-model="mainData.education_level"
        required
      >
        <option value="">-------</option>
        <option
          v-for="educationLevel in educationLevels"
          :value="educationLevel.id"
          :key="educationLevel.id"
        >
          {{ educationLevel.education_level }}
        </option>
      </select>
    </div>
    <div class="mb-3">
      <label for="id_education_graduated" class="form-label"
        >Наименование учебного заведения</label
      >
      <textarea
        id="id_education_graduated"
        class="form-control"
        v-model="mainData.education_graduated"
        required
      />
    </div>
    <div class="row">
      <div class="col-6">
        <div class="mb-3">
          <label for="id_education_graduating_start_year" class="form-label"
            >Год поступления</label
          >
          <input
            type="number"
            class="form-control"
            id="id_education_graduating_start_year"
            min="1900"
            v-model="mainData.education_graduating_start_year"
            required
          />
        </div>
      </div>
      <div class="col-6">
        <div class="mb-3">
          <label for="id_education_graduating_end_year" class="form-label"
            >Год окончания</label
          >
          <input
            type="number"
            class="form-control"
            id="id_education_graduating_end_year"
            min="1900"
            v-model="mainData.education_graduating_end_year"
            required
          />
        </div>
      </div>
    </div>
    <div class="mb-3">
      <label for="id_education_average_score" class="form-label"
        >Средний бал</label
      >
      <input
        type="number"
        class="form-control"
        id="id_education_average_score"
        min="0"
        step="0.01"
        v-model="mainData.education_average_score"
      />
    </div>
    <div class="mb-3">
      <label for="id_education_location_kind" class="form-label"
        >Вид населенного пункта</label
      >
      <select
        id="id_education_location_kind"
        class="form-select"
        v-model="mainData.education_location_kind"
        required
      >
        <option value="">-------</option>
        <option
          v-for="educationLocationKind in educationLocationKinds"
          :value="educationLocationKind.id"
          :key="educationLocationKind.id"
        >
          {{ educationLocationKind.education_location_kind }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: "EducationHistoryModalForCadetUpdate",
  props: {
    mainData: { type: Object, required: true },
    educationKinds: { type: Array, required: true },
    educationLevels: { type: Array, required: true },
    educationLocationKinds: { type: Array, required: true },
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
