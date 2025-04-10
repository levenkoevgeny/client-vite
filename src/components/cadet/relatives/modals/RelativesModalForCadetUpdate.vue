<template>
  <div>
    <div class="mb-3">
      <label for="id_degree_of_kinship" class="form-label"
        >Степень родства</label
      >
      <select
        id="id_degree_of_kinship"
        class="form-select"
        v-model="mainData.degree_of_kinship"
        required
      >
        <option value="">-------</option>
        <option
          v-for="degreeOfKinship in degreeOfKinshipList"
          :value="degreeOfKinship.id"
          :key="degreeOfKinship.id"
        >
          {{ degreeOfKinship.degree_of_kinship }}
        </option>
      </select>
    </div>

    <div class="mb-3">
      <label for="id_kinship_data" class="form-label"
        >Фамилия, имя, отчество жены (мужа), детей и лиц, находящихся на
        иждивении</label
      >
      <textarea
        type="text"
        class="form-control"
        id="id_kinship_data"
        rows="2"
        v-model="mainData.kinship_data"
      />
    </div>

    <div class="mb-3">
      <label for="id_date_of_birth" class="form-label">Дата рождения</label>
      <input
        type="date"
        class="form-control"
        id="id_date_of_birth"
        v-model="mainData.date_of_birth"
      />
    </div>

    <div class="mb-3">
      <label for="id_place_of_birth" class="form-label">Место рождения</label>
      <textarea
        type="text"
        class="form-control"
        id="id_place_of_birth"
        rows="1"
        v-model="mainData.place_of_birth"
      />
    </div>

    <div class="mb-3">
      <label for="id_document_data" class="form-label"
        >Основание, номер и дата свидетельства о браке, о рождении, кем
        выдано</label
      >
      <textarea
        type="text"
        class="form-control"
        id="id_document_data"
        rows="1"
        v-model="mainData.document_data"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "RelativesModalForCadetUpdate",
  props: {
    mainData: { type: Object, required: true },
    degreeOfKinshipList: { type: Array, required: true, default: [] },
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
