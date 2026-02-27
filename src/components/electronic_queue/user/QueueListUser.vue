<template>
  <div
    class="modal fade"
    id="setWorkPlaceModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    ref="setWorkPlaceModal"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header border border-0">
          <!--          <h1 class="modal-title fs-5" id="exampleModalLabel">-->
          <!--            Укажите номер Вашего рабочего места-->
          <!--          </h1>-->
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body border border-0">
          <h1 class="modal-title fs-5" id="exampleModalLabel">
            Укажите номер Вашего рабочего места!
          </h1>

          <!--          <div class="mb-3">-->
          <!--            <input id="id_workplace_create" type="text" class="form-control" />-->
          <!--          </div>-->
        </div>
        <div class="modal-footer border border-0">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            ref="mainItemAddModalCloseButton"
          >
            Закрыть
          </button>

          <!--          <button type="submit" class="btn btn-primary" @click="setWorkPlace">-->
          <!--            Сохранить-->
          <!--          </button>-->
        </div>
      </div>
    </div>
  </div>

  <div class="container-fluid">
    <div class="row">
      <div class="col-2">
        <div style="max-height: calc(100vh - 220px); overflow-y: auto">
          <h3>Список очередей</h3>
          <div class="list-group">
            <router-link
              v-for="queue in orderedMainList"
              :key="queue.id"
              class="list-group-item list-group-item-action rounded-1"
              :to="{ name: 'queue-list-processing', params: { id: queue.id } }"
            >
              {{ queue.queue_name }}
            </router-link>
            <br />
          </div>
        </div>
      </div>
      <div class="col-10">
        <h1 class="mb-3 p-2" v-if="user.workplace">
          <span class="mb-3 bg-success p-2"
            >Ваше рабочее место - {{ user.workplace }}</span
          >
        </h1>
        <h1 class="bg-danger" v-else>Не указан номер Вашего рабочего места!</h1>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import NavigationLayout from "@/components/layouts/NavigationLayout.vue"
import getQueueAPIInstance from "@/api/electronic_queue/queueAPI.js"
import { mapGetters } from "vuex"

export default {
  name: "QueueListUser",
  components: { NavigationLayout },
  data() {
    return {
      currentQueueData: {
        queue_name: "",
        queue_liter: "",
      },
      mainItemList: { results: [], count: null, next: null, previous: null },
      mainItemAPIInstance: getQueueAPIInstance(),
      searchForm: Object.assign({}, getQueueAPIInstance().searchObj),
    }
  },
  async created() {
    await this.loadData()
    if (!this.user.workplace) {
      let workPlaceModal = this.$refs.setWorkPlaceModal
      let myModal = new bootstrap.Modal(workPlaceModal, {
        keyboard: false,
      })
      myModal.show()
    }
  },
  methods: {
    async loadData() {
      this.isLoading = true
      const response = await this.mainItemAPIInstance.getItemsList()
      this.mainItemList = await response.data
      this.isLoading = false
    },
  },
  computed: {
    orderedMainList() {
      return this.mainItemList.results
    },
    ...mapGetters({
      user: "auth/getUser",
    }),
  },
}
</script>

<style scoped></style>
