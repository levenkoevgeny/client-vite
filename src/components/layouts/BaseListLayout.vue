<template>
  <slot name="modals"></slot>
  <div class="container-fluid">
    <div class="row flex-nowrap">
      <div class="col">
        <div class="d-flex justify-content-end">
          <a
            href="#"
            data-bs-target="#sidebar"
            data-bs-toggle="collapse"
            class="rounded-3 p-1 text-decoration-none fs-3 filter-icon-color"
            ><font-awesome-icon :icon="['fas', 'filter']"
          /></a>
        </div>

        <h2>
          {{ title }}
        </h2>
        <slot name="search-form-horizontal"></slot>
        <div class="d-flex align-items-center justify-content-end m-4">
          <slot name="add-button">
            <button class="btn btn-warning" :disabled="isLoading" type="button">
              <span class="fas fa-plus me-2"></span>Добавить запись
            </button>
          </slot>
        </div>
        <div></div>
        <div v-if="isLoading || isCommonLoading">Загрузка данных ...</div>
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
            <slot name="table-mode-button"></slot>
            <div
              class="table-responsive"
              style="max-height: calc(100vh - 400px); overflow-y: auto"
              @scroll="loadMoreData"
              id="infinite_list"
              ref="infinite_list_div"
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

      <div class="col-auto">
        <div class="navbar navbar-expand-lg">
          <div id="sidebar" class="collapse collapse-horizontal border-start">
            <div
              id="sidebar-nav"
              class="list-group border-0 rounded-0 text-sm-start"
              style="width: 500px"
            >
              <h3 class="my-3 p-3">Поиск по критериям</h3>
              <div
                style="max-height: calc(100vh - 290px); overflow-y: auto"
                class="p-3"
              >
                <slot name="search-form"></slot>
              </div>
              <slot name="search-form-clear-button"></slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  name: "base-list-layout",
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
    loadMoreData: { type: Function, required: false, default: () => {} },
  },
  components: {},
  data() {
    return {}
  },
  async created() {},
  methods: {},
  computed: {
    ...mapGetters({
      isCommonLoading: "common/getIsCommonLoading",
    }),
  },
}
</script>

<style>
thead {
  position: sticky;
  top: 0;
}
th,
td {
  min-width: 100px;
  text-align: start;
  vertical-align: middle;
}
td {
  cursor: pointer;
}
.filter-icon-color {
  color: var(--bs-body-color);
}
>>> {
  --vs-controls-color: #664cc3;
  --vs-border-color: #664cc3;

  --vs-dropdown-bg: #282c34;
  --vs-dropdown-color: #cc99cd;
  --vs-dropdown-option-color: #cc99cd;

  --vs-selected-bg: #664cc3;
  --vs-selected-color: #eeeeee;

  --vs-search-input-color: #eeeeee;

  --vs-dropdown-option--active-bg: #664cc3;
  --vs-dropdown-option--active-color: #eeeeee;
}
</style>
