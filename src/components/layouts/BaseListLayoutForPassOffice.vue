<template>
  <div class="container-fluid">
    <slot name="modals"></slot>
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

        <div v-show="isLoading || isCommonLoading">Загрузка данных ...</div>
        <div v-show="!(isLoading || isCommonLoading)">
          <div v-show="mainListLength">
            <div class="mb-3 d-flex align-items-center justify-content-between">
              <div>
                <span>Всего записей - </span>
                <span class="text-body-tertiary fw-semibold">
                  {{ mainListLength }}</span
                >
              </div>
            </div>
            <div
              class="table-responsive border"
              style="max-height: calc(100vh - 230px); overflow-y: auto"
              ref="infinite_list"
            >
              <table class="table table-hover">
                <thead style="position: sticky; top: 0">
                  <slot name="thead"></slot>
                </thead>
                <tbody class="table-borderless">
                  <slot name="tbody"></slot>
                </tbody>
              </table>
              <div ref="observer" style="height: 10px"></div>
            </div>
          </div>
          <div v-show="!mainListLength">Записей нет</div>
          <div class="my-3"></div>
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
  mounted() {
    const options = {
      root: this.$refs.infinite_list,
      rootMargin: "0px",
      threshold: 0.5,
    }

    const observer = new IntersectionObserver(this.loadMoreData, options)
    observer.observe(this.$refs.observer)
  },
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
</style>
