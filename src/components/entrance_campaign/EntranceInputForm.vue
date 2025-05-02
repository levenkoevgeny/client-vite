<template>
  <div class="container-fluid">
    <div
      class="modal fade"
      id="id_cadetHistoryModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      ref="cadetHistoryModal"
    >
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              История изменений:
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div class="modal-body">
            <div
              style="max-height: 400px; overflow-y: auto"
              v-if="cadetHistoryList.results.length > 0"
            >
              <table class="table">
                <thead>
                  <tr>
                    <th>Пользователь</th>
                    <th>Действие</th>
                    <th>Дата и время</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="record in cadetHistoryList.results"
                    :key="record.id"
                  >
                    <td>{{ record.get_user }}</td>
                    <td>{{ record.action }}</td>
                    <td>
                      {{
                        new Date(record.date_time_created).toLocaleString(
                          "ru-RU",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            second: "numeric",
                          },
                        )
                      }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else>
              <p>Записей нет</p>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              ref="cadetAddModalCloseButton"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>

    <!--    Validation modal-->
    <div
      class="modal fade"
      id="id_validationErrorsModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      ref="validationErrorsModal"
    >
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              Для сохранения данных исправте следующие ошибки:
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div class="modal-body">
            <div style="max-height: 400px; overflow-y: auto">
              <p v-for="error of v$.currentCadetData.$errors">
                {{ error.$message }}
              </p>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              ref="cadetAddModalCloseButton"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>

    <!--Has to save data before printing-->
    <div
      class="modal fade"
      id="id_hasToSaveDataModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      ref="hasToSaveDataModal"
    >
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              Несохраненные данные!
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div class="modal-body">
            <h1 class="fs-5">
              Прежде чем распечатать заявление сохраните все изменения!
            </h1>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              ref="cadetAddModalCloseButton"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>

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
      <div class="d-flex flex-row justify-content-between align-items-end pb-3">
        <div>
          <h1
            class="fw-lighter"
            :class="{
              'bg-success-subtle':
                currentCadetData.application_has_been_printed,
            }"
          >
            Личное дело абитуриента
            <span class="fw-normal text-decoration-underline"
              >{{ currentCadetData.last_name_rus }}&nbsp;{{
                currentCadetData.first_name_rus
              }}&nbsp;{{ currentCadetData.patronymic_rus }}</span
            >
          </h1>
          <button class="mx-2 btn btn-warning" @click="showHistory">
            История изменений&nbsp;&nbsp;<font-awesome-icon
              :icon="['fas', 'database']"
            />
          </button>
          <div v-if="currentCadetData.application_has_been_printed">
            <p>
              <font-awesome-icon :icon="['fas', 'print']" /> Заявление
              отпечатано
              <span v-if="currentCadetData.application_has_been_printed_date">
                - {{ currentCadetData.application_has_been_printed_date }}</span
              >
            </p>
          </div>
        </div>
        <div class="d-flex flex-row justify-content-end align-items-center">
          <div
            class="me-4 text-success fs-5"
            v-if="isDataFromServerEqualChangedData"
          >
            &#8226; &nbsp;Данные сохранены
          </div>
          <div class="me-4 text-secondary fs-5" v-else-if="isDataSaving">
            &#8226; &nbsp;Сохранение ...
          </div>
          <div class="me-4 text-warning fs-5" v-else>
            &#8226; &nbsp;Несохраненные данные
          </div>

          <div>
            <button
              class="btn btn-primary"
              @click="saveEntranceForm"
              :disabled="isDataFromServerEqualChangedData || isDataSaving"
            >
              Сохранить изменения
            </button>
          </div>
        </div>
      </div>
      <div style="max-height: calc(100vh - 300px); overflow-y: auto">
        <div style="max-width: 99%">
          <div class="card shadow mb-2 rounded border-0">
            <div class="card-body">
              <h5 class="card-title">Персональные данные</h5>
              <div class="row mt-3">
                <div class="col-xl-3">
                  <div class="form-floating mb-3">
                    <input
                      id="id_last_name_rus"
                      type="text"
                      class="form-control form-control-sm"
                      placeholder="Фамилия"
                      v-model="currentCadetData.last_name_rus"
                    />
                    <label for="id_last_name_rus">Фамилия (рус)</label>
                  </div>
                </div>
                <div class="col-xl-3">
                  <div class="form-floating mb-3">
                    <input
                      id="id_first_name_rus"
                      type="text"
                      class="form-control"
                      placeholder="Имя"
                      v-model="currentCadetData.first_name_rus"
                    />
                    <label for="id_first_name_rus">Имя (рус)</label>
                  </div>
                </div>
                <div class="col-xl-3">
                  <div class="form-floating mb-3">
                    <input
                      id="id_patronymic_rus"
                      type="text"
                      class="form-control"
                      placeholder="Отчество"
                      v-model="currentCadetData.patronymic_rus"
                    />
                    <label for="id_patronymic_rus">Отчество (рус)</label>
                  </div>
                </div>
                <div class="col-xl-3">
                  <div class="form-floating mb-3">
                    <input
                      id="id_date_of_birth"
                      type="date"
                      class="form-control"
                      placeholder="Дата рождения"
                      v-model="currentCadetData.date_of_birth"
                    />
                    <label for="id_date_of_birth">Дата рождения</label>
                  </div>
                </div>
                <!--                <div class="col-xl-3">-->
                <!--                  <div class="form-floating mb-3">-->
                <!--                    <input-->
                <!--                      id="id_last_name_bel"-->
                <!--                      type="text"-->
                <!--                      class="form-control form-control-sm"-->
                <!--                      placeholder="Фамилия (бел)"-->
                <!--                      v-model="currentCadetData.last_name_bel"-->
                <!--                    />-->
                <!--                    <label for="id_last_name_bel">Фамилия (бел)</label>-->
                <!--                  </div>-->
                <!--                  <div class="form-floating mb-3">-->
                <!--                    <input-->
                <!--                      id="id_first_name_bel"-->
                <!--                      type="text"-->
                <!--                      class="form-control"-->
                <!--                      placeholder="Имя (бел)"-->
                <!--                      v-model="currentCadetData.first_name_bel"-->
                <!--                      required-->
                <!--                    />-->
                <!--                    <label for="id_first_name_bel">Имя (бел)</label>-->
                <!--                  </div>-->
                <!--                  <div class="form-floating mb-3">-->
                <!--                    <input-->
                <!--                      id="id_patronymic_bel"-->
                <!--                      type="text"-->
                <!--                      class="form-control"-->
                <!--                      placeholder="Отчество (бел)"-->
                <!--                      v-model="currentCadetData.patronymic_bel"-->
                <!--                    />-->
                <!--                    <label for="id_patronymic_bel">Отчество (бел)</label>-->
                <!--                  </div>-->
                <!--                </div>-->
              </div>

              <div class="row">
                <div class="col-xl-3">
                  <div class="form-floating mb-3">
                    <select
                      id="id_gender"
                      class="form-select"
                      v-model="currentCadetData.gender"
                    >
                      <option :value="null">---------</option>
                      <option value="1">Мужской</option>
                      <option value="0">Женский</option>
                    </select>
                    <label for="id_gender">Пол</label>
                  </div>
                </div>
                <div class="col-xl-3">
                  <div class="form-floating mb-3">
                    <select
                      id="id_rank"
                      class="form-select"
                      v-model="currentCadetData.current_rank"
                    >
                      <option :value="null">---------</option>
                      <option :value="rank.id" v-for="rank in orderedRanks">
                        {{ rank.rank }}
                      </option>
                    </select>
                    <label for="id_rank">Звание</label>
                  </div>
                </div>
                <div class="col-xl-3">
                  <div class="form-floating mb-3">
                    <input
                      id="id_personal_number_mvd"
                      type="text"
                      class="form-control"
                      placeholder="Личный номер"
                      v-model="currentCadetData.personal_number_mvd"
                    />
                    <label for="id_personal_number_mvd">Личный номер</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card shadow mb-2 rounded border-0">
            <div class="card-body">
              <h5 class="card-title">Блок по Академии</h5>
              <div class="row mt-3">
                <div class="col-xl-3">
                  <div class="form-floating mb-3">
                    <select
                      id="id_subdivision"
                      class="form-select"
                      v-model="currentCadetData.subdivision"
                    >
                      <option :value="null">---------</option>
                      <option
                        :value="subdivision.id"
                        v-for="subdivision in orderedSubdivisions"
                      >
                        {{ subdivision.subdivision_short_name }}
                      </option>
                    </select>
                    <label for="id_subdivision">Факультет</label>
                  </div>
                </div>
                <div class="col-xl-3">
                  <div class="form-floating mb-3">
                    <select
                      id="id_educational_institution"
                      class="form-select"
                      v-model="currentCadetData.educational_institution"
                    >
                      <option :value="null">---------</option>
                      <option
                        :value="educationalInstitution.id"
                        v-for="educationalInstitution in orderedEducationalInstitutions"
                      >
                        {{ educationalInstitution.educational_institution }}
                      </option>
                    </select>
                    <label for="id_educational_institution"
                      >Учреждение образования</label
                    >
                  </div>
                </div>
                <div class="col-xl-3">
                  <div class="form-floating mb-3">
                    <select
                      id="id_document_type"
                      class="form-select"
                      v-model="currentCadetData.document_type"
                    >
                      <option :value="null">---------</option>
                      <option
                        :value="document_type.id"
                        v-for="document_type in orderedDocumentTypes"
                      >
                        {{ document_type.document_type }}
                      </option>
                    </select>
                    <label for="id_document_type">Документ</label>
                  </div>
                </div>
                <div class="col-xl-3">
                  <div class="form-floating mb-3">
                    <select
                      id="id_privilege"
                      class="form-select"
                      v-model="currentCadetData.privilege"
                    >
                      <option :value="null">---------</option>
                      <option
                        :value="privilege.id"
                        v-for="privilege in orderedPrivileges"
                      >
                        {{ privilege.privilege }}
                      </option>
                    </select>
                    <label for="id_privilege">Льгота</label>
                  </div>
                </div>

                <div class="row mt-3">
                  <div class="col-xl-3">
                    <div class="form-floating mb-3">
                      <select
                        id="id_foreign_language_was"
                        class="form-select"
                        v-model="currentCadetData.foreign_language_was"
                      >
                        <option :value="null">---------</option>
                        <option
                          :value="foreign_language.id"
                          v-for="foreign_language in orderedForeignLanguages"
                        >
                          {{ foreign_language.foreign_language }}
                        </option>
                      </select>
                      <label for="id_foreign_language_was"
                        >Иностранный язык (был)</label
                      >
                    </div>
                  </div>
                  <div class="col-xl-3">
                    <div class="form-floating mb-3">
                      <select
                        id="id_foreign_language_will_be"
                        class="form-select"
                        v-model="currentCadetData.foreign_language_will_be"
                      >
                        <option :value="null">---------</option>
                        <option
                          :value="foreign_language.id"
                          v-for="foreign_language in orderedForeignLanguages"
                        >
                          {{ foreign_language.foreign_language }}
                        </option>
                      </select>
                      <label for="id_foreign_language_will_be"
                        >Иностранный язык (будет)</label
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="my-4">
            <div>
              <nav>
                <div class="nav nav-tabs" id="nav-tab" role="tablist">
                  <button
                    class="nav-link active"
                    id="nav-assembly-organ-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-assembly-organ"
                    type="button"
                    role="tab"
                    aria-controls="nav-assembly-organ"
                    aria-selected="true"
                  >
                    Комплектующий орган
                  </button>
                  <button
                    class="nav-link"
                    id="nav-education-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-education"
                    type="button"
                    role="tab"
                    aria-controls="nav-education"
                    aria-selected="false"
                  >
                    Образование
                  </button>
                  <button
                    class="nav-link"
                    id="nav-contact-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-contact"
                    type="button"
                    role="tab"
                    aria-controls="nav-contact"
                    aria-selected="false"
                  >
                    Личная информация
                  </button>
                  <button
                    class="nav-link"
                    id="nav-representatives-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-representatives"
                    type="button"
                    role="tab"
                    aria-controls="nav-representatives"
                    aria-selected="false"
                  >
                    Представители
                  </button>
                  <button
                    class="nav-link"
                    id="nav-questionary-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-questionary"
                    type="button"
                    role="tab"
                    aria-controls="nav-questionary"
                    aria-selected="false"
                  >
                    Анкета
                  </button>
                  <button
                    class="nav-link"
                    id="nav-med-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-med"
                    type="button"
                    role="tab"
                    aria-controls="nav-med"
                    aria-selected="false"
                  >
                    Данные мед. осв-я
                  </button>
                  <button
                    class="nav-link"
                    id="nav-services-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-services"
                    type="button"
                    role="tab"
                    aria-controls="nav-services"
                    aria-selected="false"
                  >
                    Прохождение службы
                  </button>
                  <button
                    class="nav-link"
                    id="nav-attached_documents-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-attached_documents"
                    type="button"
                    role="tab"
                    aria-controls="nav-attached_documents"
                    aria-selected="false"
                  >
                    Отсканированные документы
                  </button>
                </div>
              </nav>
              <div class="tab-content" id="nav-tabContent">
                <div
                  class="tab-pane fade show active"
                  id="nav-assembly-organ"
                  role="tabpanel"
                  aria-labelledby="nav-assembly-organ-tab"
                  tabindex="0"
                >
                  <div>
                    <div class="my-3">
                      <div class="row">
                        <div class="col-xl-3">
                          <div class="form-floating mb-3">
                            <select
                              id="id_component_organ"
                              class="form-select"
                              v-model="currentCadetData.in_whose_interests"
                            >
                              <option :value="null">---------</option>
                              <option
                                :value="in_whose_interests.id"
                                v-for="in_whose_interests in orderedInWhoseInterests"
                              >
                                {{ in_whose_interests.in_whose_interests }}
                              </option>
                            </select>
                            <label for="id_component_organ"
                              >В чьих интересах</label
                            >
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-xl-3">
                          <div class="form-floating mb-3">
                            <select
                              id="id_component_organ"
                              class="form-select"
                              v-model="currentCadetData.component_organ"
                            >
                              <option :value="null">---------</option>
                              <option
                                :value="componentOrg.id"
                                v-for="componentOrg in orderedComponentOrgans"
                              >
                                {{ componentOrg.component_name }}
                              </option>
                            </select>
                            <label for="id_component_organ"
                              >Комплектующий орган</label
                            >
                          </div>
                        </div>
                        <div class="col-lg-3">
                          <div class="form-floating mb-3">
                            <select
                              id="id_entrance_category"
                              class="form-select"
                              v-model="currentCadetData.entrance_category"
                            >
                              <option :value="null">---------</option>
                              <option
                                :value="entranceCategory.id"
                                v-for="entranceCategory in orderedEntranceCategories"
                              >
                                {{ entranceCategory.entrance_category_name }}
                              </option>
                            </select>
                            <label for="id_entrance_category">Категория</label>
                          </div>
                        </div>
                        <div class="col-lg-3">
                          <div class="form-floating mb-3">
                            <select
                              id="id_social_status"
                              class="form-select"
                              v-model="currentCadetData.social_status"
                            >
                              <option :value="null">---------</option>
                              <option
                                :value="socialStatus.id"
                                v-for="socialStatus in orderedSocialStatuses"
                              >
                                {{ socialStatus.social_status }}
                              </option>
                            </select>
                            <label for="id_social_status"
                              >Социальный статус</label
                            >
                          </div>
                        </div>
                        <div class="col-lg-3">
                          <div class="form-floating mb-3">
                            <select
                              id="id_region_for_medical_examination"
                              class="form-select"
                              v-model="
                                currentCadetData.region_for_medical_examination
                              "
                            >
                              <option :value="null">---------</option>
                              <option
                                :value="countryRegion.id"
                                v-for="countryRegion in orderedCountryRegions"
                              >
                                {{ countryRegion.country_region }}
                              </option>
                            </select>
                            <label for="id_region_for_medical_examination"
                              >Обл. для мед. ком.</label
                            >
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-lg-3">
                          <div class="form-floating mb-3">
                            <select
                              id="id_arrived_from_go_rovd"
                              class="form-select"
                              v-model="currentCadetData.arrived_from_go_rovd"
                            >
                              <option :value="null">---------</option>
                              <option
                                :value="go_rovd.id"
                                v-for="go_rovd in orderedGorovds"
                              >
                                {{ go_rovd.go_rovd_name }}
                              </option>
                            </select>
                            <label for="id_arrived_from_go_rovd"
                              >Прибыл из ГО-РОВД</label
                            >
                          </div>
                        </div>
                        <div class="col-lg-3">
                          <div class="form-floating mb-3">
                            <select
                              id="id_military_office"
                              class="form-select"
                              v-model="currentCadetData.military_office"
                            >
                              <option :value="null">---------</option>
                              <option
                                :value="militaryOffice.id"
                                v-for="militaryOffice in orderedMilitaryOffices"
                              >
                                {{ militaryOffice.military_office }}
                              </option>
                            </select>
                            <label for="id_military_office">Военкомат</label>
                          </div>
                        </div>

                        <div class="col-lg-6">
                          <div class="form-floating mb-3">
                            <input
                              type="text"
                              id="id_military_office_extra_data"
                              class="form-control form-control-sm"
                              placeholder="Военкомат (доп. информация)"
                              v-model="
                                currentCadetData.military_office_extra_data
                              "
                            />
                            <label for="id_military_office_extra_data"
                              >Военкомат (доп. информация)</label
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="tab-pane fade"
                  id="nav-education"
                  role="tabpanel"
                  aria-labelledby="nav-education-tab"
                  tabindex="0"
                >
                  <div class="my-3">
                    <div class="row">
                      <div class="col-xl-3">
                        <div class="form-floating mb-3">
                          <select
                            id="id_education_kind"
                            class="form-select"
                            v-model="currentCadetData.education_kind"
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
                            v-model="currentCadetData.education_kind"
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
                            v-model="
                              currentCadetData.education_graduating_end_year
                            "
                            @input="makeInputDefaultNullValueIfEmpty"
                          />
                          <label for="id_education_graduating_end_year"
                            >Год окончания</label
                          >
                        </div>

                        <!--                        <div class="form-floating mb-3">-->
                        <!--                          <input-->
                        <!--                            type="number"-->
                        <!--                            id="id_education_graduating_start_year"-->
                        <!--                            name="education_graduating_start_year"-->
                        <!--                            class="form-control form-control-sm"-->
                        <!--                            placeholder="Год поступления"-->
                        <!--                            v-model="-->
                        <!--                              currentCadetData.education_graduating_start_year-->
                        <!--                            "-->
                        <!--                            @input="makeInputDefaultNullValueIfEmpty"-->
                        <!--                          />-->
                        <!--                          <label for="id_education_graduating_start_year"-->
                        <!--                            >Год поступления</label-->
                        <!--                          >-->
                        <!--                        </div>-->
                      </div>
                      <div class="col-xl-3">
                        <div class="form-floating mb-3">
                          <select
                            id="id_medal"
                            class="form-select"
                            v-model="currentCadetData.medal"
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
                      <div class="col-xl-3">
                        <div class="form-floating mb-3">
                          <textarea
                            id="id_education_graduated"
                            rows="2"
                            class="form-control form-control-sm"
                            v-model="currentCadetData.education_graduated"
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
                            v-model="currentCadetData.education_location_kind"
                          >
                            <option :value="null">---------</option>
                            <option
                              :value="educationLocalityKind.id"
                              v-for="educationLocalityKind in orderedEducationLocalityKinds"
                            >
                              {{
                                educationLocalityKind.education_location_kind
                              }}
                            </option>
                          </select>
                          <label for="id_education_location_kind"
                            >Город/село</label
                          >
                        </div>
                      </div>
                      <div class="col-xl-3">
                        <!--                        <div class="form-floating mb-3">-->
                        <!--                          <input-->
                        <!--                            type="number"-->
                        <!--                            id="id_education_average_score"-->
                        <!--                            name="education_average_score"-->
                        <!--                            class="form-control form-control-sm"-->
                        <!--                            placeholder="Средний бал"-->
                        <!--                            v-model="currentCadetData.education_average_score"-->
                        <!--                            @input="makeInputDefaultNullValueIfEmpty"-->
                        <!--                          />-->
                        <!--                          <label for="id_education_average_score"-->
                        <!--                            >Средний бал</label-->
                        <!--                          >-->
                        <!--                        </div>-->
                      </div>
                      <div class="col-xl-3"></div>
                    </div>

                    <div class="row">
                      <div class="col-12">
                        <div class="form-check mb-3">
                          <input
                            id="id_is_located_in_Minsk"
                            class="form-check-input"
                            type="checkbox"
                            v-model="currentCadetData.is_located_in_Minsk"
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
                <div
                  class="tab-pane fade"
                  id="nav-contact"
                  role="tabpanel"
                  aria-labelledby="nav-contact-tab"
                  tabindex="0"
                >
                  <div>
                    <div class="my-3">
                      <div class="row">
                        <div class="col-6">
                          <div class="form-floating mb-3">
                            <input
                              type="text"
                              id="id_place_of_birth"
                              class="form-control form-control-sm"
                              placeholder="Место рождения"
                              v-model="currentCadetData.place_of_birth"
                            />
                            <label for="id_place_of_birth"
                              >Место рождения</label
                            >
                          </div>
                        </div>
                        <div class="col-6">
                          <div class="form-floating mb-3">
                            <input
                              type="text"
                              id="id_phone_number"
                              class="form-control form-control-sm"
                              placeholder="Номер телефона"
                              v-model="currentCadetData.phone_number"
                            />
                            <label for="id_phone_number">Номер телефона</label>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-6">
                          <div class="form-floating mb-3">
                            <input
                              type="text"
                              id="id_address_registration"
                              class="form-control form-control-sm"
                              placeholder="Место жительства (регистрация)"
                              v-model="currentCadetData.address_registration"
                              required
                            />
                            <label for="id_address_registration"
                              >Место жительства (регистрация)</label
                            >
                          </div>
                        </div>
                        <div class="col-6">
                          <div class="form-floating mb-3">
                            <input
                              id="id_address_residence"
                              type="text"
                              class="form-control form-control-sm"
                              placeholder="Место жительства (проживание)"
                              v-model="currentCadetData.address_residence"
                            />
                            <label for="id_address_residence"
                              >Место жительства (проживание)</label
                            >
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-6">
                          <div class="form-floating mb-3">
                            <select
                              class="form-select"
                              id="id_passport_document_type"
                              v-model="currentCadetData.passport_document_type"
                            >
                              <option :value="null">---------</option>
                              <option value="1">Паспорт</option>
                              <option value="2">Идентификационная карта</option>
                            </select>
                            <label for="id_passport_document_type"
                              >Документ удостоверяющий личность</label
                            >
                          </div>
                        </div>
                        <div class="col-3">
                          <div class="form-floating mb-3">
                            <input
                              type="text"
                              id="id_passport_number"
                              class="form-control form-control-sm"
                              placeholder="Серия и номер паспорта (номер идентификационной
                              карты)"
                              v-model="currentCadetData.passport_number"
                            />
                            <label for="id_passport_number"
                              >Серия и номер паспорта (номер идентификационной
                              карты)</label
                            >
                          </div>
                        </div>
                        <div class="col-3">
                          <div class="form-floating mb-3">
                            <input
                              type="text"
                              id="id_identification_number"
                              class="form-control form-control-sm"
                              placeholder="Номер паспорта"
                              v-model="currentCadetData.identification_number"
                            />
                            <label for="id_identification_number"
                              >Идентификационный номер</label
                            >
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-6">
                          <div class="form-floating mb-3">
                            <textarea
                              class="form-control"
                              rows="1"
                              id="id_passport_issue_authority_text"
                              v-model="
                                currentCadetData.passport_issue_authority_text
                              "
                            />
                            <label for="id_passport_issue_authority_text"
                              >Орган выдачи</label
                            >
                          </div>
                        </div>
                        <div class="col-xl-3">
                          <div class="form-floating mb-3">
                            <input
                              type="date"
                              id="id_passport_issue_date"
                              class="form-control form-control-sm"
                              placeholder="Дата выдачи"
                              v-model="currentCadetData.passport_issue_date"
                            />
                            <label for="id_passport_issue_date"
                              >Дата выдачи</label
                            >
                          </div>
                        </div>
                        <div class="col-xl-3">
                          <div class="form-floating mb-3">
                            <input
                              type="date"
                              id="id_passport_validity_period"
                              class="form-control form-control-sm"
                              placeholder="Срок действия"
                              v-model="
                                currentCadetData.passport_validity_period
                              "
                            />
                            <label for="id_passport_validity_period"
                              >Срок действия</label
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="tab-pane fade"
                  id="nav-representatives"
                  role="tabpanel"
                  aria-labelledby="nav-representatives-tab"
                  tabindex="0"
                >
                  <div class="my-3">
                    <div class="form-check mb-3">
                      <input
                        id="id_parents_is_in_divorce"
                        class="form-check-input"
                        type="checkbox"
                        v-model="currentCadetData.parents_is_in_divorce"
                      />
                      <label
                        class="form-check-label"
                        for="id_parents_is_in_divorce"
                        >Родители в разводе
                      </label>
                    </div>
                  </div>
                  <div>
                    <div class="my-3">
                      <p class="fs-6 fw-bold my-2">Мать</p>
                      <div class="row">
                        <div class="col-xl-3">
                          <div class="form-floating mb-3">
                            <input
                              id="id_mother_last_name"
                              type="text"
                              class="form-control form-control-sm"
                              placeholder="Мать (фамилия)"
                              v-model="currentCadetData.mother_last_name"
                            />
                            <label for="id_mother_last_name">Фамилия</label>
                          </div>
                        </div>
                        <div class="col-xl-3">
                          <div class="form-floating mb-3">
                            <input
                              id="id_mother_first_name"
                              type="text"
                              class="form-control form-control-sm"
                              placeholder="Мать (имя)"
                              v-model="currentCadetData.mother_first_name"
                            />
                            <label for="id_mother_first_name">Имя</label>
                          </div>
                        </div>
                        <div class="col-xl-3">
                          <div class="form-floating mb-3">
                            <input
                              id="id_mother_patronymic"
                              type="text"
                              class="form-control form-control-sm"
                              placeholder="Мать (отчество)"
                              v-model="currentCadetData.mother_patronymic"
                            />
                            <label for="id_mother_patronymic">Отчество</label>
                          </div>
                        </div>
                        <div class="col-xl-3">
                          <div class="form-floating mb-3">
                            <input
                              id="id_mother_date_of_birth"
                              type="date"
                              class="form-control form-control-sm"
                              placeholder="Мать (дата рождения)"
                              v-model="currentCadetData.mother_date_of_birth"
                            />
                            <label for="id_mother_date_of_birth"
                              >Дата рождения</label
                            >
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-3">
                          <div class="form-floating mb-3">
                            <input
                              id="id_mother_address_residence"
                              type="text"
                              class="form-control form-control-sm"
                              placeholder="Проживает"
                              v-model="
                                currentCadetData.mother_address_residence
                              "
                            />
                            <label for="id_mother_address_residence"
                              >Проживает</label
                            >
                          </div>
                        </div>
                        <div class="col-3">
                          <div class="form-floating mb-3">
                            <input
                              id="id_mother_address_registration"
                              type="text"
                              class="form-control form-control-sm"
                              placeholder="Зарегистрирована"
                              v-model="
                                currentCadetData.mother_address_registration
                              "
                            />
                            <label for="id_mother_address_registration"
                              >Зарегистрирована</label
                            >
                          </div>
                        </div>
                        <div class="col-3">
                          <div class="form-floating mb-3">
                            <input
                              id="id_mother_place_of_work"
                              type="text"
                              class="form-control form-control-sm"
                              placeholder="Место работы и должность"
                              v-model="currentCadetData.mother_place_of_work"
                            />
                            <label for="id_mother_place_of_work"
                              >Место работы и должность</label
                            >
                          </div>
                        </div>
                        <div class="col-3">
                          <div class="form-floating mb-3">
                            <input
                              id="id_mother_phone_number"
                              type="text"
                              class="form-control form-control-sm"
                              placeholder="Номер телефона"
                              v-model="currentCadetData.mother_phone_number"
                            />
                            <label for="id_mother_phone_number"
                              >Номер телефона</label
                            >
                          </div>
                        </div>
                      </div>
                      <p class="fs-6 fw-bold my-2">Отец</p>
                      <div class="row">
                        <div class="col-xl-3">
                          <div class="form-floating mb-3">
                            <input
                              id="id_father_last_name"
                              type="text"
                              class="form-control form-control-sm"
                              placeholder="Отец (фамилия)"
                              v-model="currentCadetData.father_last_name"
                            />
                            <label for="id_father_last_name">Фамилия</label>
                          </div>
                        </div>
                        <div class="col-xl-3">
                          <div class="form-floating mb-3">
                            <input
                              id="id_father_first_name"
                              type="text"
                              class="form-control form-control-sm"
                              placeholder="Отец (имя)"
                              v-model="currentCadetData.father_first_name"
                            />
                            <label for="id_father_first_name">Имя</label>
                          </div>
                        </div>
                        <div class="col-xl-3">
                          <div class="form-floating mb-3">
                            <input
                              id="id_father_patronymic"
                              type="text"
                              class="form-control form-control-sm"
                              placeholder="Отец (отчество)"
                              v-model="currentCadetData.father_patronymic"
                            />
                            <label for="id_father_patronymic">Отчество</label>
                          </div>
                        </div>
                        <div class="col-xl-3">
                          <div class="form-floating mb-3">
                            <input
                              id="id_father_date_of_birth"
                              type="date"
                              class="form-control form-control-sm"
                              placeholder="Отец (дата рождения)"
                              v-model="currentCadetData.father_date_of_birth"
                            />
                            <label for="id_father_date_of_birth"
                              >Дата рождения</label
                            >
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-3">
                          <div class="form-floating mb-3">
                            <input
                              id="id_father_address_residence"
                              type="text"
                              class="form-control form-control-sm"
                              placeholder="Проживает"
                              v-model="
                                currentCadetData.father_address_residence
                              "
                            />
                            <label for="id_father_address_residence"
                              >Проживает</label
                            >
                          </div>
                        </div>
                        <div class="col-3">
                          <div class="form-floating mb-3">
                            <input
                              id="id_father_address_registration"
                              type="text"
                              class="form-control form-control-sm"
                              placeholder="Зарегистрирован"
                              v-model="
                                currentCadetData.father_address_registration
                              "
                            />
                            <label for="id_father_address_registration"
                              >Зарегистрирован</label
                            >
                          </div>
                        </div>
                        <div class="col-3">
                          <div class="form-floating mb-3">
                            <input
                              id="id_father_place_of_work"
                              type="text"
                              class="form-control form-control-sm"
                              placeholder="Место работы и должность"
                              v-model="currentCadetData.father_place_of_work"
                            />
                            <label for="id_father_place_of_work"
                              >Место работы и должность</label
                            >
                          </div>
                        </div>
                        <div class="col-3">
                          <div class="form-floating mb-3">
                            <input
                              id="id_father_phone_number"
                              type="text"
                              class="form-control form-control-sm"
                              placeholder="Номер телефона"
                              v-model="currentCadetData.father_phone_number"
                            />
                            <label for="id_father_phone_number"
                              >Номер телефона</label
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="tab-pane fade"
                  id="nav-questionary"
                  role="tabpanel"
                  aria-labelledby="nav-questionary-tab"
                  tabindex="0"
                >
                  <div>
                    <div class="my-3">
                      <div class="row">
                        <div class="col-xl-6">
                          <div class="form-floating mb-3">
                            <select
                              id="id_vpk"
                              class="form-select"
                              v-model="currentCadetData.vpk"
                            >
                              <option :value="null">---------</option>
                              <option
                                :value="vpk.id"
                                v-for="vpk in orderedVpkCategories"
                              >
                                {{ vpk.category }}
                              </option>
                            </select>
                            <label for="id_vpk"
                              >Военно-патриотический клуб</label
                            >
                          </div>
                        </div>
                        <div class="col-xl-6">
                          <div class="form-floating mb-3">
                            <input
                              id="id_vpk_data"
                              type="text"
                              class="form-control form-control-sm"
                              placeholder="Данные по ВПК"
                              v-model="currentCadetData.vpk_data"
                            />
                            <label for="id_vpk_data">Данные по ВПК</label>
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-xl-3">
                          <div class="form-check mb-3">
                            <input
                              id="id_aims_to_graduate_with_honors"
                              class="form-check-input"
                              type="checkbox"
                              v-model="
                                currentCadetData.aims_to_graduate_with_honors
                              "
                            />
                            <label
                              class="form-check-label"
                              for="id_aims_to_graduate_with_honors"
                            >
                              Претендует на аттестат с отличием
                            </label>
                          </div>
                        </div>
                        <div class="col-xl-3">
                          <div class="form-check mb-3">
                            <input
                              id="id_is_olympiad_winner"
                              class="form-check-input"
                              type="checkbox"
                              v-model="currentCadetData.is_olympiad_winner"
                            />
                            <label
                              class="form-check-label"
                              for="id_is_olympiad_winner"
                            >
                              Победитель ресбуликанских или региональных
                              олимпиад
                            </label>
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-xl-3">
                          <div class="form-check mb-3">
                            <input
                              id="id_is_class_vpn"
                              class="form-check-input"
                              type="checkbox"
                              v-model="currentCadetData.is_class_vpn"
                            />
                            <label
                              class="form-check-label"
                              for="id_is_class_vpn"
                            >
                              Класс военно-патриотической направленности
                            </label>
                          </div>
                        </div>
                        <div class="col-xl-3">
                          <div class="form-check mb-3">
                            <input
                              id="id_is_class_pn"
                              class="form-check-input"
                              type="checkbox"
                              v-model="currentCadetData.is_class_pn"
                            />
                            <label
                              class="form-check-label"
                              for="id_is_class_pn"
                            >
                              Класс правовой направленности
                            </label>
                          </div>
                        </div>
                        <div class="col-xl-3">
                          <div class="form-check mb-3">
                            <input
                              id="id_is_class_other"
                              class="form-check-input"
                              type="checkbox"
                              v-model="currentCadetData.is_class_other"
                            />
                            <label
                              class="form-check-label"
                              for="id_is_class_other"
                            >
                              Профильный класс иной направленности
                            </label>
                          </div>
                        </div>
                        <div class="col-xl-3">
                          <div class="form-check mb-3">
                            <input
                              id="id_has_achievements_in_sports"
                              class="form-check-input"
                              type="checkbox"
                              v-model="
                                currentCadetData.has_achievements_in_sports
                              "
                            />
                            <label
                              class="form-check-label"
                              for="id_has_achievements_in_sports"
                            >
                              Достижения в спорте
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="tab-pane fade"
                  id="nav-med"
                  role="tabpanel"
                  aria-labelledby="nav-med-tab"
                  tabindex="0"
                >
                  <div>
                    <div class="my-3">
                      <div class="row">
                        <div class="col-xl-4">
                          <div class="form-floating mb-3">
                            <select
                              id="id_health_group"
                              class="form-select"
                              aria-label="Floating label select example"
                              v-model="currentCadetData.health_group"
                            >
                              <option :value="null">---------</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                            </select>
                            <label for="id_health_group"
                              >Группа предназначения</label
                            >
                          </div>
                        </div>
                        <div class="col-xl-4">
                          <div class="form-floating mb-3">
                            <select
                              id="id_ppfl_test"
                              class="form-select"
                              v-model="currentCadetData.ppfl_test"
                            >
                              <option :value="null">---------</option>
                              <option
                                :value="ppfl.id"
                                v-for="ppfl in orderedPpflCategories"
                              >
                                {{ ppfl.category }}
                              </option>
                            </select>
                            <label for="id_ppfl_test"
                              >Категория профессионального соответствия</label
                            >
                          </div>
                        </div>
                        <div class="col-xl-4">
                          <div class="form-floating mb-3">
                            <select
                              id="id_medical_age_group"
                              class="form-select"
                              aria-label="Floating label select example"
                              v-model="currentCadetData.medical_age_group"
                            >
                              <option :value="null">---------</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                            </select>
                            <label for="id_medical_age_group"
                              >Медико-возрастная группа</label
                            >
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-xl-2">
                          <div class="form-check">
                            <input
                              id="id_passed_medical_examination"
                              class="form-check-input"
                              type="checkbox"
                              v-model="
                                currentCadetData.passed_medical_examination
                              "
                            />
                            <label
                              class="form-check-label"
                              for="id_passed_medical_examination"
                            >
                              Окончательное мед. освидетельствование
                            </label>
                          </div>
                        </div>
                        <div class="col-xl-2">
                          <div class="form-floating mb-3">
                            <input
                              id="id_passed_medical_examination_date"
                              class="form-control"
                              placeholder="Дата прохождения"
                              type="date"
                              v-model="
                                currentCadetData.passed_medical_examination_date
                              "
                            />
                            <label
                              class="form-check-label"
                              for="id_passed_medical_examination_date"
                              >Дата прохождения
                            </label>
                          </div>
                        </div>

                        <div class="col-xl-8">
                          <div class="form-floating mb-3">
                            <textarea
                              id="id_passed_medical_examination_extra_data"
                              class="form-control"
                              placeholder="Примечание по медицинской комиссии"
                              rows="2"
                              v-model="
                                currentCadetData.passed_medical_examination_extra_data
                              "
                            ></textarea>
                            <label
                              for="id_passed_medical_examination_extra_data"
                              >Примечание по медицинской комиссии</label
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="tab-pane fade"
                  id="nav-services"
                  role="tabpanel"
                  aria-labelledby="nav-med-tab"
                  tabindex="0"
                >
                  <div>
                    <div class="my-3">
                      <h5>Служба в ВС РБ</h5>
                      <div class="row">
                        <div class="col-xl-2">
                          <div class="form-floating mb-3">
                            <input
                              id="id_military_service_start"
                              type="date"
                              class="form-control form-control-sm"
                              placeholder="Начало"
                              v-model="currentCadetData.military_service_start"
                            />
                            <label for="id_military_service_start"
                              >Начало</label
                            >
                          </div>
                        </div>
                        <div class="col-xl-2">
                          <div class="form-floating mb-3">
                            <input
                              id="id_military_service_end"
                              type="date"
                              class="form-control form-control-sm"
                              placeholder="Окончание"
                              v-model="currentCadetData.military_service_end"
                            />
                            <label for="id_military_service_end"
                              >Окончание</label
                            >
                          </div>
                        </div>

                        <div class="col-xl-4">
                          <div class="form-floating mb-3">
                            <textarea
                              id="id_military_organization"
                              class="form-control"
                              placeholder="Место прохождения службы"
                              rows="2"
                              v-model="currentCadetData.military_organization"
                            ></textarea>
                            <label for="id_military_organization"
                              >Место прохождения службы</label
                            >
                          </div>
                        </div>
                        <div class="col-xl-4">
                          <div class="form-floating mb-3">
                            <textarea
                              id="id_military_position"
                              class="form-control"
                              placeholder="Должность"
                              rows="2"
                              v-model="currentCadetData.military_position"
                            ></textarea>
                            <label for="id_military_position">Должность</label>
                          </div>
                        </div>
                      </div>
                      <h5>Служба в МВД</h5>
                      <div class="row">
                        <div class="col-xl-2">
                          <div class="form-floating mb-3">
                            <input
                              id="id_mvd_service_start"
                              type="date"
                              class="form-control form-control-sm"
                              placeholder="Начало"
                              v-model="currentCadetData.mvd_service_start"
                            />
                            <label for="id_mvd_service_start">Начало</label>
                          </div>
                        </div>
                        <div class="col-xl-2">
                          <div class="form-floating mb-3">
                            <input
                              id="id_mvd_service_end"
                              type="date"
                              class="form-control form-control-sm"
                              placeholder="Окончание"
                              v-model="currentCadetData.mvd_service_end"
                            />
                            <label for="id_mvd_service_end">Окончание</label>
                          </div>
                        </div>

                        <div class="col-xl-4">
                          <div class="form-floating mb-3">
                            <textarea
                              id="id_mvd_organization"
                              class="form-control"
                              placeholder="Место прохождения службы"
                              rows="2"
                              v-model="currentCadetData.mvd_organization"
                            ></textarea>
                            <label for="id_mvd_organization"
                              >Место прохождения службы</label
                            >
                          </div>
                        </div>
                        <div class="col-xl-4">
                          <div class="form-floating mb-3">
                            <textarea
                              id="id_mvd_position"
                              class="form-control"
                              placeholder="Должность"
                              rows="2"
                              v-model="currentCadetData.mvd_position"
                            ></textarea>
                            <label for="id_mvd_position">Должность</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="tab-pane fade"
                  id="nav-attached_documents"
                  role="tabpanel"
                  aria-labelledby="nav-attached_documents-tab"
                  tabindex="0"
                >
                  <div class="m-3">
                    <div v-if="currentCadetData.attached_documents">
                      <div class="d-flex flex-row my-2">
                        <div class="mx-3">
                          <input
                            class="form-control"
                            ref="uploadedDocument"
                            type="file"
                            accept=".pdf"
                            v-on:change="uploadDocument"
                            style="width: 600px"
                          />
                        </div>
                        <div class="d-flex align-items-end">
                          <button
                            type="button"
                            class="btn btn-link"
                            @click="deleteDocument"
                          >
                            Удалить скан документа
                          </button>
                        </div>
                      </div>

                      <object
                        :data="currentCadetData.attached_documents"
                        type="application/pdf"
                        ref="objectWithDocument"
                        width="100%"
                        height="700"
                      >
                        <p>
                          <b>Ошибка загрузки pdf документа.</b> Попробуйте
                          скачать его
                          <a :href="currentCadetData.attached_documents"
                            >отсюда</a
                          >.
                        </p>
                      </object>
                    </div>

                    <div v-else>
                      <div class="mb-3">
                        <label for="formFile" class="form-label"
                          >Выберите pdf файл для загрузки</label
                        >
                        <input
                          class="form-control"
                          ref="uploadedDocument"
                          type="file"
                          accept=".pdf"
                          v-on:change="uploadDocument"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="border-bottom border-4 my-3"></div>

            <div class="card shadow mb-2 rounded border-0">
              <div class="card-body">
                <div class="mb-3">
                  <label class="form-label" for="id_extra_data"
                    >Примечание для отдела кадров</label
                  >
                  <textarea
                    id="id_extra_data"
                    class="form-control"
                    rows="2"
                    v-model="currentCadetData.extra_data"
                  ></textarea>
                </div>
                <!--                <div class="border-bottom border-4 my-3"></div>-->
                <div class="mb-3">
                  <label class="form-label" for="id_comments_on_personal_file"
                    >Замечания по личному делу</label
                  >
                  <textarea
                    id="id_comments_on_personal_file"
                    class="form-control"
                    rows="3"
                    v-model="currentCadetData.comments_on_personal_file"
                  ></textarea>
                </div>
              </div>
            </div>
            <!--Анкета-->
            <div class="card shadow mb-2 rounded border-0">
              <div class="card-body">
                <div class="row">
                  <div class="col-xl-4">
                    <div class="form-check mb-3">
                      <input
                        id="id_needs_increased_attention"
                        class="form-check-input"
                        type="checkbox"
                        v-model="currentCadetData.needs_increased_attention"
                      />
                      <label
                        class="form-check-label"
                        for="id_needs_increased_attention"
                      >
                        Требует повышенного внимания
                      </label>
                    </div>
                    <div class="form-check mb-3">
                      <input
                        id="id_needs_psychological_support"
                        class="form-check-input"
                        type="checkbox"
                        v-model="currentCadetData.needs_psychological_support"
                      />
                      <label
                        class="form-check-label"
                        for="id_needs_psychological_support"
                      >
                        Требует психологического сопровождения
                      </label>
                    </div>
                    <div class="form-check mb-3">
                      <input
                        id="id_is_risk_group"
                        class="form-check-input"
                        type="checkbox"
                        v-model="currentCadetData.is_risk_group"
                      />
                      <label class="form-check-label" for="id_is_risk_group"
                        >Группа риска</label
                      >
                    </div>
                    <div class="form-check mb-3">
                      <input
                        id="id_has_conviction"
                        class="form-check-input"
                        type="checkbox"
                        v-model="currentCadetData.has_conviction"
                      />
                      <label class="form-check-label" for="id_has_conviction"
                        >Судимость</label
                      >
                    </div>
                    <div class="form-check mb-3">
                      <input
                        id="id_has_dactocard"
                        class="form-check-input"
                        type="checkbox"
                        v-model="currentCadetData.has_dactocard"
                      />
                      <label class="form-check-label" for="id_has_dactocard"
                        >Дактокарта</label
                      >
                    </div>
                    <div class="form-check mb-3">
                      <input
                        id="id_has_gusb_check"
                        class="form-check-input"
                        type="checkbox"
                        v-model="currentCadetData.has_gusb_check"
                      />
                      <label class="form-check-label" for="id_has_gusb_check"
                        >Проверка ГУСБ</label
                      >
                    </div>
                    <div class="form-check mb-3">
                      <input
                        id="id_has_employee_in_family"
                        class="form-check-input"
                        type="checkbox"
                        v-model="currentCadetData.has_employee_in_family"
                      />
                      <label
                        class="form-check-label"
                        for="id_has_employee_in_family"
                        >Сотрудники в семье</label
                      >
                    </div>
                    <div class="form-check mb-3">
                      <input
                        id="is_is_orphan"
                        class="form-check-input"
                        type="checkbox"
                        v-model="currentCadetData.is_orphan"
                      />
                      <label class="form-check-label" for="is_is_orphan"
                        >Сирота</label
                      >
                    </div>
                    <div class="form-check mb-3">
                      <input
                        id="id_is_employee"
                        class="form-check-input"
                        type="checkbox"
                        v-model="currentCadetData.is_employee"
                      />
                      <label class="form-check-label" for="id_is_employee"
                        >Сотрудник</label
                      >
                    </div>
                  </div>
                  <div class="col-xl-4">
                    <p>Сертификаты</p>
                    <div class="form-check mb-3">
                      <input
                        id="id_has_certificate_ideas_for_Belarus"
                        class="form-check-input"
                        type="checkbox"
                        v-model="
                          currentCadetData.has_certificate_ideas_for_Belarus
                        "
                      />
                      <label
                        class="form-check-label"
                        for="id_has_certificate_ideas_for_Belarus"
                        >100 идей для Беларуси</label
                      >
                    </div>
                    <div class="form-check mb-3">
                      <input
                        id="id_has_certificate_kind_heart"
                        class="form-check-input"
                        type="checkbox"
                        v-model="currentCadetData.has_certificate_kind_heart"
                      />
                      <label
                        class="form-check-label"
                        for="id_has_certificate_kind_heart"
                        >Доброе сердце</label
                      >
                    </div>
                  </div>
                  <div class="col-xl-4">
                    <div class="form-check mb-3">
                      <input
                        id="id_is_law_class"
                        class="form-check-input"
                        type="checkbox"
                        v-model="currentCadetData.is_law_class"
                      />
                      <label class="form-check-label" for="id_is_law_class"
                        >Правовой класс</label
                      >
                    </div>
                    <div class="form-check mb-3">
                      <input
                        id="id_is_law_enforcement"
                        class="form-check-input"
                        type="checkbox"
                        v-model="currentCadetData.is_law_enforcement"
                      />
                      <label
                        class="form-check-label"
                        for="id_is_law_enforcement"
                        >Охрана правопорядка</label
                      >
                    </div>
                    <div class="form-check mb-3">
                      <input
                        id="id_is_reserve"
                        class="form-check-input"
                        type="checkbox"
                        v-model="currentCadetData.is_reserve"
                      />
                      <label class="form-check-label" for="id_is_reserve"
                        >Резерв</label
                      >
                    </div>
                    <div class="form-check mb-3">
                      <input
                        id="id_is_fired"
                        class="form-check-input"
                        type="checkbox"
                        v-model="currentCadetData.is_fired"
                      />
                      <label class="form-check-label" for="id_is_fired"
                        >Уволен</label
                      >
                    </div>
                    <div class="form-check mb-3">
                      <input
                        id="id_took_documents"
                        class="form-check-input"
                        type="checkbox"
                        v-model="currentCadetData.took_documents"
                      />
                      <label class="form-check-label" for="id_took_documents"
                        >Забрал документы</label
                      >
                    </div>

                    <div class="form-check mb-3">
                      <input
                        id="id_is_vv"
                        class="form-check-input"
                        type="checkbox"
                        v-model="currentCadetData.is_vv"
                      />
                      <label class="form-check-label" for="id_is_vv">ВВ</label>
                    </div>
                    <div class="form-check mb-3">
                      <input
                        id="id_is_fp"
                        class="form-check-input"
                        type="checkbox"
                        v-model="currentCadetData.is_fp"
                      />
                      <label class="form-check-label" for="id_is_fp">ФП</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="border-bottom border-4 my-3"></div>

          <h3 class="fw-bold">Заявление</h3>
          <h5 class="fw-bold">Выбор специальностей</h5>
          <div class="row">
            <div class="col-xl-6">
              <div class="form-floating mb-3">
                <select
                  id="id_s1"
                  class="form-select"
                  v-model="currentCadetData.speciality_1"
                >
                  <option :value="null">---------</option>
                  <option
                    :value="speciality.id"
                    v-for="speciality in orderedSpecialities_select_1"
                  >
                    {{ speciality.speciality_name }}
                  </option>
                </select>
                <label for="id_s1">Специальность 1</label>
              </div>
              <div class="form-floating mb-3">
                <select
                  id="id_s2"
                  class="form-select"
                  v-model="currentCadetData.speciality_2"
                >
                  <option :value="null">---------</option>
                  <option
                    :value="speciality.id"
                    v-for="speciality in orderedSpecialities_select_2"
                  >
                    {{ speciality.speciality_name }}
                  </option>
                </select>
                <label for="id_s2">Специальность 2</label>
              </div>
              <div class="form-floating mb-3">
                <select
                  id="id_s3"
                  class="form-select"
                  v-model="currentCadetData.speciality_3"
                >
                  <option :value="null">---------</option>
                  <option
                    :value="speciality.id"
                    v-for="speciality in orderedSpecialities_select_3"
                  >
                    {{ speciality.speciality_name }}
                  </option>
                </select>
                <label for="id_s3">Специальность 3</label>
              </div>
              <div class="form-floating mb-3">
                <select
                  id="id_s4"
                  class="form-select"
                  v-model="currentCadetData.speciality_4"
                >
                  <option :value="null">---------</option>
                  <option
                    :value="speciality.id"
                    v-for="speciality in orderedSpecialities_select_4"
                  >
                    {{ speciality.speciality_name }}
                  </option>
                </select>
                <label for="id_s4">Специальность 4</label>
              </div>
              <div class="form-floating mb-3">
                <select
                  id="id_s5"
                  class="form-select"
                  v-model="currentCadetData.speciality_5"
                >
                  <option :value="null">---------</option>
                  <option
                    :value="speciality.id"
                    v-for="speciality in orderedSpecialities_select_5"
                  >
                    {{ speciality.speciality_name }}
                  </option>
                </select>
                <label for="id_s5">Специальность 5</label>
              </div>
              <div class="form-floating mb-3">
                <select
                  id="id_s6"
                  class="form-select"
                  v-model="currentCadetData.speciality_6"
                >
                  <option :value="null">---------</option>
                  <option
                    :value="speciality.id"
                    v-for="speciality in orderedSpecialities_select_6"
                  >
                    {{ speciality.speciality_name }}
                  </option>
                </select>
                <label for="id_s6">Специальность 6</label>
              </div>
              <div class="form-floating mb-3">
                <select
                  id="id_s7"
                  class="form-select"
                  v-model="currentCadetData.speciality_7"
                >
                  <option :value="null">---------</option>
                  <option
                    :value="speciality.id"
                    v-for="speciality in orderedSpecialities_select_7"
                  >
                    {{ speciality.speciality_name }}
                  </option>
                </select>
                <label for="id_s7">Специальность 7</label>
              </div>
            </div>
            <div class="col-xl-6">
              <h5>Набранные баллы</h5>
              <div>
                <p class="fw-bold">
                  Сертификаты централизованного тестирования
                </p>
                {{ currentCadetDataFromServer.rus_score_ct }}
                {{ currentCadetData.rus_score_ct }}
                <table class="table">
                  <thead>
                    <tr>
                      <th class="text-center table-primary">Русский</th>
                      <th class="text-center table-primary">Белорусский</th>
                      <th class="text-center table-warning">Обществоведение</th>
                      <th class="text-center table-success">
                        Иностранный язык
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colspan="2" class="text-center table-primary">
                        <input
                          type="number"
                          class="form-control text-center"
                          value="123"
                        />
                      </td>
                      <td class="text-center table-warning">
                        <input
                          type="number"
                          class="form-control text-center"
                          value="456"
                        />
                      </td>
                      <td class="text-center table-success">
                        <input
                          type="number"
                          class="form-control text-center"
                          value="789"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td class="text-center table-primary">
                        <input
                          name="rus_score_ct"
                          type="number"
                          class="form-control text-center"
                          v-model="currentCadetData.rus_score_ct"
                          @input="makeInputDefaultNullValueIfEmpty"
                        />
                      </td>
                      <td class="text-center table-primary">
                        <input
                          name="bel_score_ct"
                          type="number"
                          class="form-control text-center"
                          v-model="currentCadetData.bel_score_ct"
                          @input="makeInputDefaultNullValueIfEmpty"
                        />
                      </td>
                      <td class="text-center table-warning">
                        <input
                          name="social_science_ct"
                          type="number"
                          class="form-control text-center"
                          v-model="currentCadetData.social_science_ct"
                          @input="makeInputDefaultNullValueIfEmpty"
                        />
                      </td>
                      <td class="text-center table-success">
                        <input
                          name="foreign_lang_ct"
                          type="number"
                          class="form-control text-center"
                          v-model="currentCadetData.foreign_lang_ct"
                          @input="makeInputDefaultNullValueIfEmpty"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td class="text-center table-primary">
                        <select class="form-select">
                          <option selected class="text-center">
                            ----------
                          </option>
                          <option value="2024 ЦЭ" class="text-center">
                            2024 ЦЭ
                          </option>
                          <option value="2024 ЦТ" class="text-center">
                            2024 ЦТ
                          </option>
                        </select>
                      </td>
                      <td class="text-center table-primary">
                        <select class="form-select">
                          <option selected class="text-center">
                            ----------
                          </option>
                          <option value="2024 ЦЭ" class="text-center">
                            2024 ЦЭ
                          </option>
                          <option value="2024 ЦТ" class="text-center">
                            2024 ЦТ
                          </option>
                        </select>
                      </td>
                      <td class="text-center table-warning">
                        <select class="form-select">
                          <option selected class="text-center">
                            ----------
                          </option>
                          <option value="2024 ЦЭ" class="text-center">
                            2024 ЦЭ
                          </option>
                          <option value="2024 ЦТ" class="text-center">
                            2024 ЦТ
                          </option>
                        </select>
                      </td>
                      <td class="text-center table-success">
                        <select class="form-select">
                          <option selected class="text-center">
                            ----------
                          </option>
                          <option value="2024 ЦЭ" class="text-center">
                            2024 ЦЭ
                          </option>
                          <option value="2024 ЦТ" class="text-center">
                            2024 ЦТ
                          </option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td class="text-center table-primary">Минимум 10</td>
                      <td class="text-center table-primary">Минимум 10</td>
                      <td class="text-center table-warning">Минимум 25</td>
                      <td class="text-center table-success">Минимум 15</td>
                    </tr>
                  </tbody>
                </table>
                <div class="border-bottom border-4 my-3"></div>
                <p class="fw-bold">Аттестат, 10 / 10 /100</p>
                <table class="table">
                  <thead>
                    <tr>
                      <th class="text-center table-primary">Русский</th>
                      <th class="text-center table-primary">Белорусский</th>
                      <th class="text-center table-warning">Обществоведение</th>
                      <th class="text-center table-success">
                        Иностранный язык
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="text-center table-primary">
                        <input
                          name="rus_score_cert"
                          type="number"
                          class="form-control text-center"
                          v-model="currentCadetData.rus_score_cert"
                          @input="makeInputDefaultNullValueIfEmpty"
                        />
                      </td>
                      <td class="text-center table-primary">
                        <input
                          name="bel_score_cert"
                          type="number"
                          class="form-control text-center"
                          v-model="currentCadetData.bel_score_cert"
                          @input="makeInputDefaultNullValueIfEmpty"
                        />
                      </td>
                      <td class="text-center table-warning">
                        <input
                          name="social_science_cert"
                          type="number"
                          class="form-control text-center"
                          v-model="currentCadetData.social_science_cert"
                          @input="makeInputDefaultNullValueIfEmpty"
                        />
                      </td>
                      <td class="text-center table-success">
                        <input
                          name="foreign_lang_cert"
                          type="number"
                          class="form-control text-center"
                          v-model="currentCadetData.foreign_lang_cert"
                          @input="makeInputDefaultNullValueIfEmpty"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2" class="text-center table-primary fw-bold">
                        Средний балл (аттестата)
                      </td>
                      <td colspan="2" class="text-center table-primary fw-bold">
                        Сумма (рус. + бел.)
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2" class="text-center table-primary">
                        <input
                          type="number"
                          class="form-control text-center"
                          :value="getAverageCertificateScore"
                          disabled
                        />
                      </td>
                      <td colspan="2" class="text-center table-primary">
                        <input
                          type="number"
                          class="form-control text-center"
                          :value="getARussianAndBelorussianSumScore"
                          disabled
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="border-bottom border-4 my-3"></div>

          <div>
            <button
              v-if="currentCadetData.application_has_been_printed"
              class="btn btn-primary"
              disabled
            >
              <font-awesome-icon :icon="['fas', 'print']" />&nbsp;&nbsp;
              Заявление отпечатано
            </button>
            <button
              v-else
              class="btn btn-primary"
              @click="printApplication(this.currentCadetData.id)"
            >
              <font-awesome-icon :icon="['fas', 'print']" />&nbsp;&nbsp;
              Отпечатать заявление
            </button>
            <div class="form-check mb-3">
              <input
                id="id_application_has_been_printed"
                class="form-check-input"
                type="checkbox"
                v-model="currentCadetData.application_has_been_printed"
              />
              <label
                class="form-check-label"
                for="id_application_has_been_printed"
              >
                Заявление отпечатано
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavigationLayout from "@/components/layouts/NavigationLayout.vue"
import { globalCadetAPIForEntranceInstance } from "@/api/cadet/cadetAPI"
import getActionHistoryAPIInstance from "@/api/cadet/actionHistoryAPI.js"
import { isEqual } from "lodash"
import { mapGetters } from "vuex"
import useVuelidate from "@vuelidate/core"
import { required, helpers, minValue, maxValue } from "@vuelidate/validators"

