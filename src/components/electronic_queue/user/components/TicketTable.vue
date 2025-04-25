<template>
  <div style="max-height: calc(100vh - 450px); overflow-y: auto">
    <table class="table">
      <thead>
        <tr>
          <th>Номер талона</th>
          <th>Дата и время выдачи</th>
          <th>Статус</th>
          <th>Оператор</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ticket in ticketList" :key="ticket.id">
          <td>{{ ticket.ticket_number_verbose }}</td>
          <td>
            {{
              new Date(ticket.date_time_created).toLocaleString("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              })
            }}
          </td>
          <td>{{ states[ticket.ticket_state] }}</td>
          <td v-if="ticket.operator">{{ ticket.operator }}</td>
          <td v-else></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "TicketTable",
  components: {},
  props: {
    ticketList: { type: Array, required: true },
  },
  data() {
    return { states: { 0: "В ожидании", 1: "В обработке", 2: "Обработан" } }
  },
  async created() {},
  methods: {},
  computed: {},
}
</script>

<style scoped></style>
