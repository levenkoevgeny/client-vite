<template>
  <div class="card border-0">
    <div class="card-body">
      <h5 class="card-title">
        {{ title }}
      </h5>

      <div class="d-flex align-items-center justify-content-end mb-4">
        <slot name="add-button">
          <button class="btn btn-warning" :disabled="isLoading" type="button">
            <span class="fas fa-plus me-2"></span>Добавить запись
          </button>
        </slot>
      </div>
      <div v-if="isLoading">Загрузка данных ...</div>
      <div v-else>
        <div v-if="mainListLength">
          <div class="mb-3 d-flex align-items-center justify-content-between">
            <div>
              <span>Всего записей - </span>
              <span class="text-body-tertiary fw-semibold">
                {{ mainListLength }}</span
              >
            </div>
            <slot name="delete-selected-button"></slot>
          </div>
          <div
            class="table-responsive"
            style="max-height: 200px; overflow-y: auto"
          >
            <table class="table table-hover">
              <thead style="position: sticky; top: 0">
                <slot name="thead"></slot>
              </thead>
              <tbody class="table-borderless">
                <slot name="tbody"></slot>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else>Записей нет</div>
        <div class="my-3"></div>
        <slot name="paginator"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "base-list-layout-for-cadet-update",
  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },
    mainListLength: {
      type: Number,
      required: true,
      default: 0,
    },
    title: { type: String, required: false, default: "Заголовок" },
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

<style>
th,
td {
  min-width: 100px;
  text-align: start;
  vertical-align: middle;
}
td {
  cursor: pointer;
}
</style>
