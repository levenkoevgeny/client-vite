<template>
  <nav>
    <ul class="pagination pagination-md my-0">
      <li
        class="page-item"
        :class="{ disabled: !listPrevious }"
        @click="updatePaginator(listPrevious)"
      >
        <button class="page-link">
          <span aria-hidden="true">&laquo;</span>
        </button>
      </li>
      <li class="mx-2"></li>
      <li class="page-item" :class="{ disabled: !listNext }">
        <button class="page-link" @click="updatePaginator(listNext)">
          <span aria-hidden="true">&raquo;</span>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "PaginatorView",
  data() {
    return {
      BACKEND_PROTOCOL: import.meta.env.VITE_APP_BACKEND_PROTOCOL,
      BACKEND_HOST: import.meta.env.VITE_APP_BACKEND_HOST,
      BACKEND_PORT: import.meta.env.VITE_APP_BACKEND_PORT,
    }
  },
  props: {
    listPrevious: { type: [String, null] },
    listNext: { type: [String, null] },
    updatePaginator: { type: Function, required: true },
  },
  async created() {},

  methods: {},
  computed: {},
  watch: {},
}
</script>

<style scoped></style>
