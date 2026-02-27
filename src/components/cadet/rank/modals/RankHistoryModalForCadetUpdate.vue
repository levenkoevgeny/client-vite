<template>
  <div>
    <div class="mb-3">
      <label for="id_rank" class="form-label">Звание</label>
      <select id="id_rank" class="form-select" v-model="mainData.rank" required>
        <option value="">-------</option>
        <option v-for="rank in ranks" :value="rank.id" :key="rank.id">
          {{ rank.rank }}
        </option>
      </select>
    </div>
    <div class="mb-3">
      <label for="id_rank_date" class="form-label"
        >С какого числа присвоено звание</label
      >
      <input
        type="date"
        class="form-control"
        id="id_rank_date"
        v-model="mainData.rank_date"
      />
    </div>
    <div class="mb-3">
      <label for="id_rank_order_date" class="form-label"
        >Дата приказа о присвоении звания</label
      >
      <input
        type="date"
        class="form-control"
        id="id_rank_order_date"
        v-model="mainData.rank_order_date"
      />
    </div>
    <div class="mb-3">
      <label for="id_rank_order_number" class="form-label"
        >Номер приказа о присвоении звания</label
      >
      <input
        type="text"
        class="form-control"
        id="id_rank_order_number"
        v-model="mainData.rank_order_number"
      />
    </div>
    <div class="mb-3">
      <label for="id_order_owner" class="form-label">Чей приказ</label>
      <select
        id="id_order_owner"
        class="form-select"
        v-model="mainData.rank_order_owner"
      >
        <option value="null">-------</option>
        <option
          v-for="orderOwner in orderOwners"
          :value="orderOwner.id"
          :key="orderOwner.id"
        >
          {{ orderOwner.order_owner }}
        </option>
      </select>
    </div>
    <!--    <div class="mb-3">-->
    <!--      <label for="id_rank_extra_data" class="form-label">Фабула</label>-->
    <!--      <textarea-->
    <!--        class="form-control"-->
    <!--        id="id_rank_extra_data"-->
    <!--        rows="3"-->
    <!--        v-model="mainData.rank_extra_data"-->
    <!--      />-->
    <!--    </div>-->
  </div>
</template>

<script>
export default {
  name: "RankHistoryModalForCadetUpdate",
  props: {
    mainData: { type: Object, required: true },
    ranks: { type: Array, required: true },
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
