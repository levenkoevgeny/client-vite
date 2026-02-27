<template>
  <div class="container-fluid">
    <router-view></router-view>
  </div>
</template>

<script>
import NavigationLayout from "@/components/layouts/NavigationLayout.vue"

export default {
  name: "EntranceMainView",
  components: { NavigationLayout },
  data() {
    return {
      currentTime: new Date(),
      timeInterval: null,
    }
  },
  async created() {
    this.timeInterval = setInterval(() => {
      this.currentTime = new Date()
    }, 1000)
  },
  methods: {},
  computed: {},
  unmounted() {
    clearInterval(this.timeInterval)
  },
}
</script>

<style scoped></style>
