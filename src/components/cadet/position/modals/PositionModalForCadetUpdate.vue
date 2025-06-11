<template>
  <div>
    <div class="mb-3">
      <label for="id_position" class="form-label">Должность</label>
      <select
        id="id_position"
        class="form-select"
        v-model="mainData.position"
        required
      >
        <option value="">-------</option>
        <option
          v-for="position in positionList"
          :value="position.id"
          :key="position.id"
        >
          {{ position.position }}
        </option>
      </select>
    </div>

    <div class="mb-3">
      <label for="id_position_date" class="form-label"
        >Дата назначения на должность</label
      >
      <input
        type="date"
        class="form-control"
        id="id_position_date"
        v-model="mainData.position_date"
      />
    </div>

    <div class="mb-3">
      <label for="id_position_order_date" class="form-label"
        >Дата приказа</label
      >
      <input
        type="date"
        class="form-control"
        id="id_position_order_date"
        v-model="mainData.position_order_date"
      />
    </div>

    <div class="mb-3">
      <label for="id_position_order_number" class="form-label"
        >Номер приказа</label
      >
      <input
        type="text"
        class="form-control"
        id="id_position_order_number"
        v-model="mainData.position_order_number"
      />
    </div>

    <div class="mb-3">
      <label for="id_position_order_owner" class="form-label">Чей приказ</label>
      <select
        id="id_position_order_owner"
        class="form-select"
        v-model="mainData.position_order_owner"
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
      <label for="id_position_extra_data" class="form-label"
        >Дополнительная информация</label
      >
      <textarea
        type="text"
        class="form-control"
        id="id_position_extra_data"
        v-model="mainData.position_extra_data"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "PositionModalForCadetUpdate",
  props: {
    mainData: { type: Object, required: true },
    positionList: { type: Array, required: true, default: [] },
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
