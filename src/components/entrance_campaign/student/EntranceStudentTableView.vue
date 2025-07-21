<template>
  <div
    class="modal fade"
    id="exportDataModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    ref="exportDataModal"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" v-if="isExporting">
            Идет экспорт данных ...
          </h1>
          <h1 class="modal-title fs-5" v-else>Экспорт данных</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div>
            <div style="font-size: 1.7rem">
              <button
                class="btn btn-link text-primary"
                style="font-size: inherit"
                title="Экспорт в Word"
                @click="exportData('docx')"
                :disabled="isExporting"
              >
                <font-awesome-icon :icon="['far', 'file-word']" />
              </button>
              <button
                class="btn btn-link text-success"
                style="font-size: inherit; color: inherit"
                title="Экспорт в Excel"
                @click="exportData('xlsx')"
                :disabled="isExporting"
              >
                <font-awesome-icon :icon="['far', 'file-excel']" />
              </button>
            </div>
            <div>
              <div
                class="d-flex flex-row align-items-center justify-content-start my-2"
              >
                <button
                  class="btn text-primary me-2 p-0"
                  @click="checkAllFieldsForExport"
                >
                  <font-awesome-icon :icon="['fas', 'list-check']" />
                  Выбрать все поля
                </button>
                <button
                  class="btn text-primary m-0 p-0"
                  @click="clearAllFieldsForExport"
                >
                  Очистить
                  <font-awesome-icon :icon="['far', 'circle-xmark']" />
                </button>
              </div>
              <label class="form-label">Выбор полей для экспорта</label>

              <v-select
                v-model="selectedFieldsForDataExport"
                :options="fieldsForDataExport"
                label="fieldName"
                :reduce="(field) => field.fieldValue"
                multiple
                style="min-width: 400px"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container-fluid">
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
      <div class="my-3"></div>
      <ul class="nav nav-links my-3 mb-lg-2 mx-n3">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#"
            ><span>Всего </span
            ><span class="text-body-tertiary fw-semibold"
              >({{ studentList.count }})</span
            ></a
          >
        </li>
      </ul>

      <div
        class="d-flex flex-row align-items-center justify-content-between mb-4"
      >
        <div class="m-0 p-0"></div>
        <div class="d-flex flex-row">
          <button class="btn btn-secondary me-3" @click="showDocumentsModal">
            Выходные документы&nbsp;&nbsp;<font-awesome-icon
              :icon="['fas', 'print']"
            />
          </button>

          <button class="btn btn-secondary me-3" @click="showExportDataModal">
            Экспорт&nbsp;&nbsp;<font-awesome-icon
              :icon="['fas', 'file-export']"
            />
          </button>

          <button class="btn btn-primary" @click="clearFilter">
            Сбросить фильтр
          </button>
        </div>
      </div>
      <div
        class="d-flex flex-row align-items-center justify-content-between mb-4"
      >
        <div class="m-0 p-0"></div>
        <div
          style="
            min-height: calc(100vh - 270px);
            max-height: calc(100vh - 270px);
            overflow: auto;
          "
          ref="infinite_list"
          @scroll="handleScroll"
        >
          <table
            class="table table-hover table-responsive"
            style="overflow: auto"
          >
            <thead ref="thead">
              <tr>
                <th scope="col" class="text-center">№п.п.</th>
                <th scope="col" class="text-center">Форма обучения</th>
                <th scope="col">
                  <div class="d-flex flex-row align-items-center">
                    <nobr>Сумма балов</nobr>
                    <div class="dropdown">
                      <button
                        class="btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></button>
                      <ul class="dropdown-menu">
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('score_sum')"
                          >
                            меньш. -> больш.
                          </button>
                        </li>
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('-score_sum')"
                          >
                            больш. -> меньш.
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </th>
                <th scope="col">
                  <div class="d-flex flex-row align-items-center">
                    <span class="text-nowrap">Фамилия</span>
                    <div class="dropdown">
                      <button
                        class="btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></button>
                      <ul class="dropdown-menu">
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('last_name_rus')"
                          >
                            А -> Я
                          </button>
                        </li>
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('-last_name_rus')"
                          >
                            Я -> А
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </th>
                <th scope="col">
                  <div class="d-flex flex-row align-items-center">
                    <span class="text-nowrap">Имя</span>
                    <div class="dropdown">
                      <button
                        class="btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></button>
                      <ul class="dropdown-menu">
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('first_name_rus')"
                          >
                            А -> Я
                          </button>
                        </li>
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('-first_name_rus')"
                          >
                            Я -> А
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </th>
                <th scope="col">
                  <div class="d-flex flex-row align-items-center">
                    <span class="text-nowrap">Отчество</span>

                    <div class="dropdown">
                      <button
                        class="btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></button>
                      <ul class="dropdown-menu">
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('patronymic_rus')"
                          >
                            А -> Я
                          </button>
                        </li>
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('-patronymic_rus')"
                          >
                            Я -> А
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </th>

                <th scope="col">
                  <div class="d-flex flex-row align-items-center">
                    <span class="text-nowrap">Социальный статус</span>
                    <div class="dropdown">
                      <button
                        class="btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></button>
                      <ul class="dropdown-menu">
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('social_status__social_status')"
                          >
                            А -> Я
                          </button>
                        </li>
                        <li>
                          <button
                            class="dropdown-item"
                            @click="
                              setOrdering('-social_status__social_status')
                            "
                          >
                            Я -> А
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </th>
                <th scope="col">
                  <div class="d-flex flex-row align-items-center">
                    <span class="text-nowrap">Место работы и должность</span>
                    <div class="dropdown">
                      <button
                        class="btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></button>
                      <ul class="dropdown-menu">
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('place_of_work')"
                          >
                            А -> Я
                          </button>
                        </li>
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('-place_of_work')"
                          >
                            Я -> А
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </th>

                <th scope="col">
                  <div class="d-flex flex-row align-items-center">
                    <span class="text-nowrap">Возраст</span>
                  </div>
                </th>
                <th scope="col">
                  <div class="d-flex flex-row align-items-center">
                    <span class="text-nowrap">Заявление отпечатано</span>
                    <div class="dropdown">
                      <button
                        class="btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></button>
                      <ul class="dropdown-menu">
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('application_has_been_printed')"
                          >
                            А -> Я
                          </button>
                        </li>
                        <li>
                          <button
                            class="dropdown-item"
                            @click="
                              setOrdering('-application_has_been_printed')
                            "
                          >
                            Я -> А
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </th>
                <th scope="col">
                  <div class="d-flex flex-row align-items-center">
                    <span class="text-nowrap">Дата печати заявления</span>
                    <div class="dropdown">
                      <button
                        class="btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></button>
                      <ul class="dropdown-menu">
                        <li>
                          <button
                            class="dropdown-item"
                            @click="
                              setOrdering('application_has_been_printed_date')
                            "
                          >
                            А -> Я
                          </button>
                        </li>
                        <li>
                          <button
                            class="dropdown-item"
                            @click="
                              setOrdering('-application_has_been_printed_date')
                            "
                          >
                            Я -> А
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </th>
                <th scope="col">
                  <div class="d-flex flex-row align-items-center">
                    <span class="text-nowrap">Пол</span>
                    <div class="dropdown">
                      <button
                        class="btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></button>
                      <ul class="dropdown-menu">
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('gender')"
                          >
                            А -> Я
                          </button>
                        </li>
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('-gender')"
                          >
                            Я -> А
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </th>

                <th scope="col" style="min-width: 400px">
                  <div class="d-flex flex-row align-items-center">
                    <span class="text-nowrap">Область места проживания</span>
                    <div class="dropdown">
                      <button
                        class="btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></button>
                      <ul class="dropdown-menu">
                        <li>
                          <button
                            class="dropdown-item"
                            @click="
                              setOrdering('residence_region__country_region')
                            "
                          >
                            А -> Я
                          </button>
                        </li>
                        <li>
                          <button
                            class="dropdown-item"
                            @click="
                              setOrdering('-residence_region__country_region')
                            "
                          >
                            Я -> А
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </th>
                <th scope="col" style="min-width: 450px">
                  <div class="d-flex flex-row align-items-center">
                    <span class="text-nowrap">Льгота</span>
                    <div class="dropdown">
                      <button
                        class="btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></button>
                      <ul class="dropdown-menu">
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('privilege_1__privilege')"
                          >
                            А -> Я
                          </button>
                        </li>
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('-privilege_1__privilege')"
                          >
                            Я -> А
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </th>
                <th scope="col" style="min-width: 300px">
                  <div class="d-flex flex-row align-items-center">
                    <span class="text-nowrap">Образование</span>
                  </div>
                </th>
                <th scope="col">
                  <div class="d-flex flex-row align-items-center">
                    <span class="text-nowrap"
                      >Категория профессионального соответствия</span
                    >
                  </div>
                </th>
                <th scope="col">
                  <div class="d-flex flex-row align-items-center">
                    <span class="text-nowrap">Группа предназначения</span>
                  </div>
                </th>

                <!--              <th scope="col">-->
                <!--                <span class="text-nowrap">Место рождения</span>-->
                <!--              </th>-->
                <!--              <th scope="col">-->
                <!--                <span class="text-nowrap">Адрес регистрации</span>-->
                <!--              </th>-->
                <!--              <th scope="col">-->
                <!--                <span class="text-nowrap">Адрес места жительства</span>-->
                <!--              </th>-->
                <!--              <th scope="col">-->
                <!--                <span class="text-nowrap">Номер телефона</span>-->
                <!--              </th>-->
                <!--              <th scope="col">-->
                <!--                <span class="text-nowrap">Номер паспорта</span>-->
                <!--              </th>-->
                <!--              <th scope="col">-->
                <!--                <span class="text-nowrap">Паспорт (дата выдачи)</span>-->
                <!--              </th>-->
                <!--              <th scope="col">-->
                <!--                <span class="text-nowrap">Паспорт (срок действия)</span>-->
                <!--              </th>-->
                <!--              <th scope="col">-->
                <!--                <span class="text-nowrap">Паспорт (орган выдачи)</span>-->
                <!--              </th>-->
                <!--              <th scope="col">-->
                <!--                <span class="text-nowrap">Идентификационный номер</span>-->
                <!--              </th>-->
                <!--              <th scope="col">-->
                <!--                <span class="text-nowrap">Отец (фамилия)</span>-->
                <!--              </th>-->
                <!--              <th scope="col">-->
                <!--                <span class="text-nowrap">Отец (имя)</span>-->
                <!--              </th>-->
                <!--              <th scope="col">-->
                <!--                <span class="text-nowrap">Отец (отчество)</span>-->
                <!--              </th>-->
                <!--              <th scope="col">-->
                <!--                <span class="text-nowrap">Отец (дата рождекния)</span>-->
                <!--              </th>-->
                <!--              <th scope="col">-->
                <!--                <span class="text-nowrap">Отец (место работы)</span>-->
                <!--              </th>-->
                <!--              <th scope="col">-->
                <!--                <span class="text-nowrap">Отец (номер телефона)</span>-->
                <!--              </th>-->
                <!--              <th scope="col">-->
                <!--                <span class="text-nowrap">Мать (фамилия)</span>-->
                <!--              </th>-->
                <!--              <th scope="col">-->
                <!--                <span class="text-nowrap">Мать (имя)</span>-->
                <!--              </th>-->
                <!--              <th scope="col">-->
                <!--                <span class="text-nowrap">Мать (отчество)</span>-->
                <!--              </th>-->
                <!--              <th scope="col">-->
                <!--                <span class="text-nowrap">Мать (дата рождекния)</span>-->
                <!--              </th>-->
                <!--              <th scope="col">-->
                <!--                <span class="text-nowrap">Мать (место работы)</span>-->
                <!--              </th>-->
                <!--              <th scope="col">-->
                <!--                <span class="text-nowrap">Мать (номер телефона)</span>-->
                <!--              </th>-->
                <th scope="col">
                  <span class="text-nowrap"
                    >Иностранный язык (изучал в школе)</span
                  >
                </th>
                <th scope="col">
                  <span class="text-nowrap"
                    >Иностранный язык (будет изучать)</span
                  >
                </th>
                <th scope="col" class="text-center" style="min-width: 450px">
                  <div class="d-flex flex-row align-items-center">
                    <span class="text-nowrap">ВПК</span>
                    <div class="dropdown">
                      <button
                        class="btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></button>
                      <ul class="dropdown-menu">
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('vpk__category')"
                          >
                            А -> Я
                          </button>
                        </li>
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('-vpk__category')"
                          >
                            Я -> А
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </th>
                <th scope="col" class="text-center" style="min-width: 450px">
                  <div class="d-flex flex-row align-items-center">
                    <span class="text-nowrap">ВПК (данные)</span>
                    <div class="dropdown">
                      <button
                        class="btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></button>
                      <ul class="dropdown-menu">
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('vpk_data')"
                          >
                            А -> Я
                          </button>
                        </li>
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('-vpk_data')"
                          >
                            Я -> А
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </th>

                <th scope="col" class="text-center" style="min-width: 250px">
                  <div class="d-flex flex-row align-items-center">
                    <span class="text-nowrap">Образование (город/село)</span>
                    <div class="dropdown">
                      <button
                        class="btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></button>
                      <ul class="dropdown-menu">
                        <li>
                          <button
                            class="dropdown-item"
                            @click="
                              setOrdering(
                                'education_location_kind__education_location_kind',
                              )
                            "
                          >
                            А -> Я
                          </button>
                        </li>
                        <li>
                          <button
                            class="dropdown-item"
                            @click="
                              setOrdering(
                                '-education_location_kind__education_location_kind',
                              )
                            "
                          >
                            Я -> А
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </th>

                <th scope="col" class="text-center" style="min-width: 250px">
                  <div class="d-flex flex-row align-items-center">
                    <span class="text-nowrap">Уровень образования</span>
                    <div class="dropdown">
                      <button
                        class="btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></button>
                      <ul class="dropdown-menu">
                        <li>
                          <button
                            class="dropdown-item"
                            @click="
                              setOrdering('education_level__education_level')
                            "
                          >
                            А -> Я
                          </button>
                        </li>
                        <li>
                          <button
                            class="dropdown-item"
                            @click="
                              setOrdering('-education_level__education_level')
                            "
                          >
                            Я -> А
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </th>
                <th scope="col">
                  <div class="d-flex flex-row align-items-center">
                    <span class="text-nowrap">Год окончания</span>
                    <div class="dropdown">
                      <button
                        class="btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></button>
                      <ul class="dropdown-menu">
                        <li>
                          <button
                            class="dropdown-item"
                            @click="
                              setOrdering('education_graduating_end_year')
                            "
                          >
                            А -> Я
                          </button>
                        </li>
                        <li>
                          <button
                            class="dropdown-item"
                            @click="
                              setOrdering('-education_graduating_end_year')
                            "
                          >
                            Я -> А
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </th>
                <th scope="col" style="min-width: 350px">
                  <div class="d-flex flex-row align-items-center">
                    <span class="text-nowrap">Медаль</span>
                    <div class="dropdown">
                      <button
                        class="btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></button>
                      <ul class="dropdown-menu">
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('medal__medal_kind')"
                          >
                            А -> Я
                          </button>
                        </li>
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('-medal__medal_kind')"
                          >
                            Я -> А
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </th>

                <th scope="col">
                  <div class="d-flex flex-row align-items-center">
                    <span class="text-nowrap"
                      >Колличество баллов по русскому языку (сертификат)
                    </span>
                    <div class="dropdown">
                      <button
                        class="btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></button>
                      <ul class="dropdown-menu">
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('rus_score_ct')"
                          >
                            А -> Я
                          </button>
                        </li>
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('-rus_score_ct')"
                          >
                            Я -> А
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </th>
                <th scope="col">
                  <div class="d-flex flex-row align-items-center">
                    <span class="text-nowrap"
                      >Что сдавал по русскому языку
                    </span>
                    <div class="dropdown">
                      <button
                        class="btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></button>
                      <ul class="dropdown-menu">
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('rus_ct_choice')"
                          >
                            А -> Я
                          </button>
                        </li>
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('-rus_ct_choice')"
                          >
                            Я -> А
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </th>
                <th scope="col">
                  <div class="d-flex flex-row align-items-center">
                    <nobr
                      >Колличество баллов по белорусскому языку (сертификат)
                    </nobr>
                    <div class="dropdown">
                      <button
                        class="btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></button>
                      <ul class="dropdown-menu">
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('bel_score_ct')"
                          >
                            А -> Я
                          </button>
                        </li>
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('-bel_score_ct')"
                          >
                            Я -> А
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </th>
                <th scope="col">
                  <div class="d-flex flex-row align-items-center">
                    <span class="text-nowrap"
                      >Что сдавал по белорусскому языку
                    </span>
                    <div class="dropdown">
                      <button
                        class="btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></button>
                      <ul class="dropdown-menu">
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('bel_ct_choice')"
                          >
                            А -> Я
                          </button>
                        </li>
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('-bel_ct_choice')"
                          >
                            Я -> А
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </th>

                <th scope="col">
                  <div class="d-flex flex-row align-items-center">
                    <span class="text-nowrap"
                      >Колличество баллов по обществоведению (сертификат)
                    </span>
                    <div class="dropdown">
                      <button
                        class="btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></button>
                      <ul class="dropdown-menu">
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('social_science_score_ct')"
                          >
                            А -> Я
                          </button>
                        </li>
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('-social_science_score_ct')"
                          >
                            Я -> А
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </th>
                <th scope="col">
                  <div class="d-flex flex-row align-items-center">
                    <span class="text-nowrap"
                      >Что сдавал по обществоведению
                    </span>
                    <div class="dropdown">
                      <button
                        class="btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></button>
                      <ul class="dropdown-menu">
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('social_science_ct_choice')"
                          >
                            А -> Я
                          </button>
                        </li>
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('-social_science_ct_choice')"
                          >
                            Я -> А
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </th>
                <th scope="col">
                  <div class="d-flex flex-row align-items-center">
                    <nobr
                      >Колличество баллов по иностранному языку (сертификат)
                    </nobr>
                    <div class="dropdown">
                      <button
                        class="btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></button>
                      <ul class="dropdown-menu">
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('foreign_lang_score_ct')"
                          >
                            А -> Я
                          </button>
                        </li>
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('-foreign_lang_score_ct')"
                          >
                            Я -> А
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </th>
                <th scope="col">
                  <div class="d-flex flex-row align-items-center">
                    <span class="text-nowrap"
                      >Что сдавал по иностранному языку
                    </span>
                    <div class="dropdown">
                      <button
                        class="btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></button>
                      <ul class="dropdown-menu">
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('foreign_lang_ct_choice')"
                          >
                            А -> Я
                          </button>
                        </li>
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('-foreign_lang_ct_choice')"
                          >
                            Я -> А
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </th>
                <th scope="col">
                  <div class="d-flex flex-row align-items-center">
                    <span class="text-nowrap">Средний балл (аттестат) </span>
                    <div class="dropdown">
                      <button
                        class="btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></button>
                      <ul class="dropdown-menu">
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('education_average_score')"
                          >
                            А -> Я
                          </button>
                        </li>
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('-education_average_score')"
                          >
                            Я -> А
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </th>
                <th scope="col">
                  <div class="d-flex flex-row align-items-center">
                    <span class="text-nowrap">3 ЦТ</span>
                    <div class="dropdown">
                      <button
                        class="btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></button>
                      <ul class="dropdown-menu">
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('has_3_ct')"
                          >
                            А -> Я
                          </button>
                        </li>
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('-has_3_ct')"
                          >
                            Я -> А
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </th>
                <th scope="col">
                  <div class="d-flex flex-row align-items-center">
                    <span class="text-nowrap">2 ЦЭ</span>
                    <div class="dropdown">
                      <button
                        class="btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></button>
                      <ul class="dropdown-menu">
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('has_2_ce')"
                          >
                            А -> Я
                          </button>
                        </li>
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('-has_2_ce')"
                          >
                            Я -> А
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </th>
                <th scope="col">
                  <div class="d-flex flex-row align-items-center">
                    <span class="text-nowrap"
                      >Колличество баллов по русскому языку (аттестат)
                    </span>
                    <div class="dropdown">
                      <button
                        class="btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></button>
                      <ul class="dropdown-menu">
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('rus_score_cert')"
                          >
                            А -> Я
                          </button>
                        </li>
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('-rus_score_cert')"
                          >
                            Я -> А
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </th>
                <th scope="col">
                  <div class="d-flex flex-row align-items-center">
                    <span class="text-nowrap"
                      >Колличество баллов по белорусскому языку (аттестат)
                    </span>
                    <div class="dropdown">
                      <button
                        class="btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></button>
                      <ul class="dropdown-menu">
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('bel_score_cert')"
                          >
                            А -> Я
                          </button>
                        </li>
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('-bel_score_cert')"
                          >
                            Я -> А
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </th>
                <th scope="col">
                  <div class="d-flex flex-row align-items-center">
                    <span class="text-nowrap"
                      >Колличество баллов по обществоведению (аттестат)
                    </span>
                    <div class="dropdown">
                      <button
                        class="btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></button>
                      <ul class="dropdown-menu">
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('social_science_score_cert')"
                          >
                            А -> Я
                          </button>
                        </li>
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('-social_science_score_cert')"
                          >
                            Я -> А
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </th>

                <th scope="col">
                  <div class="d-flex flex-row align-items-center">
                    <span class="text-nowrap"
                      >Колличество баллов по иностранному языку (аттестат)
                    </span>
                    <div class="dropdown">
                      <button
                        class="btn dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></button>
                      <ul class="dropdown-menu">
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('foreign_lang_score_cert')"
                          >
                            А -> Я
                          </button>
                        </li>
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setOrdering('-foreign_lang_score_cert')"
                          >
                            Я -> А
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </th>
                <th scope="col" style="min-width: 450px">
                  <div class="d-flex flex-row align-items-center">
                    <span class="text-nowrap">Специальность</span>
                  </div>
                </th>
              </tr>

              <tr>
                <th></th>
                <th>
                  <select
                    class="form-select"
                    v-model="searchForm.education_form"
                    style="width: 200px"
                  >
                    <option selected value="">-------</option>
                    <option
                      :value="form.id"
                      :key="form.id"
                      v-for="form in orderedEducationForms"
                    >
                      {{ form.education_form }}
                    </option>
                  </select>
                </th>
                <th>
                  <div class="d-flex justify-content-center align-items-center">
                    <input
                      type="text"
                      class="form-control me-2"
                      v-model="searchForm.score_sum__gte"
                    />
                    <input
                      type="text"
                      class="form-control"
                      v-model="searchForm.score_sum__lte"
                    />
                  </div>
                </th>
                <th>
                  <input
                    type="text"
                    class="form-control"
                    v-model="searchForm.last_name_rus__icontains"
                    style="width: 150px"
                  />
                </th>
                <th>
                  <input
                    type="text"
                    class="form-control"
                    v-model="searchForm.first_name_rus__icontains"
                    style="width: 150px"
                  />
                </th>
                <th>
                  <input
                    type="text"
                    class="form-control"
                    v-model="searchForm.patronymic_rus__icontains"
                    style="width: 150px"
                  />
                </th>
                <th>
                  <v-select
                    v-model="searchForm.social_status__in"
                    :options="orderedSocialStatuses"
                    label="social_status"
                    :reduce="(social_status) => social_status.id"
                    multiple
                    style="width: 100%"
                  />
                </th>
                <th>
                  <input
                    type="text"
                    class="form-control"
                    v-model="searchForm.place_of_work__icontains"
                    style="width: 250px"
                  />
                </th>

                <th>
                  <div class="d-flex justify-content-center align-items-center">
                    <input
                      type="text"
                      class="form-control me-2"
                      v-model="searchForm.age_gte"
                      style="width: 70px"
                    />
                    <input
                      type="text"
                      class="form-control"
                      v-model="searchForm.age_lte"
                      style="width: 70px"
                    />
                  </div>
                </th>
                <th>
                  <select
                    class="form-select"
                    v-model="searchForm.application_has_been_printed"
                  >
                    <option selected value="">-------</option>
                    <option value="true" key="1">Да</option>
                    <option value="false" key="0">Нет</option>
                  </select>
                </th>
                <th>
                  <div class="d-flex justify-content-center align-items-center">
                    <input
                      type="date"
                      class="form-control me-2"
                      v-model="
                        searchForm.application_has_been_printed_date__gte
                      "
                    />
                    <input
                      type="date"
                      class="form-control"
                      v-model="
                        searchForm.application_has_been_printed_date__lte
                      "
                    />
                  </div>
                </th>
                <th>
                  <select class="form-select" v-model="searchForm.gender">
                    <option selected value="">-------</option>
                    <option value="1" key="1">Мужской</option>
                    <option value="0" key="0">Женский</option>
                  </select>
                </th>
                <th>
                  <v-select
                    v-model="searchForm.residence_region__in"
                    :options="orderedCountryRegions"
                    label="country_region"
                    :reduce="(region) => region.id"
                    multiple
                  />
                </th>
                <th>
                  <v-select
                    v-model="searchForm.privilege_1__in"
                    :options="orderedPrivileges"
                    label="privilege"
                    :reduce="(privilege) => privilege.id"
                    multiple
                  />
                </th>
                <th>
                  <v-select
                    v-model="searchForm.education_kind__in"
                    :options="orderedEducationKinds"
                    label="education"
                    :reduce="(education) => education.id"
                    multiple
                  />
                </th>
                <th>
                  <v-select
                    v-model="searchForm.ppfl_test__in"
                    :options="orderedPpflCategories"
                    label="category"
                    :reduce="(ppfl) => ppfl.id"
                    multiple
                  />
                </th>
                <th>
                  <select class="form-select" v-model="searchForm.health_group">
                    <option value="">-----</option>
                    <option
                      v-for="item in orderedHealthGroups"
                      :value="item.id"
                      :key="item.id"
                    >
                      {{ item.health_group }}
                    </option>
                  </select>
                </th>
                <!--              <th>-->
                <!--                <input-->
                <!--                  type="text"-->
                <!--                  class="form-control me-2"-->
                <!--                  v-model="searchForm.place_of_birth__icontains"-->
                <!--                />-->
                <!--              </th>-->
                <!--              <th>-->
                <!--                <input-->
                <!--                  type="text"-->
                <!--                  class="form-control me-2"-->
                <!--                  v-model="searchForm.address_registration__icontains"-->
                <!--                />-->
                <!--              </th>-->
                <!--              <th>-->
                <!--                <input-->
                <!--                  type="text"-->
                <!--                  class="form-control me-2"-->
                <!--                  v-model="searchForm.address_residence__icontains"-->
                <!--                />-->
                <!--              </th>-->
                <!--              <th>-->
                <!--                <input-->
                <!--                  type="text"-->
                <!--                  class="form-control me-2"-->
                <!--                  v-model="searchForm.phone_number__icontains"-->
                <!--                />-->
                <!--              </th>-->
                <!--              <th>-->
                <!--                <input-->
                <!--                  type="text"-->
                <!--                  class="form-control me-2"-->
                <!--                  v-model="searchForm.passport_number__icontains"-->
                <!--                />-->
                <!--              </th>-->
                <!--              <th>-->
                <!--                <div class="d-flex justify-content-center align-items-center">-->
                <!--                  <input-->
                <!--                    type="date"-->
                <!--                    class="form-control me-2"-->
                <!--                    v-model="searchForm.passport_issue_date__gte"-->
                <!--                  />-->
                <!--                  <input-->
                <!--                    type="date"-->
                <!--                    class="form-control"-->
                <!--                    v-model="searchForm.passport_issue_date__lte"-->
                <!--                  />-->
                <!--                </div>-->
                <!--              </th>-->
                <!--              <th>-->
                <!--                <div class="d-flex justify-content-center align-items-center">-->
                <!--                  <input-->
                <!--                    type="date"-->
                <!--                    class="form-control me-2"-->
                <!--                    v-model="searchForm.passport_validity_period__gte"-->
                <!--                  />-->
                <!--                  <input-->
                <!--                    type="date"-->
                <!--                    class="form-control"-->
                <!--                    v-model="searchForm.passport_validity_period__lte"-->
                <!--                  />-->
                <!--                </div>-->
                <!--              </th>-->
                <!--              <th>-->
                <!--                <v-select-->
                <!--                  v-model="searchForm.passport_issue_authority__in"-->
                <!--                  :options="orderedPassportIssueAuthorities"-->
                <!--                  label="passport_issue_authority"-->
                <!--                  :reduce="-->
                <!--                    (passport_issue_authority) => passport_issue_authority.id-->
                <!--                  "-->
                <!--                  multiple-->
                <!--                />-->
                <!--              </th>-->
                <!--              <th>-->
                <!--                <input-->
                <!--                  type="text"-->
                <!--                  class="form-control me-2"-->
                <!--                  v-model="searchForm.identification_number__icontains"-->
                <!--                />-->
                <!--              </th>-->
                <!--              <th></th>-->
                <!--              <th></th>-->
                <!--              <th></th>-->
                <!--              <th></th>-->
                <!--              <th></th>-->
                <!--              <th></th>-->
                <!--              <th></th>-->
                <!--              <th></th>-->
                <!--              <th></th>-->
                <!--              <th></th>-->
                <!--              <th></th>-->
                <!--              <th></th>-->
                <th>
                  <select
                    class="form-select"
                    v-model="searchForm.foreign_language_was"
                  >
                    <option selected value="">-------</option>
                    <option
                      v-for="foreignLanguage in orderedForeignLanguages"
                      :value="foreignLanguage.id"
                      :key="foreignLanguage.id"
                    >
                      {{ foreignLanguage.foreign_language }}
                    </option>
                  </select>
                </th>
                <th>
                  <select
                    class="form-select"
                    v-model="searchForm.foreign_language_will_be"
                  >
                    <option selected value="">-------</option>
                    <option
                      v-for="foreignLanguage in orderedForeignLanguages"
                      :value="foreignLanguage.id"
                      :key="foreignLanguage.id"
                    >
                      {{ foreignLanguage.foreign_language }}
                    </option>
                  </select>
                </th>
                <th>
                  <v-select
                    v-model="searchForm.vpk__in"
                    :options="orderedVpkCategories"
                    label="category"
                    :reduce="(vpk) => vpk.id"
                    multiple
                  />
                </th>
                <th>
                  <div class="d-flex justify-content-center align-items-center">
                    <input
                      type="text"
                      class="form-control me-2"
                      v-model="searchForm.vpk_data__icontains"
                    />
                  </div>
                </th>

                <th>
                  <v-select
                    v-model="searchForm.education_location_kind__in"
                    :options="orderedEducationLocalityKinds"
                    label="education_location_kind"
                    :reduce="
                      (educationLocalityKind) => educationLocalityKind.id
                    "
                    multiple
                  />
                </th>

                <th>
                  <v-select
                    v-model="searchForm.education_level__in"
                    :options="orderedEducationLevels"
                    label="education_level"
                    :reduce="(educationLevel) => educationLevel.id"
                    multiple
                  />
                </th>

                <th>
                  <input
                    type="number"
                    class="form-control me-2"
                    v-model="searchForm.education_graduating_end_year"
                  />
                </th>

                <th>
                  <v-select
                    v-model="searchForm.medal__in"
                    :options="orderedMedals"
                    label="medal_kind"
                    :reduce="(medal) => medal.id"
                    multiple
                  />
                </th>
                <th>
                  <div class="d-flex justify-content-center align-items-center">
                    <input
                      type="text"
                      class="form-control me-2"
                      v-model="searchForm.rus_score_ct__gte"
                    />
                    <input
                      type="text"
                      class="form-control"
                      v-model="searchForm.rus_score_ct__lte"
                    />
                  </div>
                </th>
                <th>
                  <select
                    class="form-select"
                    v-model="searchForm.rus_ct_choice"
                  >
                    <option selected value="">-------</option>
                    <option value="2024 ЦЭ" key="2024 ЦЭ">2024 ЦЭ</option>
                    <option value="2024 ЦТ" key="2024 ЦТ">2024 ЦТ</option>
                    <option value="2025 ЦЭ" key="2025 ЦЭ">2025 ЦЭ</option>
                    <option value="2025 ЦТ" key="2025 ЦТ">2025 ЦТ</option>
                  </select>
                </th>
                <th>
                  <div class="d-flex justify-content-center align-items-center">
                    <input
                      type="text"
                      class="form-control me-2"
                      v-model="searchForm.bel_score_ct__gte"
                    />
                    <input
                      type="text"
                      class="form-control"
                      v-model="searchForm.bel_score_ct__lte"
                    />
                  </div>
                </th>
                <th>
                  <select
                    class="form-select"
                    v-model="searchForm.bel_ct_choice"
                  >
                    <option selected value="">-------</option>
                    <option value="2024 ЦЭ" key="2024 ЦЭ">2024 ЦЭ</option>
                    <option value="2024 ЦТ" key="2024 ЦТ">2024 ЦТ</option>
                    <option value="2025 ЦЭ" key="2025 ЦЭ">2025 ЦЭ</option>
                    <option value="2025 ЦТ" key="2025 ЦТ">2025 ЦТ</option>
                  </select>
                </th>

                <th>
                  <div class="d-flex justify-content-center align-items-center">
                    <input
                      type="text"
                      class="form-control me-2"
                      v-model="searchForm.social_science_score_ct__gte"
                    />
                    <input
                      type="text"
                      class="form-control"
                      v-model="searchForm.social_science_score_ct__lte"
                    />
                  </div>
                </th>
                <th>
                  <select
                    class="form-select"
                    v-model="searchForm.social_science_ct_choice"
                  >
                    <option selected value="">-------</option>
                    <option value="2024 ЦЭ" key="2024 ЦЭ">2024 ЦЭ</option>
                    <option value="2024 ЦТ" key="2024 ЦТ">2024 ЦТ</option>
                    <option value="2025 ЦЭ" key="2025 ЦЭ">2025 ЦЭ</option>
                    <option value="2025 ЦТ" key="2025 ЦТ">2025 ЦТ</option>
                  </select>
                </th>
                <th>
                  <div class="d-flex justify-content-center align-items-center">
                    <input
                      type="text"
                      class="form-control me-2"
                      v-model="searchForm.foreign_lang_score_ct__gte"
                    />
                    <input
                      type="text"
                      class="form-control"
                      v-model="searchForm.foreign_lang_score_ct__lte"
                    />
                  </div>
                </th>
                <th>
                  <select
                    class="form-select"
                    v-model="searchForm.foreign_lang_ct_choice"
                  >
                    <option selected value="">-------</option>
                    <option value="2024 ЦЭ" key="2024 ЦЭ">2024 ЦЭ</option>
                    <option value="2024 ЦТ" key="2024 ЦТ">2024 ЦТ</option>
                    <option value="2025 ЦЭ" key="2025 ЦЭ">2025 ЦЭ</option>
                    <option value="2025 ЦТ" key="2025 ЦТ">2025 ЦТ</option>
                  </select>
                </th>
                <th>
                  <div class="d-flex justify-content-center align-items-center">
                    <input
                      type="text"
                      class="form-control me-2"
                      v-model="searchForm.education_average_score__gte"
                    />
                    <input
                      type="text"
                      class="form-control"
                      v-model="searchForm.education_average_score__lte"
                    />
                  </div>
                </th>
                <th>
                  <select class="form-select" v-model="searchForm.has_3_ct">
                    <option selected value="">-------</option>
                    <option value="true" key="1">Да</option>
                    <option value="false" key="0">Нет</option>
                  </select>
                </th>
                <th>
                  <select class="form-select" v-model="searchForm.has_2_ce">
                    <option selected value="">-------</option>
                    <option value="true" key="1">Да</option>
                    <option value="false" key="0">Нет</option>
                  </select>
                </th>
                <th>
                  <div class="d-flex justify-content-center align-items-center">
                    <input
                      type="text"
                      class="form-control me-2"
                      v-model="searchForm.rus_score_cert__gte"
                    />
                    <input
                      type="text"
                      class="form-control"
                      v-model="searchForm.rus_score_cert__lte"
                    />
                  </div>
                </th>
                <th>
                  <div class="d-flex justify-content-center align-items-center">
                    <input
                      type="text"
                      class="form-control me-2"
                      v-model="searchForm.bel_score_cert__gte"
                    />
                    <input
                      type="text"
                      class="form-control"
                      v-model="searchForm.bel_score_cert__lte"
                    />
                  </div>
                </th>
                <th>
                  <div class="d-flex justify-content-center align-items-center">
                    <input
                      type="text"
                      class="form-control me-2"
                      v-model="searchForm.social_science_score_cert__gte"
                    />
                    <input
                      type="text"
                      class="form-control"
                      v-model="searchForm.social_science_score_cert__lte"
                    />
                  </div>
                </th>
                <th>
                  <div class="d-flex justify-content-center align-items-center">
                    <input
                      type="text"
                      class="form-control me-2"
                      v-model="searchForm.foreign_lang_score_cert__gte"
                    />
                    <input
                      type="text"
                      class="form-control"
                      v-model="searchForm.foreign_lang_score_cert__lte"
                    />
                  </div>
                </th>
                <th>
                  <v-select
                    v-model="searchForm.speciality_1__in"
                    :options="orderedAdmissionQuotas"
                    label="quota_verbose_name"
                    :reduce="(quota) => quota.id"
                    multiple
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="student in orderedMainList"
                :key="student.id"
                @dblclick="
                  $router.push({
                    name: 'entrance-student-input-form',
                    params: { id: student.id },
                  })
                "
              >
                <td class="text-center">{{ student.serial_number }}</td>
                <td class="text-center">{{ student.get_education_form }}</td>
                <td class="text-center">{{ student.score_sum }}</td>
                <td>{{ student.last_name_rus }}</td>
                <td>{{ student.first_name_rus }}</td>
                <td>{{ student.patronymic_rus }}</td>

                <td class="text-center">{{ student.get_social_status }}</td>
                <td class="text-center">{{ student.place_of_work }}</td>
                <td class="text-center">{{ student.get_age }}</td>

                <td
                  v-if="student.application_has_been_printed"
                  class="text-center"
                >
                  <font-awesome-icon :icon="['fa', 'check']" />
                </td>
                <td v-else class="text-center"></td>

                <td
                  v-if="student.application_has_been_printed_date"
                  class="text-center"
                >
                  {{
                    new Date(
                      student.application_has_been_printed_date,
                    ).toLocaleString("ru-RU", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      second: "numeric",
                    })
                  }}
                </td>
                <td v-else></td>
                <td>{{ student.get_gender }}</td>
                <td class="text-center">
                  {{ student.get_residence_region }}
                </td>
                <template v-if="Object.keys(normalizedPrivilege).length === 0">
                  <td></td>
                </template>
                <template v-else>
                  <td v-if="student.privilege_1">
                    {{ normalizedPrivilege[student.privilege_1].privilege }}
                  </td>
                  <td v-else></td>
                </template>
                <template
                  v-if="Object.keys(normalizedEducationKinds).length === 0"
                >
                  <td></td>
                </template>
                <template v-else>
                  <td v-if="student.education_kind">
                    {{
                      normalizedEducationKinds[student.education_kind].education
                    }}
                  </td>
                  <td v-else></td>
                </template>
                <template
                  v-if="Object.keys(normalizedPpflCategories).length === 0"
                >
                  <td></td>
                </template>
                <template v-else>
                  <td v-if="student.ppfl_test">
                    {{ normalizedPpflCategories[student.ppfl_test].category }}
                  </td>
                  <td v-else></td>
                </template>
                <template
                  v-if="Object.keys(normalizedHealthGroups).length === 0"
                >
                  <td></td>
                </template>
                <template v-else>
                  <td v-if="student.health_group">
                    {{
                      normalizedHealthGroups[student.health_group].health_group
                    }}
                  </td>
                  <td v-else></td>
                </template>
                <!--              <td>{{ student.place_of_birth }}</td>-->
                <!--              <td>{{ student.address_registration }}</td>-->
                <!--              <td>{{ student.address_residence }}</td>-->
                <!--              <td>{{ student.phone_number }}</td>-->
                <!--              <td>{{ student.passport_number }}</td>-->
                <!--              <td class="text-center">{{ student.passport_issue_date }}</td>-->
                <!--              <td class="text-center">-->
                <!--                {{ student.passport_validity_period }}-->
                <!--              </td>-->
                <!--              <td>{{ student.passport_issue_authority }}</td>-->
                <!--              <td>{{ student.identification_number }}</td>-->
                <!--              <td>{{ student.father_last_name }}</td>-->
                <!--              <td>{{ student.father_first_name }}</td>-->
                <!--              <td>{{ student.father_patronymic }}</td>-->
                <!--              <td class="text-center">{{ student.father_date_of_birth }}</td>-->
                <!--              <td>{{ student.father_place_of_work }}</td>-->
                <!--              <td>{{ student.father_phone_number }}</td>-->
                <!--              <td>{{ student.mother_last_name }}</td>-->
                <!--              <td>{{ student.mother_first_name }}</td>-->
                <!--              <td>{{ student.mother_patronymic }}</td>-->
                <!--              <td class="text-center">{{ student.mother_date_of_birth }}</td>-->
                <!--              <td>{{ student.mother_place_of_work }}</td>-->
                <!--              <td>{{ student.mother_phone_number }}</td>-->
                <td>{{ student.get_foreign_language_was }}</td>
                <td>{{ student.get_foreign_language_will_be }}</td>
                <td class="text-center">{{ student.get_vpk }}</td>
                <td class="text-center">{{ student.vpk_data }}</td>
                <td class="text-center">
                  {{ student.get_education_location_kind }}
                </td>
                <td class="text-center">
                  {{ student.get_education_level }}
                </td>
                <td class="text-center">
                  {{ student.education_graduating_end_year }}
                </td>

                <td class="text-center">
                  {{ student.get_medal }}
                </td>

                <td class="text-center">{{ student.rus_score_ct }}</td>
                <td class="text-center">{{ student.rus_ct_choice }}</td>
                <td class="text-center">{{ student.bel_score_ct }}</td>
                <td class="text-center">{{ student.bel_ct_choice }}</td>
                <td class="text-center">
                  {{ student.social_science_score_ct }}
                </td>
                <td class="text-center">
                  {{ student.social_science_ct_choice }}
                </td>
                <td class="text-center">{{ student.foreign_lang_score_ct }}</td>
                <td class="text-center">
                  {{ student.foreign_lang_ct_choice }}
                </td>
                <td class="text-center">
                  {{ student.education_average_score }}
                </td>
                <td v-if="student.has_3_ct" class="text-center">
                  <font-awesome-icon :icon="['fa', 'check']" />
                </td>
                <td v-else class="text-center"></td>

                <td v-if="student.has_2_ce" class="text-center">
                  <font-awesome-icon :icon="['fa', 'check']" />
                </td>
                <td v-else class="text-center"></td>

                <td class="text-center">{{ student.rus_score_cert }}</td>
                <td class="text-center">{{ student.bel_score_cert }}</td>
                <td class="text-center">
                  {{ student.social_science_score_cert }}
                </td>
                <td class="text-center">
                  {{ student.foreign_lang_score_cert }}
                </td>
                <template
                  v-if="Object.keys(normalizedAdmissionQuota).length === 0"
                >
                  <td></td>
                </template>
                <template v-else>
                  <td v-if="student.speciality_1">
                    {{
                      normalizedAdmissionQuota[student.speciality_1]
                        .quota_verbose_name
                    }}
                  </td>
                  <td v-else></td>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="my-3"></div>
      </div>
      <div class="my-3"></div>
    </div>
  </div>
