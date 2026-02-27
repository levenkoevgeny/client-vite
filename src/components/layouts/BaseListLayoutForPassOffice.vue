<template>
  <div class="container-fluid">
    <slot name="modals"></slot>
    <div class="my-4"></div>
    <div class="row flex-nowrap">
      <div class="col">
        <h2>
          {{ title }}
        </h2>
        <div class="my-4"></div>

        <div v-show="isLoading || isCommonLoading">Загрузка данных ...</div>
        <div v-show="!(isLoading || isCommonLoading)">
          <div>
            <div class="mb-3 d-flex align-items-center justify-content-between">
              <div>
                <span>Всего записей - </span>
                <span class="text-body-tertiary fw-semibold">
                  {{ mainListLength }}</span
                ><span class="text-body-tertiary fw-semibold">
                  (выбрано - {{ selectedItemsCount }})</span
                >
              </div>
            </div>
            <slot name="search-form-clear-button"></slot>
            <div
              class="table-responsive"
              style="max-height: calc(100vh - 300px); overflow-y: auto"
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
    selectedItemsCount: {
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
