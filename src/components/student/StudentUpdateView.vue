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
        {{ currentStudentData.first_name_rus }})
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
                          accept="image/png, image/jpeg"
                          style="position: absolute; bottom: 10px; left: 10px"
                        />
                      </div>
                    </div>
                    <div class="col-lg-8">
                      <p>{{ getStudentStatus }}</p>
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

                      <div class="row">
                        <div class="col-lg-4">
                          <div class="mb-3">
                            <label class="form-label" for="id_id"
                              >Номер в базе</label
                            >
                            <input
                              type="text"
                              class="form-control"
                              name="last_name_rus"
                              maxlength="30"
                              required
                              id="id_id"
                              v-model="currentStudentData.id"
                            />
                          </div>
                        </div>
                        <div class="col-lg-4">
                          <div class="mb-3">
                            <label class="form-label" for="id_first_name_rus"
                              >Категория</label
                            >
                            <select
                              class="form-select"
                              name="subdivision"
                              id="id_subdivision"
                              v-model="currentStudentData.category"
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
                              v-model="currentStudentData.date_of_birth"
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
                              v-model="currentStudentData.place_of_birth"
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
                              autocomplete="false"
                              v-model="currentStudentData.phone_number"
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
                              v-model="currentStudentData.address_residence"
                            />
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-lg-4">
                          <div class="mb-3">
                            <label
                              class="form-label"
                              for="id_address_registration"
                              >Пол</label
                            >
                            <select
                              name=""
                              id=""
                              class="form-select"
                              v-model="currentStudentData.gender"
                            >
                              <option value="">------</option>
                              <option value="1">мужской</option>
                              <option value="0">женский</option>
                            </select>
                          </div>
                        </div>
                        <div class="col-lg-8">
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
                              v-model="currentStudentData.address_registration"
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
                          v-model="currentStudentData.passport_number"
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
                          v-model="currentStudentData.passport_issue_date"
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
                          v-model="currentStudentData.passport_validity_period"
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
                          v-model="currentStudentData.passport_issue_authority"
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

            <div
              class="shadow p-3 mb-3 bg-body-tertiary rounded"
              id="simple-list-academy-data"
            >
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Обучение в Академии МВД</h5>
                  <div class="row">
                    <div class="col-lg-4">
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
                    <div class="col-lg-4">
                      <div class="mb-3">
                        <label class="form-label" for="id_subdivision"
                          >Факультет</label
                        >
                        <select
                          class="form-select"
                          name="subdivision"
                          id="id_subdivision"
                          v-model="currentStudentData.subdivision"
                        >
                          <option value="" selected>---------</option>
                          <option
                            v-for="subdivision in orderedSubdivisions"
                            :value="subdivision.id"
                          >
                            {{ subdivision.subdivision_name }}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div class="col-lg-4">
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
                          <option value="" selected>---------</option>
                          <option
                            v-for="education_form in orderedEducationForms"
                            :value="education_form.id"
                          >
                            {{ education_form.education_form }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-lg-4">
                      <div class="mb-3">
                        <label class="form-label" for="id_first_name_rus"
                          >Специальность</label
                        >
                      </div>
                    </div>
                    <div class="col-lg-4">
                      <div class="mb-3">
                        <label class="form-label" for="id_first_name_rus"
                          >Специализация</label
                        >
                      </div>
                    </div>
                    <div class="col-lg-4">
                      <div class="mb-3">
                        <label class="form-label" for="id_first_name_rus"
                          >Направление</label
                        >
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-lg-3">
                      <div class="mb-3">
                        <label class="form-label" for="id_subdivision"
                          >Дата начала обучения</label
                        >
                        <input
                          type="date"
                          class="form-control"
                          v-model="currentStudentData.academy_start_date"
                          id="id_subdivision"
                        />
                      </div>
                    </div>
                    <div class="col-lg-3">
                      <div class="mb-3">
                        <label class="form-label" for="id_subdivision"
                          >Дата окончания обучения</label
                        >
                        <input
                          type="date"
                          class="form-control"
                          v-model="currentStudentData.academy_end_date"
                          id="id_subdivision"
                        />
                      </div>
                    </div>
                    <div class="col-lg-3">
                      <div class="mb-3">
                        <label class="form-label" for="id_subdivision"
                          >Причина окончания</label
                        >
                        <select
                          class="form-select"
                          name="graduation_reason"
                          id="id_graduation_reason"
                          v-model="currentStudentData.graduation_reason"
                        >
                          <option value="" selected>---------</option>
                          <option
                            v-for="graduation_reason in orderedGraduationReasons"
                            :value="graduation_reason.id"
                            :key="graduation_reason.id"
                          >
                            {{ graduation_reason.graduation_reason }}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div class="col-lg-3">
                      <div class="mb-3">
                        <label class="form-label" for="id_subdivision"
                          >Статья отчисления</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          v-model="currentStudentData.graduation_reason_article"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-lg-3">
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
                          <option value="" selected>---------</option>
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

                    <div class="col-lg-3">
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

                    <div class="col-lg-3">
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
                    <div class="col-lg-3">
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
                  </div>

                  <div class="row">
                    <div class="col-lg-3">
                      <div class="mb-3">
                        <label class="form-label" for="id_category"
                          >Год поступления</label
                        >
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12">
                      <div class="mb-3">
                        <label class="form-label" for="id_subdivision"
                          >Дополнительная информация об отчислении</label
                        >
                        <textarea
                          class="form-control"
                          rows="2"
                          v-model="currentStudentData.graduation_extra_data"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="shadow p-3 mb-3 bg-body-tertiary rounded"
              id="simple-list-parents-data"
            >
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title mb-3">Данные о родителях</h5>
                  <div class="row">
                    <div class="col-lg-6">
                      <div>
                        <h5>Отец</h5>
                        <div class="row">
                          <div class="col-4">
                            <div class="mb-3">
                              <label
                                class="form-label"
                                for="id_father_last_name"
                                >Фамилия:</label
                              >
                              <input
                                type="text"
                                class="form-control"
                                name="father_last_name"
                                v-model="currentStudentData.father_last_name"
                                id="id_father_last_name"
                              />
                            </div>
                          </div>
                          <div class="col-4">
                            <div class="mb-3">
                              <label
                                class="form-label"
                                for="id_father_first_name"
                                >Имя</label
                              >
                              <input
                                type="text"
                                class="form-control"
                                name="father_first_name"
                                maxlength="30"
                                id="id_father_first_name"
                                v-model="currentStudentData.father_first_name"
                              />
                            </div>
                          </div>
                          <div class="col-4">
                            <div class="mb-3">
                              <label
                                class="form-label"
                                for="id_father_patronymic"
                                >Отчество</label
                              >
                              <input
                                type="text"
                                class="form-control"
                                name="father_patronymic"
                                maxlength="30"
                                id="id_father_patronymic"
                                v-model="currentStudentData.father_patronymic"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-4">
                            <div class="mb-3">
                              <label
                                class="form-label"
                                for="id_father_date_of_birth"
                                >Дата рождения</label
                              >
                              <input
                                type="date"
                                class="form-control"
                                name="father_date_of_birth"
                                id="id_father_date_of_birth"
                                v-model="
                                  currentStudentData.father_date_of_birth
                                "
                              />
                            </div>
                          </div>
                          <div class="col-8">
                            <div class="mb-3">
                              <label
                                class="form-label"
                                for="id_father_phone_number"
                                >Номер телефона</label
                              >
                              <input
                                type="text"
                                class="form-control"
                                name="father_phone_number"
                                maxlength="30"
                                id="id_father_phone_number"
                                v-model="currentStudentData.father_phone_number"
                              />
                            </div>
                          </div>
                          <div class="col-4"></div>
                        </div>
                        <div class="row">
                          <div class="col-12">
                            <div class="mb-3">
                              <label
                                class="form-label"
                                for="id_father_place_of_work"
                                >Место работы</label
                              >
                              <textarea
                                class="form-control"
                                name="father_place_of_work"
                                cols="40"
                                rows="2"
                                id="id_father_place_of_work"
                                v-model="
                                  currentStudentData.father_place_of_work
                                "
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div>
                        <h5>Мать</h5>
                        <div class="row">
                          <div class="col-4">
                            <div class="mb-3">
                              <label
                                class="form-label"
                                for="id_mother_last_name"
                                >Фамилия:</label
                              >
                              <input
                                type="text"
                                class="form-control"
                                name="mother_last_name"
                                maxlength="30"
                                id="id_mother_last_name"
                                v-model="currentStudentData.mother_last_name"
                              />
                            </div>
                          </div>
                          <div class="col-4">
                            <div class="mb-3">
                              <label
                                class="form-label"
                                for="id_mother_first_name"
                                >Имя</label
                              >
                              <input
                                type="text"
                                class="form-control"
                                name="mother_first_name"
                                maxlength="30"
                                id="id_mother_first_name"
                                v-model="currentStudentData.mother_first_name"
                              />
                            </div>
                          </div>
                          <div class="col-4">
                            <div class="mb-3">
                              <label
                                class="form-label"
                                for="id_mother_patronymic"
                                >Отчество</label
                              >
                              <input
                                type="text"
                                class="form-control"
                                name="mother_patronymic"
                                maxlength="30"
                                id="id_mother_patronymic"
                                v-model="currentStudentData.mother_patronymic"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-4">
                            <div class="mb-3">
                              <label
                                class="form-label"
                                for="id_mother_date_of_birth"
                                >Дата рождения</label
                              >
                              <input
                                type="date"
                                class="form-control"
                                name="mother_date_of_birth"
                                id="id_mother_date_of_birth"
                                v-model="
                                  currentStudentData.mother_date_of_birth
                                "
                              />
                            </div>
                          </div>
                          <div class="col-8">
                            <div class="mb-3">
                              <label
                                class="form-label"
                                for="id_mother_phone_number"
                                >Номер телефона</label
                              >
                              <input
                                type="text"
                                class="form-control"
                                name="mother_phone_number"
                                maxlength="30"
                                id="id_mother_phone_number"
                                v-model="currentStudentData.mother_phone_number"
                              />
                            </div>
                          </div>
                          <div class="col-4"></div>
                        </div>
                        <div class="row">
                          <div class="col-12">
                            <div class="mb-3">
                              <label
                                class="form-label"
                                for="id_father_place_of_work"
                                >Место работы</label
                              >
                              <textarea
                                class="form-control"
                                name="father_place_of_work"
                                cols="40"
                                rows="2"
                                id="id_father_place_of_work"
                                v-model="
                                  currentStudentData.mother_place_of_work
                                "
                              />
                            </div>
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
              id="simple-list-orders-data"
            >
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title mb-3">Приказы</h5>
                  <div class="row">
                    <div class="col-lg-6">
                      <div class="row mb-3">
                        <label for="inputEmail3" class="col-lg-4 col-form-label"
                          >Приказ о зачислении</label
                        >
                        <div class="col-lg-4">
                          <input type="text" class="form-control" />
                        </div>
                        <div class="col-lg-4">
                          <input
                            type="date"
                            class="form-control"
                            id="inputEmail3"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="row mb-3">
                        <label for="inputEmail3" class="col-lg-4 col-form-label"
                          >Приказ об отчислении</label
                        >
                        <div class="col-lg-4">
                          <input
                            type="text"
                            class="form-control"
                            id="inputEmail3"
                          />
                        </div>
                        <div class="col-lg-4">
                          <input
                            type="date"
                            class="form-control"
                            id="inputEmail3"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-lg-6">
                      <div class="row mb-3">
                        <label for="inputEmail3" class="col-lg-4 col-form-label"
                          >Приказ о восстановлении</label
                        >
                        <div class="col-lg-4">
                          <input
                            type="text"
                            class="form-control"
                            id="inputEmail3"
                          />
                        </div>
                        <div class="col-lg-4">
                          <input
                            type="date"
                            class="form-control"
                            id="inputEmail3"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="row mb-3">
                        <label for="inputEmail3" class="col-lg-4 col-form-label"
                          >Приказ о предоставлении отпуска</label
                        >
                        <div class="col-lg-4">
                          <input
                            type="text"
                            class="form-control"
                            id="inputEmail3"
                          />
                        </div>
                        <div class="col-lg-4">
                          <input
                            type="date"
                            class="form-control"
                            id="inputEmail3"
                          />
                        </div>
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
                    <a
                      class="list-group-item list-group-item-action rounded-1"
                      href="#simple-list-academy-data"
                      >Обучение в Академии МВД</a
                    >

                    <a
                      class="list-group-item list-group-item-action rounded-1"
                      href="#simple-list-parents-data"
                      >Данные о родителях</a
                    >

                    <a
                      class="list-group-item list-group-item-action rounded-1"
                      href="#simple-list-orders-data"
                      >Приказы</a
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
import getStudentAPIInstance from "@/api/student/studentAPI"
import getJobHistoryAPIInstance from "@/api/cadet/jobHistoryAPI"
import { debounce } from "lodash/function"

import { EducationHistoryCadetComponent } from "@/components/cadet/education"
import { ForeignLanguagesCadetComponent } from "@/components/cadet/languages"
import { ScientificWorksCadetComponent } from "@/components/cadet/scientific_works"
import { JobCadetComponent } from "@/components/cadet/job"
import {
  ArmyServiceCadetComponent,
  MVDServiceCadetComponent,
} from "@/components/cadet/service"
import { RewardCadetComponent } from "@/components/cadet/reward"
import { PunishmentCadetComponent } from "@/components/cadet/punishment"
import { PositionCadetComponent } from "@/components/cadet/position"
import { SpecialityCadetComponent } from "@/components/cadet/speciality"
import RelativesCadetComponent from "@/components/cadet/relatives/RelativesCadetComponent.vue"

import "vue-select/dist/vue-select.css"
import { mapGetters } from "vuex"
import * as dayjs from "dayjs"

export default {
  name: "StudentUpdateView",
  components: {
    EducationHistoryCadetComponent,
    ForeignLanguagesCadetComponent,
    ScientificWorksCadetComponent,
    JobCadetComponent,
    ArmyServiceCadetComponent,
    MVDServiceCadetComponent,
    RewardCadetComponent,
    PunishmentCadetComponent,
    PositionCadetComponent,
    SpecialityCadetComponent,
    RelativesCadetComponent,
  },
  data() {
    return {
      selected: "",
      isLoading: true,
      isError: false,
      currentStudentData: {
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
      jobHistoryAPIInstance: getJobHistoryAPIInstance(),
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
    },
    async getStudentData(studentId) {
      const res = await this.studentAPIInstance.getItemData(studentId)
      return res.data
    },
    debouncedUpdate: debounce(async function () {
      this.isLoading = true
      try {
        const { photo, ...rest } = this.currentStudentData
        await this.studentAPIInstance.updateItem(rest)
      } catch (e) {
      } finally {
        this.isLoading = false
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
    orderedCategories() {
      return this.categories.results.filter(
        (category) => category.category_group == "3",
      )
    },
    orderedSubdivisions() {
      return this.subdivisions.results.filter(
        (subdivision) => subdivision.subdivision_category == "3",
      )
    },

    getStudentStatus() {
      if (dayjs().isBefore(dayjs(this.currentStudentData.academy_end_date))) {
        return "Обучается"
      } else
        return `Дата окончания обучения - ${this.currentStudentData.academy_end_date}, причина - ${this.currentStudentData.get_graduation_reason || "Нет данных"},
        статья - ${this.currentStudentData.graduation_reason_article || "Нет данных"}`
    },
    ...mapGetters({
      groups: "groups/getList",
      ranks: "ranks/getList",
      educationForms: "educationForms/getList",
      categories: "personCategories/getList",
      subdivisions: "subdivisions/getList",
      passportAuthorities: "passportAuthorities/getList",
      isCommonLoading: "common/getIsCommonLoading",
    }),
  },
  watch: {
    currentStudentData: {
      handler(newValue, oldValue) {
        this.debouncedUpdate()
      },
      deep: true,
    },
  },
}
</script>

<style scoped></style>
