<template>
  <div class="container-fluid">
    <br />
    <div
      v-if="isLoading || isCommonLoading"
      style="height: calc(100vh - 170px)"
      class="d-flex justify-content-center align-items-center"
    >
      <div class="spinner-grow" style="width: 3rem; height: 3rem" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else>
      <h1 class="my-2 text-decoration-underline">
        Личное дело ({{ currentEmployeeData.last_name_rus }}
        {{ currentEmployeeData.first_name_rus }})
      </h1>

      <h3 class="me-3" v-if="currentEmployeeData.is_active">Запись активна</h3>
      <h3 class="me-3" v-else>Запись неактивна</h3>

      <div class="mb-3"></div>
      <div class="row">
        <div class="col-10">
          <div
            data-bs-spy="scroll"
            data-bs-target="#simple-list-example"
            data-bs-offset="0"
            data-bs-smooth-scroll="true"
            class="scrollspy-example"
            tabindex="0"
            style="
              height: calc(100vh - 270px);
              max-height: calc(100vh - 270px);
              overflow-y: scroll;
            "
          >
            <div
              class="shadow p-3 mb-3 bg-body-tertiary rounded"
              id="simple-list-personal-data"
            >
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Личные данные</h5>
                  <div class="row">
                    <div class="col-lg-4">
                      <div
                        class="text-center m-3 border"
                        style="position: relative"
                      >
                        <img
                          v-if="currentEmployeeData.photo"
                          :src="currentEmployeeData.photo"
                          class="rounded-2"
                          alt="..."
                          style="width: 100%"
                        />
                        <img
                          v-else
                          src="../../assets/without_photo.jpg"
                          class="rounded-2"
                          alt="..."
                          style="width: 100%"
                        />
                        <input
                          type="file"
                          accept="image/png, image/jpeg"
                          style="position: absolute; bottom: 10px; left: 10px"
                        />
                      </div>
                    </div>
                    <div class="col-lg-8">
                      <div class="d-flex flex-column">
                        <h3 v-if="currentEmployeeData.date_of_birth">
                          Дата рождения -
                          {{
                            new Date(
                              currentEmployeeData.date_of_birth,
                            ).toLocaleString("ru-RU", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          }}
                        </h3>
                        <h3 v-if="currentEmployeeData.get_age">
                          Возраст - {{ currentEmployeeData.get_age }} лет
                        </h3>
                        <h3 v-else>Возраст - нет данных</h3>

                        <h3 v-if="currentEmployeeData.get_next_rank_time">
                          Следующее звание
                          {{ currentEmployeeData.get_next_rank_time }}
                        </h3>
                        <h3>
                          Подразделение -
                          {{ currentEmployeeData.get_subdivision }}
                        </h3>
                      </div>

                      <div class="row mt-3">
                        <div class="col-lg-4">
                          <div class="mb-3">
                            <label class="form-label" for="id_last_name_rus"
                              >Фамилия (рус):</label
                            >
                            <input
                              type="text"
                              class="form-control"
                              name="last_name_rus"
                              maxlength="30"
                              required
                              id="id_last_name_rus"
                              v-model="currentEmployeeData.last_name_rus"
                            />
                          </div>
                        </div>
                        <div class="col-lg-4">
                          <div class="mb-3">
                            <label class="form-label" for="id_first_name_rus"
                              >Имя (рус):</label
                            >
                            <input
                              type="text"
                              class="form-control"
                              name="first_name_rus"
                              maxlength="30"
                              required
                              id="id_first_name_rus"
                              v-model="currentEmployeeData.first_name_rus"
                            />
                          </div>
                        </div>
                        <div class="col-lg-4">
                          <div class="mb-3">
                            <label class="form-label" for="id_patronymic_rus"
                              >Отчество (рус):</label
                            >
                            <input
                              type="text"
                              class="form-control"
                              name="patronymic_rus"
                              maxlength="30"
                              id="id_patronymic_rus"
                              v-model="currentEmployeeData.patronymic_rus"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-lg-4">
                          <div class="mb-3">
                            <label class="form-label" for="id_category"
                              >Категория:</label
                            >
                            <select
                              class="form-select"
                              name="category"
                              id="id_category"
                              v-model="currentEmployeeData.category"
                            >
                              <option value="" selected>---------</option>
                              <option
                                v-for="category in orderedCategories"
                                :value="category.id"
                                :key="category.id"
                              >
                                {{ category.category }}
                              </option>
                            </select>
                          </div>
                        </div>
                        <div class="col-lg-4">
                          <div class="mb-3">
                            <label
                              class="form-label"
                              for="id_personal_number_mvd"
                              >Личный номер (жетон)</label
                            >
                            <input
                              type="text"
                              class="form-control"
                              name="personal_number_mvd"
                              id="id_personal_number_mvd"
                              v-model="currentEmployeeData.personal_number_mvd"
                            />
                          </div>
                        </div>
                        <div class="col-lg-4">
                          <div class="mb-3">
                            <label class="form-label" for="id_category"
                              >Подразделение</label
                            >
                            <select
                              class="form-select"
                              name="subdivision"
                              id="id_subdivision"
                              v-model="currentEmployeeData.subdivision"
                            >
                              <option value="" selected>---------</option>
                              <option
                                v-for="subdivision in orderedSubdivisions"
                                :value="subdivision.id"
                                :key="subdivision.id"
                              >
                                {{ subdivision.subdivision_name }}
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-lg-4">
                          <div class="mb-3"></div>
                        </div>
                        <div class="col-lg-4">
                          <div class="mb-3">
                            <label class="form-label" for="id_category"
                              >Звание</label
                            >
                            <input
                              class="form-control"
                              type="text"
                              v-model="currentEmployeeData.get_rank"
                              disabled
                            />
                          </div>
                        </div>
                        <div class="col-lg-4">
                          <div class="mb-3">
                            <label class="form-label" for="id_category"
                              >Должность</label
                            >
                            <input
                              class="form-control"
                              type="text"
                              v-model="currentEmployeeData.get_position"
                              disabled
                            />
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-lg-4">
                          <div class="mb-3">
                            <label class="form-label" for="id_date_of_birth"
                              >Дата рождения:</label
                            >
                            <input
                              type="date"
                              class="form-control"
                              name="date_of_birth"
                              id="id_date_of_birth"
                              v-model="currentEmployeeData.date_of_birth"
                            />
                          </div>
                        </div>
                        <div class="col-lg-8">
                          <div class="mb-3">
                            <label class="form-label" for="id_place_of_birth"
                              >Место рождения</label
                            >
                            <input
                              type="text"
                              class="form-control"
                              name="place_of_birth"
                              id="id_place_of_birth"
                              v-model="currentEmployeeData.place_of_birth"
                            />
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-lg-4">
                          <div class="mb-3">
                            <label class="form-label" for="id_phone_number"
                              >Номер телефона:</label
                            >
                            <input
                              type="text"
                              class="form-control"
                              name="phone_number"
                              maxlength="30"
                              id="id_phone_number"
                              v-model="currentEmployeeData.phone_number"
                            />
                          </div>
                        </div>
                        <div class="col-lg-8">
                          <div class="mb-3">
                            <label class="form-label" for="id_address_residence"
                              >Адрес места жительства</label
                            >
                            <input
                              type="text"
                              class="form-control"
                              name="address_residence"
                              id="id_address_residence"
                              v-model="currentEmployeeData.address_residence"
                            />
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-lg-12">
                          <div class="mb-3">
                            <label
                              class="form-label"
                              for="id_address_registration"
                              >Адрес регистрации</label
                            >
                            <input
                              type="text"
                              class="form-control"
                              name="address_registration"
                              id="id_address_registration"
                              v-model="currentEmployeeData.address_registration"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="shadow p-3 mb-3 bg-body-tertiary rounded"
              id="simple-list-passport-data"
            >
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Паспортные данные</h5>
                  <div class="row">
                    <div class="col-3">
                      <div class="mb-3">
                        <label class="form-label" for="id_passport_number"
                          >Номер паспорта</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          name="passport_number"
                          maxlength="100"
                          id="id_passport_number"
                          v-model="currentEmployeeData.passport_number"
                        />
                      </div>
                    </div>
                    <div class="col-3">
                      <div class="mb-3">
                        <label class="form-label" for="id_passport_issue_date"
                          >Дата выдачи паспорта:</label
                        >
                        <input
                          type="date"
                          class="form-control"
                          name="passport_issue_date"
                          id="id_passport_issue_date"
                          v-model="currentEmployeeData.passport_issue_date"
                        />
                      </div>
                    </div>
                    <div class="col-3">
                      <div class="mb-3">
                        <label
                          class="form-label"
                          for="id_passport_validity_period"
                          >Срок оконч. паспорта:</label
                        >
                        <input
                          type="date"
                          class="form-control"
                          name="passport_validity_period"
                          id="id_passport_validity_period"
                          v-model="currentEmployeeData.passport_validity_period"
                        />
                      </div>
                    </div>
                    <div class="col-3">
                      <div class="mb-3">
                        <label
                          class="form-label"
                          for="id_passport_issue_authority"
                          >Орган выдачи паспорта:</label
                        >
                        <select
                          class="form-select"
                          name="passport_issue_authority"
                          id="id_passport_issue_authority"
                          v-model="currentEmployeeData.passport_issue_authority"
                        >
                          <option value="" selected>---------</option>

                          <option
                            v-for="passportIssueAuthority in orderedPassportIssueAuthorities"
                            :value="passportIssueAuthority.id"
                          >
                            {{
                              passportIssueAuthority.passport_issue_authority
                            }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!--            <RankHistoryEmployeeComponent-->
            <!--              :employee-id="$route.params.id"-->
            <!--              :order-owners-list="orderOwners"-->
            <!--            />-->
            <!--            <EducationHistoryCadetComponent :cadet-id="$route.params.id" />-->
            <!--            <ScientificWorksCadetComponent :cadet-id="$route.params.id" />-->
            <!--            <JobCadetComponent :cadet-id="$route.params.id" />-->
            <!--            <ArmyServiceCadetComponent-->
            <!--              :cadet-id="$route.params.id"-->
            <!--              :order-owners-list="orderOwner"-->
            <!--            />-->
            <!--            <MVDServiceCadetComponent-->
            <!--              :cadet-id="$route.params.id"-->
            <!--              :order-owners-list="orderOwner"-->
            <!--            />-->
            <!--            <RewardCadetComponent-->
            <!--              :cadet-id="$route.params.id"-->
            <!--              :order-owners-list="orderOwner"-->
            <!--            />-->
            <!--            <EncouragementCadetComponent-->
            <!--              :cadet-id="$route.params.id"-->
            <!--              :order-owners-list="orderOwner"-->
            <!--            />-->
            <!--            <PunishmentCadetComponent-->
            <!--              :cadet-id="$route.params.id"-->
            <!--              :order-owners-list="orderOwner"-->
            <!--            />-->
            <!--            <PositionCadetComponent-->
            <!--              :cadet-id="$route.params.id"-->
            <!--              :order-owners-list="orderOwner"-->
            <!--            />-->
            <!--            <SpecialityCadetComponent-->
            <!--              :cadet-id="$route.params.id"-->
            <!--              :order-owners-list="orderOwner"-->
            <!--            />-->
            <!--            <RelativesCadetComponent :cadet-id="$route.params.id" />-->
          </div>
        </div>
        <div class="col-2">
          <div
            style="
              height: calc(100vh - 270px);
              max-height: calc(100vh - 270px);
              overflow-y: scroll;
            "
          >
            <div class="shadow p-3 mb-5 bg-body-tertiary rounded">
              <div class="card">
                <div class="card-body">
                  <div class="list-group">
                    <a
                      class="list-group-item list-group-item-action rounded-1"
                      href="#simple-list-personal-data"
                      >Личные данные</a
                    >
                    <a
                      class="list-group-item list-group-item-action rounded-1"
                      href="#simple-list-passport-data"
                      >Паспортные данные</a
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import getEmployeeAPIInstance from "@/api/employee/employeeAPI"
import BaseListLayout from "@/components/layouts/BaseListLayout.vue"

import { mapGetters } from "vuex"
import { defineAsyncComponent } from "vue"

const ArmyServiceCadetComponent = defineAsyncComponent(
  () => import("@/components/cadet/service/ArmyServiceCadetComponent.vue"),
)
const MVDServiceCadetComponent = defineAsyncComponent(
  () => import("@/components/cadet/service/MVDServiceCadetComponent.vue"),
)
const RewardCadetComponent = defineAsyncComponent(
  () => import("@/components/cadet/reward/RewardCadetComponent.vue"),
)

import BaseListLayoutForCadetUpdate from "@/components/layouts/BaseListLayoutForCadetUpdate.vue"

// import RelativesCadetComponent from "@/components/cadet/relatives/RelativesCadetComponent.vue"
// import { PositionCadetComponent } from "@/components/cadet/position"
// import { JobCadetComponent } from "@/components/cadet/job"

// import { EncouragementCadetComponent } from "@/components/cadet/encouragement"
// import { SpecialityCadetComponent } from "@/components/cadet/speciality"

// import { RankHistoryEmployeeComponent } from "@/components/employee/rank"
// import { PunishmentCadetComponent } from "@/components/cadet/punishment"
// import { EducationHistoryCadetComponent } from "@/components/cadet/education"

export default {
  name: "EmployeeUpdateView",
  components: {
    // EducationHistoryCadetComponent,
    // PunishmentCadetComponent,
    // MVDServiceCadetComponent,
    // RankHistoryEmployeeComponent,
    // RewardCadetComponent,
    // SpecialityCadetComponent,
    // EncouragementCadetComponent,
    // JobCadetComponent,
    // PositionCadetComponent,
    // RelativesCadetComponent,
    // ArmyServiceCadetComponent,
    BaseListLayoutForCadetUpdate,
    BaseListLayout,
  },
  data() {
    return {
      employeeList: { count: "", results: [], previous: null, next: null },
      isLoading: true,
      isError: false,
      currentEmployeeData: {
        category: null,
        last_name_rus: "",
        first_name_rus: "",
        patronymic_rus: "",
        last_name_bel: "",
        first_name_bel: "",
        patronymic_bel: "",
        last_name_en: "",
        first_name_en: "",
        patronymic_en: "",
        date_of_birth: "",
        place_of_birth: "",
        photo: "",
        address_residence: "",
        address_registration: "",
        phone_number: "",
        personal_number_mvd: "",
        marital_status: "",
        passport_number: "",
        passport_issue_date: "",
        passport_validity_period: "",
        passport_issue_authority: "",
        identification_number: "",
        removed_from_military_registration: "",
        military_commissariat_attitude: "",
        father_last_name: "",
        father_first_name: "",
        father_patronymic: "",
        father_date_of_birth: "",
        father_place_of_work: "",
        father_phone_number: "",
        mother_last_name: "",
        mother_first_name: "",
        mother_patronymic: "",
        mother_date_of_birth: "",
        mother_place_of_work: "",
        mother_phone_number: "",
        foreign_language_was: "",
        foreign_language_will_be: "",
        subdivision: "",
        group: "",
        academy_start_date: "",
        academy_end_date: "",
        graduation_reason: "",
        graduation_reason_article: "",
        graduation_extra_data: "",
        specialization: "",
        direction_ord: "",
        component_organ: "",
        entrance_category: "",
        arrived_from_go_rovd: "",
        social_status: "",
        region_for_medical_examination: "",
        military_office: "",
        extra_data: "",
        vpk: "",
        vpk_data: "",
        aims_to_graduate_with_honors: "",
        is_class_vpn: "",
        is_class_pn: "",
        is_class_other: "",
        has_achievements_in_sports: "",
        is_olympiad_winner: "",
        health_group: "",
        ppfl_test: "",
        medical_age_group: "",
        needs_increased_attention: "",
        needs_psychological_support: "",
        is_risk_group: "",
        has_conviction: "",
        has_dactocard: "",
        has_gusb_check: "",
        has_employee_in_family: "",
        is_orphan: "",
        passed_medical_examination: "",
        passed_medical_examination_extra_data: "",
        has_certificate_ideas_for_Belarus: "",
        has_certificate_kind_heart: "",
        is_employee: "",
      },
      BACKEND_PROTOCOL: import.meta.env.VITE_APP_BACKEND_PROTOCOL,
      BACKEND_HOST: import.meta.env.VITE_APP_BACKEND_HOST,
      BACKEND_PORT: import.meta.env.VITE_APP_BACKEND_PORT,
      employeeAPIInstance: getEmployeeAPIInstance(),
      employeeNewForm: {
        last_name_rus: "",
        first_name_rus: "",
        date_of_birth: null,
      },
    }
  },
  async created() {
    await this.loadData(this.$route.params.id)
  },
  methods: {
    async loadData(employeeId) {
      try {
        const res = await this.employeeAPIInstance.getItemData(employeeId)
        this.currentEmployeeData = res.data
      } catch (error) {
      } finally {
        this.isLoading = false
      }
    },
  },

  computed: {
    orderedCategories() {
      return this.categories.results
    },
    orderedSubdivisions() {
      return this.subdivisions.results.filter(
        (subdivision) => subdivision.subdivision_category == "2",
      )
    },
    orderedPassportIssueAuthorities() {
      return this.passportIssueAuthorities.results
    },
    ...mapGetters({
      groups: "groups/getList",
      ranks: "ranks/getList",
      subdivisions: "subdivisions/getList",
      specialities: "specialities/getList",
      positions: "positions/getList",
      orderOwners: "orderOwners/getList",
      categories: "personCategories/getList",
      passportIssueAuthorities: "passportAuthorities/getList",
      isCommonLoading: "common/getIsCommonLoading",
    }),
  },
}
</script>
