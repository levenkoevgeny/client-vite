<template>
  <div>
    <div class="mb-3">
      <label for="id_speciality" class="form-label">Специальность</label>
      <select
        id="id_speciality"
        class="form-select"
        v-model="mainData.speciality"
        required
      >
        <option value="">-------</option>
        <option
          v-for="speciality in specialityList"
          :value="speciality.id"
          :key="speciality.id"
        >
          {{ speciality.speciality_name }}
        </option>
      </select>
    </div>

    <div class="mb-3">
      <label for="id_speciality_order_date" class="form-label"
        >Дата приказа</label
      >
      <input
        type="date"
        class="form-control"
        id="id_speciality_order_date"
        v-model="mainData.speciality_order_date"
      />
    </div>

    <div class="mb-3">
      <label for="id_speciality_order_number" class="form-label"
        >Номер приказа</label
      >
      <input
        type="text"
        class="form-control"
        id="id_speciality_order_number"
        v-model="mainData.speciality_order_number"
      />
    </div>

    <div class="mb-3">
      <label for="id_speciality_order_owner" class="form-label"
        >Чей приказ</label
      >
      <select
        id="id_speciality_order_owner"
        class="form-select"
        v-model="mainData.speciality_order_owner"
      >
        <option value="">-------</option>
        <option
          v-for="orderOwner in orderOwners"
          :value="orderOwner.id"
          :key="orderOwner.id"
        >
          {{ orderOwner.order_owner }}
        </option>
      </select>
    </div>

    <div class="mb-3">
      <label for="id_speciality_extra_data" class="form-label"
        >Дополнительная информация</label
      >
      <textarea
        type="text"
        class="form-control"
        id="id_speciality_extra_data"
        v-model="mainData.speciality_extra_data"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "SpecialityModalForCadetUpdate",
  props: {
    mainData: { type: Object, required: true },
    specialityList: { type: Array, required: true, default: [] },
    orderOwners: { type: Array, required: true, default: [] },
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
