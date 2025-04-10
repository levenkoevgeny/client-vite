<template>
  <div>
    <div class="mb-3">
      <label for="id_reward" class="form-label">Награда</label>
      <select
        id="id_reward"
        class="form-select"
        v-model="mainData.reward"
        required
      >
        <option value="">-------</option>
        <option
          v-for="reward in rewardList"
          :value="reward.id"
          :key="reward.id"
        >
          {{ reward.reward_title }}
        </option>
      </select>
    </div>

    <div class="mb-3">
      <label for="id_reward_date" class="form-label">Дата награды</label>
      <input
        type="date"
        class="form-control"
        id="id_reward_date"
        v-model="mainData.reward_date"
      />
    </div>

    <div class="mb-3">
      <label for="id_reason" class="form-label">За что награжден</label>
      <textarea id="id_reason" class="form-control" v-model="mainData.reason" />
    </div>

    <div class="mb-3">
      <label for="id_order_owner" class="form-label">Чей приказ</label>
      <select id="id_reward" class="form-select" v-model="mainData.order_owner">
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
      <label for="id_order_number" class="form-label">Номер приказа</label>
      <input
        type="date"
        class="form-control"
        id="id_order_number"
        v-model="mainData.order_number"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "RewardModalForCadetUpdate",
  props: {
    mainData: { type: Object, required: true },
    rewardList: { type: Array, required: true, default: [] },
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
