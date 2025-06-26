<template>
  <!-- export modal-->

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

  <!--  documents modal-->

  <div
    class="modal fade"
    id="documentsModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    ref="documentsModal"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" v-if="isDocumentProcessing">
            Идет формирование документа ...
          </h1>
          <h1 class="modal-title fs-5" v-else>Выходные документы</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div>
            <div class="d-flex flex-column">
              <button
                class="btn btn-secondary mb-3"
                @click="notifyExportAll"
                :disabled="isDocumentProcessing"
              >
                <font-awesome-icon
                  :icon="['fas', 'envelope']"
                />&nbsp;&nbsp;Извещения (все активные записи !!! уточнить по
                БГМУ и т.д.)
              </button>
              <button
                class="btn btn-secondary mb-3"
                @click="notifyExport"
                :disabled="isDocumentProcessing"
              >
                <font-awesome-icon
                  :icon="['fas', 'envelope']"
                />&nbsp;&nbsp;Извещения (только отфильтрованные записи)
              </button>
              <button class="btn btn-secondary mb-3">
                <font-awesome-icon :icon="['fas', 'book']" />&nbsp;&nbsp;Журнал
                регистрации
              </button>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container-fluid">
    <div class="my-3"></div>
    <ul class="nav nav-links my-3 mb-lg-2 mx-n3">
      <li class="nav-item">
        <a class="nav-link active" aria-current="page" href="#"
          ><span>Всего </span
          ><span class="text-body-tertiary fw-semibold"
            >({{ cadetList.count }})</span
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
      style="
        min-height: calc(100vh - 270px);
        max-height: calc(100vh - 270px);
        overflow-x: auto;
        max-width: 100%;
        width: 30000px;
      "
      ref="infinite_list"
      @scroll="handleScroll"
    >
      <table
        ref="mainTable"
        class="table table-hover table-responsive"
        style="overflow: auto"
      >
        <thead ref="thead">
          <tr>
            <th scope="col" class="text-center">№п.п.</th>
            <th scope="col">Активный</th>
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
            <th scope="col">Кто изучал дело</th>
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
            <th scope="col" class="text-center" style="min-width: 450px">
              <div class="d-flex flex-row align-items-center">
                <span class="text-nowrap">Учреждение образования</span>
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
                            'educational_institution__educational_institution',
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
                            '-educational_institution__educational_institution',
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
            <th scope="col" style="min-width: 450px">
              <div class="d-flex flex-row align-items-center">
                <span class="text-nowrap">Комплектующий орган</span>
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
                        @click="setOrdering('component_organ__component_name')"
                      >
                        А -> Я
                      </button>
                    </li>
                    <li>
                      <button
                        class="dropdown-item"
                        @click="setOrdering('-component_organ__component_name')"
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
                <span class="text-nowrap">Прибыл из ГО-РОВД</span>
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
                          setOrdering('arrived_from_go_rovd__go_rovd_name')
                        "
                      >
                        А -> Я
                      </button>
                    </li>
                    <li>
                      <button
                        class="dropdown-item"
                        @click="
                          setOrdering('-arrived_from_go_rovd__go_rovd_name')
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

            <th scope="col" style="min-width: 450px">
              <div class="d-flex flex-row align-items-center">
                <span class="text-nowrap">Специальность 1</span>
              </div>
            </th>
            <th scope="col">
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
            <th scope="col">
              <div class="d-flex flex-row align-items-center">
                <span class="text-nowrap">Медико-возрастная группа</span>
              </div>
            </th>

            <th scope="col">
              <div class="d-flex flex-row align-items-center">
                <span class="text-nowrap">Группа риска</span>
              </div>
            </th>

            <th scope="col">
              <div class="d-flex flex-row align-items-center">
                <span class="text-nowrap">Проверка ГУСБ</span>
              </div>
            </th>

            <th scope="col">
              <div class="d-flex flex-row align-items-center">
                <span class="text-nowrap">Дата рождения</span>
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
                        @click="setOrdering('date_of_birth')"
                      >
                        меньш. -> больш.
                      </button>
                    </li>
                    <li>
                      <button
                        class="dropdown-item"
                        @click="setOrdering('-date_of_birth')"
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
                <span class="text-nowrap">Возраст</span>
              </div>
            </th>
            <th scope="col">
              <span class="text-nowrap">Место рождения</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Адрес регистрации</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Адрес места жительства</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Номер телефона</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Номер паспорта</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Паспорт (дата выдачи)</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Паспорт (срок действия)</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Паспорт (орган выдачи)</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Идентификационный номер</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Отец (фамилия)</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Отец (имя)</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Отец (отчество)</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Отец (дата рождекния)</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Отец (место работы)</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Отец (номер телефона)</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Мать (фамилия)</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Мать (имя)</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Мать (отчество)</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Мать (дата рождекния)</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Мать (место работы)</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Мать (номер телефона)</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Иностранный язык (изучал в школе)</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Иностранный язык (будет изучать)</span>
            </th>
            <th scope="col">
              <span class="text-nowrap">Снятие с воинского учета</span>
            </th>
            <th scope="col">
              <div class="d-flex flex-row align-items-center">
                <span class="text-nowrap">Военкомат</span>
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
                        @click="setOrdering('military_office__military_office')"
                      >
                        А -> Я
                      </button>
                    </li>
                    <li>
                      <button
                        class="dropdown-item"
                        @click="
                          setOrdering('-military_office__military_office')
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
                <span class="text-nowrap">Номер зачетной книжки</span>
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
                        @click="setOrdering('student_record_book_number')"
                      >
                        А -> Я
                      </button>
                    </li>
                    <li>
                      <button
                        class="dropdown-item"
                        @click="setOrdering('-student_record_book_number')"
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
                  >Номер сертификата по рус./ бел.
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
                        @click="setOrdering('rus_bel_ct_number')"
                      >
                        А -> Я
                      </button>
                    </li>
                    <li>
                      <button
                        class="dropdown-item"
                        @click="setOrdering('-rus_bel_ct_number')"
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
                <span class="text-nowrap">Что сдавал по русскому языку </span>
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
                  >Колличество баллов по белорусскому языку (сертификат)</nobr
                >
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
                  >Номер сертификата по обществоведению
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
                        @click="setOrdering('social_science_ct_number')"
                      >
                        А -> Я
                      </button>
                    </li>
                    <li>
                      <button
                        class="dropdown-item"
                        @click="setOrdering('-social_science_ct_number')"
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
                <span class="text-nowrap">Что сдавал по обществоведению </span>
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
                <span class="text-nowrap"
                  >Номер сертификата по иностранному языку
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
                        @click="setOrdering('foreign_lang_ct_number')"
                      >
                        А -> Я
                      </button>
                    </li>
                    <li>
                      <button
                        class="dropdown-item"
                        @click="setOrdering('-foreign_lang_ct_number')"
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
                  >Колличество баллов по иностранному языку (сертификат)</nobr
                >
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
            <th scope="col">
              <div class="d-flex flex-row align-items-center">
                <span class="text-nowrap">Претендует на диплом с отличием</span>
              </div>
            </th>
            <th scope="col">
              <div class="d-flex flex-row align-items-center">
                <span class="text-nowrap"
                  >Класс военно-патриотической направленности</span
                >
              </div>
            </th>
            <th scope="col">
              <div class="d-flex flex-row align-items-center">
                <span class="text-nowrap"
                  >Победитель республиканских или региональных олимпиад</span
                >
              </div>
            </th>
            <th scope="col">
              <div class="d-flex flex-row align-items-center">
                <span class="text-nowrap">Класс правовой направленности</span>
              </div>
            </th>
            <th scope="col">
              <div class="d-flex flex-row align-items-center">
                <span class="text-nowrap">Достижения в спорте</span>
              </div>
            </th>
            <th scope="col">
              <div class="d-flex flex-row align-items-center">
                <span class="text-nowrap"
                  >Профильный класс иной направленности</span
                >
              </div>
            </th>
          </tr>
          <tr>
            <th></th>
            <th>
              <select class="form-select" v-model="searchForm.is_active">
                <option selected value="">-------</option>
                <option value="true" key="1">Да</option>
                <option value="false" key="0">Нет</option>
              </select>
            </th>

            <th>
              <input
                type="text"
                class="form-control"
                v-model="searchForm.last_name_rus__icontains"
              />
            </th>
            <th>
              <input
                type="text"
                class="form-control"
                v-model="searchForm.first_name_rus__icontains"
              />
            </th>
            <th>
              <input
                type="text"
                class="form-control"
                v-model="searchForm.patronymic_rus__icontains"
              />
            </th>

            <th>
              <select
                id="id_who_created"
                class="form-select"
                v-model="searchForm.who_created"
              >
                <option value="">-------</option>
                <option
                  v-for="user in usersList.results"
                  :value="user.id"
                  :key="user.id"
                >
                  {{ user.get_display_name }}
                </option>
              </select>
            </th>

            <th>
              <div class="d-flex justify-content-center align-items-center">
                <input
                  type="date"
                  class="form-control me-2"
                  v-model="searchForm.application_has_been_printed_date__gte"
                />
                <input
                  type="date"
                  class="form-control"
                  v-model="searchForm.application_has_been_printed_date__lte"
                />
              </div>
            </th>

            <th style="min-width: 200px">
              <v-select
                v-model="searchForm.educational_institution__in"
                :options="orderedEducationalInstitutions"
                label="educational_institution"
                :reduce="(institution) => institution.id"
                multiple
              />
            </th>
            <th>
              <v-select
                v-model="searchForm.component_organ__in"
                :options="orderedComponentOrgans"
                label="component_name"
                :reduce="(component_organ) => component_organ.id"
                multiple
              />
            </th>
            <th>
              <v-select
                v-model="searchForm.arrived_from_go_rovd__in"
                :options="orderedGorovds"
                label="go_rovd_name"
                :reduce="(go_rovd) => go_rovd.id"
                multiple
              />
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
                v-model="searchForm.speciality_1__in"
                :options="orderedAdmissionQuotas"
                label="quota_verbose_name"
                :reduce="(quota) => quota.id"
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
            <th>
              <select
                class="form-select"
                v-model="searchForm.medical_age_group"
              >
                <option value="">-----</option>
                <option value="1" key="1">1</option>
                <option value="2" key="2">2</option>
                <option value="3" key="3">3</option>
                <option value="4" key="4">4</option>
                <option value="5" key="5">5</option>
              </select>
            </th>
            <th>
              <select class="form-select" v-model="searchForm.is_risk_group">
                <option selected value="">-------</option>
                <option value="true" key="1">Да</option>
                <option value="false" key="0">Нет</option>
              </select>
            </th>
            <th>
              <select class="form-select" v-model="searchForm.has_gusb_check">
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
                  v-model="searchForm.date_of_birth__gte"
                />
                <input
                  type="date"
                  class="form-control"
                  v-model="searchForm.date_of_birth__lte"
                />
              </div>
            </th>
            <th>
              <div class="d-flex justify-content-center align-items-center">
                <input
                  type="text"
                  class="form-control me-2"
                  v-model="searchForm.age_gte"
                />
                <input
                  type="text"
                  class="form-control"
                  v-model="searchForm.age_lte"
                />
              </div>
            </th>
            <th>
              <input
                type="text"
                class="form-control me-2"
                v-model="searchForm.place_of_birth__icontains"
              />
            </th>
            <th>
              <input
                type="text"
                class="form-control me-2"
                v-model="searchForm.address_registration__icontains"
              />
            </th>
            <th>
              <input
                type="text"
                class="form-control me-2"
                v-model="searchForm.address_residence__icontains"
              />
            </th>
            <th>
              <input
                type="text"
                class="form-control me-2"
                v-model="searchForm.phone_number__icontains"
              />
            </th>

            <th>
              <input
                type="text"
                class="form-control me-2"
                v-model="searchForm.passport_number__icontains"
              />
            </th>
            <th>
              <div class="d-flex justify-content-center align-items-center">
                <input
                  type="date"
                  class="form-control me-2"
                  v-model="searchForm.passport_issue_date__gte"
                />
                <input
                  type="date"
                  class="form-control"
                  v-model="searchForm.passport_issue_date__lte"
                />
              </div>
            </th>
            <th>
              <div class="d-flex justify-content-center align-items-center">
                <input
                  type="date"
                  class="form-control me-2"
                  v-model="searchForm.passport_validity_period__gte"
                />
                <input
                  type="date"
                  class="form-control"
                  v-model="searchForm.passport_validity_period__lte"
                />
              </div>
            </th>
            <th>
              <v-select
                v-model="searchForm.passport_issue_authority__in"
                :options="orderedPassportIssueAuthorities"
                label="passport_issue_authority"
                :reduce="
                  (passport_issue_authority) => passport_issue_authority.id
                "
                multiple
              />
            </th>
            <th>
              <input
                type="text"
                class="form-control me-2"
                v-model="searchForm.identification_number__icontains"
              />
            </th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
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
              <div class="d-flex justify-content-center align-items-center">
                <input
                  type="date"
                  class="form-control me-2"
                  v-model="searchForm.removed_from_military_registration__gte"
                />
                <input
                  type="date"
                  class="form-control"
                  v-model="searchForm.removed_from_military_registration__lte"
                />
              </div>
            </th>
            <th style="min-width: 300px">
              <v-select
                v-model="searchForm.military_office__in"
                :options="orderedMilitaryOffices"
                label="military_office"
                :reduce="(military_office) => military_office.id"
                multiple
              />
            </th>
            <th>
              <input
                type="text"
                class="form-control"
                v-model="searchForm.student_record_book_number__icontains"
              />
            </th>
            <th>
              <input
                type="text"
                class="form-control"
                v-model="searchForm.rus_bel_ct_number__icontains"
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
              <select class="form-select" v-model="searchForm.rus_ct_choice">
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
              <select class="form-select" v-model="searchForm.bel_ct_choice">
                <option selected value="">-------</option>
                <option value="2024 ЦЭ" key="2024 ЦЭ">2024 ЦЭ</option>
                <option value="2024 ЦТ" key="2024 ЦТ">2024 ЦТ</option>
                <option value="2025 ЦЭ" key="2025 ЦЭ">2025 ЦЭ</option>
                <option value="2025 ЦТ" key="2025 ЦТ">2025 ЦТ</option>
              </select>
            </th>
            <th>
              <input
                type="text"
                class="form-control"
                v-model="searchForm.social_science_ct_number__icontains"
              />
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
              <input
                type="text"
                class="form-control"
                v-model="searchForm.foreign_lang_ct_number__icontains"
              />
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
            <th style="min-width: 200px">
              <v-select
                v-model="searchForm.vpk__in"
                :options="orderedVpkCategories"
                label="category"
                :reduce="(vpk) => vpk.id"
                multiple
              />
            </th>
            <th>
              <select
                class="form-select"
                v-model="searchForm.aims_to_graduate_with_honors"
              >
                <option selected value="">-------</option>
                <option value="true" key="1">Да</option>
                <option value="false" key="0">Нет</option>
              </select>
            </th>
            <th>
              <select class="form-select" v-model="searchForm.is_class_vpn">
                <option selected value="">-------</option>
                <option value="true" key="1">Да</option>
                <option value="false" key="0">Нет</option>
              </select>
            </th>
            <th>
              <select
                class="form-select"
                v-model="searchForm.is_olympiad_winner"
              >
                <option selected value="">-------</option>
                <option value="true" key="1">Да</option>
                <option value="false" key="0">Нет</option>
              </select>
            </th>

            <th>
              <select class="form-select" v-model="searchForm.is_class_pn">
                <option selected value="">-------</option>
                <option value="true" key="1">Да</option>
                <option value="false" key="0">Нет</option>
              </select>
            </th>
            <th>
              <select
                class="form-select"
                v-model="searchForm.has_achievements_in_sports"
              >
                <option selected value="">-------</option>
                <option value="true" key="1">Да</option>
                <option value="false" key="0">Нет</option>
              </select>
            </th>
            <th>
              <select class="form-select" v-model="searchForm.is_class_other">
                <option selected value="">-------</option>
                <option value="true" key="1">Да</option>
                <option value="false" key="0">Нет</option>
              </select>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="cadet in orderedMainList"
            :key="cadet.id"
            @dblclick="
              $router.push({
                name: 'entrance-cadet-input-form',
                params: { id: cadet.id },
              })
            "
          >
            <td class="text-center">{{ cadet.serial_number }}</td>
            <td v-if="cadet.is_active"></td>

            <td v-else class="text-center">
              <font-awesome-icon :icon="['fas', 'lock']" />
            </td>

            <td>{{ cadet.last_name_rus }}</td>
            <td>{{ cadet.first_name_rus }}</td>
            <td>{{ cadet.patronymic_rus }}</td>
            <td></td>
            <td v-if="cadet.application_has_been_printed_date">
              {{
                new Date(
                  cadet.application_has_been_printed_date,
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
            <td>{{ cadet.get_educational_institution }}</td>
            <td>{{ cadet.get_component_organ }}</td>
            <td>{{ cadet.get_arrived_from_go_rovd }}</td>
            <td>{{ cadet.get_gender }}</td>
            <template v-if="Object.keys(normalizedAdmissionQuota).length === 0">
              <td></td>
            </template>
            <template v-else>
              <td v-if="cadet.speciality_1">
                {{
                  normalizedAdmissionQuota[cadet.speciality_1]
                    .quota_verbose_name
                }}
              </td>
              <td v-else></td>
            </template>
            <template v-if="Object.keys(normalizedEducationKinds).length === 0">
              <td></td>
            </template>
            <template v-else>
              <td v-if="cadet.education_kind">
                {{ normalizedEducationKinds[cadet.education_kind].education }}
              </td>
              <td v-else></td>
            </template>

            <template v-if="Object.keys(normalizedPpflCategories).length === 0">
              <td></td>
            </template>
            <template v-else>
              <td v-if="cadet.ppfl_test">
                {{ normalizedPpflCategories[cadet.ppfl_test].category }}
              </td>
              <td v-else></td>
            </template>

            <template v-if="Object.keys(normalizedHealthGroups).length === 0">
              <td></td>
            </template>
            <template v-else>
              <td v-if="cadet.health_group">
                {{ normalizedHealthGroups[cadet.health_group].health_group }}
              </td>
              <td v-else></td>
            </template>

            <td>{{ cadet.medical_age_group }}</td>

            <td v-if="cadet.is_risk_group" class="text-center">
              <font-awesome-icon :icon="['fa', 'check']" />
            </td>
            <td v-else class="text-center"></td>
            <td v-if="cadet.has_gusb_check" class="text-center">
              <font-awesome-icon :icon="['fa', 'check']" />
            </td>
            <td v-else class="text-center"></td>
            <td class="text-center">{{ cadet.date_of_birth }}</td>
            <td class="text-center">{{ cadet.get_age }}</td>
            <td>{{ cadet.place_of_birth }}</td>
            <td>{{ cadet.address_registration }}</td>
            <td>{{ cadet.address_residence }}</td>
            <td>{{ cadet.phone_number }}</td>
            <td>{{ cadet.passport_number }}</td>
            <td class="text-center">{{ cadet.passport_issue_date }}</td>
            <td class="text-center">{{ cadet.passport_validity_period }}</td>
            <td>{{ cadet.passport_issue_authority }}</td>
            <td>{{ cadet.identification_number }}</td>
            <td>{{ cadet.father_last_name }}</td>
            <td>{{ cadet.father_first_name }}</td>
            <td>{{ cadet.father_patronymic }}</td>
            <td class="text-center">{{ cadet.father_date_of_birth }}</td>
            <td>{{ cadet.father_place_of_work }}</td>
            <td>{{ cadet.father_phone_number }}</td>
            <td>{{ cadet.mother_last_name }}</td>
            <td>{{ cadet.mother_first_name }}</td>
            <td>{{ cadet.mother_patronymic }}</td>
            <td class="text-center">{{ cadet.mother_date_of_birth }}</td>
            <td>{{ cadet.mother_place_of_work }}</td>
            <td>{{ cadet.mother_phone_number }}</td>
            <td>{{ cadet.get_foreign_language_was }}</td>
            <td>{{ cadet.get_foreign_language_will_be }}</td>
            <td class="text-center">
              {{ cadet.removed_from_military_registration }}
            </td>
            <td>
              <span class="text-nowrap">{{ cadet.get_military_office }}</span>
            </td>
            <td class="text-center">{{ cadet.student_record_book_number }}</td>
            <td class="text-center">{{ cadet.rus_bel_ct_number }}</td>
            <td class="text-center">{{ cadet.rus_score_ct }}</td>
            <td class="text-center">{{ cadet.rus_ct_choice }}</td>
            <td class="text-center">{{ cadet.bel_score_ct }}</td>
            <td class="text-center">{{ cadet.bel_ct_choice }}</td>
            <td class="text-center">{{ cadet.social_science_ct_number }}</td>
            <td class="text-center">{{ cadet.social_science_score_ct }}</td>
            <td class="text-center">{{ cadet.social_science_ct_choice }}</td>
            <td class="text-center">{{ cadet.foreign_lang_ct_number }}</td>
            <td class="text-center">{{ cadet.foreign_lang_score_ct }}</td>
            <td class="text-center">{{ cadet.foreign_lang_ct_choice }}</td>
            <td class="text-center">{{ cadet.rus_score_cert }}</td>
            <td class="text-center">{{ cadet.bel_score_cert }}</td>
            <td class="text-center">{{ cadet.social_science_score_cert }}</td>
            <td class="text-center">{{ cadet.foreign_lang_score_cert }}</td>
            <td class="text-center">{{ cadet.education_average_score }}</td>
            <td class="text-center">{{ cadet.get_vpk }}</td>
            <td v-if="cadet.aims_to_graduate_with_honors" class="text-center">
              <font-awesome-icon :icon="['fa', 'check']" />
            </td>
            <td v-else class="text-center"></td>
            <td v-if="cadet.is_class_vpn" class="text-center">
              <font-awesome-icon :icon="['fa', 'check']" />
            </td>
            <td v-else class="text-center"></td>
            <td v-if="cadet.is_olympiad_winner" class="text-center">
              <font-awesome-icon :icon="['fa', 'check']" />
            </td>
            <td v-else class="text-center"></td>
            <td v-if="cadet.is_class_pn" class="text-center">
              <font-awesome-icon :icon="['fa', 'check']" />
            </td>
            <td v-else class="text-center"></td>
            <td v-if="cadet.has_achievements_in_sports" class="text-center">
              <font-awesome-icon :icon="['fa', 'check']" />
            </td>
            <td v-else class="text-center"></td>
            <td v-if="cadet.is_class_other" class="text-center">
              <font-awesome-icon :icon="['fa', 'check']" />
            </td>
            <td v-else class="text-center"></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="my-3"></div>
  </div>
</template>

<script>
import { globalCadetAPIForEntranceInstance } from "@/api/cadet/cadetAPI.js"
import { debounce } from "lodash/function"
import { mapGetters } from "vuex"
import getUsersAPIInstance from "@/api/auth/usersAPI.js"
import { getQueryStringFromSearchForm } from "../../../../utils.js"

export default {
  name: "EntranceCadetTableView",
  data() {
    return {
      isLoading: true,
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
        {
          fieldName: "Личный номер (жетон)",
          fieldValue: "personal_number_mvd",
        },
        { fieldName: "Семейное положение", fieldValue: "get_marital_status" },
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
        { fieldName: "Факультет", fieldValue: "get_subdivision" },
        { fieldName: "Звание", fieldValue: "get_rank" },
        { fieldName: "Должность", fieldValue: "get_position" },
        {
          fieldName: "Номер зачетной книжки",
          fieldValue: "student_record_book_number",
        },
        { fieldName: "Отец - фамилия", fieldValue: "father_last_name" },
        { fieldName: "Отец - имя", fieldValue: "father_first_name" },
        { fieldName: "Отец - отчество", fieldValue: "father_patronymic" },
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
          fieldName: "Отец - место регистрации",
          fieldValue: "father_address_registration",
        },
        { fieldName: "Мать - фамилия", fieldValue: "mother_last_name" },
        { fieldName: "Мать - имя", fieldValue: "mother_first_name" },
        { fieldName: "Мать - отчество", fieldValue: "mother_patronymic" },
        {
          fieldName: "Мать - дата рождения",
          fieldValue: "get_mother_date_of_birth",
        },
        {
          fieldName: "Мать - место работы",
          fieldValue: "mother_place_of_work",
        },
        {
          fieldName: "Мать - номер телефона",
          fieldValue: "mother_phone_number",
        },
        {
          fieldName: "Мать - место жительства",
          fieldValue: "mother_address_residence",
        },
        {
          fieldName: "Мать - место регистрации",
          fieldValue: "mother_address_registration",
        },
        {
          fieldName: "Родители в разводе",
          fieldValue: "parents_is_in_divorce",
        },
        {
          fieldName: "Снят с воинского учета",
          fieldValue: "get_removed_from_military_registration",
        },
        {
          fieldName: "Иностранный язык (изучаемый в школе)",
          fieldValue: "get_foreign_language_was",
        },
        {
          fieldName: "Иностранный язык (будет изучать)",
          fieldValue: "get_foreign_language_will_be",
        },
        { fieldName: "Группа", fieldValue: "get_group" },
        { fieldName: "Дата поступления", fieldValue: "get_academy_start_date" },
        { fieldName: "Дата окончания", fieldValue: "get_academy_end_date" },
        {
          fieldName: "Причина окончания (Статья)",
          fieldValue: "graduation_reason_article",
        },
        {
          fieldName: "Причина окончания (доп. данные)",
          fieldValue: "graduation_extra_data",
        },
        { fieldName: "Специализация", fieldValue: "get_specialization" },
        { fieldName: "Направление ОРД", fieldValue: "get_direction_ord" },
        {
          fieldName: "Специальность (обучается)",
          fieldValue: "get_speciality",
        },
        { fieldName: "Год набора", fieldValue: "entrance_year" },
        {
          fieldName: "Заявление было отпечатано",
          fieldValue: "application_has_been_printed",
        },
        {
          fieldName: "Дата и время отпечатки заявления",
          fieldValue: "get_application_has_been_printed_date",
        },
        { fieldName: "Комплектующий орган", fieldValue: "get_component_organ" },
        {
          fieldName: "В чьих интересах обучается",
          fieldValue: "get_in_whose_interests",
        },
        {
          fieldName: "Категория поступающего",
          fieldValue: "get_entrance_category",
        },
        {
          fieldName: "Прибыл из ГО-РОВД",
          fieldValue: "get_arrived_from_go_rovd",
        },
        { fieldName: "Социальный статус", fieldValue: "get_social_status" },
        {
          fieldName: "Область (для прохождения мед. комиссии)",
          fieldValue: "get_region_for_medical_examination",
        },
        { fieldName: "Военкомат", fieldValue: "get_military_office" },
        {
          fieldName: "Военкомат (дополнительные данные)",
          fieldValue: "military_office_extra_data",
        },
        {
          fieldName: "Замечания по личному делу",
          fieldValue: "comments_on_personal_file",
        },
        {
          fieldName: "Учреждение образования",
          fieldValue: "get_educational_institution",
        },
        {
          fieldName: "Место службы в армии",
          fieldValue: "military_organization",
        },
        {
          fieldName: "Служба в армии (начало)",
          fieldValue: "get_military_service_start",
        },
        {
          fieldName: "Служба в армии (окончание)",
          fieldValue: "get_military_service_end",
        },
        {
          fieldName: "Служба в армии (должность)",
          fieldValue: "military_position",
        },
        { fieldName: "Служба в МВД", fieldValue: "mvd_organization" },
        {
          fieldName: "Служба в МВД (начало)",
          fieldValue: "get_mvd_service_start",
        },
        {
          fieldName: "Служба в МВД (окончание)",
          fieldValue: "get_mvd_service_end",
        },
        { fieldName: "Служба в МВД (должность)", fieldValue: "mvd_position" },
        {
          fieldName: "Вид учреждения образования",
          fieldValue: "get_education_kind",
        },
        { fieldName: "Уровень образования", fieldValue: "get_education_level" },
        {
          fieldName: "Наименование учебного заведения",
          fieldValue: "education_graduated",
        },
        {
          fieldName: "Год поступления в учебное заведение",
          fieldValue: "education_graduating_start_year",
        },
        {
          fieldName: "Год окончания учебного заведения",
          fieldValue: "education_graduating_end_year",
        },
        { fieldName: "Средний бал", fieldValue: "education_average_score" },
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
        { fieldName: "Специальность 1", fieldValue: "get_speciality_1" },
        { fieldName: "Специальность 2", fieldValue: "get_speciality_2" },
        { fieldName: "Специальность 3", fieldValue: "get_speciality_3" },
        { fieldName: "Специальность 4", fieldValue: "get_speciality_4" },
        { fieldName: "Специальность 5", fieldValue: "get_speciality_5" },
        { fieldName: "Специальность 6", fieldValue: "get_speciality_6" },
        { fieldName: "Специальность 7", fieldValue: "get_speciality_7" },
        { fieldName: "Специальность 8", fieldValue: "get_speciality_8" },
        { fieldName: "Специальность 9", fieldValue: "get_speciality_9" },
        { fieldName: "Льгота 1", fieldValue: "get_privilege_1" },
        { fieldName: "Льгота 2", fieldValue: "get_privilege_2" },
        { fieldName: "Льгота 3", fieldValue: "get_privilege_3" },
        { fieldName: "Льгота 4", fieldValue: "get_privilege_4" },
        { fieldName: "Льгота 5", fieldValue: "get_privilege_5" },
        { fieldName: "Льгота 6", fieldValue: "get_privilege_6" },
        { fieldName: "Льгота 7", fieldValue: "get_privilege_7" },
        { fieldName: "Льгота 8", fieldValue: "get_privilege_8" },
        { fieldName: "Льгота 9", fieldValue: "get_privilege_9" },
        { fieldName: "Группа здоровья", fieldValue: "get_health_group" },
        {
          fieldName: "Категория профессионального соответствия",
          fieldValue: "get_ppfl_test",
        },
        {
          fieldName: "Медико-возрастная группа",
          fieldValue: "medical_age_group",
        },
        {
          fieldName: "Окончательное медицинское освидетельствование",
          fieldValue: "passed_medical_examination",
        },
        {
          fieldName: "Дата прохождения медицинской комиссии",
          fieldValue: "get_passed_medical_examination_date",
        },
        {
          fieldName: "Медицинская комиссия (доп. данные)",
          fieldValue: "passed_medical_examination_extra_data",
        },
        { fieldName: "Возраст", fieldValue: "get_age" },
      ],
      selectedFieldsForDataExport: ["last_name_rus", "first_name_rus"],
      searchForm: Object.assign(
        {},
        globalCadetAPIForEntranceInstance.searchObj,
      ),
      cadetList: { count: 0, results: [], previous: null, next: null },
      cadetAPIInstance: globalCadetAPIForEntranceInstance,
      usersAPIInstance: getUsersAPIInstance(),
      usersList: { count: 0, results: [], previous: null, next: null },
    }
  },
  async created() {
    await this.loadData()
  },

  mounted() {
    this.loadMoreData()
  },

  methods: {
    async loadData() {
      this.isLoading = true
      const response = await this.cadetAPIInstance.getItemsList()
      this.cadetList = await response.data
      const responseUser = await this.usersAPIInstance.getItemsList()
      this.usersList = await responseUser.data

      this.isLoading = false
      this.setSerialNumbers()
    },
    async handleScroll() {
      const container = this.$refs.infinite_list
      if (
        Math.round(container.scrollTop + container.clientHeight) ===
        container.scrollHeight
      ) {
        if (this.cadetList.next) {
          this.isLoading = true
          try {
            const response = await this.cadetAPIInstance.updateList(
              this.cadetList.next,
            )
            const newData = await response.data
            this.cadetList.results = [
              ...this.cadetList.results,
              ...newData.results,
            ]
            this.cadetList.next = newData.next
            this.cadetList.previous = newData.previous
            this.setSerialNumbers()
          } catch (error) {
            this.isError = true
          } finally {
            this.isLoading = false
          }
        }
      }
    },
    // loadMoreData() {
    //   const options = {
    //     root: this.$refs.infinite_list,
    //     rootMargin: "0px",
    //     threshold: 0.5,
    //   }
    //
    //   const callback = async (entries, observer) => {
    //     if (entries[0].isIntersecting) {
    //       if (this.cadetList.next) {
    //         this.isLoading = true
    //         try {
    //           const response = await this.cadetAPIInstance.updateList(
    //             this.cadetList.next,
    //           )
    //           const newData = await response.data
    //           this.cadetList.results = [
    //             ...this.cadetList.results,
    //             ...newData.results,
    //           ]
    //           this.cadetList.next = newData.next
    //           this.cadetList.previous = newData.previous
    //           this.setSerialNumbers()
    //         } catch (error) {
    //           this.isError = true
    //         } finally {
    //           this.isLoading = false
    //         }
    //       }
    //     }
    //   }
    //
    //   const observer = new IntersectionObserver(callback, options)
    //   observer.observe(this.$refs.observer)
    // },
    setSerialNumbers() {
      let i = 1
      this.cadetList.results.forEach((item) => {
        item.serial_number = i
        i++
      })
    },
    debouncedSearch: debounce(async function () {
      this.isLoading = true
      this.cadetAPIInstance.searchObj = Object.assign({}, this.searchForm)
      try {
        const cadetAResponse = await this.cadetAPIInstance.getItemsList()
        this.cadetList = await cadetAResponse.data
        this.setSerialNumbers()
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    }, 500),
    showExportDataModal() {
      let addModal = this.$refs.exportDataModal
      let myModal = new bootstrap.Modal(addModal, {
        keyboard: false,
      })
      myModal.show()
    },
    showDocumentsModal() {
      let addModal = this.$refs.documentsModal
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

        this.cadetAPIInstance.list_export(export_data).then((response) => {
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

    async notifyExport() {
      this.isDocumentProcessing = true
      let export_data = {}
      export_data.query_string = getQueryStringFromSearchForm(this.searchForm)
      this.cadetAPIInstance.notify_export(export_data).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `notify.docx`)
        document.body.appendChild(link)
        link.click()
        this.isDocumentProcessing = false
      })
    },

    async notifyExportAll() {
      this.isDocumentProcessing = true
      this.cadetAPIInstance.notify_export_all().then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `notify.docx`)
        document.body.appendChild(link)
        link.click()
        this.isDocumentProcessing = false
      })
    },

    clearFilter() {
      this.searchForm = Object.assign(
        {},
        this.cadetAPIInstance.searchObjDefault,
      )
    },
    setOrdering(fieldName) {
      this.searchForm.ordering = fieldName
    },
  },
  computed: {
    normalizedAdmissionQuota() {
      let normObj = {}
      this.admissionQuotas.results.map((item) => (normObj[item.id] = item))
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
      return this.cadetList.results
    },
    orderedAdmissionQuotas() {
      return this.admissionQuotas.results
        .filter((quota) => quota.ownership_category === "1")
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
    orderedGraduationReasons() {
      return this.graduationReasons.results
    },
    orderedEducationalInstitutions() {
      return this.educationalInstitutions.results
    },
    orderedGorovds() {
      return this.gorovds.results
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
    ...mapGetters({
      componentOrgans: "componentOrgans/getList",
      passportIssueAuthorities: "passportAuthorities/getList",
      foreignLanguages: "foreignLanguages/getList",
      militaryOffices: "militaryOffices/getList",
      graduationReasons: "graduationReasons/getList",
      educationalInstitutions: "educationalInstitutions/getList",
      gorovds: "gorovds/getList",
      admissionQuotas: "admissionQuota/getList",
      educationKinds: "educationKind/getList",
      ppflCategories: "ppflCategories/getList",
      healthGroups: "healthGroup/getList",
      vpkCategories: "vpkCategories/getList",
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

<style scoped>
#infinite_list th,
td {
  min-width: 200px;
  text-align: start;
  vertical-align: middle;
}

thead {
  position: sticky;
  top: 0;
}

input,
select {
  min-width: 200px;
}

z-index-select {
  z-index: 1000;
}
</style>