export default {
  name: "EntranceInputForm",
  components: { NavigationLayout },
  data() {
    return {
      currentTime: new Date(),
      isLoading: true,
      isDataSaving: false,
      isError: false,
      currentCadetData: {
        id: "",
        is_active: "",
        category: "",
        gender: "",
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
        passport_document_type: "",
        passport_number: "",
        passport_issue_date: "",
        passport_validity_period: "",
        passport_issue_authority: "",
        passport_issue_authority_text: "",
        identification_number: "",
        subdivision: "",
        current_rank: "",
        current_position: "",
        student_record_book_number: "",
        father_last_name: "",
        father_first_name: "",
        father_patronymic: "",
        father_date_of_birth: "",
        father_place_of_work: "",
        father_phone_number: "",
        father_address_residence: "",
        father_address_registration: "",
        mother_last_name: "",
        mother_first_name: "",
        mother_patronymic: "",
        mother_date_of_birth: "",
        mother_place_of_work: "",
        mother_phone_number: "",
        mother_address_residence: "",
        mother_address_registration: "",
        parents_is_in_divorce: "",
        removed_from_military_registration: "",
        foreign_language_was: "",
        foreign_language_will_be: "",
        group: "",
        academy_start_date: "",
        academy_end_date: "",
        graduation_reason: "",
        graduation_reason_article: "",
        graduation_extra_data: "",
        specialization: "",
        direction_ord: "",
        current_speciality: "",
        component_organ: "",
        in_whose_interests: "",
        entrance_category: "",
        arrived_from_go_rovd: "",
        social_status: "",
        region_for_medical_examination: "",
        military_office: "",
        military_office_extra_data: "",
        extra_data: "",
        comments_on_personal_file: "",
        educational_institution: "",
        document_type: "",
        privilege: "",
        attached_documents: "",
        military_organization: "",
        military_service_start: "",
        military_service_end: "",
        military_position: "",
        mvd_organization: "",
        mvd_service_start: "",
        mvd_service_end: "",
        mvd_position: "",
        education_kind: "",
        education_level: "",
        education_graduated: "",
        education_graduating_start_year: "",
        education_graduating_end_year: "",
        education_average_score: "",
        education_location_kind: "",
        is_located_in_Minsk: "",
        medal: "",
        vpk: "",
        vpk_data: "",
        is_class_vpn: "",
        is_class_pn: "",
        is_class_other: "",
        has_achievements_in_sports: "",
        is_olympiad_winner: "",
        health_group: "",
        ppfl_test: "",
        medical_age_group: "",
        passed_medical_examination_extra_data: "",
        passed_medical_examination: "",
        passed_medical_examination_date: "",
        needs_increased_attention: "",
        needs_psychological_support: "",
        is_risk_group: "",
        has_conviction: "",
        has_dactocard: "",
        has_gusb_check: "",
        has_employee_in_family: "",
        is_orphan: "",
        has_certificate_ideas_for_Belarus: "",
        has_certificate_kind_heart: "",
        is_employee: "",
        is_law_class: "",
        is_law_enforcement: "",
        is_reserve: "",
        is_fired: "",
        took_documents: "",
        is_vv: "",
        is_fp: "",
        application_has_been_printed: "",
        application_has_been_printed_date: "",
        rus_score_ct: "",
        bel_score_ct: "",
        social_science_ct: "",
        foreign_lang_ct: "",
        rus_score_cert: "",
        bel_score_cert: "",
        social_science_cert: "",
        foreign_lang_cert: "",
        speciality_1: "",
        speciality_2: "",
        speciality_3: "",
        speciality_4: "",
        speciality_5: "",
        speciality_6: "",
        speciality_7: "",
      },
      currentCadetDataFromServer: {},
      cadetAPIInstance: globalCadetAPIForEntranceInstance,
      actionHistoryAPIInstance: getActionHistoryAPIInstance(),
      BACKEND_PROTOCOL: import.meta.env.VITE_APP_BACKEND_PROTOCOL,
      BACKEND_HOST: import.meta.env.VITE_APP_BACKEND_HOST,
      BACKEND_PORT: import.meta.env.VITE_APP_BACKEND_PORT,
      cadetHistoryList: { count: 0, results: [], previous: null, next: null },
    }
  },
  setup() {
    return { v$: useVuelidate() }
  },
  validations() {
    const education_graduating_end_year_minValueValue = minValue(2000)
    const education_graduating_end_year_maxValueValue = maxValue(2025)
    return {
      currentCadetData: {
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
    async loadData(applicantId) {
      try {
        const response = await this.cadetAPIInstance.getItemData(applicantId)
        this.currentCadetData = response.data
        this.currentCadetDataFromServer = Object.assign(
          {},
          this.currentCadetData,
        )
      } catch (error) {
      } finally {
        this.isLoading = false
      }
    },
    async uploadDocument() {
      let formData = new FormData()
      formData.append(
        "attached_documents",
        this.$refs.uploadedDocument.files[0],
      )

      const response = await this.cadetAPIInstance.updatePhotoOrAnyFile(
        this.currentCadetData.id,
        formData,
      )

      this.currentCadetData = {
        ...this.currentCadetData,
        attached_documents: response.data.attached_documents,
      }
    },
    async deleteDocument() {
      const response = await this.cadetAPIInstance.updatePhotoOrAnyFile(
        this.currentCadetData.id,
        { attached_documents: null },
      )

      this.currentCadetData = {
        ...this.currentCadetData,
        attached_documents: response.data.attached_documents,
      }
    },
    async saveEntranceForm() {
      if (this.v$.$invalid) {
        let validationErrorsModal = this.$refs.validationErrorsModal
        let myModal = new bootstrap.Modal(validationErrorsModal, {
          keyboard: false,
        })
        myModal.show()
      } else {
        this.isDataSaving = true
        try {
          const { photo, attached_documents, ...rest } = this.currentCadetData
          const updatedData = await this.cadetAPIInstance.updateItem(rest)
          this.currentCadetData = updatedData.data
          this.currentCadetDataFromServer = Object.assign(
            {},
            this.currentCadetData,
          )
        } catch (e) {
        } finally {
          this.isDataSaving = false
        }
      }
    },
    async showHistory() {
      try {
        this.actionHistoryAPIInstance.searchObj.app_label = "kis_inheritance"
        this.actionHistoryAPIInstance.searchObj.model_name = "CadetInheritance"
        this.actionHistoryAPIInstance.searchObj.record_id =
          this.currentCadetData.id
        const response = await this.actionHistoryAPIInstance.getItemsList()
        this.cadetHistoryList = response.data
        let historyModal = this.$refs.cadetHistoryModal
        let myModal = new bootstrap.Modal(historyModal, {
          keyboard: false,
        })
        myModal.show()
      } catch (error) {
      } finally {
      }
    },
    makeInputDefaultNullValueIfEmpty(event) {
      if (event.target.value.trim().length === 0) {
        this.currentCadetData[event.target.name] = null
      }
    },
    removeFileFieldsFromObj(obj) {
      const { photo, attached_documents, ...rest } = obj
      return rest
    },
    printApplication(entranceId) {
      if (!this.isDataFromServerEqualChangedData) {
        let hasToSaveDataModal = this.$refs.hasToSaveDataModal
        let myModal = new bootstrap.Modal(hasToSaveDataModal, {
          keyboard: false,
        })
        myModal.show()
      } else {
        let queryString = `?application_id=${entranceId}`
        this.$axios
          .get(
            `${this.BACKEND_PROTOCOL}://${this.BACKEND_HOST}:${this.BACKEND_PORT}/api/application-print/${queryString}`,
            { responseType: "blob" },
          )
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute(
              "download",
              `${this.currentCadetData.last_name_rus}.docx`,
            )
            document.body.appendChild(link)
            link.click()
          })
      }
    },
  },
  computed: {
    orderedCadetCategories() {
      return this.categories.results
    },
    orderedRanks() {
      return this.ranks.results
    },
    orderedSubdivisions() {
      return this.subdivisions.results.filter(
        (subdivision) => subdivision.subdivision_category == "1",
      )
    },
    orderedSpecialities_select_1() {
      return this.specialities.results.filter(
        (item) =>
          item.id !== this.currentCadetData.speciality_2 &&
          item.id !== this.currentCadetData.speciality_3 &&
          item.id !== this.currentCadetData.speciality_4 &&
          item.id !== this.currentCadetData.speciality_5 &&
          item.id !== this.currentCadetData.speciality_6 &&
          item.id !== this.currentCadetData.speciality_7,
      )
    },
    orderedSpecialities_select_2() {
      return this.specialities.results.filter(
        (item) =>
          item.id !== this.currentCadetData.speciality_1 &&
          item.id !== this.currentCadetData.speciality_3 &&
          item.id !== this.currentCadetData.speciality_4 &&
          item.id !== this.currentCadetData.speciality_5 &&
          item.id !== this.currentCadetData.speciality_6 &&
          item.id !== this.currentCadetData.speciality_7,
      )
    },

    orderedSpecialities_select_3() {
      return this.specialities.results.filter(
        (item) =>
          item.id !== this.currentCadetData.speciality_1 &&
          item.id !== this.currentCadetData.speciality_2 &&
          item.id !== this.currentCadetData.speciality_4 &&
          item.id !== this.currentCadetData.speciality_5 &&
          item.id !== this.currentCadetData.speciality_6 &&
          item.id !== this.currentCadetData.speciality_7,
      )
    },

    orderedSpecialities_select_4() {
      return this.specialities.results.filter(
        (item) =>
          item.id !== this.currentCadetData.speciality_1 &&
          item.id !== this.currentCadetData.speciality_2 &&
          item.id !== this.currentCadetData.speciality_3 &&
          item.id !== this.currentCadetData.speciality_5 &&
          item.id !== this.currentCadetData.speciality_6 &&
          item.id !== this.currentCadetData.speciality_7,
      )
    },

    orderedSpecialities_select_5() {
      return this.specialities.results.filter(
        (item) =>
          item.id !== this.currentCadetData.speciality_1 &&
          item.id !== this.currentCadetData.speciality_2 &&
          item.id !== this.currentCadetData.speciality_3 &&
          item.id !== this.currentCadetData.speciality_4 &&
          item.id !== this.currentCadetData.speciality_6 &&
          item.id !== this.currentCadetData.speciality_7,
      )
    },

    orderedSpecialities_select_6() {
      return this.specialities.results.filter(
        (item) =>
          item.id !== this.currentCadetData.speciality_1 &&
          item.id !== this.currentCadetData.speciality_2 &&
          item.id !== this.currentCadetData.speciality_3 &&
          item.id !== this.currentCadetData.speciality_4 &&
          item.id !== this.currentCadetData.speciality_5 &&
          item.id !== this.currentCadetData.speciality_7,
      )
    },

    orderedSpecialities_select_7() {
      return this.specialities.results.filter(
        (item) =>
          item.id !== this.currentCadetData.speciality_1 &&
          item.id !== this.currentCadetData.speciality_2 &&
          item.id !== this.currentCadetData.speciality_3 &&
          item.id !== this.currentCadetData.speciality_4 &&
          item.id !== this.currentCadetData.speciality_5 &&
          item.id !== this.currentCadetData.speciality_6,
      )
    },
    orderedComponentOrgans() {
      return this.componentOrgans.results.sort((a, b) => {
        const nameA = a.component_name.toUpperCase() // ignore upper and lowercase
        const nameB = b.component_name.toUpperCase() // ignore upper and lowercase
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }
        return 0
      })
    },
    orderedEntranceCategories() {
      return this.entranceCategories.results
    },
    orderedSocialStatuses() {
      return this.socialStatuses.results
    },
    orderedCountryRegions() {
      return this.countryRegions.results.sort((a, b) => {
        const nameA = a.country_region.toUpperCase() // ignore upper and lowercase
        const nameB = b.country_region.toUpperCase() // ignore upper and lowercase
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }
        return 0
      })
    },
    orderedGorovds() {
      return this.gorovds.results.sort((a, b) => {
        const nameA = a.go_rovd_name.toUpperCase() // ignore upper and lowercase
        const nameB = b.go_rovd_name.toUpperCase() // ignore upper and lowercase
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }
        return 0
      })
    },
    orderedMilitaryOffices() {
      return this.militaryOffices.results.sort((a, b) => {
        const nameA = a.military_office.toUpperCase() // ignore upper and lowercase
        const nameB = b.military_office.toUpperCase() // ignore upper and lowercase
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }
        return 0
      })
    },
    orderedEducationalInstitutions() {
      return this.educationalInstitutions.results
    },
    orderedDocumentTypes() {
      return this.documentTypes.results
    },
    orderedPrivileges() {
      return this.privileges.results
    },
    orderedForeignLanguages() {
      return this.foreignLanguages.results
    },
    orderedPpflCategories() {
      return this.ppflCategories.results
    },
    orderedVpkCategories() {
      return this.vpkCategories.results
    },
    orderedEducationKinds() {
      return this.educationKinds.results
    },
    orderedEducationLevels() {
      return this.educationLevels.results
    },
    orderedEducationLocalityKinds() {
      return this.educationLocalityKinds.results
    },
    orderedMedals() {
      return this.medals.results
    },
    orderedInWhoseInterests() {
      return this.inWhoseInterests.results
    },
    isDataFromServerEqualChangedData() {
      return isEqual(
        this.removeFileFieldsFromObj(this.currentCadetData),
        this.removeFileFieldsFromObj(this.currentCadetDataFromServer),
      )
    },
    getAverageCertificateScore() {
      let averageCertificateScore = ""
      if (
        isFinite(this.currentCadetData.rus_score_cert) &&
        this.currentCadetData.rus_score_cert !== null &&
        isFinite(this.currentCadetData.bel_score_cert) &&
        this.currentCadetData.bel_score_cert !== null &&
        isFinite(this.currentCadetData.social_science_cert) &&
        this.currentCadetData.social_science_cert !== null &&
        isFinite(this.currentCadetData.foreign_lang_cert) &&
        this.currentCadetData.foreign_lang_cert !== null
      ) {
        averageCertificateScore =
          (this.currentCadetData.rus_score_cert +
            this.currentCadetData.bel_score_cert +
            this.currentCadetData.social_science_cert +
            this.currentCadetData.foreign_lang_cert) /
          4
        return averageCertificateScore.toFixed(1)
      }
      return averageCertificateScore
    },
    getARussianAndBelorussianSumScore() {
      let scoreSum = ""
      if (
        isFinite(this.currentCadetData.rus_score_cert) &&
        this.currentCadetData.rus_score_cert !== null &&
        isFinite(this.currentCadetData.bel_score_cert)
      ) {
        scoreSum =
          this.currentCadetData.rus_score_cert +
          this.currentCadetData.bel_score_cert
        return scoreSum
      }
      return scoreSum
    },

    ...mapGetters({
      groups: "groups/getList",
      ranks: "ranks/getList",
      subdivisions: "subdivisions/getList",
      specialities: "specialities/getList",
      positions: "positions/getList",
      categories: "personCategories/getList",
      componentOrgans: "componentOrgans/getList",
      entranceCategories: "entranceCategory/getList",
      socialStatuses: "socialStatus/getList",
      countryRegions: "countryRegion/getList",
      gorovds: "gorovds/getList",
      militaryOffices: "militaryOffices/getList",
      educationalInstitutions: "educationalInstitutions/getList",
      documentTypes: "documentType/getList",
      privileges: "privileges/getList",
      passportAuthorities: "passportAuthorities/getList",
      foreignLanguages: "foreignLanguages/getList",
      ppflCategories: "ppflCategories/getList",
      vpkCategories: "vpkCategories/getList",
      token: "auth/getToken",
      isCommonLoading: "common/getIsCommonLoading",
      educationKinds: "educationKind/getList",
      educationLevels: "educationLevel/getList",
      educationLocalityKinds: "educationLocalityKind/getList",
      medals: "medals/getList",
      inWhoseInterests: "inWhoseInterests/getList",
    }),
  },
}
</script>
