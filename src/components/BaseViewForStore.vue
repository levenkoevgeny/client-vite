<template>
  <main-error-component />
  <router-view />
</template>

<script>
import { mapGetters } from "vuex"
import MainErrorComponent from "@/components/errors/MainErrorComponent.vue"
export default {
  name: "BaseViewForStore",
  components: { MainErrorComponent },
  async created() {
    await this.$store.dispatch("common/actionGetCommonLists", {
      token: this.token,
    })
  },
  computed: {
    ...mapGetters({
      token: "auth/getToken",
    }),
  },
}
</script>
