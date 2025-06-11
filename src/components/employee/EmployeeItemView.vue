<template>Item</template>

<script>
import { globalEmployeeAPIInstance } from "@/api/employee/employeeAPI"
import BaseListLayout from "@/components/layouts/BaseListLayout.vue"

import { mapGetters } from "vuex"
import BaseListLayoutForCadetUpdate from "@/components/layouts/BaseListLayoutForCadetUpdate.vue"
import { PaginatorView } from "@/components/common"

export default {
  name: "EmployeeItemView",
  components: {
    BaseListLayoutForCadetUpdate,
    BaseListLayout,
    PaginatorView,
  },
  data() {
    return {
      cadetList: { count: "", results: [], previous: null, next: null },
      isLoading: true,
      isError: false,
      BACKEND_PROTOCOL: import.meta.env.VITE_APP_BACKEND_PROTOCOL,
      BACKEND_HOST: import.meta.env.VITE_APP_BACKEND_HOST,
      BACKEND_PORT: import.meta.env.VITE_APP_BACKEND_PORT,
      cadetAPIInstance: globalEmployeeAPIInstance,
      searchForm: Object.assign({}, globalEmployeeAPIInstance.searchObj),
      cadetNewForm: {
        last_name_rus: "",
        first_name_rus: "",
        date_of_birth: null,
      },
    }
  },
  methods: {},
  computed: {},
}
</script>
