<template>
  <div class="container-fluid">
    <div
      class="modal fade"
      id="id_studentHistoryModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      ref="studentHistoryModal"
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
              v-if="studentHistoryList.results.length > 0"
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
                    v-for="record in studentHistoryList.results"
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
              ref="studentAddModalCloseButton"
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
              <p v-for="error of v$.currentStudentData.$errors">
                {{ error.$message }}
              </p>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              ref="studentAddModalCloseButton"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>

    <!--    Application print Validation modal-->
    <div
      class="modal fade"
      id="id_application_validationErrorsModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      ref="application_validationErrorsModal"
    >
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              Для печати заявления исправте следующие ошибки:
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
              <p v-for="error of v$.applicationPrintData.$errors">
                {{ error.$message }}
              </p>
            </div>
            <div>
              <button
                class="btn btn-primary my-3"
                @click="makePrinting(this.currentStudentData.id)"
              >
                <font-awesome-icon :icon="['fas', 'print']" />&nbsp;&nbsp; Все
                равно напечатать заявление
              </button>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              ref="applicationValidationErrorsModalCloseButton"
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
              ref="studentAddModalCloseButton"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>

    <!--Average score calculating-->
    <div
      class="modal fade"
      id="id_averageScoreCalculatingModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      ref="averageScoreCalculatingModal"
    >
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">
              Калькулятор среднего балла
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              ref="averageScoreCalculatingModalCloseButton"
            ></button>
          </div>

          <div class="modal-body">
            <div class="d-flex flex-row alert alert-warning">
              <h5 class="me-3 my-0">
                Количество записей - {{ getAverageScoreCount() }}
              </h5>
              <h5 class="my-0">Средний балл - {{ getAverageScore }}</h5>
            </div>

            <div class="mt-3">
              <div class="form-floating">
                <select
                  class="form-select"
                  v-model="average_score_calculation.choice"
                  @change="average_score_calculation_select_change"
                >
                  <option value="">-------</option>
                  <option value="cert">Школа (11 классов)</option>
                  <option value="cert,dipl">
                    Школа (11 классов) + проф.тех
                  </option>
                  <option value="cert,dipl">
                    Школа (11 классов) + ср. спец.
                  </option>
                  <option value="cert">Проф.тех</option>
                  <option value="dipl">Ср. спец.</option>
                </select>
                <label for="id_privilege">Что окончил</label>
              </div>
              <div
                class="d-flex flex-row py-2 my-3"
                style="max-height: 400px; overflow-y: auto"
              >
                <div
                  style="width: 50%"
                  class="me-2"
                  v-if="this.average_score_calculation.choice.includes('cert')"
                >
                  <div class="mb-3">
                    <select
                      class="form-select"
                      v-model="
                        average_score_calculation.cert_average_score_5_10_system
                      "
                      @change="average_score_calculation_select_change"
                    >
                      <option :value="5">5 бальная</option>
                      <option :value="10">10 бальная</option>
                    </select>
                  </div>

                  <h5 class="ms-2">Школьный аттестат</h5>

                  <select
                    class="form-select"
                    :name="select.selectIndex"
                    v-for="select in average_score_calculation.certificate"
                    v-model="select.selectValue"
                    @change="averageScoreCertificateSelectChange"
                    v-if="
                      average_score_calculation.cert_average_score_5_10_system ===
                      10
                    "
                  >
                    <option value=""></option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                  </select>

                  <select
                    class="form-select"
                    :name="select.selectIndex"
                    v-for="select in average_score_calculation.certificate"
                    v-model="select.selectValue"
                    @change="averageScoreCertificateSelectChange"
                    v-else
                  >
                    <option value=""></option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
                <div v-else style="width: 50%"></div>
                <div
                  style="width: 50%"
                  v-if="this.average_score_calculation.choice.includes('dipl')"
                >
                  <div class="mb-3">
                    <select
                      class="form-select"
                      v-model="
                        average_score_calculation.dipl_average_score_5_10_system
                      "
                    >
                      <option value="5">5 бальная</option>
                      <option value="10">10 бальная</option>
                    </select>
                  </div>

                  <h5 class="ms-2">Диплом</h5>

                  <select
                    class="form-select"
                    :name="select.selectIndex"
                    v-for="select in average_score_calculation.diploma"
                    v-model="select.selectValue"
                    @change="averageScoreDiplomaSelectChange"
                    v-if="
                      average_score_calculation.dipl_average_score_5_10_system ===
                      10
                    "
                  >
                    <option value=""></option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                  </select>
                  <select
                    class="form-select"
                    :name="select.selectIndex"
                    v-for="select in average_score_calculation.diploma"
                    v-model="select.selectValue"
                    @change="averageScoreDiplomaSelectChange"
                    v-else
                  >
                    <option value=""></option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
                <div v-else style="width: 50%"></div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-success"
              @click="saveAverageScore"
            >
              Готово
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
          <div class="d-flex flex-row align-items-end">
            <h1
              class="fw-lighter"
              :class="{
                'bg-success-subtle':
                  currentStudentData.application_has_been_printed,
              }"
            >
              Личное дело абитуриента
              <span class="fw-normal text-decoration-underline"
                >{{ currentStudentData.last_name_rus }}&nbsp;{{
                  currentStudentData.first_name_rus
                }}&nbsp;{{ currentStudentData.patronymic_rus }}</span
              >
            </h1>
            &nbsp;&nbsp;
            <h1 class="fw-lighter">
              (возраст - {{ currentStudentData.get_age }} лет)
            </h1>
          </div>

          <button class="mx-2 btn btn-warning" @click="showHistory">
            История изменений&nbsp;&nbsp;<font-awesome-icon
              :icon="['fas', 'database']"
            />
          </button>
          <div
            v-if="currentStudentData.application_has_been_printed"
            class="my-3"
          >
            <h3>
              <font-awesome-icon :icon="['fas', 'print']" />
              Заявление напечатано
              <span v-if="currentStudentData.application_has_been_printed_date">
                -
                {{
                  new Date(
                    currentStudentData.application_has_been_printed_date,
                  ).toLocaleString("ru-RU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                  })
                }}</span
              >
            </h3>
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
                      v-model="currentStudentData.last_name_rus"
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
                      v-model="currentStudentData.first_name_rus"
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
                      v-model="currentStudentData.patronymic_rus"
                    />
                    <label for="id_patronymic_rus">Отчество (рус)</label>
                  </div>
                </div>

                <div class="col-xl-3">
                  <div class="form-floating mb-3">
                    <input
                      id="id_date_of_birth"
                      type="date"
                      name="date_of_birth"
                      class="form-control"
                      placeholder="Дата рождения"
                      v-model="currentStudentData.date_of_birth"
                      @input="makeInputDefaultNullValueIfEmpty"
                    />
                    <label for="id_date_of_birth">Дата рождения</label>
                  </div>
                </div>
              </div>
              <div class="row mt-3">
                <div class="col-xl-3">
                  <div class="form-floating mb-3">
                    <input
                      id="id_last_name_bel"
                      type="text"
                      class="form-control form-control-sm"
                      placeholder="Фамилия"
                      v-model="currentStudentData.last_name_bel"
                    />
                    <label for="id_last_name_rus">Фамилия (бел)</label>
                  </div>
                </div>
                <div class="col-xl-3">
                  <div class="form-floating mb-3">
                    <input
                      id="id_first_name_bel"
                      type="text"
                      class="form-control"
                      placeholder="Имя"
                      v-model="currentStudentData.first_name_bel"
                    />
                    <label for="id_first_name_rus">Имя (бел)</label>
                  </div>
                </div>
                <div class="col-xl-3">
                  <div class="form-floating mb-3">
                    <input
                      id="id_patronymic_bel"
                      type="text"
                      class="form-control"
                      placeholder="Отчество"
                      v-model="currentStudentData.patronymic_bel"
                    />
                    <label for="id_patronymic_rus">Отчество (бел)</label>
                  </div>
                </div>
                <div class="col-xl-3">
                  <div class="form-floating mb-3">
                    <select
                      id="id_gender"
                      class="form-select"
                      v-model="currentStudentData.gender"
                    >
                      <option :value="null">---------</option>
                      <option value="1">Мужской</option>
                      <option value="0">Женский</option>
                    </select>
                    <label for="id_gender">Пол</label>
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
                      id="id_education_form"
                      class="form-select"
                      v-model="currentStudentData.education_form"
                    >
                      <option :value="null">---------</option>
                      <option :value="1" :key="1">Дневная</option>
                      <option :value="2" :key="2">Заочная</option>
                    </select>
                    <label for="id_education_form">Форма обучения</label>
                  </div>
                </div>
                <div class="col-xl-3">
                  <div class="form-floating mb-3">
                    <select
                      id="id_foreign_language_was"
                      class="form-select"
                      v-model="currentStudentData.foreign_language_was"
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
                      v-model="currentStudentData.foreign_language_will_be"
                    >
                      <option :value="null">---------</option>
                      <option :value="1" :key="1">Английский</option>
                      <option :value="2" :key="2">Немецкий</option>
                    </select>
                    <label for="id_foreign_language_will_be"
                      >Иностранный язык (будет)</label
                    >
                  </div>
                </div>
                <div class="col-xl-3"></div>
              </div>

              <div class="row">
                <div class="col-xl-3">
                  <div class="form-floating mb-3">
                    <select
                      id="id_health_group"
                      class="form-select"
                      aria-label="Floating label select example"
                      v-model="currentStudentData.health_group"
                    >
                      <option :value="null">---------</option>
                      <option :value="8" :key="8">1</option>
                      <option :value="1" :key="1">2</option>
                      <option :value="3" :key="3">3</option>
                      <!--                      <option-->
                      <!--                          :value="health_group.id"-->
                      <!--                          v-for="health_group in orderedHealthGroups"-->
                      <!--                      >-->
                      <!--                        {{ health_group.health_group }}-->
                      <!--                      </option>-->
                    </select>
                    <label for="id_health_group">Группа здоровья</label>
                  </div>
                </div>
                <div class="col-xl-3">
                  <div class="form-floating mb-3">
                    <select
                      id="id_ppfl_test"
                      class="form-select"
                      v-model="currentStudentData.ppfl_test"
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
                      >Группа по физической культуре</label
                    >
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

                  <!--                  <button-->
                  <!--                    class="nav-link"-->
                  <!--                    id="nav-attached_documents-tab"-->
                  <!--                    data-bs-toggle="tab"-->
                  <!--                    data-bs-target="#nav-attached_documents"-->
                  <!--                    type="button"-->
                  <!--                    role="tab"-->
                  <!--                    aria-controls="nav-attached_documents"-->
                  <!--                    aria-selected="false"-->
                  <!--                  >-->
                  <!--                    Отсканированные документы-->
                  <!--                  </button>-->
                </div>
              </nav>
              <div class="tab-content" id="nav-tabContent">
                <div
                  class="tab-pane fade show active"
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
                            v-model="currentStudentData.education_kind"
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
                            v-model="currentStudentData.education_level"
                          >
                            <option :value="null">---------</option>
                            <option :value="6" :key="6">Общее среднее</option>
                            <option :value="7" :key="7">
                              Среднее специальное
                            </option>
                            <option :value="5" :key="5">
                              Профессионально-техническое
                            </option>
                            <option :value="4" :key="4">Высшее</option>

                            <!--                            <option-->
                            <!--                              :value="educationLevel.id"-->
                            <!--                              v-for="educationLevel in orderedEducationLevels"-->
                            <!--                            >-->
                            <!--                              {{ educationLevel.education_level }}-->
                            <!--                            </option>-->
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
                              currentStudentData.education_graduating_end_year
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
                        <!--                              currentStudentData.education_graduating_start_year-->
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
                            v-model="currentStudentData.medal"
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
                            v-model="currentStudentData.education_graduated"
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
                            v-model="currentStudentData.education_location_kind"
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
                    </div>
                    <div class="row">
                      <div class="col-12">
                        <div class="form-check mb-3">
                          <input
                            id="id_is_located_in_Minsk"
                            class="form-check-input"
                            type="checkbox"
                            v-model="currentStudentData.is_located_in_Minsk"
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
                    <div class="row">
                      <div class="col-xl-12">
                        <div class="form-floating mb-3">
                          <textarea
                            id="id_education_tab_extra_data"
                            class="form-control"
                            placeholder="Примечание по образованию"
                            rows="2"
                            v-model="
                              currentStudentData.education_tab_extra_data
                            "
                          ></textarea>
                          <label for="id_education_tab_extra_data"
                            >Примечание по образованию</label
                          >
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
                        <div class="col-xl-3">
                          <div class="form-floating mb-3">
                            <input
                              type="text"
                              id="id_place_of_birth"
                              class="form-control form-control-sm"
                              placeholder="Место рождения"
                              v-model="currentStudentData.place_of_birth"
                            />
                            <label for="id_place_of_birth"
                              >Место рождения</label
                            >
                          </div>
                        </div>
                        <div class="col-xl-3">
                          <div class="form-floating mb-3">
                            <input
                              type="text"
                              id="id_phone_number"
                              class="form-control form-control-sm"
                              placeholder="Номер телефона"
                              v-model="currentStudentData.phone_number"
                            />
                            <label for="id_phone_number">Номер телефона</label>
                          </div>
                        </div>
                        <div class="col-xl-3">
                          <div class="form-floating mb-3">
                            <select
                              id="id_education_location_kind"
                              class="form-select"
                              v-model="
                                currentStudentData.residence_location_kind
                              "
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
                              >Место регистрации - город/село</label
                            >
                          </div>
                        </div>

                        <div class="col-lg-3">
                          <div class="form-floating mb-3">
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
                            <label for="id_region_for_medical_examination"
                              >Область места жительства</label
                            >
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
                              placeholder="Место регистрации"
                              v-model="currentStudentData.address_registration"
                              required
                            />
                            <label for="id_address_registration"
                              >Место регистрации</label
                            >
                          </div>
                        </div>
                        <div class="col-6">
                          <div class="form-floating mb-3">
                            <input
                              id="id_address_residence"
                              type="text"
                              class="form-control form-control-sm"
                              placeholder="Место фактического жительства"
                              v-model="currentStudentData.address_residence"
                            />
                            <label for="id_address_residence"
                              >Место фактического жительства</label
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
                              v-model="
                                currentStudentData.passport_document_type
                              "
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
                              placeholder="Серия и номер паспорта (номер ид. карты)"
                              v-model="currentStudentData.passport_number"
                            />
                            <label for="id_passport_number"
                              >Серия и номер паспорта (номер ид. карты)</label
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
                              v-model="currentStudentData.identification_number"
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
                                currentStudentData.passport_issue_authority_text
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
                              name="passport_issue_date"
                              class="form-control form-control-sm"
                              placeholder="Дата выдачи"
                              v-model="currentStudentData.passport_issue_date"
                              @input="makeInputDefaultNullValueIfEmpty"
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
                                currentStudentData.passport_validity_period
                              "
                            />
                            <label for="id_passport_validity_period"
                              >Срок действия</label
                            >
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-3">
                          <div class="form-floating mb-3">
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
                            <label for="id_social_status"
                              >Социальный статус</label
                            >
                          </div>
                        </div>
                        <div class="col-xxl-3">
                          <div class="form-floating mb-3">
                            <textarea
                              id="id_department"
                              class="form-control"
                              placeholder="Наименование ведомства (для сотрудников)"
                              rows="2"
                              v-model="currentStudentData.department"
                            ></textarea>
                            <label for="id_department"
                              >Наименование ведомства (для сотрудников)</label
                            >
                          </div>
                        </div>
                        <div class="col-xxl-3">
                          <div class="form-floating mb-3">
                            <textarea
                              id="id_place_of_work"
                              class="form-control"
                              placeholder="Место работы и должность"
                              rows="2"
                              v-model="currentStudentData.place_of_work"
                            ></textarea>
                            <label for="id_place_of_work"
                              >Место работы и должность</label
                            >
                          </div>
                        </div>
                        <div class="col-xxl-3">
                          <div class="form-floating mb-3">
                            <textarea
                              id="id_rank"
                              class="form-control"
                              placeholder="Место работы"
                              rows="2"
                              v-model="currentStudentData.rank"
                            ></textarea>
                            <label for="id_rank">Звание</label>
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-xl-12">
                          <div class="form-floating mb-3">
                            <textarea
                              id="id_personal_information_tab_extra_data"
                              class="form-control"
                              placeholder="Примечание по личной информации"
                              rows="2"
                              v-model="
                                currentStudentData.personal_information_tab_extra_data
                              "
                            ></textarea>
                            <label for="id_personal_information_tab_extra_data"
                              >Примечание по личной информации</label
                            >
                          </div>
                        </div>
                      </div>

                      <div class="row d-flex flex-row align-items-center">
                        <div class="col-xl-3">
                          <div class="form-check mb-3">
                            <input
                              id="id_is_disabled"
                              class="form-check-input"
                              type="checkbox"
                              v-model="currentStudentData.is_disabled"
                            />
                            <label
                              class="form-check-label"
                              for="id_is_disabled"
                            >
                              Имеет инвалидность
                            </label>
                          </div>
                        </div>
                        <div class="col-xl-9">
                          <div class="form-floating mb-3">
                            <input
                              id="id_is_disabled_extra_data"
                              type="text"
                              class="form-control"
                              placeholder="Из числа детей-сирот (доп.)"
                              v-model="
                                currentStudentData.is_disabled_extra_data
                              "
                            />
                            <label for="id_is_disabled_extra_data"
                              >Имеет инвалидность (доп.)</label
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
                        <div class="row">
                          <div class="col-xl-12">
                            <div class="form-floating mb-3">
                              <textarea
                                id="id_parents_tab_extra_data"
                                class="form-control"
                                placeholder="Примечание по представителям"
                                rows="2"
                                v-model="
                                  currentStudentData.parents_tab_extra_data
                                "
                              ></textarea>
                              <label for="id_parents_tab_extra_data"
                                >Примечание по представителям
                              </label>
                            </div>
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
                <div
                  class="tab-pane fade"
                  id="nav-attached_documents"
                  role="tabpanel"
                  aria-labelledby="nav-attached_documents-tab"
                  tabindex="0"
                >
                  <div class="m-3">
                    <div v-if="currentStudentData.attached_documents">
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
                        :data="currentStudentData.attached_documents"
                        type="application/pdf"
                        ref="objectWithDocument"
                        width="100%"
                        height="700"
                      >
                        <p>
                          <b>Ошибка загрузки pdf документа.</b> Попробуйте
                          скачать его
                          <a :href="currentStudentData.attached_documents"
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
                    >Примечание по личному делу</label
                  >
                  <textarea
                    id="id_extra_data"
                    class="form-control"
                    rows="2"
                    v-model="currentStudentData.extra_data"
                  ></textarea>
                </div>
              </div>
            </div>
            <!--Анкета-->
            <!--            <div class="card shadow mb-2 rounded border-0">-->
            <!--              <div class="card-body">-->
            <!--                <div class="row">-->
            <!--                  <div class="col-xl-4">-->
            <!--                    <div class="form-check mb-3">-->
            <!--                      <input-->
            <!--                        id="id_needs_increased_attention"-->
            <!--                        class="form-check-input"-->
            <!--                        type="checkbox"-->
            <!--                        v-model="currentStudentData.needs_increased_attention"-->
            <!--                      />-->
            <!--                      <label-->
            <!--                        class="form-check-label"-->
            <!--                        for="id_needs_increased_attention"-->
            <!--                      >-->
            <!--                        Требует повышенного внимания-->
            <!--                      </label>-->
            <!--                    </div>-->
            <!--                    <div class="form-check mb-3">-->
            <!--                      <input-->
            <!--                        id="id_needs_psychological_support"-->
            <!--                        class="form-check-input"-->
            <!--                        type="checkbox"-->
            <!--                        v-model="currentStudentData.needs_psychological_support"-->
            <!--                      />-->
            <!--                      <label-->
            <!--                        class="form-check-label"-->
            <!--                        for="id_needs_psychological_support"-->
            <!--                      >-->
            <!--                        Требует психологического сопровождения-->
            <!--                      </label>-->
            <!--                    </div>-->
            <!--                    <div class="form-check mb-3">-->
            <!--                      <input-->
            <!--                        id="id_is_risk_group"-->
            <!--                        class="form-check-input"-->
            <!--                        type="checkbox"-->
            <!--                        v-model="currentStudentData.is_risk_group"-->
            <!--                      />-->
            <!--                      <label class="form-check-label" for="id_is_risk_group"-->
            <!--                        >Группа риска</label-->
            <!--                      >-->
            <!--                    </div>-->
            <!--                    <div class="form-check mb-3">-->
            <!--                      <input-->
            <!--                        id="id_has_conviction"-->
            <!--                        class="form-check-input"-->
            <!--                        type="checkbox"-->
            <!--                        v-model="currentStudentData.has_conviction"-->
            <!--                      />-->
            <!--                      <label class="form-check-label" for="id_has_conviction"-->
            <!--                        >Судимость</label-->
            <!--                      >-->
            <!--                    </div>-->
            <!--                    <div class="form-check mb-3">-->
            <!--                      <input-->
            <!--                        id="id_has_dactocard"-->
            <!--                        class="form-check-input"-->
            <!--                        type="checkbox"-->
            <!--                        v-model="currentStudentData.has_dactocard"-->
            <!--                      />-->
            <!--                      <label class="form-check-label" for="id_has_dactocard"-->
            <!--                        >Дактилоскопирование</label-->
            <!--                      >-->
            <!--                    </div>-->
            <!--                    <div class="form-check mb-3">-->
            <!--                      <input-->
            <!--                        id="id_has_gusb_check"-->
            <!--                        class="form-check-input"-->
            <!--                        type="checkbox"-->
            <!--                        v-model="currentStudentData.has_gusb_check"-->
            <!--                      />-->
            <!--                      <label class="form-check-label" for="id_has_gusb_check"-->
            <!--                        >Проверка ГУСБ</label-->
            <!--                      >-->
            <!--                    </div>-->
            <!--                    <div class="form-check mb-3">-->
            <!--                      <input-->
            <!--                        id="id_has_employee_in_family"-->
            <!--                        class="form-check-input"-->
            <!--                        type="checkbox"-->
            <!--                        v-model="currentStudentData.has_employee_in_family"-->
            <!--                      />-->
            <!--                      <label-->
            <!--                        class="form-check-label"-->
            <!--                        for="id_has_employee_in_family"-->
            <!--                        >Сотрудники в семье</label-->
            <!--                      >-->
            <!--                    </div>-->
            <!--                    <div class="form-check mb-3">-->
            <!--                      <input-->
            <!--                        id="is_is_orphan"-->
            <!--                        class="form-check-input"-->
            <!--                        type="checkbox"-->
            <!--                        v-model="currentStudentData.is_orphan"-->
            <!--                      />-->
            <!--                      <label class="form-check-label" for="is_is_orphan"-->
            <!--                        >Сирота</label-->
            <!--                      >-->
            <!--                    </div>-->
            <!--                    <div class="form-check mb-3">-->
            <!--                      <input-->
            <!--                        id="id_is_employee"-->
            <!--                        class="form-check-input"-->
            <!--                        type="checkbox"-->
            <!--                        v-model="currentStudentData.is_employee"-->
            <!--                      />-->
            <!--                      <label class="form-check-label" for="id_is_employee"-->
            <!--                        >Сотрудник</label-->
            <!--                      >-->
            <!--                    </div>-->
            <!--                  </div>-->
            <!--                  <div class="col-xl-4">-->
            <!--                    <p>Сертификаты</p>-->
            <!--                    <div class="form-check mb-3">-->
            <!--                      <input-->
            <!--                        id="id_has_certificate_ideas_for_Belarus"-->
            <!--                        class="form-check-input"-->
            <!--                        type="checkbox"-->
            <!--                        v-model="-->
            <!--                          currentStudentData.has_certificate_ideas_for_Belarus-->
            <!--                        "-->
            <!--                      />-->
            <!--                      <label-->
            <!--                        class="form-check-label"-->
            <!--                        for="id_has_certificate_ideas_for_Belarus"-->
            <!--                        >100 идей для Беларуси</label-->
            <!--                      >-->
            <!--                    </div>-->
            <!--                    <div class="form-check mb-3">-->
            <!--                      <input-->
            <!--                        id="id_has_certificate_kind_heart"-->
            <!--                        class="form-check-input"-->
            <!--                        type="checkbox"-->
            <!--                        v-model="currentStudentData.has_certificate_kind_heart"-->
            <!--                      />-->
            <!--                      <label-->
            <!--                        class="form-check-label"-->
            <!--                        for="id_has_certificate_kind_heart"-->
            <!--                        >Доброе сердце</label-->
            <!--                      >-->
            <!--                    </div>-->
            <!--                  </div>-->
            <!--                  <div class="col-xl-4">-->
            <!--                    <div class="form-check mb-3">-->
            <!--                      <input-->
            <!--                        id="id_is_law_class"-->
            <!--                        class="form-check-input"-->
            <!--                        type="checkbox"-->
            <!--                        v-model="currentStudentData.is_law_class"-->
            <!--                      />-->
            <!--                      <label class="form-check-label" for="id_is_law_class"-->
            <!--                        >Правовой класс</label-->
            <!--                      >-->
            <!--                    </div>-->
            <!--                    <div class="form-check mb-3">-->
            <!--                      <input-->
            <!--                        id="id_is_law_enforcement"-->
            <!--                        class="form-check-input"-->
            <!--                        type="checkbox"-->
            <!--                        v-model="currentStudentData.is_law_enforcement"-->
            <!--                      />-->
            <!--                      <label-->
            <!--                        class="form-check-label"-->
            <!--                        for="id_is_law_enforcement"-->
            <!--                        >Охрана правопорядка</label-->
            <!--                      >-->
            <!--                    </div>-->
            <!--                    <div class="form-check mb-3">-->
            <!--                      <input-->
            <!--                        id="id_is_reserve"-->
            <!--                        class="form-check-input"-->
            <!--                        type="checkbox"-->
            <!--                        v-model="currentStudentData.is_reserve"-->
            <!--                      />-->
            <!--                      <label class="form-check-label" for="id_is_reserve"-->
            <!--                        >Резерв</label-->
            <!--                      >-->
            <!--                    </div>-->
            <!--                    <div class="form-check mb-3">-->
            <!--                      <input-->
            <!--                        id="id_is_fired"-->
            <!--                        class="form-check-input"-->
            <!--                        type="checkbox"-->
            <!--                        v-model="currentStudentData.is_fired"-->
            <!--                      />-->
            <!--                      <label class="form-check-label" for="id_is_fired"-->
            <!--                        >Уволен</label-->
            <!--                      >-->
            <!--                    </div>-->
            <!--                    <div class="form-check mb-3">-->
            <!--                      <input-->
            <!--                        id="id_took_documents"-->
            <!--                        class="form-check-input"-->
            <!--                        type="checkbox"-->
            <!--                        v-model="currentStudentData.took_documents"-->
            <!--                      />-->
            <!--                      <label class="form-check-label" for="id_took_documents"-->
            <!--                        >Забрал документы</label-->
            <!--                      >-->
            <!--                    </div>-->

            <!--                    <div class="form-check mb-3">-->
            <!--                      <input-->
            <!--                        id="id_is_vv"-->
            <!--                        class="form-check-input"-->
            <!--                        type="checkbox"-->
            <!--                        v-model="currentStudentData.is_vv"-->
            <!--                      />-->
            <!--                      <label class="form-check-label" for="id_is_vv">ВВ</label>-->
            <!--                    </div>-->
            <!--                    <div class="form-check mb-3">-->
            <!--                      <input-->
            <!--                        id="id_is_fp"-->
            <!--                        class="form-check-input"-->
            <!--                        type="checkbox"-->
            <!--                        v-model="currentStudentData.is_fp"-->
            <!--                      />-->
            <!--                      <label class="form-check-label" for="id_is_fp">ФП</label>-->
            <!--                    </div>-->
            <!--                  </div>-->
            <!--                </div>-->
            <!--              </div>-->
            <!--            </div>-->
          </div>

          <div class="border-bottom border-4 my-3"></div>

          <h3 class="fw-bold">Заявление</h3>

          <div class="row">
            <div class="col-xxl-6">
              <h5 class="fw-bold">Выбор специальностей</h5>
              <div class="row">
                <div class="col-6">
                  <div class="form-floating mb-3">
                    <select
                      id="id_s1"
                      class="form-select"
                      v-model="currentStudentData.speciality_1"
                    >
                      <option :value="null">---------</option>
                      <option
                        :value="quota.id"
                        v-for="quota in orderedAdmissionQuotes_select_1"
                      >
                        {{ quota.quota_verbose_name }}
                      </option>
                    </select>
                    <label for="id_s1">Специальность</label>
                  </div>
                </div>
                <div class="col-6">
                  <div class="form-floating mb-3">
                    <select
                      id="id_privilege"
                      class="form-select"
                      v-model="currentStudentData.privilege_1"
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
              </div>
              <h5>Набранные баллы</h5>
              <div>
                <p class="fw-bold">
                  Сертификаты централизованного тестирования
                </p>
                <h3>Сумма баллов - {{ get_score_sum }}</h3>
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
                        <label for="id_rus_bel_cert_number"
                          >№ сертификата</label
                        >
                        <input
                          id="id_rus_bel_cert_number"
                          type="text"
                          class="form-control text-center"
                          v-model="currentStudentData.rus_bel_ct_number"
                        />
                      </td>
                      <td class="text-center table-warning">
                        <label for="id_social_science_cert_number"
                          >№ сертификата</label
                        >
                        <input
                          id="id_social_science_cert_number"
                          type="text"
                          class="form-control text-center"
                          v-model="currentStudentData.social_science_ct_number"
                        />
                      </td>
                      <td class="text-center table-success">
                        <label for="id_foreign_lang_cert_number"
                          >№ сертификата</label
                        >
                        <input
                          id="id_foreign_lang_cert_number"
                          type="text"
                          class="form-control text-center"
                          v-model="currentStudentData.foreign_lang_ct_number"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td class="text-center table-primary">
                        <label for="id_rus_score_ct"
                          >Количество баллов по сертификату</label
                        >
                        <input
                          id="id_rus_score_ct"
                          name="rus_score_ct"
                          type="number"
                          class="form-control text-center"
                          v-model="currentStudentData.rus_score_ct"
                          @input="makeInputDefaultNullValueIfEmpty"
                        />
                      </td>
                      <td class="text-center table-primary">
                        <label for="id_bel_score_ct"
                          >Количество баллов по сертификату</label
                        >
                        <input
                          id="id_bel_score_ct"
                          name="bel_score_ct"
                          type="number"
                          class="form-control text-center"
                          v-model="currentStudentData.bel_score_ct"
                          @input="makeInputDefaultNullValueIfEmpty"
                        />
                      </td>
                      <td class="text-center table-warning">
                        <label for="id_social_science_ct"
                          >Количество баллов по сертификату</label
                        >
                        <input
                          id="id_social_science_ct"
                          name="social_science_score_ct"
                          type="number"
                          class="form-control text-center"
                          v-model="currentStudentData.social_science_score_ct"
                          @input="makeInputDefaultNullValueIfEmpty"
                        />
                      </td>
                      <td class="text-center table-success">
                        <label for="id_foreign_lang_ct"
                          >Количество баллов по сертификату</label
                        >
                        <input
                          id="id_foreign_lang_ct"
                          name="foreign_lang_score_ct"
                          type="number"
                          class="form-control text-center"
                          v-model="currentStudentData.foreign_lang_score_ct"
                          @input="makeInputDefaultNullValueIfEmpty"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td class="text-center table-primary">
                        <select
                          class="form-select"
                          v-model="currentStudentData.rus_ct_choice"
                        >
                          <option selected class="text-center" value="">
                            ----------
                          </option>
                          <option value="2024 ЦЭ" class="text-center">
                            2024 ЦЭ
                          </option>
                          <option value="2024 ЦТ" class="text-center">
                            2024 ЦТ
                          </option>
                          <option value="2025 ЦЭ" class="text-center">
                            2025 ЦЭ
                          </option>
                          <option value="2025 ЦТ" class="text-center">
                            2025 ЦТ
                          </option>
                        </select>
                      </td>
                      <td class="text-center table-primary">
                        <select
                          class="form-select"
                          v-model="currentStudentData.bel_ct_choice"
                        >
                          <option selected class="text-center" value="">
                            ----------
                          </option>
                          <option value="2024 ЦЭ" class="text-center">
                            2024 ЦЭ
                          </option>
                          <option value="2024 ЦТ" class="text-center">
                            2024 ЦТ
                          </option>
                          <option value="2025 ЦЭ" class="text-center">
                            2025 ЦЭ
                          </option>
                          <option value="2025 ЦТ" class="text-center">
                            2025 ЦТ
                          </option>
                        </select>
                      </td>
                      <td class="text-center table-warning">
                        <select
                          class="form-select"
                          v-model="currentStudentData.social_science_ct_choice"
                        >
                          <option selected class="text-center" value="">
                            ----------
                          </option>
                          <option value="2024 ЦЭ" class="text-center">
                            2024 ЦЭ
                          </option>
                          <option value="2024 ЦТ" class="text-center">
                            2024 ЦТ
                          </option>
                          <option value="2025 ЦЭ" class="text-center">
                            2025 ЦЭ
                          </option>
                          <option value="2025 ЦТ" class="text-center">
                            2025 ЦТ
                          </option>
                        </select>
                      </td>
                      <td class="text-center table-success">
                        <select
                          class="form-select"
                          v-model="currentStudentData.foreign_lang_ct_choice"
                        >
                          <option selected class="text-center" value="">
                            ----------
                          </option>
                          <option value="2024 ЦЭ" class="text-center">
                            2024 ЦЭ
                          </option>
                          <option value="2024 ЦТ" class="text-center">
                            2024 ЦТ
                          </option>
                          <option value="2025 ЦЭ" class="text-center">
                            2025 ЦЭ
                          </option>
                          <option value="2025 ЦТ" class="text-center">
                            2025 ЦТ
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

                <div
                  class="d-flex flex-row justify-content-between align-items-end"
                >
                  <p class="fw-bold">Аттестат, 10 / 10 /100</p>
                </div>

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
                          v-model="currentStudentData.rus_score_cert"
                          @input="makeInputDefaultNullValueIfEmpty"
                        />
                      </td>
                      <td class="text-center table-primary">
                        <input
                          name="bel_score_cert"
                          type="number"
                          class="form-control text-center"
                          v-model="currentStudentData.bel_score_cert"
                          @input="makeInputDefaultNullValueIfEmpty"
                        />
                      </td>
                      <td class="text-center table-warning">
                        <input
                          name="social_science_score_cert"
                          type="number"
                          class="form-control text-center"
                          v-model="currentStudentData.social_science_score_cert"
                          @input="makeInputDefaultNullValueIfEmpty"
                        />
                      </td>
                      <td class="text-center table-success">
                        <input
                          name="foreign_lang_score_cert"
                          type="number"
                          class="form-control text-center"
                          v-model="currentStudentData.foreign_lang_score_cert"
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
                        <div class="d-flex flex-row">
                          <button
                            class="btn btn-warning me-2 text-nowrap"
                            @click="showAverageScoreCalculatingModal"
                          >
                            <font-awesome-icon
                              :icon="['fas', 'calculator']"
                            />&nbsp;Рассчитать
                          </button>
                          <input
                            type="number"
                            name="education_average_score"
                            class="form-control text-center"
                            v-model="currentStudentData.education_average_score"
                            @input="makeInputDefaultNullValueIfEmpty"
                          />
                        </div>
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

                <div class="my-3"></div>
              </div>
            </div>

            <div class="col-xxl-6"></div>
          </div>

          <div class="border-bottom border-4 my-3"></div>

          <div>
            <button class="btn btn-secondary my-3 me-3" @click="printTitlePage">
              <font-awesome-icon :icon="['fas', 'print']" />&nbsp;&nbsp;
              <template v-if="isTitlePagePrinting"
                >Формирование титульного листа ...
              </template>
              <template v-else>Напечатать титульный лист</template>
            </button>

            <!--            <button-->
            <!--              v-if="currentStudentData.application_has_been_printed"-->
            <!--              class="btn btn-primary my-3 me-3"-->
            <!--              disabled-->
            <!--            >-->
            <!--              <font-awesome-icon :icon="['fas', 'print']" />&nbsp;&nbsp;-->
            <!--              Заявление напечатано-->
            <!--            </button>-->
            <button class="btn btn-primary my-3 me-3" @click="printApplication">
              <font-awesome-icon :icon="['fas', 'print']" />&nbsp;&nbsp;
              <template v-if="isPrintingApplication"
                >Формирование заявления ...
              </template>
              <template v-else>Напечатать заявление</template>
            </button>

            <!--            <div class="form-check my-3" v-if="currentUser.is_superuser">-->
            <!--              <input-->
            <!--                id="id_application_has_been_printed"-->
            <!--                class="form-check-input"-->
            <!--                type="checkbox"-->
            <!--                v-model="currentStudentData.application_has_been_printed"-->
            <!--              />-->
            <!--              <label-->
            <!--                class="form-check-label"-->
            <!--                for="id_application_has_been_printed"-->
            <!--              >-->
            <!--                Заявление напечатано-->
            <!--              </label>-->
            <!--            </div>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavigationLayout from "@/components/layouts/NavigationLayout.vue"
import { globalStudentAPIForEntranceInstance } from "@/api/student/studentAPI"
import getActionHistoryAPIInstance from "@/api/cadet/actionHistoryAPI"
import { isEqual } from "lodash"
import { mapGetters } from "vuex"
import useVuelidate from "@vuelidate/core"
import {
  helpers,
  maxValue,
  minValue,
  required,
  requiredIf,
} from "@vuelidate/validators"

export default {
  name: "EntranceStudentInputForm",
  components: { NavigationLayout },
  data() {
    return {
      isLoading: true,
      isDataSaving: false,
      isPrintingApplication: false,
      isTitlePagePrinting: false,
      isError: false,
      currentStudentData: {
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
        academy_end_date: "",
        academy_end_order: "",
        academy_start_date: "",
        academy_start_order: "",
        admission_order_date: "",
        aims_to_graduate_with_honors: "",
        aims_to_graduate_with_honors_extra_data: "",
        application_has_been_printed: "",
        application_has_been_printed_date: "",
        attached_documents: "",
        bel_ct_choice: "",
        bel_score_cert: "",
        bel_score_ct: "",
        class_other_extra_data: "",
        class_pn_extra_data: "",
        class_vpn_extra_data: "",
        contract_number: "",
        department: "",
        document_type: "",
        education_average_score: "",
        education_average_score_calculation: "",
        education_form: "",
        education_graduated: "",
        education_graduating_end_year: "",
        education_graduating_start_year: "",
        education_kind: "",
        education_level: "",
        education_location_kind: "",
        education_tab_extra_data: "",
        entrance_year: "",
        expulsion_order_date: "",
        extra_data: "",
        father_address_residence: "",
        father_date_of_birth: "",
        father_first_name: "",
        father_is_employee: "",
        father_last_name: "",
        father_patronymic: "",
        father_phone_number: "",
        father_place_of_work: "",
        foreign_lang_ct_choice: "",
        foreign_lang_ct_number: "",
        foreign_lang_score_cert: "",
        foreign_lang_score_ct: "",
        foreign_language_was: "",
        foreign_language_will_be: "",
        from_large_family_extra_data: "",
        from_low_income_families_extra_data: "",
        from_single_parent_family: "",
        from_single_parent_family_extra_data: "",
        graduation_extra_data: "",
        graduation_reason: "",
        graduation_reason_article: "",
        group: "",
        has_achievements_in_sports: "",
        has_achievements_in_sports_extra_data: "",
        has_intellectual_and_scientific_research_events: "",
        has_intellectual_and_scientific_research_events_extra_data: "",
        has_other_cultural_and_mass_hobbies: "",
        has_other_cultural_and_mass_hobbies_extra_data: "",
        has_own_family: "",
        has_own_family_extra_data: "",
        is_disabled: "",
        is_disabled_extra_data: "",
        has_passion_for_choreography: "",
        has_passion_for_choreography_extra_data: "",
        has_passion_for_kvn: "",
        has_passion_for_kvn_extra_data: "",
        has_passion_for_vocals: "",
        has_passion_for_vocals_extra_data: "",
        have_dependent_children_parents: "",
        have_dependent_children_parents_extra_data: "",
        health_group: "",
        is_brsm_member: "",
        is_brsm_member_extra_data: "",
        is_children_left_without_parental_care: "",
        is_children_left_without_parental_care_extra_data: "",
        is_class_other: "",
        is_class_pn: "",
        is_class_vpn: "",
        is_from_large_family: "",
        is_from_low_income_families: "",
        is_located_in_Minsk: "",
        is_member_of_other_public_organizations: "",
        is_member_of_other_public_organizations_extra_data: "",
        is_olympiad_winner: "",
        is_orphan: "",
        is_orphan_extra_data: "",
        medal: "",
        mother_address_residence: "",
        mother_date_of_birth: "",
        mother_first_name: "",
        mother_is_employee: "",
        mother_last_name: "",
        mother_patronymic: "",
        mother_phone_number: "",
        mother_place_of_work: "",
        olympiad_winner_extra_data: "",
        parents_tab_extra_data: "",
        personal_information_tab_extra_data: "",
        place_of_work: "",
        position: "",
        ppfl_test: "",
        privilege_1: "",
        questionary_tab_extra_data: "",
        rank: "",
        reinstatement_date: "",
        reinstatement_order: "",
        residence_location_kind: "",
        residence_region: "",
        rus_bel_ct_number: "",
        rus_ct_choice: "",
        rus_score_cert: "",
        rus_score_ct: "",
        social_science_ct_choice: "",
        social_science_ct_number: "",
        social_science_score_cert: "",
        social_science_score_ct: "",
        social_status: "",
        speciality: "",
        speciality_1: "",
        specialization: "",
        student_record_book_number: "",
        vacation_date: "",
        vacation_order: "",
        victims_of_the_Chernobyl_disaster: "",
        victims_of_the_Chernobyl_disaster_extra_data: "",
        year: "",
        year_litera: "",
      },
      applicationPrintData: {},
      currentStudentDataFromServer: {},
      studentAPIInstance: globalStudentAPIForEntranceInstance,
      actionHistoryAPIInstance: getActionHistoryAPIInstance(),
      BACKEND_PROTOCOL: import.meta.env.VITE_APP_BACKEND_PROTOCOL,
      BACKEND_HOST: import.meta.env.VITE_APP_BACKEND_HOST,
      BACKEND_PORT: import.meta.env.VITE_APP_BACKEND_PORT,
      studentHistoryList: { count: 0, results: [], previous: null, next: null },
      average_score_calculation: {
        choice: "",
        cert_average_score_5_10_system: 10,
        dipl_average_score_5_10_system: 10,
        certificate: [{ selectIndex: 0, selectValue: 0 }],
        diploma: [{ selectIndex: 0, selectValue: 0 }],
      },
    }
  },
  setup() {
    return { v$: useVuelidate() }
  },
  validations() {
    const education_graduating_end_year_minValueValue = minValue(1940)
    const education_graduating_end_year_maxValueValue = maxValue(2025)
    const ct_maxValueValue = maxValue(100)
    const ct_minValueValue = minValue(1)
    const cert_maxValueValue = maxValue(10)
    const cert_minValueValue = minValue(1)
    return {
      currentStudentData: {
        last_name_rus: {
          required: helpers.withMessage(
            "Поле 'Фамилия' не может быть пустым",
            required,
          ),
          $autoDirty: true,
        },
        date_of_birth: {
          required: helpers.withMessage(
            "Поле 'Дата рождения' не может быть пустым",
            required,
          ),
          $autoDirty: true,
        },
        education_graduating_end_year: {
          education_graduating_end_year_maxValueValue: helpers.withMessage(
            "Некорректное значение поля 'Год окончания школы' - не может превышать 2025",
            education_graduating_end_year_maxValueValue,
          ),
          education_graduating_end_year_minValueValue: helpers.withMessage(
            "Некорректное значение поля 'Год окончания школы'",
            education_graduating_end_year_minValueValue,
          ),
          $autoDirty: true,
        },
        rus_score_ct: {
          ct_maxValueValue: helpers.withMessage(
            "Значение поля 'Русский язык - колличество баллов по сертификату' не может превышать 100",
            ct_maxValueValue,
          ),
          ct_minValueValue: helpers.withMessage(
            "Значение поля 'Русский язык - колличество баллов по сертификату' не может быть меньше 1",
            ct_minValueValue,
          ),
          $autoDirty: true,
        },
        bel_score_ct: {
          ct_maxValueValue: helpers.withMessage(
            "Значение поля 'Белорусский язык - колличество баллов по сертификату' не может превышать 100",
            ct_maxValueValue,
          ),
          ct_minValueValue: helpers.withMessage(
            "Значение поля 'Белорусский язык - колличество баллов по сертификату' не может быть меньше 1",
            ct_minValueValue,
          ),
          $autoDirty: true,
        },
        social_science_score_ct: {
          ct_maxValueValue: helpers.withMessage(
            "Значение поля 'Обществоведение - колличество баллов по сертификату' не может превышать 100",
            ct_maxValueValue,
          ),
          ct_minValueValue: helpers.withMessage(
            "Значение поля 'Обществоведение - колличество баллов по сертификату' не может быть меньше 1",
            ct_minValueValue,
          ),
          $autoDirty: true,
        },
        foreign_lang_score_ct: {
          ct_maxValueValue: helpers.withMessage(
            "Значение поля 'Иностранный язык - колличество баллов по сертификату' не может превышать 100",
            ct_maxValueValue,
          ),
          ct_minValueValue: helpers.withMessage(
            "Значение поля 'Иностранный язык - колличество баллов по сертификату' не может быть меньше 1",
            ct_minValueValue,
          ),
          $autoDirty: true,
        },
        rus_score_cert: {
          cert_maxValueValue: helpers.withMessage(
            "Значение поля 'Русский язык - колличество баллов в аттестате' не может превышать 10",
            cert_maxValueValue,
          ),
          cert_minValueValue: helpers.withMessage(
            "Значение поля 'Русский язык - колличество баллов в аттестате' не может быть меньше 1",
            cert_minValueValue,
          ),
          $autoDirty: true,
        },
        bel_score_cert: {
          cert_maxValueValue: helpers.withMessage(
            "Значение поля 'Белорусский язык - колличество баллов в аттестате' не может превышать 10",
            cert_maxValueValue,
          ),
          cert_minValueValue: helpers.withMessage(
            "Значение поля 'Белорусский язык - колличество баллов в аттестате' не может быть меньше 1",
            cert_minValueValue,
          ),
          $autoDirty: true,
        },
        social_science_score_cert: {
          cert_maxValueValue: helpers.withMessage(
            "Значение поля 'Обществоведение - колличество баллов в аттестате' не может превышать 10",
            cert_maxValueValue,
          ),
          cert_minValueValue: helpers.withMessage(
            "Значение поля 'Обществоведение - колличество баллов в аттестате' не может быть меньше 1",
            cert_minValueValue,
          ),
          $autoDirty: true,
        },
        foreign_lang_score_cert: {
          cert_maxValueValue: helpers.withMessage(
            "Значение поля 'Иностранный язык - колличество баллов в аттестате' не может превышать 10",
            cert_maxValueValue,
          ),
          cert_minValueValue: helpers.withMessage(
            "Значение поля 'Иностранный язык - колличество баллов в аттестате' не может быть меньше 1",
            cert_minValueValue,
          ),
          $autoDirty: true,
        },
      },
      applicationPrintData: {
        last_name_rus: {
          required: helpers.withMessage(
            "Поле 'Фамилия' не может быть пустым",
            required,
          ),
          $autoDirty: true,
        },
        first_name_rus: {
          required: helpers.withMessage(
            "Поле 'Имя' не может быть пустым",
            required,
          ),
          $autoDirty: true,
        },
        patronymic_rus: {
          required: helpers.withMessage(
            "Поле 'Отчество' не может быть пустым",
            required,
          ),
          $autoDirty: true,
        },
        address_residence: {
          required: helpers.withMessage(
            "Поле 'Проживает по адресу' не может быть пустым",
            required,
          ),
          $autoDirty: true,
        },
        education_graduating_end_year: {
          required: helpers.withMessage(
            "Поле 'Год окончания учреждения образования' не может быть пустым",
            required,
          ),
          $autoDirty: true,
        },
        education_graduated: {
          required: helpers.withMessage(
            "Поле 'Учреждение образования' не может быть пустым",
            required,
          ),
          $autoDirty: true,
        },
        foreign_language_was: {
          required: helpers.withMessage(
            "Поле 'Иностранный язык, который изучал' не может быть пустым",
            required,
          ),
          $autoDirty: true,
        },
        foreign_language_will_be: {
          required: helpers.withMessage(
            "Поле 'Иностранный язык, который будет изучать' не может быть пустым",
            required,
          ),
          $autoDirty: true,
        },
        date_of_birth: {
          required: helpers.withMessage(
            "Поле 'Дата рождения' не может быть пустым",
            required,
          ),
          $autoDirty: true,
        },
        phone_number: {
          required: helpers.withMessage(
            "Поле 'Номер телефона' не может быть пустым",
            required,
          ),
          $autoDirty: true,
        },
        passport_document_type: {
          required: helpers.withMessage(
            "Поле 'Вид документа удостоверяющего личность' не может быть пустым",
            required,
          ),
          $autoDirty: true,
        },
        passport_issue_date: {
          required: helpers.withMessage(
            "Поле 'Дата выдачи пасспорта' не может быть пустым",
            required,
          ),
          $autoDirty: true,
        },
        passport_issue_authority_text: {
          required: helpers.withMessage(
            "Поле 'Орган выдачи пасспорта' не может быть пустым",
            required,
          ),
          $autoDirty: true,
        },
        identification_number: {
          required: helpers.withMessage(
            "Поле 'Идентификационный номер' не может быть пустым",
            required,
          ),
          $autoDirty: true,
        },
        rus_bel_ct_number: {
          required: helpers.withMessage(
            "Поле 'Русский / белорусский язык - номер сертификата' не может быть пустым",
            required,
          ),
          $autoDirty: true,
        },
        social_science_ct_number: {
          required: helpers.withMessage(
            "Поле 'Обществоведение - номер сертификата' не может быть пустым",
            required,
          ),
          $autoDirty: true,
        },
        foreign_lang_ct_number: {
          required: helpers.withMessage(
            "Поле 'Иностранный язык - номер сертификата' не может быть пустым",
            required,
          ),
          $autoDirty: true,
        },

        rus_score_ct: {
          required: helpers.withMessage(
            "Поле 'Русский язык - количество баллов по сертификату' не может быть пустым",
            requiredIf(() => !this.applicationPrintData.bel_score_ct),
          ),
          $autoDirty: true,
        },
        bel_score_ct: {
          required: helpers.withMessage(
            "Поле 'Белорусский язык - количество баллов по сертификату' не может быть пустым",
            requiredIf(() => !this.applicationPrintData.rus_score_ct),
          ),
          $autoDirty: true,
        },
        social_science_score_ct: {
          required: helpers.withMessage(
            "Поле 'Обществоведение - количество баллов по сертификату' не может быть пустым",
            required,
          ),
          $autoDirty: true,
        },
        foreign_lang_score_ct: {
          required: helpers.withMessage(
            "Поле 'Иностранный язык - количество баллов по сертификату' не может быть пустым",
            required,
          ),
          $autoDirty: true,
        },
        rus_score_cert: {
          required: helpers.withMessage(
            "Поле 'Русский язык - количество баллов в аттестате' не может быть пустым",
            required,
          ),
          $autoDirty: true,
        },
        bel_score_cert: {
          required: helpers.withMessage(
            "Поле 'Белорусский язык - количество баллов в аттестате' не может быть пустым",
            required,
          ),
          $autoDirty: true,
        },
        social_science_score_cert: {
          required: helpers.withMessage(
            "Поле 'Обществоведение - количество баллов в аттестате' не может быть пустым",
            required,
          ),
          $autoDirty: true,
        },
        foreign_lang_score_cert: {
          required: helpers.withMessage(
            "Поле 'Иностранный язык - количество баллов в аттестате' не может быть пустым",
            required,
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
        const response = await this.studentAPIInstance.getItemData(applicantId)
        this.currentStudentData = response.data
        if (this.currentStudentData.education_average_score_calculation) {
          this.average_score_calculation = JSON.parse(
            this.currentStudentData.education_average_score_calculation,
          )
        }
        this.currentStudentDataFromServer = Object.assign(
          {},
          this.currentStudentData,
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

      const response = await this.studentAPIInstance.updatePhotoOrAnyFile(
        this.currentStudentData.id,
        formData,
      )

      this.currentStudentData = {
        ...this.currentStudentData,
        attached_documents: response.data.attached_documents,
      }
    },
    async deleteDocument() {
      const response = await this.studentAPIInstance.updatePhotoOrAnyFile(
        this.currentStudentData.id,
        { attached_documents: null },
      )

      this.currentStudentData = {
        ...this.currentStudentData,
        attached_documents: response.data.attached_documents,
      }
    },

    async saveEntranceForm() {
      if (this.v$.currentStudentData.$invalid) {
        let validationErrorsModal = this.$refs.validationErrorsModal
        let myModal = new bootstrap.Modal(validationErrorsModal, {
          keyboard: false,
        })
        myModal.show()
      } else {
        this.isDataSaving = true
        try {
          const { photo, attached_documents, sign_image, ...rest } =
            this.currentStudentData
          const updatedData = await this.studentAPIInstance.updateItem({
            ...rest,
            score_sum: this.get_score_sum,
          })
          this.currentStudentData = updatedData.data
          this.currentStudentDataFromServer = Object.assign(
            {},
            this.currentStudentData,
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
        this.actionHistoryAPIInstance.searchObj.model_name =
          "StudentInheritance"
        this.actionHistoryAPIInstance.searchObj.record_id =
          this.currentStudentData.id
        this.actionHistoryAPIInstance.searchObj.limit = 100000
        const response = await this.actionHistoryAPIInstance.getItemsList()
        this.studentHistoryList = response.data
        let historyModal = this.$refs.studentHistoryModal
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
        this.currentStudentData[event.target.name] = null
      }
    },
    removeFileFieldsFromObj(obj) {
      const { photo, attached_documents, sign_image, ...rest } = obj
      return rest
    },

    async printApplication() {
      if (!this.isDataFromServerEqualChangedData) {
        let hasToSaveDataModal = this.$refs.hasToSaveDataModal
        let myModal = new bootstrap.Modal(hasToSaveDataModal, {
          keyboard: false,
        })
        myModal.show()
        return
      }
      if (this.v$.applicationPrintData.$invalid) {
        let applicationValidationErrorsModal =
          this.$refs.application_validationErrorsModal
        let myModal = new bootstrap.Modal(applicationValidationErrorsModal, {
          keyboard: false,
        })
        myModal.show()
        return
      } else {
        this.isPrintingApplication = true
        await this.makePrinting()
        this.isPrintingApplication = false
      }
    },

    async printTitlePage() {
      if (!this.isDataFromServerEqualChangedData) {
        let hasToSaveDataModal = this.$refs.hasToSaveDataModal
        let myModal = new bootstrap.Modal(hasToSaveDataModal, {
          keyboard: false,
        })
        myModal.show()
        return
      } else {
        this.isTitlePagePrinting = true
        await this.makeTitlePagePrinting()
        this.isTitlePagePrinting = false
      }
    },

    async makePrinting() {
      let dataObj = {
        id: this.currentStudentData.id,
        application_has_been_printed: true,
      }
      if (!this.currentStudentData.application_has_been_printed_date) {
        dataObj = {
          ...dataObj,
          application_has_been_printed_date: new Date().toISOString(),
        }
      }
      const resp = await this.studentAPIInstance.updateItemPartly(dataObj)
      this.currentStudentData = { ...this.currentStudentData, ...resp.data }
      this.currentStudentDataFromServer = Object.assign(
        {},
        this.currentStudentData,
      )

      this.studentAPIInstance
        .entrance_application_print(this.currentStudentData.id)
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement("a")
          link.href = url
          link.setAttribute(
            "download",
            `${this.currentStudentData.last_name_rus}.docx`,
          )
          document.body.appendChild(link)
          link.click()
        })
      this.$refs.applicationValidationErrorsModalCloseButton.click()
    },

    async makeTitlePagePrinting() {
      this.studentAPIInstance
        .title_page_print(this.currentStudentData.id)
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement("a")
          link.href = url
          link.setAttribute(
            "download",
            `${this.currentStudentData.last_name_rus}.docx`,
          )
          document.body.appendChild(link)
          link.click()
        })
    },

    averageScoreCertificateSelectChange(e) {
      const lastIndex =
        this.average_score_calculation.certificate[
          this.average_score_calculation.certificate.length - 1
        ].selectIndex
      if (parseInt(e.target.name) === lastIndex) {
        this.average_score_calculation.certificate.push({
          selectIndex: lastIndex + 1,
          selectValue: 0,
        })
      }
    },

    averageScoreDiplomaSelectChange(e) {
      const lastIndex =
        this.average_score_calculation.diploma[
          this.average_score_calculation.diploma.length - 1
        ].selectIndex
      if (parseInt(e.target.name) === lastIndex) {
        this.average_score_calculation.diploma.push({
          selectIndex: lastIndex + 1,
          selectValue: 0,
        })
      }
    },

    getAverageScoreCount() {
      return (
        this.average_score_calculation.certificate.filter(
          (item) => item.selectValue !== 0 && item.selectValue !== "",
        ).length +
        this.average_score_calculation.diploma.filter(
          (item) => item.selectValue !== 0 && item.selectValue !== "",
        ).length
      )
    },

    average_score_calculation_select_change() {
      this.average_score_calculation.certificate = [
        { selectIndex: 0, selectValue: 0 },
      ]
      this.average_score_calculation.diploma = [
        { selectIndex: 0, selectValue: 0 },
      ]
    },

    showAverageScoreCalculatingModal() {
      let validationErrorsModal = this.$refs.averageScoreCalculatingModal
      let myModal = new bootstrap.Modal(validationErrorsModal, {
        keyboard: false,
      })
      myModal.show()
    },

    saveAverageScore() {
      this.currentStudentData.education_average_score_calculation =
        JSON.stringify(this.average_score_calculation)
      if (this.getAverageScore === 0) {
        this.currentStudentData.education_average_score = null
      } else
        this.currentStudentData.education_average_score = this.getAverageScore
      this.$refs.averageScoreCalculatingModalCloseButton.click()
    },
  },
  computed: {
    orderedSubdivisions() {
      return this.subdivisions.results.filter(
        (subdivision) => subdivision.subdivision_category == "1",
      )
    },
    orderedAdmissionQuotes_select_1() {
      return this.orderedAdmissionQuotes
    },
    orderedEducationForms() {
      return this.educationForms.results
    },

    orderedAdmissionQuotes() {
      return this.admissionQuota.results
        .filter((quota) => quota.ownership_category === "3")
        .sort((a, b) => {
          const admission_codeA = a.admission_code
          const admission_codeB = b.admission_code
          if (admission_codeA < admission_codeB) {
            return -1
          }
          if (admission_codeA > admission_codeB) {
            return 1
          }
          return 0
        })
    },

    orderedHealthGroups() {
      return this.healthGroups.results
        .filter((healthGroup) => healthGroup.ownership_category === "3")
        .sort((a, b) => {
          const healthGroupA = a.health_group.toUpperCase()
          const healthGroupB = b.health_group.toUpperCase()
          if (healthGroupA < healthGroupB) {
            return -1
          }
          if (healthGroupA > healthGroupB) {
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

    orderedPrivileges() {
      return this.privileges.results
    },
    orderedForeignLanguages() {
      return this.foreignLanguages.results
    },
    orderedPpflCategories() {
      return this.ppflCategories.results.filter(
        (ppfl) => ppfl.ownership_category === "3",
      )
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
    orderedDocumentTypes() {
      return this.documentTypes.results
    },

    isDataFromServerEqualChangedData() {
      return isEqual(
        this.removeFileFieldsFromObj(this.currentStudentData),
        this.removeFileFieldsFromObj(this.currentStudentDataFromServer),
      )
    },
    getARussianAndBelorussianSumScore() {
      let scoreSum = ""
      if (
        isFinite(this.currentStudentData.rus_score_cert) &&
        this.currentStudentData.rus_score_cert !== null &&
        isFinite(this.currentStudentData.bel_score_cert)
      ) {
        scoreSum =
          this.currentStudentData.rus_score_cert +
          this.currentStudentData.bel_score_cert
        return scoreSum
      }
      return scoreSum
    },
    get_score_sum() {
      let education_average_score = this.currentStudentData
        .education_average_score
        ? parseInt(this.currentStudentData.education_average_score)
        : 0
      let rus_score_ct = this.currentStudentData.rus_score_ct
        ? this.currentStudentData.rus_score_ct
        : 0
      let bel_score_ct = this.currentStudentData.bel_score_ct
        ? this.currentStudentData.bel_score_ct
        : 0
      let social_science_score_ct = this.currentStudentData
        .social_science_score_ct
        ? this.currentStudentData.social_science_score_ct
        : 0
      let foreign_lang_score_ct = this.currentStudentData.foreign_lang_score_ct
        ? this.currentStudentData.foreign_lang_score_ct
        : 0

      return (
        education_average_score +
        rus_score_ct +
        bel_score_ct +
        social_science_score_ct +
        foreign_lang_score_ct
      )
    },

    getAverageScore() {
      const score_system = {
        5: { 3: 4, 4: 7, 5: 10 },
        10: {
          3: 3,
          4: 4,
          5: 5,
          6: 6,
          7: 7,
          8: 8,
          9: 9,
          10: 10,
        },
      }

      let counter = 0
      this.average_score_calculation.certificate.forEach((item) => {
        if (item.selectValue !== 0 && item.selectValue !== "") {
          counter =
            counter +
            parseInt(
              score_system[
                this.average_score_calculation.cert_average_score_5_10_system
              ][item.selectValue],
            )
        }
      })
      this.average_score_calculation.diploma.forEach((item) => {
        if (item.selectValue !== 0 && item.selectValue !== "") {
          counter =
            counter +
            parseInt(
              score_system[
                this.average_score_calculation.dipl_average_score_5_10_system
              ][item.selectValue],
            )
        }
      })
      if (this.getAverageScoreCount() > 0) {
        return ((counter / this.getAverageScoreCount()) * 10).toFixed(0)
      } else return 0
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
      admissionQuota: "admissionQuota/getList",
      currentUser: "auth/getUser",
      documentTypes: "documentType/getList",
      healthGroups: "healthGroup/getList",
      educationForms: "educationForms/getList",
    }),
  },
  watch: {
    currentStudentData: {
      handler(newValue, oldValue) {
        this.applicationPrintData = Object.assign({}, this.currentStudentData)
      },
      deep: true,
    },
  },
}
</script>

<style scoped></style>
