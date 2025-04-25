<template>

  <div class="container-fluid">
    <div class="d-flex flex-row justify-content-between mb-3">
      <h2 class="mt-3">Список очередей</h2>

    </div>
  </div>
</template>

<script>
import NavigationLayout from "@/components/layouts/NavigationLayout.vue"

export default {
  name: "ElectronicQueueList",
  components: { NavigationLayout },
  data() {
    return {
      currentTime: new Date(),
    }
  },
  async created() {
    setInterval(() => {
      this.currentTime = new Date()
    }, 1000)
  },
  methods: {},
  computed: {},
}
</script>

<style scoped></style>
