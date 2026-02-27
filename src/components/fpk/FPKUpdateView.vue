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
      <!--      <h1>Компонент находится в разработке!!!!</h1>-->
      <h1 class="my-2 text-decoration-underline">
        Личное дело ({{ currentFPKData.last_name_rus }}
        {{ currentFPKData.first_name_rus }})
      </h1>
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
              height: calc(100vh - 250px);
              max-height: calc(100vh - 250px);
              overflow-y: scroll;
            "
          >
            <div class="shadow p-3 mb-3" id="simple-list-personal-data">
              <div class="card border-0">
                <div class="card-body">
                  <h5 class="card-title">Личные данные</h5>
                  <div class="row">
                    <div class="col-lg-4">
                      <div
                        class="text-center m-3 border"
                        style="position: relative"
                      >
                        <img
                          v-if="currentFPKData.photo"
                          :src="currentFPKData.photo"
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
                          v-on:change="uploadPhoto"
                          ref="uploadedPhoto"
                          name="photo_file"
                          accept="image/png, image/jpeg"
                          style="position: absolute; bottom: 10px; left: 10px"
                        />
                      </div>
                    </div>
                    <div class="col-lg-8">
                      <div class="d-flex flex-row">
                        <h3 class="me-3" v-if="currentFPKData.get_age">
                          Возраст - {{ currentFPKData.get_age }} лет
                        </h3>
                        <h3 class="me-3" v-else>Возраст - нет данных</h3>
                      </div>

                      <div
                        class="row d-flex justify-content-start align-items-center"
                      >
                        <div class="col-lg-4">
                          <div class="mb-3">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                v-model="currentFPKData.is_active"
                                id="id_is_active"
                              />
                              <label
                                class="form-check-label"
                                for="id_is_active"
                              >
                                Запись активна
                              </label>
                            </div>
                          </div>
                        </div>
                        <div class="col-lg-4">
                          <div class="mb-3">
                            <label class="form-label" for="id_id"
                            >Номер в базе</label
                            >
                            <input
                              type="text"
                              class="form-control"
                              name="id"
                              id="id_id"
                              disabled
                              v-model="currentFPKData.id"
                            />
                          </div>
                        </div>
                        <div class="col-lg-4">
                          <div class="mb-3">
                            <label class="form-label" for="id_entrance_year"
                            >Год набора</label
                            >
                            <input
                              type="text"
                              class="form-control"
                              name="entrance_year"
                              required
                              id="id_entrance_year"
                              disabled
                              v-model="currentFPKData.entrance_year"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="row">
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
                              v-model="currentFPKData.last_name_rus"
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
                              v-model="currentFPKData.first_name_rus"
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
                              v-model="currentFPKData.patronymic_rus"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-lg-4">
                          <div class="mb-3">
                            <label class="form-label" for="id_last_name_bel"
                            >Фамилия (бел):</label
                            >
                            <input
                              type="text"
                              class="form-control"
                              name="last_name_bel"
                              maxlength="100"
                              required
                              id="id_last_name_bel"
                              v-model="currentFPKData.last_name_bel"
                            />
                          </div>
                        </div>
                        <div class="col-lg-4">
                          <div class="mb-3">
                            <label class="form-label" for="id_first_name_bel"
                            >Имя (бел):</label
                            >
                            <input
                              type="text"
                              class="form-control"
                              name="first_name_bel"
                              maxlength="100"
                              required
                              id="id_first_name_bel"
                              v-model="currentFPKData.first_name_bel"
                            />
                          </div>
                        </div>
                        <div class="col-lg-4">
                          <div class="mb-3">
                            <label class="form-label" for="id_patronymic_bel"
                            >Отчество (бел):</label
                            >
                            <input
                              type="text"
                              class="form-control"
                              name="patronymic_bel"
                              maxlength="100"
                              id="id_patronymic_bel"
                              v-model="currentFPKData.patronymic_bel"
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
                              v-model="currentFPKData.date_of_birth"
                            />
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
                              v-model="currentFPKData.personal_number_mvd"
                            />
                          </div>
                        </div>
                        <div class="col-lg-4">
                          <div class="mb-3">
                            <label for="id_rank" class="form-label"
                            >Звание</label
                            >
                            <select
                              id="id_rank"
                              class="form-select"
                              v-model="currentFPKData.current_rank"
                            >
                              <option :value="null">-------</option>
                              <option
                                v-for="rank in orderedRanks"
                                :value="rank.id"
                                :key="rank.id"
                              >
                                {{ rank.rank }}
                              </option>
                            </select>
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
                              v-model="currentFPKData.phone_number"
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
                              v-model="currentFPKData.address_residence"
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
                              v-model="currentFPKData.address_registration"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="shadow p-3 mb-3" id="simple-list-education">
              <div class="card border-0">
                <div class="card-body">
                  <h5 class="card-title">Образование</h5>

                  <div class="row">
                    <div class="col-xl-3">
                      <div class="form-floating mb-3">
                        <select
                          id="id_education_kind"
                          class="form-select"
                          v-model="currentFPKData.education_kind"
                        >
                          <option :value="null">---------</option>
                          <option
                            :value="educationKind.id"
                            v-for="educationKind in orderedEducationKinds"
                          >
                            {{ educationKind.education }}
                          </option>
                        </select>
                        <label for="id_education_kind">Образование</label>
                      </div>
                    </div>
                    <div class="col-xl-3">
                      <div class="form-floating mb-3">
                        <select
                          id="id_education_level"
                          class="form-select"
                          v-model="currentFPKData.education_level"
                        >
                          <option :value="null">---------</option>
                          <option
                            :value="educationLevel.id"
                            v-for="educationLevel in orderedEducationLevels"
                          >
                            {{ educationLevel.education_level }}
                          </option>
                        </select>
                        <label for="id_education_level"
                        >Уровень образования</label
                        >
                      </div>
                    </div>
                    <div class="col-xl-3">
                      <div class="form-floating mb-3">
                        <input
                          type="number"
                          id="id_education_graduating_end_year"
                          name="education_graduating_end_year"
                          class="form-control form-control-sm"
                          placeholder="Год окончания"
                          v-model="currentFPKData.education_graduating_end_year"
                          @input="makeInputDefaultNullValueIfEmpty"
                        />
                        <label for="id_education_graduating_end_year"
                        >Год окончания</label
                        >
                      </div>
                    </div>
                    <div class="col-xl-3">
                      <div class="form-floating mb-3">
                        <select
                          id="id_medal"
                          class="form-select"
                          v-model="currentFPKData.medal"
                        >
                          <option :value="null">---------</option>
                          <option
                            :value="medal.id"
                            v-for="medal in orderedMedals"
                          >
                            {{ medal.medal_kind }}
                          </option>
                        </select>
                        <label for="id_medal">Медаль</label>
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-xl-6">
                      <div class="form-floating mb-3">
                        <textarea
                          id="id_education_graduated"
                          rows="2"
                          class="form-control form-control-sm"
                          v-model="currentFPKData.education_graduated"
                          placeholder="Наименование УО"
                        ></textarea>
                        <label for="id_education_graduated"
                        >Наименование УО</label
                        >
                      </div>
                    </div>
                    <div class="col-xl-3">
                      <div class="form-floating mb-3">
                        <select
                          id="id_education_location_kind"
                          class="form-select"
                          v-model="currentFPKData.education_location_kind"
                        >
                          <option :value="null">---------</option>
                          <option
                            :value="educationLocalityKind.id"
                            v-for="educationLocalityKind in orderedEducationLocalityKinds"
                          >
                            {{ educationLocalityKind.education_location_kind }}
                          </option>
                        </select>
                        <label for="id_education_location_kind"
                        >Город/село</label
                        >
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-12">
                      <div class="form-check mb-3">
                        <input
                          id="id_is_located_in_Minsk"
                          class="form-check-input"
                          type="checkbox"
                          v-model="currentFPKData.is_located_in_Minsk"
                        />
                        <label
                          class="form-check-label"
                          for="id_is_located_in_Minsk"
                        >
                          УО расположено в г. Минск
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="shadow p-3 mb-3" id="simple-list-academy-data">
              <div class="card border-0">
                <div class="card-body">
                  <h5 class="card-title">Обучение в Академии МВД</h5>
                  <div class="row">
                    <div class="col-lg-4">
                      <div class="mb-3">
                        <label class="form-label" for="id_category"
                        >Группа</label
                        >
                        <select
                          class="form-select"
                          name="subdivision"
                          id="id_subdivision"
                          v-model="currentFPKData.group"
                        >
                          <option :value="null">---------</option>
                          <option
                            v-for="group in orderedGroups"
                            :value="group.id"
                            :key="group.id"
                          >
                            {{ group.group_name }}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div class="col-lg-4">
                      <div class="mb-3">
                        <label class="form-label" for="id_student_record_book_number"
                        >Номер зачетной книжки</label>

                        <input type="text" id="id_student_record_book_number" class="form-control"
                               v-model="currentFPKData.student_record_book_number">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-2">
          <div
            style="
              height: calc(100vh - 250px);
              max-height: calc(100vh - 250px);
              overflow-y: scroll;
            "
          >
            <div class="shadow p-2 mb-5 rounded">
              <div class="card border-0">
                <div class="card-body">
                  <div class="list-group">
                    <a
                      class="list-group-item list-group-item-action rounded-1"
                      href="#simple-list-personal-data"
                    >Личные данные</a
                    >
                    <!--                    <a-->
                    <!--                      class="list-group-item list-group-item-action rounded-1"-->
                    <!--                      href="#simple-list-passport-data"-->
                    <!--                      >Паспортные данные</a-->
                    <!--                    >-->
                    <a
                      class="list-group-item list-group-item-action rounded-1"
                      href="#simple-list-academy-data"
                    >Обучение в Академии МВД</a
                    >
                    <a
                      class="list-group-item list-group-item-action rounded-1"
                      href="#simple-list-education"
                    >Образование</a
                    >
                    <!--                    <a-->
                    <!--                      class="list-group-item list-group-item-action rounded-1"-->
                    <!--                      href="#simple-list-education-data"-->
                    <!--                      >Образование</a-->
                    <!--                    >-->
                    <!--                    <a-->
                    <!--                      class="list-group-item list-group-item-action rounded-1"-->
                    <!--                      href="#simple-list-foreign-language-data"-->
                    <!--                      >Иностранные языки</a-->
                    <!--                    >-->
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
import { debounce } from "lodash/function"
import getFPKPRKStudentAPIInstance from "@/api/fpkprk/fpk_prk_studentAPI.js"
import { mapGetters } from "vuex"

