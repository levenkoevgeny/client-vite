<template>
  <div>
    <div class="mb-3">
      <label for="id_encouragement_kind" class="form-label"
        >Вид поощрения</label
      >
      <select
        id="id_encouragement_kind"
        class="form-select"
        v-model="mainData.encouragement_kind"
        required
      >
        <option value="">-------</option>
        <option
          v-for="encouragementKind in encouragementKindList"
          :value="encouragementKind.id"
          :key="encouragementKind.id"
        >
          {{ encouragementKind.encouragement_kind }}
        </option>
      </select>
    </div>

    <div class="row">
      <div class="col-6">
        <div class="mb-3">
          <label for="id_encouragement_date" class="form-label"
            >Дата поощрения</label
          >
          <input
            type="date"
            class="form-control"
            id="id_encouragement_date"
            v-model="mainData.encouragement_date"
          />
        </div>
      </div>
      <div class="col-6">
        <div class="mb-3">
          <label for="id_encouragement_order_date" class="form-label"
            >Дата приказа</label
          >
          <input
            type="date"
            class="form-control"
            id="id_encouragement_order_date"
            v-model="mainData.encouragement_order_date"
          />
        </div>
      </div>
    </div>

    <div class="mb-3">
      <label for="id_encouragement_order_number" class="form-label"
        >Номер приказа</label
      >
      <input
        type="text"
        class="form-control"
        id="id_encouragement_order_number"
        v-model="mainData.encouragement_order_number"
      />
    </div>

    <div class="mb-3">
      <label for="id_encouragement_order_owner" class="form-label"
        >Чей приказ</label
      >
      <select
        id="id_encouragement_order_owner"
        class="form-select"
        v-model="mainData.encouragement_order_owner"
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
      <label for="id_encouragement_extra_data" class="form-label">Фабула</label>
      <textarea
        class="form-control"
        id="id_encouragement_extra_data"
        v-model="mainData.encouragement_extra_data"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "EncouragementModalForCadetUpdate",
  props: {
    mainData: { type: Object, required: true },
    encouragementKindList: { type: Array, required: true, default: [] },
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
