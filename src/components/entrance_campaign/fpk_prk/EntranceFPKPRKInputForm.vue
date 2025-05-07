<template>
  <div class="container-fluid">FPK PRK Item</div>
</template>

<script>
import NavigationLayout from "@/components/layouts/NavigationLayout.vue"
import { globalFPKPRKStudentAPIForEntranceInstance } from "@/api/fpkprk/fpk_prk_studentAPI.js"
import getActionHistoryAPIInstance from "@/api/cadet/actionHistoryAPI.js"
import { isEqual } from "lodash"
import { mapGetters } from "vuex"
import useVuelidate from "@vuelidate/core"
import { required, helpers, minValue, maxValue } from "@vuelidate/validators"

export default {
  name: "FPKPRKInputForm",
  components: { NavigationLayout },
  data() {
    return {
      currentTime: new Date(),
      isLoading: true,
      isDataSaving: false,
      isError: false,
      currentFPKPRKData: {
        id: "",
        is_active: "",
        category: "",
        gender: "",
        last_name_rus: "",
        first_name_rus: "",
        patronymic_rus: "",
        date_of_birth: "",
        place_of_birth: "",
        photo: "",
        address_residence: "",
        address_registration: "",
        phone_number: "",
      },
      currentFPKPRKDataFromServer: {},
      fpk_prkAPIInstance: globalFPKPRKStudentAPIForEntranceInstance,
      actionHistoryAPIInstance: getActionHistoryAPIInstance(),
      BACKEND_PROTOCOL: import.meta.env.VITE_APP_BACKEND_PROTOCOL,
      BACKEND_HOST: import.meta.env.VITE_APP_BACKEND_HOST,
      BACKEND_PORT: import.meta.env.VITE_APP_BACKEND_PORT,
      fpk_prkHistoryList: { count: 0, results: [], previous: null, next: null },
    }
  },
  setup() {
    return { v$: useVuelidate() }
  },
  validations() {
    const education_graduating_end_year_minValueValue = minValue(2000)
    const education_graduating_end_year_maxValueValue = maxValue(2025)
    return {
      currentFPKPRKData: {
        last_name_rus: {
          required: helpers.withMessage(
            "Поле 'Фамилия (рус)' не может быть пустым",
            required,
          ),
          $autoDirty: true,
        },
        education_graduating_end_year: {
          education_graduating_end_year_maxValueValue: helpers.withMessage(
            "Некорректное значение поля 'Год окончания школы'",
            education_graduating_end_year_maxValueValue,
          ),
          education_graduating_end_year_minValueValue: helpers.withMessage(
            "Некорректное значение поля 'Год окончания школы'",
            education_graduating_end_year_minValueValue,
          ),
          $autoDirty: true,
        },
      },
    }
  },
  async created() {
    await this.loadData(this.$route.params.id)
  },
  methods: {
    async loadData(applicantId) {},
  },
  computed: {
    ...mapGetters({}),
  },
}
</script>
