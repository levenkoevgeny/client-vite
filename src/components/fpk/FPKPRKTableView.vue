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

  <div class="container-fluid">
    <div class="my-3"></div>
    <ul class="nav nav-links my-3 mb-lg-2 mx-n3">
      <li class="nav-item">
        <a class="nav-link active" aria-current="page" href="#"
          ><span>Всего </span
          ><span class="text-body-tertiary fw-semibold"
            >({{ fpkprkList.count }})</span
          ></a
        >
      </li>
    </ul>
    <div
      class="d-flex flex-row align-items-center justify-content-between mb-4"
    >
      <div class="m-0 p-0"></div>
      <div class="d-flex flex-row">
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
        overflow: auto;
      "
      ref="infinite_list"
      @scroll="handleScroll"
    >
      <table class="table table-hover table-responsive" style="overflow: auto">
        <thead ref="thead">
          <tr>
            <th scope="col" class="text-center">№п.п.</th>
            <th scope="col">Активный</th>
            <th scope="col">
              <div
                class="d-flex flex-row align-items-center justify-content-center"
              >
                <span class="text-nowrap">Год набора</span>
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
                        @click="setOrdering('entrance_year')"
                      >
                        меньш. -> больш.
                      </button>
                    </li>
                    <li>
                      <button
                        class="dropdown-item"
                        @click="setOrdering('-entrance_year')"
                      >
                        больш. -> меньш.
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </th>
            <th scope="col" class="text-center">ФПК / МАГ</th>
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

            <th scope="col">
              <div class="d-flex flex-row align-items-center">
                <span class="text-nowrap">Примечания для отдела кадров</span>
              </div>
            </th>

            <th scope="col">
              <div class="d-flex flex-row align-items-center">
                <span class="text-nowrap">Замечания по личному делу</span>
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
            <!--            <th scope="col">-->
            <!--              <span class="text-nowrap">Место рождения</span>-->
            <!--            </th>-->
            <!--            <th scope="col">-->
            <!--              <span class="text-nowrap">Адрес регистрации</span>-->
            <!--            </th>-->
            <!--            <th scope="col">-->
            <!--              <span class="text-nowrap">Адрес места жительства</span>-->
            <!--            </th>-->
            <!--            <th scope="col">-->
            <!--              <span class="text-nowrap">Номер телефона</span>-->
            <!--            </th>-->
            <!--            <th scope="col">-->
            <!--              <span class="text-nowrap">Номер паспорта</span>-->
            <!--            </th>-->
            <!--            <th scope="col">-->
            <!--              <span class="text-nowrap">Паспорт (дата выдачи)</span>-->
            <!--            </th>-->
            <!--            <th scope="col">-->
            <!--              <span class="text-nowrap">Паспорт (срок действия)</span>-->
            <!--            </th>-->
            <!--            <th scope="col">-->
            <!--              <span class="text-nowrap">Паспорт (орган выдачи)</span>-->
            <!--            </th>-->
            <!--            <th scope="col">-->
            <!--              <span class="text-nowrap">Идентификационный номер</span>-->
            <!--            </th>-->

            <th scope="col">
              <span class="text-nowrap">Иностранный язык </span>
            </th>

            <!--            <th scope="col">-->
            <!--              <div class="d-flex flex-row align-items-center">-->
            <!--                <nobr>Номер зачетной книжки</nobr>-->
            <!--                <div class="dropdown">-->
            <!--                  <button-->
            <!--                    class="btn dropdown-toggle"-->
            <!--                    type="button"-->
            <!--                    data-bs-toggle="dropdown"-->
            <!--                    aria-expanded="false"-->
            <!--                  ></button>-->
            <!--                  <ul class="dropdown-menu">-->
            <!--                    <li>-->
            <!--                      <button-->
            <!--                        class="dropdown-item"-->
            <!--                        @click="setOrdering('student_record_book_number')"-->
            <!--                      >-->
            <!--                        А -> Я-->
            <!--                      </button>-->
            <!--                    </li>-->
            <!--                    <li>-->
            <!--                      <button-->
            <!--                        class="dropdown-item"-->
            <!--                        @click="setOrdering('-student_record_book_number')"-->
            <!--                      >-->
            <!--                        Я -> А-->
            <!--                      </button>-->
            <!--                    </li>-->
            <!--                  </ul>-->
            <!--                </div>-->
            <!--              </div>-->
            <!--            </th>-->
            <th scope="col">
              <div class="d-flex flex-row align-items-center">
                <nobr>Номер сертификата по рус./ бел.</nobr>
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
                <nobr>Колличество баллов по русскому языку (сертификат)</nobr>
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
                <nobr>Что сдавал по русскому языку</nobr>
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
                <nobr>Что сдавал по белорусскому языку</nobr>
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
                <nobr>Номер сертификата по обществоведению</nobr>
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
                <nobr>Колличество баллов по обществоведению (сертификат)</nobr>
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
                <nobr>Что сдавал по обществоведению</nobr>
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
                <nobr>Номер сертификата по иностранному языку</nobr>
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
                <nobr>Что сдавал по иностранному языку</nobr>
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
                <nobr>Колличество баллов по русскому языку (аттестат)</nobr>
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
                <nobr>Колличество баллов по белорусскому языку (аттестат)</nobr>
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
                <nobr>Колличество баллов по обществоведению (аттестат)</nobr>
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
                <nobr>Колличество баллов по иностранному языку (аттестат)</nobr>
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
                <nobr>Средний балл (аттестат)</nobr>
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
              <div class="d-flex justify-content-center align-items-center">
                <input
                  type="number"
                  class="form-control me-2"
                  v-model="searchForm.entrance_year__gte"
                  style="width: 120px"
                />
                <input
                  type="number"
                  class="form-control"
                  v-model="searchForm.entrance_year__lte"
                  style="width: 120px"
                />
              </div>
            </th>

            <th style="min-width: 200px">
              <select class="form-select" v-model="searchForm.fpk_mag_choice">
                <option selected value="">-------</option>
                <option :value="1" key="1">ФПКиПРК</option>
                <option :value="2" key="2">Маг</option>
              </select>
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
              <select
                class="form-select"
                v-model="searchForm.gender"
                style="width: 200px"
              >
                <option selected value="">-------</option>
                <option value="1" key="1">Мужской</option>
                <option value="0" key="0">Женский</option>
              </select>
            </th>

            <th>
              <input
                type="text"
                class="form-control"
                v-model="searchForm.extra_data__icontains"
              />
            </th>

            <th>
              <input
                type="text"
                class="form-control"
                v-model="searchForm.comments_on_personal_file__icontains"
              />
            </th>

            <th>
              <input
                type="text"
                class="form-control"
                v-model="searchForm.last_name_rus__icontains"
                style="width: 200px"
              />
            </th>
            <th>
              <input
                type="text"
                class="form-control"
                v-model="searchForm.first_name_rus__icontains"
                style="width: 200px"
              />
            </th>

            <th>
              <input
                type="text"
                class="form-control"
                v-model="searchForm.patronymic_rus__icontains"
                style="width: 200px"
              />
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
                  style="width: 150px"
                />
                <input
                  type="text"
                  class="form-control"
                  v-model="searchForm.age_lte"
                  style="width: 150px"
                />
              </div>
            </th>
            <th>
              <select
                class="form-select"
                v-model="searchForm.foreign_language"
                style="width: 250px"
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

            <!--            <th>-->
            <!--              <input-->
            <!--                type="text"-->
            <!--                class="form-control"-->
            <!--                v-model="searchForm.student_record_book_number__icontains"-->
            <!--              />-->
            <!--            </th>-->
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
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="fpkprk in orderedMainList"
            :key="fpkprk.id"
            @dblclick="
              $router.push({
                name: 'fpk-mag-update',
                params: { id: fpkprk.id },
              })
            "
          >
            <td class="text-center">{{ fpkprk.serial_number }}</td>
            <td v-if="fpkprk.is_active"></td>

            <td v-else class="text-center">
              <font-awesome-icon :icon="['fas', 'lock']" />
            </td>
            <td class="text-center">{{ fpkprk.entrance_year }}</td>
            <td class="text-center">{{ fpkprk.get_fpk_mag_choice }}</td>
            <td>{{ fpkprk.get_component_organ }}</td>
            <td>{{ fpkprk.get_arrived_from_go_rovd }}</td>
            <td class="text-center">{{ fpkprk.get_gender }}</td>
            <td>{{ fpkprk.extra_data }}</td>
            <td>{{ fpkprk.comments_on_personal_file }}</td>
            <td>{{ fpkprk.last_name_rus }}</td>
            <td>{{ fpkprk.first_name_rus }}</td>
            <td>{{ fpkprk.patronymic_rus }}</td>
            <td class="text-center">{{ fpkprk.date_of_birth }}</td>
            <td class="text-center">{{ fpkprk.get_age }}</td>
            <td>{{ fpkprk.get_foreign_language }}</td>
            <td class="text-center">{{ fpkprk.rus_bel_ct_number }}</td>
            <td class="text-center">{{ fpkprk.rus_score_ct }}</td>
            <td class="text-center">{{ fpkprk.rus_ct_choice }}</td>
            <td class="text-center">{{ fpkprk.bel_score_ct }}</td>
            <td class="text-center">{{ fpkprk.bel_ct_choice }}</td>
            <td class="text-center">{{ fpkprk.social_science_ct_number }}</td>
            <td class="text-center">{{ fpkprk.social_science_score_ct }}</td>
            <td class="text-center">{{ fpkprk.social_science_ct_choice }}</td>
            <td class="text-center">{{ fpkprk.foreign_lang_ct_number }}</td>
            <td class="text-center">{{ fpkprk.foreign_lang_score_ct }}</td>
            <td class="text-center">{{ fpkprk.foreign_lang_ct_choice }}</td>
            <td class="text-center">{{ fpkprk.rus_score_cert }}</td>
            <td class="text-center">{{ fpkprk.bel_score_cert }}</td>
            <td class="text-center">{{ fpkprk.social_science_score_cert }}</td>
            <td class="text-center">{{ fpkprk.foreign_lang_score_cert }}</td>
            <td class="text-center">{{ fpkprk.education_average_score }}</td>
            <td class="text-center">{{ fpkprk.score_sum }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="my-3"></div>
  </div>
</template>

<script>
import { globalFPKPRKStudentAPIInstance } from "@/api/fpkprk/fpk_prk_studentAPI.js"
import { debounce } from "lodash/function"
import { mapGetters } from "vuex"
import { getQueryStringFromSearchForm } from "../../../utils.js"

export default {
  name: "FPKPRKTableView",
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
        { fieldName: "Звание", fieldValue: "get_rank" },
        { fieldName: "ФПКиПРК или МАГ", fieldValue: "get_fpk_mag_choice" },
        {
          fieldName: "Место работы и должность",
          fieldValue: "place_of_work_position",
        },
        {
          fieldName: "Номер зачетной книжки",
          fieldValue: "student_record_book_number",
        },
        { fieldName: "Иностранный язык", fieldValue: "get_foreign_language" },
        { fieldName: "Группа", fieldValue: "get_group" },
        { fieldName: "Дата поступления", fieldValue: "get_academy_start_date" },
        { fieldName: "Дата окончания", fieldValue: "get_academy_end_date" },
        { fieldName: "Профилизация", fieldValue: "get_profiling" },
        {
          fieldName: "Специальность (обучается)",
          fieldValue: "get_speciality",
        },
        { fieldName: "Специализация", fieldValue: "get_specialization" },
        {
          fieldName: "Направление служебной деятельности",
          fieldValue: "get_direction_service_activity",
        },
        { fieldName: "Курс", fieldValue: "year" },
        { fieldName: "Литера курса", fieldValue: "year_litera" },
        { fieldName: "Год набора", fieldValue: "entrance_year" },
        {
          fieldName: "Категория поступающего",
          fieldValue: "get_entrance_category",
        },
        { fieldName: "Комплектующий орган", fieldValue: "get_component_organ" },
        {
          fieldName: "Примечание для отдела кадров",
          fieldValue: "comments_on_personal_file",
        },
        {
          fieldName: "Замечания по личному делу",
          fieldValue: "extra_data",
        },

        { fieldName: "Средний бал", fieldValue: "education_average_score" },
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
      ],
      selectedFieldsForDataExport: ["last_name_rus", "first_name_rus"],
      searchForm: Object.assign({}, globalFPKPRKStudentAPIInstance.searchObj),
      BACKEND_PROTOCOL: import.meta.env.VITE_APP_BACKEND_PROTOCOL,
      BACKEND_HOST: import.meta.env.VITE_APP_BACKEND_HOST,
      BACKEND_PORT: import.meta.env.VITE_APP_BACKEND_PORT,
      fpkprkList: { count: 0, results: [], previous: null, next: null },
      fpkprkAPIInstance: globalFPKPRKStudentAPIInstance,
    }
  },
  async created() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      this.isLoading = true
      const response = await this.fpkprkAPIInstance.getItemsList()
      this.fpkprkList = await response.data
      this.isLoading = false
      this.setSerialNumbers()
    },
    async handleScroll() {
      const container = this.$refs.infinite_list
      if (
        container.scrollTop + container.clientHeight >=
          container.scrollHeight - 50 &&
        !this.isLoading
      ) {
        if (this.fpkprkList) {
          if (this.fpkprkList.next) {
            this.isLoading = true
            try {
              const response = await this.fpkprkAPIInstance.updateList(
                this.fpkprkList.next,
              )

              const newData = await response.data
              this.fpkprkList.results = [
                ...this.fpkprkList.results,
                ...newData.results,
              ]
              this.fpkprkList.next = newData.next
              this.fpkprkList.previous = newData.previous
              this.setSerialNumbers()
            } catch (error) {
              this.isError = true
            } finally {
              this.isLoading = false
            }
          }
        }
      }
    },
    setSerialNumbers() {
      let i = 1
      this.fpkprkList.results.forEach((item) => {
        item.serial_number = i
        i++
      })
    },
    debouncedSearch: debounce(async function () {
      this.isLoading = true
      this.fpkprkAPIInstance.searchObj = Object.assign({}, this.searchForm)
      try {
        const fpkprkResponse = await this.fpkprkAPIInstance.getItemsList()
        this.fpkprkList = await fpkprkResponse.data
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
      console.log(destination)
      if (this.selectedFieldsForDataExport.length === 0) {
        alert("Выберите хотя бы одно поле для экспорта!")
      } else {
        this.isExporting = true
        let export_data = {}

        export_data.query_string = getQueryStringFromSearchForm(this.searchForm)
        export_data.fields_for_export =
          this.selectedFieldsForDataExport.toString()
        export_data.destination = destination
        export_data.ordering = this.searchForm.ordering

        this.fpkprkAPIInstance.list_export(export_data).then((response) => {
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

    clearFilter() {
      this.searchForm = Object.assign(
        {},
        this.fpkprkAPIInstance.searchObjDefault,
      )
    },
    setOrdering(fieldName) {
      this.searchForm.ordering = fieldName
    },
  },
  computed: {
    orderedMainList() {
      return this.fpkprkList.results
    },
    orderedComponentOrgans() {
      return this.componentOrgans.results
    },
    orderedForeignLanguages() {
      return this.foreignLanguages.results
    },
    orderedMilitaryOffices() {
      return this.militaryOffices.results
    },
    orderedGorovds() {
      return this.gorovds.results
    },
    ...mapGetters({
      componentOrgans: "componentOrgans/getList",
      foreignLanguages: "foreignLanguages/getList",
      gorovds: "gorovds/getList",
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
