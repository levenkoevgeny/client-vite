<template>
  <div
    class="alert alert-danger"
    role="alert"
    style="
      position: fixed;
      z-index: 99999999;
      top: 0;
      left: 0;
      width: 100%;
      opacity: 0.8;
    "
    v-if="errorList.length"
  >
    <div class="m-2" style="max-height: 50vh; overflow-y: auto">
      <p v-for="error in errorList">
        <template v-if="error.errorCode">
          <template v-if="error.errorCode === 'token_not_valid'"
            >Сессия истекла</template
          >
        </template>
        <template v-else>{{ error.errorMessage }}</template>
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import errors from "@/store/modules/errors"

export default {
  name: "MainErrorComponent",
  computed: {
    ...mapGetters({
      errorList: "errors/getErrorsList",
    }),
  },
}
</script>

<style scoped></style>
