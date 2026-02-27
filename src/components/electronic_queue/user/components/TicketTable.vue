<template>
  <div style="max-height: calc(100vh - 500px); overflow-y: auto">
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
          <td>
            <div class="d-flex flex-row align-items-center">
              <div
                class="rounded-circle me-4"
                :style="{ backgroundColor: states[ticket.ticket_state].color }"
                style="width: 10px; height: 10px"
              ></div>
              <div>{{ states[ticket.ticket_state].text }}</div>
            </div>
          </td>
          <td v-if="ticket.operator">{{ ticket.get_operator_name }}</td>
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
    return {
      states: {
        0: { text: "В ожидании", color: "#2b2f32" },
        1: { text: "В обработке", color: "#75b798" },
        2: { text: "Обработан", color: "#052c65" },
      },
    }
  },
  async created() {},
  methods: {},
  computed: {},
}
</script>

<style scoped></style>
