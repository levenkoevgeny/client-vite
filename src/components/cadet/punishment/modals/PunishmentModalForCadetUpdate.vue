<template>
  <div>
    <div class="mb-3">
      <label for="id_punishment_kind" class="form-label">Вид взыскания</label>
      <select
        id="id_punishment_kind"
        class="form-select"
        v-model="mainData.punishment_kind"
        required
      >
        <option value="">-------</option>
        <option
          v-for="punishmentKind in punishmentKindList"
          :value="punishmentKind.id"
          :key="punishmentKind.id"
        >
          {{ punishmentKind.punishment_kind }}
        </option>
      </select>
    </div>

    <div class="row">
      <div class="col-6">
        <div class="mb-3">
          <label for="id_punishment_start_date" class="form-label"
            >Дата начала действия</label
          >
          <input
            type="date"
            class="form-control"
            id="id_punishment_start_date"
            v-model="mainData.punishment_start_date"
          />
        </div>
      </div>
      <div class="col-6">
        <div class="mb-3">
          <label for="id_punishment_start_order_date" class="form-label"
            >Дата приказа наложения</label
          >
          <input
            type="date"
            class="form-control"
            id="id_punishment_start_order_date"
            v-model="mainData.punishment_start_order_date"
          />
        </div>
      </div>
    </div>
    <div class="mb-3">
      <label for="id_punishment_start_order_number" class="form-label"
        >Номер приказа наложения взыскания</label
      >
      <input
        type="text"
        class="form-control"
        id="id_punishment_start_order_number"
        v-model="mainData.punishment_start_order_number"
      />
    </div>
    <div class="mb-3">
      <label for="id_punishment_start_order_owner" class="form-label"
        >Чей приказ</label
      >
      <select
        id="id_punishment_start_order_owner"
        class="form-select"
        v-model="mainData.punishment_start_order_owner"
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
      <label for="id_punishment_start_extra_data" class="form-label"
        >Фабула о наложении</label
      >
      <textarea
        type="text"
        class="form-control"
        id="id_punishment_start_extra_data"
        v-model="mainData.punishment_start_extra_data"
      />
    </div>

    <div class="row">
      <div class="col-6">
        <div class="mb-3">
          <label for="id_expiration_start_date" class="form-label"
            >Дата окончания действия</label
          >
          <input
            type="date"
            class="form-control"
            id="id_expiration_start_date"
            v-model="mainData.punishment_expiration_date"
          />
        </div>
      </div>
      <div class="col-6">
        <div class="mb-3">
          <label for="id_punishment_expiration_order_date" class="form-label"
            >Дата приказа окончания</label
          >
          <input
            type="date"
            class="form-control"
            id="id_punishment_expiration_order_date"
            v-model="mainData.punishment_expiration_order_date"
          />
        </div>
      </div>
    </div>
    <div class="mb-3">
      <label for="id_punishment_expiration_order_number" class="form-label"
        >Номер приказа снятия взыскания</label
      >
      <input
        type="text"
        class="form-control"
        id="id_punishment_expiration_order_number"
        v-model="mainData.punishment_expiration_order_number"
      />
    </div>
    <div class="mb-3">
      <label for="id_punishment_expiration_order_owner" class="form-label"
        >Чей приказ</label
      >
      <select
        id="id_punishment_expiration_order_owner"
        class="form-select"
        v-model="mainData.punishment_expiration_order_owner"
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
      <label for="id_punishment_expiration_extra_data" class="form-label"
        >Фабула о снятии</label
      >
      <textarea
        type="text"
        class="form-control"
        id="id_punishment_expiration_extra_data"
        v-model="mainData.punishment_expiration_extra_data"
      />
    </div>
  </div>
</template>

<script>
// import * as dayjs from "dayjs"

export default {
  name: "PunishmentModalForCadetUpdate",
  props: {
    mainData: { type: Object, required: true },
    punishmentKindList: { type: Array, required: true, default: [] },
    orderOwners: { type: Array, required: true, default: [] },
  },
  components: {},
  data() {
    return {}
  },
  async created() {},
  methods: {},
  computed: {},
  watch: {
    "mainData.punishment_start_date": {
      handler(newValue, oldValue) {
        // if (newValue) {
        //   this.mainData.punishment_expiration_date = dayjs(newValue)
        //     .add(1, "year")
        //     .format("YYYY-MM-DD")
        // }
      },
      deep: true,
    },
  },
}
</script>

<style scoped></style>
