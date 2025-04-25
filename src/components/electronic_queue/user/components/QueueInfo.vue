<template>
  <div class="d-flex flex-row mb-4">
    <h3 class="my-4">
      Всего билетов - {{ queueData.get_ticket_count }},&nbsp;
    </h3>
    <h3 class="my-4">В очереди - {{ queueData.get_ticket_pending }},&nbsp;</h3>
    <h3 class="my-4">
      Обрабатываются - {{ queueData.get_ticket_processed }},&nbsp;
    </h3>
    <h3 class="my-4">Обслужены - {{ queueData.get_ticket_fulfilled }}</h3>
  </div>
</template>

<script>
export default {
  name: "QueueInfo",
  components: {},
  props: {
    queueData: { type: Object, required: true },
  },
  data() {
    return {}
  },
  async created() {},
  methods: {},
  computed: {},
}
</script>

<style scoped></style>
