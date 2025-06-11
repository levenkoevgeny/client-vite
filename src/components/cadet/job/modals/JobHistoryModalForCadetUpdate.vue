<template>
  <div>
    <div class="mb-3">
      <label for="id_job_position" class="form-label">Должность</label>
      <textarea
        class="form-control"
        id="id_job_position"
        rows="3"
        v-model="mainData.job_position"
        required
      />
    </div>

    <div class="row">
      <div class="col-6">
        <div class="mb-3">
          <label for="id_job_start_year" class="form-label"
            >Год начала работы</label
          >
          <input
            type="number"
            class="form-control"
            id="id_job_start_year"
            v-model="mainData.job_start_year"
          />
        </div>
      </div>
      <div class="col-6">
        <div class="mb-3">
          <label for="id_job_end_year" class="form-label"
            >Год увольнения с работы</label
          >
          <input
            type="number"
            class="form-control"
            id="id_job_end_year"
            v-model="mainData.job_end_year"
          />
        </div>
      </div>
    </div>
    <div class="mb-3">
      <label for="id_organisation_name" class="form-label"
        >Организация, где работал</label
      >
      <textarea
        class="form-control"
        id="id_organisation_name"
        rows="3"
        v-model="mainData.organisation_name"
        required
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "JobHistoryModalForCadetUpdate",
  props: {
    mainData: { type: Object, required: true },
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
