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
        Личное дело ({{ currentStudentData.last_name_rus }}
        {{ currentStudentData.first_name_rus }}
        {{ currentStudentData.patronymic_rus || "" }}) (тел.
        {{ currentStudentData.phone_number || "Нет данных" }})
      </h1>
      <div class="mb-3"></div>
      <div class="row">
        <div>
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
                  <h5 class="card-title">Обучение в Академии</h5>
                  <div class="row">
                    <div class="col-xl-2">
                      <div
                        class="text-center m-3 border"
                        style="position: relative"
                      >
                        <img
                          v-if="currentStudentData.photo"
                          :src="currentStudentData.photo"
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
                          accept="image/png, image/jpeg"
                          style="position: absolute; bottom: 10px; left: 10px"
                        />
                      </div>
                    </div>
                    <div class="col-xl-10">
                      <div class="d-flex flex-row">
                        <h3 class="me-3" v-if="currentStudentData.get_age">
                          Возраст - {{ currentStudentData.get_age }} лет
                        </h3>
                        <h3 class="me-3" v-else>Возраст - нет данных</h3>
                      </div>

                      <div class="row">
                        <div class="col-lg-4">
                          <div class="mb-3">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                v-model="currentStudentData.is_active"
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
                      </div>

                      <div class="row my-3">
                        <h3>Набор {{ currentStudentData.entrance_year }}</h3>
                        <div class="col-xl-3">
                          <div class="mb-3">
                            <label class="form-label" for="id_speciality"
                              >Специальность</label
                            >
                            <select
                              class="form-select"
                              name="speciality"
                              id="id_speciality"
                              v-model="currentStudentData.speciality"
                            >
                              <option :value="null" selected>---------</option>
                              <option
                                v-for="speciality in orderedSpecialities"
                                :value="speciality.id"
                              >
                                {{ speciality.speciality_name }}
                              </option>
                            </select>
                          </div>
                        </div>
                        <div class="col-xl-3">
                          <div class="mb-3">
                            <label class="form-label" for="id_specialization"
                              >Специализация /профилизация</label
                            >
                            <select
                              class="form-select"
                              name="specialization"
                              id="id_specialization"
                              v-model="currentStudentData.specialization"
                            >
                              <option :value="null" selected>---------</option>
                              <option
                                v-for="specialization in orderedSpecializations"
                                :value="specialization.id"
                              >
                                {{ specialization.specialization_name }}
                              </option>
                            </select>
                          </div>
                        </div>
                        <div class="col-xl-3">
                          <div class="mb-3">
                            <label class="form-label" for="id_subdivision"
                              >Дата начала обучения</label
                            >
                            <input
                              type="date"
                              class="form-control"
                              v-model="currentStudentData.academy_start_date"
                              id="id_subdivision"
                              name="academy_start_date"
                              @input="makeInputDefaultNullValueIfEmpty"
                            />
                          </div>
                        </div>
                        <div class="col-xl-3">
                          <div class="mb-3">
                            <label class="form-label" for="id_subdivision"
                              >Дата окончания обучения</label
                            >
                            <input
                              type="date"
                              class="form-control"
                              v-model="currentStudentData.academy_end_date"
                              id="id_subdivision"
                              name="academy_end_date"
                              @input="makeInputDefaultNullValueIfEmpty"
                            />
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-xl-2">
                          <div class="mb-3">
                            <label class="form-label" for="id_first_name_rus"
                              >Форма обучения</label
                            >
                            <select
                              class="form-select"
                              name="subdivision"
                              id="id_subdivision"
                              v-model="currentStudentData.education_form"
                            >
                              <option :value="null" selected>---------</option>
                              <option
                                v-for="education_form in orderedEducationForms"
                                :value="education_form.id"
                              >
                                {{ education_form.education_form }}
                              </option>
                            </select>
                          </div>
                        </div>
                        <div class="col-xl-1">
                          <div class="mb-3">
                            <label class="form-label" for="id_year">Курс</label>
                            <input
                              type="text"
                              class="form-control"
                              id="id_year"
                              v-model="currentStudentData.year"
                            />
                          </div>
                        </div>
                        <div class="col-xl-1">
                          <div class="mb-3">
                            <label class="form-label" for="id_year_litera"
                              >Литера</label
                            >
                            <input
                              type="text"
                              class="form-control"
                              id="id_year_litera"
                              v-model="currentStudentData.year_litera"
                            />
                          </div>
                        </div>
                        <div class="col-xl-2">
                          <div class="mb-3">
                            <label class="form-label" for="id_category"
                              >Группа</label
                            >
                            <select
                              class="form-select"
                              name="subdivision"
                              id="id_subdivision"
                              v-model="currentStudentData.group"
                            >
                              <option :value="null" selected>---------</option>
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
                        <div class="col-xl-2">
                          <div class="mb-3">
                            <label class="form-label" for="id_first_name_rus"
                              >Номер зачетной книжки</label
                            >
                            <input
                              type="text"
                              class="form-control"
                              v-model="
                                currentStudentData.student_record_book_number
                              "
                              id="id_student_record_book_number"
                            />
                          </div>
                        </div>
                        <div class="col-xl-2">
                          <div class="mb-3">
                            <label class="form-label" for="id_contract_number"
                              >Номер договора</label
                            >
                            <input
                              type="text"
                              class="form-control"
                              id="id_contract_number"
                              v-model="currentStudentData.contract_number"
                            />
                          </div>
                        </div>
                        <div class="col-lg-2">
                          <div class="mb-3">
                            <label
                              class="form-label"
                              for="id_foreign_language_will_be"
                              >Иностранный язык</label
                            >
                            <select
                              id="id_foreign_language_will_be"
                              class="form-select"
                              v-model="
                                currentStudentData.foreign_language_will_be
                              "
                            >
                              <option :value="null">---------</option>
                              <option :value="1" :key="1">Английский</option>
                              <option :value="2" :key="2">Немецкий</option>
                            </select>
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
                              v-model="currentStudentData.last_name_rus"
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
                              v-model="currentStudentData.first_name_rus"
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
                              v-model="currentStudentData.patronymic_rus"
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
                              name="last_name_rus"
                              maxlength="30"
                              required
                              id="id_last_name_rus"
                              v-model="currentStudentData.last_name_bel"
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
                              name="first_name_rus"
                              maxlength="30"
                              required
                              id="id_first_name_rus"
                              v-model="currentStudentData.first_name_bel"
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
                              name="patronymic_rus"
                              maxlength="30"
                              id="id_patronymic_rus"
                              v-model="currentStudentData.patronymic_bel"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <OrderHistoryStudentComponent :student-id="$route.params.id" />

            <div class="shadow p-3 mb-3" id="simple-list-passport-data">
              <div class="card border-0">
                <div class="card-body">
                  <h5 class="card-title mb-4">Личные данные</h5>

                  <div class="row">
                    <div class="col-lg-2">
                      <div class="mb-3">
                        <label class="form-label" for="id_date_of_birth"
                          >Дата рождения:</label
                        >
                        <input
                          type="date"
                          class="form-control"
                          name="date_of_birth"
                          id="id_date_of_birth"
                          v-model="currentStudentData.date_of_birth"
                          @input="makeInputDefaultNullValueIfEmpty"
                        />
                      </div>
                    </div>
                    <div class="col-lg-3">
                      <div class="mb-3">
                        <label class="form-label" for="id_place_of_birth"
                          >Место рождения</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          name="place_of_birth"
                          id="id_place_of_birth"
                          v-model="currentStudentData.place_of_birth"
                        />
                      </div>
                    </div>
                    <div class="col-lg-2">
                      <div class="mb-3">
                        <label class="form-label" for="id_address_registration"
                          >Пол</label
                        >
                        <select
                          name=""
                          id=""
                          class="form-select"
                          v-model="currentStudentData.gender"
                        >
                          <option :value="null">------</option>
                          <option value="1">мужской</option>
                          <option value="0">женский</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-xl-2">
                      <div class="mb-3">
                        <label
                          class="form-label"
                          for="id_education_location_kind"
                          >Место регистрации - город/село</label
                        >
                        <select
                          id="id_education_location_kind"
                          class="form-select"
                          v-model="currentStudentData.residence_location_kind"
                        >
                          <option :value="null">---------</option>
                          <option
                            :value="educationLocalityKind.id"
                            v-for="educationLocalityKind in orderedEducationLocalityKinds"
                          >
                            {{ educationLocalityKind.education_location_kind }}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div class="col-xl-3">
                      <div class="mb-3">
                        <label
                          class="form-label"
                          for="id_region_for_medical_examination"
                          >Область места жительства</label
                        >
                        <select
                          id="id_region_for_medical_examination"
                          class="form-select"
                          v-model="currentStudentData.residence_region"
                        >
                          <option :value="null">---------</option>
                          <option
                            :value="countryRegion.id"
                            v-for="countryRegion in orderedCountryRegions"
                          >
                            {{ countryRegion.country_region }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-lg-8"></div>
                  </div>

                  <div class="row">
                    <div class="col-xl-4">
                      <label class="form-label" for="id_address_registration"
                        >Место регистрации</label
                      >
                      <div class="mb-3">
                        <input
                          type="text"
                          id="id_address_registration"
                          class="form-control"
                          v-model="currentStudentData.address_registration"
                          required
                        />
                      </div>
                    </div>
                    <div class="col-xl-6">
                      <div class="fmb-3">
                        <label class="form-label" for="id_address_residence"
                          >Место фактического жительства</label
                        >
                        <input
                          id="id_address_residence"
                          type="text"
                          class="form-control"
                          placeholder="Место фактического жительства"
                          v-model="currentStudentData.address_residence"
                        />
                      </div>
                    </div>
                    <div class="col-xl-2">
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
                          autocomplete="false"
                          v-model="currentStudentData.phone_number"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-xl-2">
                      <div class="mb-3">
                        <label class="form-label" for="id_social_status"
                          >Социальный статус</label
                        >
                        <select
                          id="id_social_status"
                          class="form-select"
                          v-model="currentStudentData.social_status"
                        >
                          <option :value="null">---------</option>
                          <option
                            :value="socialStatus.id"
                            v-for="socialStatus in orderedSocialStatuses"
                          >
                            {{ socialStatus.social_status }}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div class="col-xxl-4">
                      <div class="mb-3">
                        <label class="form-label" for="id_place_of_work"
                          >Место работы и должность</label
                        >
                        <textarea
                          id="id_place_of_work"
                          class="form-control"
                          placeholder="Место работы и должность"
                          rows="1"
                          v-model="currentStudentData.place_of_work"
                        ></textarea>
                      </div>
                    </div>
                    <div class="col-xxl-3">
                      <div class="mb-3">
                        <label class="form-label" for="id_rank">Звание</label>
                        <textarea
                          id="id_rank"
                          class="form-control"
                          rows="1"
                          v-model="currentStudentData.rank"
                        ></textarea>
                      </div>
                    </div>
                    <div class="col-xxl-3">
                      <div class="mb-3">
                        <label class="form-label" for="id_department"
                          >Наименование ведомства (для сотрудников)</label
                        >
                        <textarea
                          id="id_department"
                          class="form-control"
                          rows="1"
                          v-model="currentStudentData.department"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-3">
                      <div class="mb-3">
                        <label
                          class="form-label"
                          for="id_passport_document_type"
                          >Документ удостоверяющий личность</label
                        >
                        <select
                          class="form-select"
                          id="id_passport_document_type"
                          v-model="currentStudentData.passport_document_type"
                        >
                          <option :value="null">---------</option>
                          <option value="1">Паспорт</option>
                          <option value="2">Идентификационная карта</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-3">
                      <div class="mb-3">
                        <label class="form-label" for="id_passport_number"
                          >Серия и номер паспорта / id карты
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          name="passport_number"
                          maxlength="100"
                          id="id_passport_number"
                          v-model="currentStudentData.passport_number"
                        />
                      </div>
                    </div>
                    <div class="col-2">
                      <div class="mb-3">
                        <label class="form-label" for="id_identification_number"
                          >Идентификационный номер</label
                        >
                        <input
                          type="text"
                          id="id_identification_number"
                          class="form-control"
                          v-model="currentStudentData.identification_number"
                        />
                      </div>
                    </div>
                    <div class="col-1">
                      <div class="mb-3">
                        <label class="form-label" for="id_passport_issue_date"
                          >Дата выдачи</label
                        >
                        <input
                          type="date"
                          class="form-control"
                          name="passport_issue_date"
                          id="id_passport_issue_date"
                          v-model="currentStudentData.passport_issue_date"
                          @input="makeInputDefaultNullValueIfEmpty"
                        />
                      </div>
                    </div>
                    <div class="col-1">
                      <div class="mb-3">
                        <label
                          class="form-label"
                          for="id_passport_validity_period"
                          >Срок оконч.</label
                        >
                        <input
                          type="date"
                          class="form-control"
                          name="passport_validity_period"
                          id="id_passport_validity_period"
                          v-model="currentStudentData.passport_validity_period"
                          @input="makeInputDefaultNullValueIfEmpty"
                        />
                      </div>
                    </div>
                    <div class="col-2">
                      <div class="mb-3">
                        <label
                          class="form-label"
                          for="id_passport_issue_authority"
                          >Орган выдачи паспорта:</label
                        >
                        <textarea
                          class="form-control"
                          rows="1"
                          v-model="
                            currentStudentData.passport_issue_authority_text
                          "
                        />
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-xl-12">
                      <div class="mb-3">
                        <label
                          class="form-label"
                          for="id_personal_information_tab_extra_data"
                          >Примечание по личным данным</label
                        >
                        <textarea
                          id="id_personal_information_tab_extra_data"
                          class="form-control"
                          rows="2"
                          v-model="
                            currentStudentData.personal_information_tab_extra_data
                          "
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="shadow p-3 mb-3" id="simple-list-parents-data">
              <div class="card border-0">
                <div class="card-body">
                  <h5 class="card-title mb-3">Данные о родителях</h5>

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
                              v-model="currentStudentData.mother_last_name"
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
                              v-model="currentStudentData.mother_first_name"
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
                              v-model="currentStudentData.mother_patronymic"
                            />
                            <label for="id_mother_patronymic">Отчество</label>
                          </div>
                        </div>
                        <div class="col-xl-3">
                          <div class="form-floating mb-3">
                            <input
                              id="id_mother_date_of_birth"
                              name="mother_date_of_birth"
                              type="date"
                              class="form-control form-control-sm"
                              placeholder="Мать (дата рождения)"
                              v-model="currentStudentData.mother_date_of_birth"
                              @input="makeInputDefaultNullValueIfEmpty"
                            />
                            <label for="id_mother_date_of_birth"
                              >Дата рождения</label
                            >
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-6">
                          <div class="form-floating mb-3">
                            <input
                              id="id_mother_address_registration"
                              type="text"
                              class="form-control form-control-sm"
                              placeholder="Место регистрации"
                              v-model="
                                currentStudentData.mother_address_registration
                              "
                            />
                            <label for="id_mother_address_registration"
                              >Место регистрации</label
                            >
                          </div>
                        </div>

                        <div class="col-6">
                          <div class="form-floating mb-3">
                            <input
                              id="id_mother_address_residence"
                              type="text"
                              class="form-control form-control-sm"
                              placeholder="Место фактичесго жительства"
                              v-model="
                                currentStudentData.mother_address_residence
                              "
                            />
                            <label for="id_mother_address_residence"
                              >Место фактичесго жительства</label
                            >
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-6">
                          <div class="row">
                            <div class="col-3 d-flex align-items-end">
                              <div class="form-check mb-3">
                                <input
                                  id="id_mother_is_employee"
                                  class="form-check-input"
                                  type="checkbox"
                                  v-model="
                                    currentStudentData.mother_is_employee
                                  "
                                />
                                <label
                                  class="form-check-label"
                                  for="id_mother_is_employee"
                                >
                                  Является сотрудником
                                </label>
                              </div>
                            </div>
                            <div class="col-9">
                              <div class="form-floating mb-3">
                                <input
                                  id="id_mother_place_of_work"
                                  type="text"
                                  class="form-control form-control-sm"
                                  placeholder="Место работы и должность"
                                  v-model="
                                    currentStudentData.mother_place_of_work
                                  "
                                />
                                <label for="id_mother_place_of_work"
                                  >Место работы и должность</label
                                >
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-6">
                          <div class="form-floating mb-3">
                            <input
                              id="id_mother_phone_number"
                              type="text"
                              class="form-control form-control-sm"
                              placeholder="Номер телефона"
                              v-model="currentStudentData.mother_phone_number"
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
                              v-model="currentStudentData.father_last_name"
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
                              v-model="currentStudentData.father_first_name"
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
                              v-model="currentStudentData.father_patronymic"
                            />
                            <label for="id_father_patronymic">Отчество</label>
                          </div>
                        </div>
                        <div class="col-xl-3">
                          <div class="form-floating mb-3">
                            <input
                              id="id_father_date_of_birth"
                              type="date"
                              name="father_date_of_birth"
                              class="form-control form-control-sm"
                              placeholder="Отец (дата рождения)"
                              v-model="currentStudentData.father_date_of_birth"
                              @input="makeInputDefaultNullValueIfEmpty"
                            />
                            <label for="id_father_date_of_birth"
                              >Дата рождения</label
                            >
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-6">
                          <div class="form-floating mb-3">
                            <input
                              id="id_father_address_registration"
                              type="text"
                              class="form-control form-control-sm"
                              placeholder="Место регистрации"
                              v-model="
                                currentStudentData.father_address_registration
                              "
                            />
                            <label for="id_father_address_registration"
                              >Место регистрации</label
                            >
                          </div>
                        </div>
                        <div class="col-6">
                          <div class="form-floating mb-3">
                            <input
                              id="id_father_address_residence"
                              type="text"
                              class="form-control form-control-sm"
                              placeholder="Место фактического жительства"
                              v-model="
                                currentStudentData.father_address_residence
                              "
                            />
                            <label for="id_father_address_residence"
                              >Место фактического жительства</label
                            >
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-6">
                          <div class="row">
                            <div class="col-3 d-flex align-items-end">
                              <div class="form-check mb-3">
                                <input
                                  id="id_father_is_employee"
                                  class="form-check-input"
                                  type="checkbox"
                                  v-model="
                                    currentStudentData.father_is_employee
                                  "
                                />
                                <label
                                  class="form-check-label"
                                  for="id_father_is_employee"
                                >
                                  Является сотрудником
                                </label>
                              </div>
                            </div>
                            <div class="col-9">
                              <div class="form-floating mb-3">
                                <input
                                  id="id_father_place_of_work"
                                  type="text"
                                  class="form-control form-control-sm"
                                  placeholder="Место работы и должность"
                                  v-model="
                                    currentStudentData.father_place_of_work
                                  "
                                />
                                <label for="id_father_place_of_work"
                                  >Место работы и должность</label
                                >
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-6">
                          <div class="form-floating mb-3">
                            <input
                              id="id_father_phone_number"
                              type="text"
                              class="form-control form-control-sm"
                              placeholder="Номер телефона"
                              v-model="currentStudentData.father_phone_number"
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
              </div>
            </div>
            <div class="shadow p-3 mb-3" id="simple-list-parents-data">
              <div class="card border-0">
                <div class="card-body">
                  <h5 class="card-title mb-3">Анкета</h5>
                  <div>
                    <div class="my-3">
                      <div class="row">
                        <div class="col-xl-3">
                          <div class="form-floating mb-3">
                            <select
                              id="id_vpk"
                              class="form-select"
                              v-model="currentStudentData.vpk"
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
                        <div class="col-xl-3">
                          <div class="form-floating mb-3">
                            <input
                              id="id_vpk_data"
                              type="text"
                              class="form-control form-control-sm"
                              placeholder="Данные по ВПК"
                              v-model="currentStudentData.vpk_data"
                            />
                            <label for="id_vpk_data">Данные по ВПК</label>
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-xl-6">
                          <div class="row d-flex flex-row align-items-center">
                            <div class="col-xl-3">
                              <div class="form-check mb-3">
                                <input
                                  id="id_is_class_vpn"
                                  class="form-check-input"
                                  type="checkbox"
                                  v-model="currentStudentData.is_class_vpn"
                                />
                                <label
                                  class="form-check-label"
                                  for="id_is_class_vpn"
                                >
                                  Класс военно-патриотической направленности
                                </label>
                              </div>
                            </div>
                            <div class="col-xl-9">
                              <div class="form-floating mb-3">
                                <input
                                  id="id_class_vpn_extra_data"
                                  type="text"
                                  class="form-control"
                                  placeholder="Претендует на аттестат с отличием (доп.)"
                                  v-model="
                                    currentStudentData.class_vpn_extra_data
                                  "
                                />
                                <label for="id_class_vpn_extra_data"
                                  >Класс военно-патриотической направленности
                                  (доп.)</label
                                >
                              </div>
                            </div>
                          </div>
                          <div class="row d-flex flex-row align-items-center">
                            <div class="col-xl-3">
                              <div class="form-check mb-3">
                                <input
                                  id="id_is_class_pn"
                                  class="form-check-input"
                                  type="checkbox"
                                  v-model="currentStudentData.is_class_pn"
                                />
                                <label
                                  class="form-check-label"
                                  for="id_is_class_pn"
                                >
                                  Класс правовой направленности
                                </label>
                              </div>
                            </div>
                            <div class="col-xl-9">
                              <div class="form-floating mb-3">
                                <input
                                  id="id_class_pn_extra_data"
                                  type="text"
                                  class="form-control"
                                  placeholder="Претендует на аттестат с отличием (доп.)"
                                  v-model="
                                    currentStudentData.class_pn_extra_data
                                  "
                                />
                                <label for="id_class_pn_extra_data"
                                  >Класс правовой направленности (доп.)</label
                                >
                              </div>
                            </div>
                          </div>
                          <div class="row d-flex flex-row align-items-center">
                            <div class="col-xl-3">
                              <div class="form-check mb-3">
                                <input
                                  id="id_is_class_other"
                                  class="form-check-input"
                                  type="checkbox"
                                  v-model="currentStudentData.is_class_other"
                                />
                                <label
                                  class="form-check-label"
                                  for="id_is_class_other"
                                >
                                  Профильный класс иной направленности
                                </label>
                              </div>
                            </div>
                            <div class="col-xl-9">
                              <div class="form-floating mb-3">
                                <input
                                  id="id_class_other_extra_data"
                                  type="text"
                                  class="form-control form-control-sm"
                                  placeholder="Профильный класс иной направленности
                              (доп.)"
                                  v-model="
                                    currentStudentData.class_other_extra_data
                                  "
                                />
                                <label for="id_class_other_extra_data"
                                  >Профильный класс иной направленности
                                  (доп.)</label
                                >
                              </div>
                            </div>
                          </div>
                          <div class="row d-flex flex-row align-items-center">
                            <div class="col-xl-3">
                              <div class="form-check mb-3">
                                <input
                                  id="id_victims_of_the_Chernobyl_disaster"
                                  class="form-check-input"
                                  type="checkbox"
                                  v-model="
                                    currentStudentData.victims_of_the_Chernobyl_disaster
                                  "
                                />
                                <label
                                  class="form-check-label"
                                  for="id_victims_of_the_Chernobyl_disaster"
                                >
                                  Пострадавшие от катастрофы на ЧАЭС
                                </label>
                              </div>
                            </div>
                            <div class="col-xl-9">
                              <div class="form-floating mb-3">
                                <input
                                  id="id_victims_of_the_Chernobyl_disaster_extra_data"
                                  type="text"
                                  class="form-control form-control-sm"
                                  placeholder="Пострадавшие от катастрофы на ЧАЭС (доп.)"
                                  v-model="
                                    currentStudentData.victims_of_the_Chernobyl_disaster_extra_data
                                  "
                                />
                                <label
                                  for="id_victims_of_the_Chernobyl_disaster_extra_data"
                                  >Пострадавшие от катастрофы на ЧАЭС
                                  (доп.)</label
                                >
                              </div>
                            </div>
                          </div>
                          <div class="row d-flex flex-row align-items-center">
                            <div class="col-xl-3">
                              <div class="form-check mb-3">
                                <input
                                  id="id_is_brsm_member"
                                  class="form-check-input"
                                  type="checkbox"
                                  v-model="currentStudentData.is_brsm_member"
                                />
                                <label
                                  class="form-check-label"
                                  for="id_is_brsm_member"
                                >
                                  Является членом БРСМ
                                </label>
                              </div>
                            </div>
                            <div class="col-xl-9">
                              <div class="form-floating mb-3">
                                <input
                                  id="id_is_brsm_member_extra_data"
                                  type="text"
                                  class="form-control"
                                  placeholder="Является членом БРСМ (доп.)"
                                  v-model="
                                    currentStudentData.is_brsm_member_extra_data
                                  "
                                />
                                <label for="id_is_brsm_member_extra_data"
                                  >Является членом БРСМ (доп.)</label
                                >
                              </div>
                            </div>
                          </div>
                          <div class="row d-flex flex-row align-items-center">
                            <div class="col-xl-3">
                              <div class="form-check mb-3">
                                <input
                                  id="id_is_member_of_other_public_organizations"
                                  class="form-check-input"
                                  type="checkbox"
                                  v-model="
                                    currentStudentData.is_member_of_other_public_organizations
                                  "
                                />
                                <label
                                  class="form-check-label"
                                  for="id_is_member_of_other_public_organizations"
                                >
                                  Является членом иных общественных организаций
                                </label>
                              </div>
                            </div>
                            <div class="col-xl-9">
                              <div class="form-floating mb-3">
                                <input
                                  id="id_is_member_of_other_public_organizations_extra_data"
                                  type="text"
                                  class="form-control"
                                  placeholder="Является членом БРСМ (доп.)"
                                  v-model="
                                    currentStudentData.is_member_of_other_public_organizations_extra_data
                                  "
                                />
                                <label
                                  for="id_is_member_of_other_public_organizations_extra_data"
                                  >Является членом иных общественных организаций
                                  (доп.)</label
                                >
                              </div>
                            </div>
                          </div>
                          <div class="row d-flex flex-row align-items-center">
                            <div class="col-xl-3">
                              <div class="form-check mb-3">
                                <input
                                  id="id_is_from_large_family"
                                  class="form-check-input"
                                  type="checkbox"
                                  v-model="
                                    currentStudentData.is_from_large_family
                                  "
                                />
                                <label
                                  class="form-check-label"
                                  for="id_is_from_large_family"
                                >
                                  Из многодетной семьи
                                </label>
                              </div>
                            </div>
                            <div class="col-xl-9">
                              <div class="form-floating mb-3">
                                <input
                                  id="id_from_large_family_extra_data"
                                  type="text"
                                  class="form-control form-control-sm"
                                  placeholder="Из многодетной семьи (доп.)"
                                  v-model="
                                    currentStudentData.from_large_family_extra_data
                                  "
                                />
                                <label for="id_from_large_family_extra_data"
                                  >Из многодетной семьи (доп.)</label
                                >
                              </div>
                            </div>
                          </div>

                          <div class="row d-flex flex-row align-items-center">
                            <div class="col-xl-3">
                              <div class="form-check mb-3">
                                <input
                                  id="id_is_olympiad_winner"
                                  class="form-check-input"
                                  type="checkbox"
                                  v-model="
                                    currentStudentData.is_olympiad_winner
                                  "
                                />
                                <label
                                  class="form-check-label"
                                  for="id_is_olympiad_winner"
                                >
                                  Победитель республиканских или региональных
                                  олимпиад
                                </label>
                              </div>
                            </div>
                            <div class="col-xl-9">
                              <div class="form-floating mb-3">
                                <input
                                  id="id_olympiad_winner_extra_data"
                                  type="text"
                                  class="form-control"
                                  placeholder="Претендует на аттестат с отличием (доп.)"
                                  v-model="
                                    currentStudentData.olympiad_winner_extra_data
                                  "
                                />
                                <label for="id_olympiad_winner_extra_data"
                                  >Победитель республиканских или региональных
                                  олимпиад (доп.)</label
                                >
                              </div>
                            </div>
                          </div>

                          <div class="row d-flex flex-row align-items-center">
                            <div class="col-xl-3">
                              <div class="form-check mb-3">
                                <input
                                  id="id_has_intellectual_and_scientific_research_events"
                                  class="form-check-input"
                                  type="checkbox"
                                  v-model="
                                    currentStudentData.has_intellectual_and_scientific_research_events
                                  "
                                />
                                <label
                                  class="form-check-label"
                                  for="id_has_intellectual_and_scientific_research_events"
                                >
                                  Мероприятия интелектуального и
                                  научно-исследовательского характера
                                </label>
                              </div>
                            </div>
                            <div class="col-xl-9">
                              <div class="form-floating mb-3">
                                <input
                                  id="id_has_intellectual_and_scientific_research_events_extra_data"
                                  type="text"
                                  class="form-control form-control-sm"
                                  placeholder="Мероприятия интелектуального и
                                  научю-исслед. хар-ра (доп.)"
                                  v-model="
                                    currentStudentData.has_intellectual_and_scientific_research_events_extra_data
                                  "
                                />
                                <label
                                  for="id_has_intellectual_and_scientific_research_events_extra_data"
                                  >Мероприятия интелектуального и науч.-исслед.
                                  хар-ра (доп.)</label
                                >
                              </div>
                            </div>
                          </div>
                          <div class="row d-flex flex-row align-items-center">
                            <div class="col-xl-3">
                              <div class="form-check mb-3">
                                <input
                                  id="id_is_from_low_income_families"
                                  class="form-check-input"
                                  type="checkbox"
                                  v-model="
                                    currentStudentData.is_from_low_income_families
                                  "
                                />
                                <label
                                  class="form-check-label"
                                  for="id_is_from_low_income_families"
                                >
                                  Из малообеспеченной семьи
                                </label>
                              </div>
                            </div>
                            <div class="col-xl-9">
                              <div class="form-floating mb-3">
                                <input
                                  id="id_from_low_income_families_extra_data"
                                  type="text"
                                  class="form-control form-control-sm"
                                  placeholder="Из малообеспеченной семьи (доп.)"
                                  v-model="
                                    currentStudentData.from_low_income_families_extra_data
                                  "
                                />
                                <label
                                  for="id_from_low_income_families_extra_data"
                                  >Из малообеспеченной семьи (доп.)</label
                                >
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="col-xl-6">
                          <div class="row d-flex flex-row align-items-center">
                            <div class="col-xl-3">
                              <div class="form-check mb-3">
                                <input
                                  id="id_have_dependent_children_parents"
                                  class="form-check-input"
                                  type="checkbox"
                                  v-model="
                                    currentStudentData.have_dependent_children_parents
                                  "
                                />
                                <label
                                  class="form-check-label"
                                  for="id_have_dependent_children_parents"
                                >
                                  Имеют на иждивении детей и / или родителей
                                </label>
                              </div>
                            </div>
                            <div class="col-xl-9">
                              <div class="form-floating mb-3">
                                <input
                                  id="id_have_dependent_children_parents_extra_data"
                                  type="text"
                                  class="form-control form-control-sm"
                                  placeholder="Имеют на иждевении детей и / или родителей (доп.)"
                                  v-model="
                                    currentStudentData.have_dependent_children_parents_extra_data
                                  "
                                />
                                <label
                                  for="id_have_dependent_children_parents_extra_data"
                                  >Имеют на иждевении детей и / или родителей
                                  (доп.)</label
                                >
                              </div>
                            </div>
                          </div>
                          <div class="row d-flex flex-row align-items-center">
                            <div class="col-xl-3">
                              <div class="form-check mb-3">
                                <input
                                  id="id_has_achievements_in_sports"
                                  class="form-check-input"
                                  type="checkbox"
                                  v-model="
                                    currentStudentData.has_achievements_in_sports
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
                            <div class="col-xl-9">
                              <div class="form-floating mb-3">
                                <input
                                  id="id_has_achievements_in_sports_extra_data"
                                  type="text"
                                  class="form-control"
                                  placeholder="Претендует на аттестат с отличием (доп.)"
                                  v-model="
                                    currentStudentData.has_achievements_in_sports_extra_data
                                  "
                                />
                                <label
                                  for="id_has_achievements_in_sports_extra_data"
                                  >Достижения в спорте (доп.)</label
                                >
                              </div>
                            </div>
                          </div>
                          <div class="row d-flex flex-row align-items-center">
                            <div class="col-xl-3">
                              <div class="form-check mb-3">
                                <input
                                  id="id_from_single_parent_family"
                                  class="form-check-input"
                                  type="checkbox"
                                  v-model="
                                    currentStudentData.from_single_parent_family
                                  "
                                />
                                <label
                                  class="form-check-label"
                                  for="id_from_single_parent_family"
                                >
                                  Из неполной семьи
                                </label>
                              </div>
                            </div>
                            <div class="col-xl-9">
                              <div class="form-floating mb-3">
                                <input
                                  id="id_from_single_parent_family_extra_data"
                                  type="text"
                                  class="form-control"
                                  placeholder="Из неполной семьи (доп.)"
                                  v-model="
                                    currentStudentData.from_single_parent_family_extra_data
                                  "
                                />
                                <label
                                  for="id_from_single_parent_family_extra_data"
                                  >Из неполной семьи (доп.)</label
                                >
                              </div>
                            </div>
                          </div>
                          <div class="row d-flex flex-row align-items-center">
                            <div class="col-xl-3">
                              <div class="form-check mb-3">
                                <input
                                  id="id_has_passion_for_vocals"
                                  class="form-check-input"
                                  type="checkbox"
                                  v-model="
                                    currentStudentData.has_passion_for_vocals
                                  "
                                />
                                <label
                                  class="form-check-label"
                                  for="id_has_passion_for_vocals"
                                >
                                  Имеет увлечение вокалом
                                </label>
                              </div>
                            </div>
                            <div class="col-xl-9">
                              <div class="form-floating mb-3">
                                <input
                                  id="id_has_passion_for_vocals_extra_data"
                                  type="text"
                                  class="form-control"
                                  placeholder="Имеет увлечение вокалом (доп.)"
                                  v-model="
                                    currentStudentData.has_passion_for_vocals_extra_data
                                  "
                                />
                                <label
                                  for="id_has_passion_for_vocals_extra_data"
                                  >Имеет увлечение вокалом (доп.)</label
                                >
                              </div>
                            </div>
                          </div>
                          <div class="row d-flex flex-row align-items-center">
                            <div class="col-xl-3">
                              <div class="form-check mb-3">
                                <input
                                  id="id_has_passion_for_choreography"
                                  class="form-check-input"
                                  type="checkbox"
                                  v-model="
                                    currentStudentData.has_passion_for_choreography
                                  "
                                />
                                <label
                                  class="form-check-label"
                                  for="id_has_passion_for_choreography"
                                >
                                  Имеет увлечение хореографией
                                </label>
                              </div>
                            </div>
                            <div class="col-xl-9">
                              <div class="form-floating mb-3">
                                <input
                                  id="id_has_passion_for_choreography_extra_data"
                                  type="text"
                                  class="form-control"
                                  placeholder="Имеет увлечение хореографией (доп.)"
                                  v-model="
                                    currentStudentData.has_passion_for_choreography_extra_data
                                  "
                                />
                                <label
                                  for="id_has_passion_for_choreography_extra_data"
                                  >Имеет увлечение хореографией (доп.)</label
                                >
                              </div>
                            </div>
                          </div>
                          <div class="row d-flex flex-row align-items-center">
                            <div class="col-xl-3">
                              <div class="form-check mb-3">
                                <input
                                  id="id_has_passion_for_kvn"
                                  class="form-check-input"
                                  type="checkbox"
                                  v-model="
                                    currentStudentData.has_passion_for_kvn
                                  "
                                />
                                <label
                                  class="form-check-label"
                                  for="id_has_passion_for_kvn"
                                >
                                  Имеет увлечение КВН
                                </label>
                              </div>
                            </div>
                            <div class="col-xl-9">
                              <div class="form-floating mb-3">
                                <input
                                  id="id_has_passion_for_kvn_extra_data"
                                  type="text"
                                  class="form-control"
                                  placeholder="Имеет увлечение КВН (доп.)"
                                  v-model="
                                    currentStudentData.has_passion_for_kvn_extra_data
                                  "
                                />
                                <label for="id_has_passion_for_kvn_extra_data"
                                  >Имеет увлечение КВН (доп.)</label
                                >
                              </div>
                            </div>
                          </div>
                          <div class="row d-flex flex-row align-items-center">
                            <div class="col-xl-3">
                              <div class="form-check mb-3">
                                <input
                                  id="id_has_other_cultural_and_mass_hobbies"
                                  class="form-check-input"
                                  type="checkbox"
                                  v-model="
                                    currentStudentData.has_other_cultural_and_mass_hobbies
                                  "
                                />
                                <label
                                  class="form-check-label"
                                  for="id_has_other_cultural_and_mass_hobbies"
                                >
                                  Имеет иные культурно-массовые увлечения
                                </label>
                              </div>
                            </div>
                            <div class="col-xl-9">
                              <div class="form-floating mb-3">
                                <input
                                  id="id_has_other_cultural_and_mass_hobbies_extra_data"
                                  type="text"
                                  class="form-control"
                                  placeholder="Имеет иные культурно-массовые увлечения (доп.)"
                                  v-model="
                                    currentStudentData.has_other_cultural_and_mass_hobbies_extra_data
                                  "
                                />
                                <label
                                  for="id_has_other_cultural_and_mass_hobbies_extra_data"
                                  >Имеет иные культурно-массовые увлечения
                                  (доп.)</label
                                >
                              </div>
                            </div>
                          </div>

                          <div class="row d-flex flex-row align-items-center">
                            <div class="col-xl-3">
                              <div class="form-check mb-3">
                                <input
                                  id="id_is_orphan"
                                  class="form-check-input"
                                  type="checkbox"
                                  v-model="currentStudentData.is_orphan"
                                />
                                <label
                                  class="form-check-label"
                                  for="id_is_orphan"
                                >
                                  Из числа детей-сирот
                                </label>
                              </div>
                            </div>
                            <div class="col-xl-9">
                              <div class="form-floating mb-3">
                                <input
                                  id="id_is_orphan_extra_data"
                                  type="text"
                                  class="form-control"
                                  placeholder="Из числа детей-сирот (доп.)"
                                  v-model="
                                    currentStudentData.is_orphan_extra_data
                                  "
                                />
                                <label for="id_is_orphan_extra_data"
                                  >Из числа детей-сирот (доп.)</label
                                >
                              </div>
                            </div>
                          </div>

                          <div class="row d-flex flex-row align-items-center">
                            <div class="col-xl-3">
                              <div class="form-check mb-3">
                                <input
                                  id="id_is_children_left_without_parental_care"
                                  class="form-check-input"
                                  type="checkbox"
                                  v-model="
                                    currentStudentData.is_children_left_without_parental_care
                                  "
                                />
                                <label
                                  class="form-check-label"
                                  for="id_is_children_left_without_parental_care"
                                >
                                  Из числа детей, оставшихся без попечения
                                  родителей
                                </label>
                              </div>
                            </div>
                            <div class="col-xl-9">
                              <div class="form-floating mb-3">
                                <input
                                  id="id_is_children_left_without_parental_care_extra_data"
                                  type="text"
                                  class="form-control"
                                  placeholder="Из числа детей, оставшихся без попечения
                                  родителей (доп.)"
                                  v-model="
                                    currentStudentData.is_children_left_without_parental_care_extra_data
                                  "
                                />
                                <label
                                  for="id_is_children_left_without_parental_care_extra_data"
                                  >Из числа детей, оставшихся без попечения
                                  родителей (доп.)</label
                                >
                              </div>
                            </div>
                          </div>

                          <div class="row d-flex flex-row align-items-center">
                            <div class="col-xl-3">
                              <div class="form-check mb-3">
                                <input
                                  id="id_has_own_family"
                                  class="form-check-input"
                                  type="checkbox"
                                  v-model="currentStudentData.has_own_family"
                                />
                                <label
                                  class="form-check-label"
                                  for="id_has_own_family"
                                >
                                  Из числа имеющих семьи
                                </label>
                              </div>
                            </div>
                            <div class="col-xl-9">
                              <div class="form-floating mb-3">
                                <input
                                  id="id_has_own_family_extra_data"
                                  type="text"
                                  class="form-control"
                                  placeholder="Из числа имеющих семьи (доп.)"
                                  v-model="
                                    currentStudentData.has_own_family_extra_data
                                  "
                                />
                                <label for="id_has_own_family_extra_data"
                                  >Из числа имеющих семьи (доп.)</label
                                >
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-xl-12">
                          <div class="form-floating mb-3">
                            <textarea
                              id="id_questionary_tab_extra_data"
                              class="form-control"
                              placeholder="Примечание по анкете"
                              rows="2"
                              v-model="
                                currentStudentData.questionary_tab_extra_data
                              "
                            ></textarea>
                            <label for="id_questionary_tab_extra_data"
                              >Примечание по анкете
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
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
import getStudentAPIInstance from "@/api/student/studentAPI"
import { debounce } from "lodash/function"

import "vue-select/dist/vue-select.css"
import { mapGetters } from "vuex"
import { defineAsyncComponent } from "vue"

const OrderHistoryStudentComponent = defineAsyncComponent(
  () =>
    import(
      "@/components/student/orderHistory/OrderHistoryStudentComponent.vue"
    ),
)

export default {
  name: "StudentUpdateView",
  components: {
    OrderHistoryStudentComponent,
  },
  data() {
    return {
      selected: "",
      isLoading: true,
      isError: false,
      currentStudentData: {
        is_preloaded_data: true,
        is_active: "",
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
        passport_issue_authority_text: "",
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
        subdivision: "",
        group: "",
        academy_start_date: "",
        academy_end_date: "",
        graduation_reason: "",
        graduation_reason_article: "",
        graduation_extra_data: "",
        component_organ: "",
        student_record_book_number: "",
        education_form: "",
        contract_number: "",
        year: "",
        year_litera: "",
      },
      studentAPIInstance: getStudentAPIInstance(),
    }
  },
  async created() {
    await this.loadData(this.$route.params.id)
  },
  methods: {
    async loadData(studentId) {
      const [student] = await Promise.all([
        this.getStudentData(studentId),
      ]).catch(() => (this.isError = true))
      this.currentStudentData = student
      this.isLoading = false
    },
    async getStudentData(studentId) {
      const res = await this.studentAPIInstance.getItemData(studentId)
      return res.data
    },
    async uploadPhoto() {
      if (this.$refs.uploadedPhoto.files.length) {
        let formData = new FormData()
        formData.append("photo", this.$refs.uploadedPhoto.files[0])

        const response = await this.studentAPIInstance.updatePhotoOrAnyFile(
          this.currentStudentData.id,
          formData,
        )

        this.currentStudentData = {
          ...this.currentStudentData,
          photo: response.data.photo,
        }
      }
    },
    makeInputDefaultNullValueIfEmpty(event) {
      if (event.target.value.trim().length === 0) {
        this.currentStudentData[event.target.name] = null
      }
    },
    debouncedUpdate: debounce(async function () {
      try {
        const { photo, attached_documents, sign_image, ...rest } =
          this.currentStudentData
        await this.studentAPIInstance.updateItem(rest)
      } catch (e) {
      } finally {
      }
    }, 500),
  },
  computed: {
    orderedGroups() {
      return this.groups.results
    },
    orderedPassportIssueAuthorities() {
      return this.passportAuthorities.results
    },
    orderedGraduationReasons() {
      return []
    },
    orderedEducationForms() {
      return this.educationForms.results
    },
    orderedSubdivisions() {
      return this.subdivisions.results.filter(
        (subdivision) => subdivision.subdivision_category == "3",
      )
    },
    orderedEducationLocalityKinds() {
      return this.educationLocalityKinds.results
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
    orderedSocialStatuses() {
      return this.socialStatuses.results
    },
    orderedSpecialities() {
      return this.specialities.results
    },
    orderedSpecializations() {
      return this.specializations.results
    },
    orderedVpkCategories() {
      return this.vpkCategories.results
    },

    ...mapGetters({
      groups: "groups/getList",
      ranks: "ranks/getList",
      educationForms: "educationForms/getList",
      categories: "personCategories/getList",
      subdivisions: "subdivisions/getList",
      passportAuthorities: "passportAuthorities/getList",
      isCommonLoading: "common/getIsCommonLoading",
      educationLocalityKinds: "educationLocalityKind/getList",
      countryRegions: "countryRegion/getList",
      socialStatuses: "socialStatus/getList",
      specialities: "specialities/getList",
      specializations: "specializations/getList",
      vpkCategories: "vpkCategories/getList",
    }),
  },
  watch: {
    currentStudentData: {
      handler(newValue, oldValue) {
        if (!oldValue.hasOwnProperty("is_preloaded_data")) {
          this.debouncedUpdate()
        }
      },
      deep: true,
    },
  },
}
</script>

<style scoped>
video {
  width: 100%;
  max-width: 600px;
  border: 1px solid #ccc;
}
</style>