</template>

<script>
import { globalStudentAPIForEntranceInstance } from "@/api/student/studentAPI.js"
import { debounce } from "lodash/function"
import { mapGetters } from "vuex"
import getUsersAPIInstance from "@/api/auth/usersAPI.js"
import { getQueryStringFromSearchForm } from "../../../../utils.js"

export default {
  name: "EntranceStudentTableView",
  data() {
    return {
      isLoading: true,
      isLoadingMore: true,
      isError: false,
      isExporting: false,
      isDocumentProcessing: false,
      fieldsForDataExport: [
        {
          fieldName: "Статус записи (активна/ неактивна)",
          fieldValue: "is_active",
        },
        { fieldName: "Пол", fieldValue: "get_gender" },
        { fieldName: "Фамилия (рус)", fieldValue: "last_name_rus" },
        { fieldName: "Имя (рус)", fieldValue: "first_name_rus" },
        { fieldName: "Отчество (рус)", fieldValue: "patronymic_rus" },
        { fieldName: "Фамилия (бел)", fieldValue: "last_name_bel" },
        { fieldName: "Имя (бел)", fieldValue: "first_name_bel" },
        { fieldName: "Отчество (бел)", fieldValue: "patronymic_bel" },
        { fieldName: "Дата рождения", fieldValue: "get_date_of_birth" },
        { fieldName: "Место рождения", fieldValue: "place_of_birth" },
        {
          fieldName: "Место жительства (проживания)",
          fieldValue: "address_residence",
        },
        { fieldName: "Номер телефона", fieldValue: "phone_number" },
        { fieldName: "Тип паспорта", fieldValue: "get_passport_document_type" },
        { fieldName: "Номер паспорта", fieldValue: "passport_number" },
        {
          fieldName: "Дата выдачи паспорта",
          fieldValue: "passport_issue_date",
        },
        {
          fieldName: "Срок действия паспорта",
          fieldValue: "passport_validity_period",
        },
        {
          fieldName: "Орган выдачи паспорта",
          fieldValue: "get_passport_issue_authority",
        },
        {
          fieldName: "Орган выдачи паспорта (текстом)",
          fieldValue: "passport_issue_authority_text",
        },
        {
          fieldName: "Идентификационный номер",
          fieldValue: "identification_number",
        },
        {
          fieldName: "Отец - фамилия",
          fieldValue: "father_last_name",
        },

        {
          fieldName: "Отец - имя",
          fieldValue: "father_first_name",
        },
        {
          fieldName: "Отец - отчество",
          fieldValue: "father_patronymic",
        },
        {
          fieldName: "Отец - дата рождения",
          fieldValue: "get_father_date_of_birth",
        },

        {
          fieldName: "Отец - место работы",
          fieldValue: "father_place_of_work",
        },
        {
          fieldName: "Отец - номер телефона",
          fieldValue: "father_phone_number",
        },
        {
          fieldName: "Отец - место жительства",
          fieldValue: "father_address_residence",
        },
        {
          fieldName: "Отец - является сотрудником",
          fieldValue: "father_is_employee",
        },
        {
          fieldName: "Мать - фамилия",
          fieldValue: "mother_last_name",
        },
        {
          fieldName: "Мать - имя",
          fieldValue: "mother_first_name",
        },
        {
          fieldName: "Мать - отчество",
          fieldValue: "mother_patronymic",
        },
        {
          fieldName: "Мать - дата рождения",
          fieldValue: "get_mother_date_of_birth",
        },
        {
          fieldName: "Мать - место работы",
          fieldValue: "mother_place_of_work",
        },
        {
          fieldName: "Мать - место жительства",
          fieldValue: "mother_address_residence",
        },
        {
          fieldName: "Мать - номер телефона",
          fieldValue: "mother_phone_number",
        },
        {
          fieldName: "Мать - является сотрудником",
          fieldValue: "mother_is_employee",
        },

        {
          fieldName: "Иностранный язык (изучаемый в школе)",
          fieldValue: "get_foreign_language_was",
        },
        {
          fieldName: "Иностранный язык (будет изучать)",
          fieldValue: "get_foreign_language_will_be",
        },
        {
          fieldName: "Форма обучения",
          fieldValue: "get_education_form",
        },
        {
          fieldName: "Группа здоровья",
          fieldValue: "get_health_group",
        },
        {
          fieldName: "Категория профессионального соответствия",
          fieldValue: "get_ppfl_test",
        },
        {
          fieldName: "Дополнительные данные (вкладка - образование)",
          fieldValue: "education_tab_extra_data",
        },
        {
          fieldName: "Дополнительные данные (вкладка - личная информация)",
          fieldValue: "personal_information_tab_extra_data",
        },
        {
          fieldName: "Дополнительные данные (вкладка - представители)",
          fieldValue: "parents_tab_extra_data",
        },
        {
          fieldName: "Дополнительные данные (вкладка - анкета)",
          fieldValue: "questionary_tab_extra_data",
        },
        {
          fieldName: "Область (проживания)",
          fieldValue: "get_residence_region",
        },
        {
          fieldName: "Вид населенного пункта (проживание)",
          fieldValue: "get_residence_location_kind",
        },
        {
          fieldName: "Социальный статус",
          fieldValue: "get_social_status",
        },

        {
          fieldName: "Вид учреждения образования",
          fieldValue: "get_education_kind",
        },
        {
          fieldName: "Уровень образования",
          fieldValue: "get_education_level",
        },
        {
          fieldName: "Наименование учебного заведения, которое окончил",
          fieldValue: "education_graduated",
        },
        {
          fieldName: "Год окончания учебного заведения",
          fieldValue: "education_graduating_end_year",
        },
        {
          fieldName: "Средний бал",
          fieldValue: "education_average_score",
        },
        {
          fieldName: "Сумма балов",
          fieldValue: "score_sum",
        },
        {
          fieldName: "Вид населенного пункта",
          fieldValue: "get_education_location_kind",
        },
        {
          fieldName: "Номер сертификата по русскому / белорусскому языку",
          fieldValue: "rus_bel_ct_number",
        },
        {
          fieldName: "Русский язык - ЦТ / ЦЭ - количество баллов",
          fieldValue: "rus_score_ct",
        },
        {
          fieldName: "Русский язык - ЦТ / ЦЭ - выбор",
          fieldValue: "rus_ct_choice",
        },
        {
          fieldName: "Белорусский язык - ЦТ / ЦЭ - количество баллов",
          fieldValue: "bel_score_ct",
        },
        {
          fieldName: "Белорусский язык - ЦТ / ЦЭ - выбор",
          fieldValue: "bel_ct_choice",
        },
        {
          fieldName: "Номер сертификата по обществоведению",
          fieldValue: "social_science_ct_number",
        },
        {
          fieldName: "Обществоведение - ЦТ / ЦЭ - количество баллов",
          fieldValue: "social_science_score_ct",
        },
        {
          fieldName: "Обществоведение - ЦТ / ЦЭ - выбор",
          fieldValue: "social_science_ct_choice",
        },
        {
          fieldName: "Номер сертификата по иностранному языку",
          fieldValue: "foreign_lang_ct_number",
        },
        {
          fieldName: "Иностранный язык - ЦТ / ЦЭ - количество баллов",
          fieldValue: "foreign_lang_score_ct",
        },
        {
          fieldName: "Иностранный язык - ЦТ / ЦЭ - выбор",
          fieldValue: "foreign_lang_ct_choice",
        },
        {
          fieldName: "Русский язык - аттестат - количество баллов",
          fieldValue: "rus_score_cert",
        },
        {
          fieldName: "Белорусский язык - аттестат - количество баллов",
          fieldValue: "bel_score_cert",
        },
        {
          fieldName: "Обществоведение - аттестат - количество баллов",
          fieldValue: "social_science_score_cert",
        },
        {
          fieldName: "Иностранный язык - аттестат - количество баллов",
          fieldValue: "foreign_lang_score_cert",
        },
        {
          fieldName: "Специальность, на которую поступает",
          fieldValue: "get_speciality_1",
        },
        {
          fieldName: "Льгота",
          fieldValue: "get_privilege_1",
        },
        {
          fieldName: "Дата и время отпечатки заявления",
          fieldValue: "get_application_has_been_printed_date",
        },
      ],
      selectedFieldsForDataExport: ["last_name_rus", "first_name_rus"],
      searchForm: Object.assign(
        {},
        globalStudentAPIForEntranceInstance.searchObj,
      ),
      studentList: { count: 0, results: [], previous: null, next: null },
      studentAPIInstance: globalStudentAPIForEntranceInstance,
      usersAPIInstance: getUsersAPIInstance(),
      usersList: { count: 0, results: [], previous: null, next: null },
    }
  },
  async created() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      this.isLoading = true
      const response = await this.studentAPIInstance.getItemsList()
      this.studentList = await response.data
      console.log(this.studentList)
      const responseUser = await this.usersAPIInstance.getItemsList()
      this.usersList = await responseUser.data

      this.isLoading = false
      this.setSerialNumbers()
    },
    async handleScroll() {
      const container = this.$refs.infinite_list
      if (
        container.scrollTop + container.clientHeight >=
          container.scrollHeight - 50 &&
        !this.isLoadingMore
      ) {
        if (this.studentList.next) {
          this.isLoadingMore = true
          try {
            const response = await this.studentAPIInstance.updateList(
              this.studentList.next,
            )
            const newData = await response.data
            this.studentList.results = [
              ...this.studentList.results,
              ...newData.results,
            ]
            this.studentList.next = newData.next
            this.studentList.previous = newData.previous
            this.setSerialNumbers()
          } catch (error) {
            this.isError = true
          } finally {
            this.isLoadingMore = false
          }
        }
      }
    },
    setSerialNumbers() {
      let i = 1
      this.studentList.results.forEach((item) => {
        item.serial_number = i
        i++
      })
    },
    clearFilter() {
      this.searchForm = Object.assign(
        {},
        this.studentAPIInstance.searchObjDefault,
      )
    },
    setOrdering(fieldName) {
      this.searchForm.ordering = fieldName + ",id"
    },
    debouncedSearch: debounce(async function () {
      this.studentAPIInstance.searchObj = Object.assign({}, this.searchForm)
      try {
        const studentsResponse = await this.studentAPIInstance.getItemsList()
        this.studentList = await studentsResponse.data
        this.setSerialNumbers()
      } catch (e) {
        this.isError = true
      } finally {
      }
    }, 500),
    showExportDataModal() {
      let addModal = this.$refs.exportDataModal
      let myModal = new bootstrap.Modal(addModal, {
        keyboard: false,
      })
      myModal.show()
    },
    checkAllFieldsForExport() {
      this.selectedFieldsForDataExport = []
      this.fieldsForDataExport.map((item) => {
        this.selectedFieldsForDataExport.push(item.fieldValue)
      })
    },
    clearAllFieldsForExport() {
      this.selectedFieldsForDataExport = []
    },
    async exportData(destination) {
      if (this.selectedFieldsForDataExport.length === 0) {
        alert("Выберите хотя бы одно поле для экспорта!")
      } else {
        this.isExporting = true
        let export_data = {}

        export_data.query_string = getQueryStringFromSearchForm(this.searchForm)
        export_data.fields_for_export =
          this.selectedFieldsForDataExport.toString()
        export_data.destination = destination
        if (this.searchForm.ordering) {
          export_data.ordering = this.searchForm.ordering.replace(",id", "")
        }

        this.studentAPIInstance.list_export(export_data).then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement("a")
          link.href = url
          link.setAttribute("download", `file.${destination}`)
          document.body.appendChild(link)
          link.click()
          this.isExporting = false
        })
      }
    },
  },
  computed: {
    normalizedAdmissionQuota() {
      let normObj = {}
      this.admissionQuotas.results.map((item) => (normObj[item.id] = item))
      return normObj
    },
    normalizedPrivilege() {
      let normObj = {}
      this.privileges.results.map((item) => (normObj[item.id] = item))
      return normObj
    },
    normalizedEducationKinds() {
      let normObj = {}
      this.educationKinds.results.map((item) => (normObj[item.id] = item))
      return normObj
    },

    normalizedPpflCategories() {
      let normObj = {}
      this.ppflCategories.results.map((item) => (normObj[item.id] = item))
      return normObj
    },

    normalizedHealthGroups() {
      let normObj = {}
      this.healthGroups.results.map((item) => (normObj[item.id] = item))
      return normObj
    },
    orderedMainList() {
      return this.studentList.results
    },
    orderedAdmissionQuotas() {
      return this.admissionQuotas.results
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
    orderedEducationKinds() {
      return this.educationKinds.results
    },
    orderedPrivileges() {
      return this.privileges.results
    },
    orderedComponentOrgans() {
      return this.componentOrgans.results
    },
    orderedPassportIssueAuthorities() {
      return this.passportIssueAuthorities.results
    },
    orderedForeignLanguages() {
      return this.foreignLanguages.results
    },
    orderedMilitaryOffices() {
      return this.militaryOffices.results
    },
    orderedPpflCategories() {
      return this.ppflCategories.results.filter(
        (category) => category.ownership_category === "1",
      )
    },
    orderedHealthGroups() {
      return this.healthGroups.results.filter(
        (group) => group.ownership_category === "1",
      )
    },
    orderedVpkCategories() {
      return this.vpkCategories.results
    },
    orderedEducationLevels() {
      return this.educationLevels.results
    },
    orderedMedals() {
      return this.medals.results
    },
    orderedCountryRegions() {
      return this.countryRegions.results
    },
    orderedEducationLocalityKinds() {
      return this.educationLocalityKinds.results
    },
    orderedEducationForms() {
      return this.educationForms.results
    },
    orderedSocialStatuses() {
      return this.socialStatus.results
    },

    ...mapGetters({
      componentOrgans: "componentOrgans/getList",
      passportIssueAuthorities: "passportAuthorities/getList",
      foreignLanguages: "foreignLanguages/getList",
      militaryOffices: "militaryOffices/getList",
      graduationReasons: "graduationReasons/getList",
      educationalInstitutions: "educationalInstitutions/getList",
      gorovds: "gorovds/getList",
      admissionQuotas: "admissionQuota/getList",
      privileges: "privileges/getList",
      educationKinds: "educationKind/getList",
      ppflCategories: "ppflCategories/getList",
      healthGroups: "healthGroup/getList",
      vpkCategories: "vpkCategories/getList",
      educationLevels: "educationLevel/getList",
      medals: "medals/getList",
      countryRegions: "countryRegion/getList",
      educationLocalityKinds: "educationLocalityKind/getList",
      educationForms: "educationForms/getList",
      socialStatus: "socialStatus/getList",
      isCommonLoading: "common/getIsCommonLoading",
    }),
  },
  watch: {
    searchForm: {
      handler(newValue, oldValue) {
        this.debouncedSearch()
      },
      deep: true,
    },
  },
}
</script>

<style scoped></style>