export default {
  name: "FPKUpdateView",
  components: {},
  data() {
    return {
      options: [],
      selected: "",
      isLoading: true,
      currentFPKData: {
        is_preloaded_data: true,
        category: "",
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
        military_office: "",
        extra_data: "",
        student_record_book_number: ""
      },
      fpkAPIInstance: getFPKPRKStudentAPIInstance(),
      BACKEND_PROTOCOL: import.meta.env.VITE_APP_BACKEND_PROTOCOL,
      BACKEND_HOST: import.meta.env.VITE_APP_BACKEND_HOST,
      BACKEND_PORT: import.meta.env.VITE_APP_BACKEND_PORT
    }
  },
  async created() {
    await this.loadData(this.$route.params.id)
  },
  methods: {
    async loadData(cadetId) {
      try {
        const res = await this.fpkAPIInstance.getItemData(cadetId)
        this.currentFPKData = await res.data
      } catch (error) {
      } finally {
        this.isLoading = false
      }
    },
    debouncedUpdate: debounce(async function() {
      try {
        const { photo, attached_documents, sign_image, ...rest } =
          this.currentFPKData
        await this.fpkAPIInstance.updateItem(rest)
      } catch (e) {
      } finally {
      }
    }, 500),
    async uploadPhoto() {
      let formData = new FormData()
      formData.append("photo", this.$refs.uploadedPhoto.files[0])

      const response = await this.fpkAPIInstance.updatePhotoOrAnyFile(
        this.currentFPKData.id,
        formData
      )

      this.currentFPKData = {
        ...this.currentFPKData,
        photo: response.data.photo
      }
    },
    makeInputDefaultNullValueIfEmpty(event) {
      if (event.target.value.trim().length === 0) {
        this.currentFPKPRKData[event.target.name] = null
      }
    }
  },
  computed: {
    orderedGroups() {
      return this.groups.results
    },
    orderedRanks() {
      return this.ranks.results
    },
    orderedEducationKinds() {
      return this.educationKinds.results
    },
    orderedEducationLevels() {
      return this.educationLevels.results
    },
    orderedMedals() {
      return this.medals.results
    },
    orderedEducationLocalityKinds() {
      return this.educationLocalityKinds.results
    },
    ...mapGetters({
      groups: "groups/getList",
      ranks: "ranks/getList",
      subdivisions: "subdivisions/getList",
      specialities: "specialities/getList",
      specializations: "specializations/getList",
      directionsORD: "directionsORD/getList",
      positions: "positions/getList",
      graduationReasons: "graduationReasons/getList",
      passportIssueAuthorities: "passportAuthorities/getList",
      educationKinds: "educationKind/getList",
      educationLevels: "educationLevel/getList",
      medals: "medals/getList",
      token: "auth/getToken",
      educationLocalityKinds: "educationLocalityKind/getList",
      isCommonLoading: "common/getIsCommonLoading"
    })
  },
  watch: {
    currentFPKData: {
      handler(newValue, oldValue) {
        if (!oldValue.hasOwnProperty("is_preloaded_data")) {
          this.debouncedUpdate()
        }
      },
      deep: true
    }
  }
}
</script>
