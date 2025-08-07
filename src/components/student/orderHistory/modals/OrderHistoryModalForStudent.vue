<template>
  <div>
    <div class="mb-3">
      <label for="id_order_number" class="form-label">Номер приказа</label>
      <input
        type="text"
        class="form-control"
        id="id_order_number"
        v-model="mainData.order_number"
        required
      />
    </div>

    <div class="mb-3">
      <label for="id_order_date" class="form-label">Дата приказа</label>
      <input
        type="date"
        class="form-control"
        id="id_order_date"
        v-model="mainData.order_date"
        required
      />
    </div>

    <div class="mb-3">
      <label for="id_order_date" class="form-label"
        >Дата начала действия приказа</label
      >
      <input
        type="date"
        class="form-control"
        id="id_order_date"
        v-model="mainData.order_start_date"
        required
      />
    </div>

    <div class="mb-3">
      <label for="id_punishment_start_extra_data" class="form-label"
        >Доп. данные</label
      >
      <textarea
        class="form-control"
        id="id_punishment_start_extra_data"
        v-model="mainData.order_extra_data"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderHistoryModalForStudent",
  props: {
    mainData: { type: Object, required: true },
  },
}
</script>

<style scoped></style>
