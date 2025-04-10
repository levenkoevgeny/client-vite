<template>
  <div>
    <div class="mb-3">
      <label for="id_military_organization" class="form-label"
        >Место службы</label
      >
      <textarea
        class="form-control"
        id="id_military_organization"
        rows="2"
        v-model="mainData.military_organization"
        required
      />
    </div>

    <div class="row">
      <div class="col-6">
        <div class="mb-3">
          <label for="id_military_service_start" class="form-label"
            >Служба в армии (начало)</label
          >
          <input
            type="date"
            class="form-control"
            id="id_military_service_start"
            v-model="mainData.military_service_start"
          />
        </div>
      </div>
      <div class="col-6">
        <div class="mb-3">
          <label for="id_military_service_end" class="form-label"
            >Служба в армии (окончание)</label
          >
          <input
            type="date"
            class="form-control"
            id="id_military_service_end"
            v-model="mainData.military_service_end"
          />
        </div>
      </div>
    </div>

    <div class="mb-3">
      <label for="id_position" class="form-label"
        >Должность (без сокращений)</label
      >
      <textarea
        class="form-control"
        id="id_position"
        rows="2"
        v-model="mainData.position"
      />
    </div>

    <div class="mb-3">
      <label for="id_order_owner" class="form-label">Чей приказ</label>
      <select
        id="id_order_owner"
        class="form-select"
        v-model="mainData.order_owner"
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
      <label for="id_order_date" class="form-label">Дата приказа</label>
      <input
        type="date"
        class="form-control"
        id="id_order_date"
        v-model="mainData.order_date"
      />
    </div>

    <div class="mb-3">
      <label for="id_order_number" class="form-label">Номер приказа</label>
      <input
        type="text"
        class="form-control"
        id="id_order_number"
        v-model="mainData.order_number"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "ArmyHistoryModalForCadetUpdate",
  props: {
    mainData: { type: Object, required: true },
    orderOwners: { type: Array, required: true },
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
