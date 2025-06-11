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
          <h1 class="modal-title fs-5">Экспорт данных</h1>
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
              >
                <font-awesome-icon :icon="['far', 'file-word']" />
              </button>
              <button
                  class="btn btn-link text-success"
                  style="font-size: inherit; color: inherit"
                  title="Экспорт в Excel"
                  @click="exportData('xlsx')"
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

  <!-- check terms modal-->

  <div
      class="modal fade"
      id="mainItemUpdateModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      ref="termsModal"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">
            Проверка сроков присвоения званий
          </h1>
          <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div>
            <table class="table">
              <thead>
              <tr>
                <th scope="col">ФИО</th>
                <th scope="col">Группа</th>
                <th scope="col">Текущее звание</th>
                <th scope="col">Должность</th>
                <th scope="col">
                  Планируемая дата присвоения очередного звания
                </th>
                <th scope="col">Количество дней до присвоения</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="cadet in rankTermsList" :key="cadet.id">
                <th scope="row">
                  <nobr>{{ cadet.get_full_name }}</nobr>
                </th>
                <th scope="row">{{ cadet.group }}</th>
                <th scope="row">{{ cadet.get_rank }}</th>
                <th scope="row">{{ cadet.get_position }}</th>
                <th scope="row">{{ cadet.get_next_rank_time }}</th>
                <th scope="row">{{ cadet.get_days_count_to_next_rank }}</th>
              </tr>
              </tbody>
            </table>
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
        <button class="btn btn-secondary me-3" @click="showExportDataModal">
          Экспорт&nbsp;&nbsp;<font-awesome-icon
            :icon="['fas', 'file-export']"
        />
        </button>
        <div class="dropdown">
          <button
              class="btn btn-secondary dropdown-toggle me-2"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
          >
            Доп. меню
          </button>
          <ul class="dropdown-menu">
            <li>
              <button class="dropdown-item" @click="checkTerms">
                Проверить сроки по званиям
              </button>
            </li>
          </ul>
        </div>
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
        @scroll="loadMoreData"
        ref="infinite_list"
        id="infinite_list"
    >
      <table class="table table-hover table-responsive" style="overflow: auto">
        <thead ref="thead">
        <tr>
          <th scope="col" class="text-center">№п.п.</th>
          <th scope="col">Активный</th>
          <th scope="col">
            <div class="d-flex flex-row align-items-center">
              <nobr>Пол</nobr>
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
              <nobr>Фамилия</nobr>
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
              <nobr>Имя</nobr>
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
              <nobr>Отчество</nobr>
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
              <nobr>Факультет</nobr>
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
                        @click="setOrdering('subdivision__subdivision_name')"
                    >
                      А -> Я
                    </button>
                  </li>
                  <li>
                    <button
                        class="dropdown-item"
                        @click="setOrdering('-subdivision__subdivision_name')"
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
              <nobr>Группа</nobr>
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
                        @click="setOrdering('group__group_name')"
                    >
                      А -> Я
                    </button>
                  </li>
                  <li>
                    <button
                        class="dropdown-item"
                        @click="setOrdering('-group__group_name')"
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
              <nobr>Звание</nobr>
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
                        @click="setOrdering('current_rank__rank')"
                    >
                      А -> Я
                    </button>
                  </li>
                  <li>
                    <button
                        class="dropdown-item"
                        @click="setOrdering('-current_rank__rank')"
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
              <nobr>Должность</nobr>
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
                        @click="setOrdering('current_position__position')"
                    >
                      А -> Я
                    </button>
                  </li>
                  <li>
                    <button
                        class="dropdown-item"
                        @click="setOrdering('-current_position__position')"
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
              <nobr>Специализация</nobr>
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
                          setOrdering('specialization__specialization_name')
                        "
                    >
                      А -> Я
                    </button>
                  </li>
                  <li>
                    <button
                        class="dropdown-item"
                        @click="
                          setOrdering('-specialization__specialization_name')
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
              <nobr>Направление ОРД</nobr>
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
                        @click="setOrdering('direction_ord__direction_name')"
                    >
                      А -> Я
                    </button>
                  </li>
                  <li>
                    <button
                        class="dropdown-item"
                        @click="setOrdering('-direction_ord__direction_name')"
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
              <nobr>Специальность</nobr>
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
                          setOrdering('current_speciality__speciality_name')
                        "
                    >
                      А -> Я
                    </button>
                  </li>
                  <li>
                    <button
                        class="dropdown-item"
                        @click="
                          setOrdering('-current_speciality__speciality_name')
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
              <nobr>Комплектующий орган</nobr>
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
          <th scope="col">
            <div class="d-flex flex-row align-items-center">
              <nobr>Дата рождения</nobr>
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
              <nobr>Возраст</nobr>
            </div>
          </th>
          <th scope="col">
            <nobr>Место рождения</nobr>
          </th>
          <th scope="col">
            <nobr>Адрес регистрации</nobr>
          </th>
          <th scope="col">
            <nobr>Адрес места жительства</nobr>
          </th>
          <th scope="col">
            <nobr>Номер телефона</nobr>
          </th>
          <th scope="col">
            <nobr>Личный номер</nobr>
          </th>
          <th scope="col">
            <nobr>Семейное положение</nobr>
          </th>
          <th scope="col">
            <nobr>Номер паспорта</nobr>
          </th>
          <th scope="col">
            <nobr>Паспорт (дата выдачи)</nobr>
          </th>
          <th scope="col">
            <nobr>Паспорт (срок действия)</nobr>
          </th>
          <th scope="col">
            <nobr>Паспорт (орган выдачи)</nobr>
          </th>
          <th scope="col">
            <nobr>Идентификационный номер</nobr>
          </th>
          <th scope="col">
            <nobr>Отец (фамилия)</nobr>
          </th>
          <th scope="col">
            <nobr>Отец (имя)</nobr>
          </th>
          <th scope="col">
            <nobr>Отец (отчество)</nobr>
          </th>
          <th scope="col">
            <nobr>Отец (дата рождекния)</nobr>
          </th>
          <th scope="col">
            <nobr>Отец (место работы)</nobr>
          </th>
          <th scope="col">
            <nobr>Отец (номер телефона)</nobr>
          </th>
          <th scope="col">
            <nobr>Мать (фамилия)</nobr>
          </th>
          <th scope="col">
            <nobr>Мать (имя)</nobr>
          </th>
          <th scope="col">
            <nobr>Мать (отчество)</nobr>
          </th>
          <th scope="col">
            <nobr>Мать (дата рождекния)</nobr>
          </th>
          <th scope="col">
            <nobr>Мать (место работы)</nobr>
          </th>
          <th scope="col">
            <nobr>Мать (номер телефона)</nobr>
          </th>
          <th scope="col">
            <nobr>Иностранный язык (изучал в школе)</nobr>
          </th>
          <th scope="col">
            <nobr>Иностранный язык (изучает сейчас)</nobr>
          </th>
          <th scope="col">
            <nobr>Начало обучения</nobr>
          </th>
          <th scope="col">
            <nobr>Окончание обучения</nobr>
          </th>
          <th scope="col">
            <nobr>Причина окончания обучения</nobr>
          </th>
          <th scope="col">
            <nobr>Статья окончания обучения</nobr>
          </th>
          <th scope="col">
            <nobr>Снятие с воинского учета</nobr>
          </th>
          <th scope="col">
            <div class="d-flex flex-row align-items-center">
              <nobr>Военкомат</nobr>
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
              <nobr>Номер зачетной книжки</nobr>
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
            <select class="form-select" v-model="searchForm.gender">
              <option selected value="">-------</option>
              <option value="1" key="1">Мужской</option>
              <option value="0" key="0">Женский</option>
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
          <th style="min-width: 200px">
            <v-select
                v-model="searchForm.subdivision__in"
                :options="orderedSubdivisions"
                label="subdivision_short_name"
                :reduce="(subdivision) => subdivision.id"
                multiple
            />
          </th>
          <th style="min-width: 200px">
            <v-select
                v-model="searchForm.group__in"
                :options="orderedGroups"
                label="group_name"
                :reduce="(group) => group.id"
                multiple
            />
          </th>
          <th>
            <v-select
                v-model="searchForm.current_rank__in"
                :options="orderedRanks"
                label="rank"
                :reduce="(rank) => rank.id"
                multiple
            />
          </th>
          <th>
            <v-select
                v-model="searchForm.current_position__in"
                :options="orderedPositions"
                label="position"
                :reduce="(current_position) => current_position.id"
                multiple
            />
          </th>

          <th>
            <v-select
                v-model="searchForm.specialization__in"
                :options="orderedSpecializations"
                label="specialization_name"
                :reduce="(specialization) => specialization.id"
                multiple
            />
          </th>
          <th>
            <v-select
                v-model="searchForm.direction_ord__in"
                :options="orderedDirectionOrds"
                label="direction_name"
                :reduce="(direction_ord) => direction_ord.id"
                multiple
            />
          </th>
          <th>
            <v-select
                v-model="searchForm.current_speciality__in"
                :options="orderedSpecialities"
                label="speciality_name"
                :reduce="(current_speciality) => current_speciality.id"
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
                v-model="searchForm.personal_number_mvd__icontains"
            />
          </th>
          <th>
            <select class="form-select" v-model="searchForm.marital_status">
              <option selected value="">-------</option>
              <option
                  v-for="maritalStatus in orderedMaritalStatuses"
                  :value="maritalStatus.id"
                  :key="maritalStatus.id"
              >
                {{ maritalStatus.marital_status }}
              </option>
            </select>
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
                  v-model="searchForm.academy_start_date__gte"
              />
              <input
                  type="date"
                  class="form-control"
                  v-model="searchForm.academy_start_date__lte"
              />
            </div>
          </th>
          <th>
            <div class="d-flex justify-content-center align-items-center">
              <input
                  type="date"
                  class="form-control me-2"
                  v-model="searchForm.academy_end_date__gte"
              />
              <input
                  type="date"
                  class="form-control"
                  v-model="searchForm.academy_end_date__lte"
              />
            </div>
          </th>
          <th scope="col">
            <v-select
                v-model="searchForm.graduation_reason__in"
                :options="orderedGraduationReasons"
                label="graduation_reason"
                :reduce="(graduation_reason) => graduation_reason.id"
                multiple
            />
          </th>
          <th scope="col">
            <input
                type="text"
                class="form-control"
                v-model="searchForm.graduation_reason_article__icontains"
            />
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
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="cadet in orderedMainList"
            :key="cadet.id"
            @dblclick="
              $router.push({ name: 'cadet-update', params: { id: cadet.id } })
            "
        >
          <td class="text-center">{{ cadet.serial_number }}</td>
          <td v-if="cadet.is_active"></td>
          <td v-else class="text-center">
            <font-awesome-icon :icon="['fas', 'lock']" />
          </td>
          <td>{{ cadet.get_gender }}</td>
          <td>{{ cadet.last_name_rus }}</td>
          <td>{{ cadet.first_name_rus }}</td>
          <td>{{ cadet.patronymic_rus }}</td>
          <td>{{ cadet.get_subdivision }}</td>
          <td>{{ cadet.get_group }}</td>
          <td>{{ cadet?.get_rank || "" }}</td>
          <td>{{ cadet.get_position || "" }}</td>
          <td>{{ cadet.get_specialization }}</td>
          <td>{{ cadet.get_direction_ord }}</td>
          <td>{{ cadet.get_speciality || "" }}</td>
          <td>{{ cadet.get_component_organ }}</td>

          <td class="text-center">{{ cadet.date_of_birth }}</td>
          <td class="text-center">{{ cadet.get_age }}</td>
          <td>{{ cadet.place_of_birth }}</td>
          <td>{{ cadet.address_registration }}</td>
          <td>{{ cadet.address_residence }}</td>
          <td>{{ cadet.phone_number }}</td>
          <td>{{ cadet.personal_number_mvd }}</td>
          <td>{{ cadet.get_marital_status }}</td>
          <td>{{ cadet.passport_number }}</td>
          <td>{{ cadet.passport_issue_date }}</td>
          <td>{{ cadet.passport_validity_period }}</td>
          <td>{{ cadet.passport_issue_authority }}</td>
          <td>{{ cadet.identification_number }}</td>
          <td>{{ cadet.father_last_name }}</td>
          <td>{{ cadet.father_first_name }}</td>
          <td>{{ cadet.father_patronymic }}</td>
          <td>{{ cadet.father_date_of_birth }}</td>
          <td>{{ cadet.father_place_of_work }}</td>
          <td>{{ cadet.father_phone_number }}</td>
          <td>{{ cadet.mother_last_name }}</td>
          <td>{{ cadet.mother_first_name }}</td>
          <td>{{ cadet.mother_patronymic }}</td>
          <td>{{ cadet.mother_date_of_birth }}</td>
          <td>{{ cadet.mother_place_of_work }}</td>
          <td>{{ cadet.mother_phone_number }}</td>
          <td>{{ cadet.get_foreign_language_was }}</td>
          <td>{{ cadet.get_foreign_language_will_be }}</td>
          <td>{{ cadet.academy_start_date }}</td>
          <td>{{ cadet.academy_end_date }}</td>
          <td>{{ cadet.get_graduation_reason }}</td>
          <td>{{ cadet.graduation_reason_article }}</td>

          <td>{{ cadet.removed_from_military_registration }}</td>
          <td>
            <nobr>{{ cadet.get_military_office }}</nobr>
          </td>
          <td>{{ cadet.student_record_book_number }}</td>
          <td>{{ cadet.rus_bel_ct_number }}</td>
          <td>{{ cadet.rus_score_ct }}</td>
          <td>{{ cadet.rus_ct_choice }}</td>
          <td>{{ cadet.bel_score_ct }}</td>
          <td>{{ cadet.bel_ct_choice }}</td>
          <td>{{ cadet.social_science_ct_number }}</td>
          <td>{{ cadet.social_science_score_ct }}</td>
          <td>{{ cadet.social_science_ct_choice }}</td>
          <td>{{ cadet.foreign_lang_ct_number }}</td>
          <td>{{ cadet.foreign_lang_score_ct }}</td>
          <td>{{ cadet.foreign_lang_ct_choice }}</td>
          <td>{{ cadet.rus_score_cert }}</td>
          <td>{{ cadet.bel_score_cert }}</td>
          <td>{{ cadet.social_science_score_cert }}</td>
          <td>{{ cadet.foreign_lang_score_cert }}</td>
          <td>{{ cadet.education_average_score }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="my-3"></div>
  </div>
</template>

<script>
import getCadetAPIInstance from "@/api/cadet/cadetAPI"
import { globalCadetAPIInstance } from "@/api/cadet/cadetAPI"

import { getLoadListFunction } from "../../../utils"
import { debounce } from "lodash/function"
import { PaginatorView } from "@/components/common"
import { mapGetters } from "vuex"

export default {
  name: "CadetListOkView",
  components: { PaginatorView },
  data() {
    return {
      isLoading: true,
      isError: false,
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
      cadetList: {
        count: "",
        results: [],
        previous: null,
        next: null,
      },
      searchForm: Object.assign({}, getCadetAPIInstance().searchObj),
      cadetAPIInstance: globalCadetAPIInstance,
      BACKEND_PROTOCOL: import.meta.env.VITE_APP_BACKEND_PROTOCOL,
      BACKEND_HOST: import.meta.env.VITE_APP_BACKEND_HOST,
      BACKEND_PORT: import.meta.env.VITE_APP_BACKEND_PORT,
      rankTermsList: [],
    }
  },
  async created() {
    await this.loadData()
  },
  methods: {
    async loadData() {
      const listFunction = getLoadListFunction.bind(this)
      this.isLoading = true
      this.isError = false
      try {
        const [cadets] = await Promise.all([listFunction("cadet")()])
        this.cadetList = cadets
        this.setSerialNumbers()
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
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
      let queryString = "?"
      for (let key in this.searchForm) {
        if (key.includes("__in")) {
          if (typeof this.searchForm[key] === "object") {
            const valArray = this.searchForm[key]
            let keyVal = ""
            valArray.forEach((val) => {
              keyVal = keyVal + `${key}=${val}&`
            })
            queryString = queryString + keyVal
          }
        } else {
          queryString = queryString + `${key}=${this.searchForm[key]}&`
        }
      }
      queryString =
          queryString + `fields_for_export=${this.selectedFieldsForDataExport}`
      queryString = queryString + `&destination=${destination}`
      this.cadetAPIInstance.list_export(queryString).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `file.${destination}`)
        document.body.appendChild(link)
        link.click()
      })
    },
    clearFilter() {
      this.searchForm = Object.assign(
          {},
          this.cadetAPIInstance.searchObjDefault,
      )
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
    setOrdering(fieldName) {
      this.searchForm.ordering = fieldName

      // let orderingArray = []
      // if (this.searchForm.ordering) {
      //   orderingArray = this.searchForm.ordering.split(",")
      // }
      // console.log("orderingArray", orderingArray)
      // let orderingArrayWithoutFieldName = orderingArray.filter(
      //   (item) => !item.includes(fieldName.replace("-", "")),
      // )
      // console.log(
      //   "orderingArrayWithoutFieldName",
      //   orderingArrayWithoutFieldName,
      // )
      // orderingArrayWithoutFieldName.unshift(fieldName)
      // this.searchForm.ordering = orderingArrayWithoutFieldName.toString()
      // console.log("searchForm.ordering", this.searchForm.ordering)
    },
    async loadMoreData() {
      const listElem = this.$refs["infinite_list"]
      if (
          listElem.scrollTop + listElem.clientHeight >=
          listElem.scrollHeight - 1
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
    setSerialNumbers() {
      let i = 1
      this.cadetList.results.forEach((item) => {
        item.serial_number = i
        i++
      })
    },
    async checkTerms() {
      let queryString = "?"
      for (let key in this.searchForm) {
        if (key.includes("__in")) {
          if (typeof this.searchForm[key] === "object") {
            const valArray = this.searchForm[key]
            let keyVal = ""
            valArray.forEach((val) => {
              keyVal = keyVal + `${key}=${val}&`
            })
            queryString = queryString + keyVal
          }
        } else {
          queryString = queryString + `${key}=${this.searchForm[key]}&`
        }
      }
      const response = await this.$axios.get(
          `${this.BACKEND_PROTOCOL}://${this.BACKEND_HOST}:${this.BACKEND_PORT}/api/ranks-terms/${queryString}`,
      )
      this.rankTermsList = await response.data
      let termsModal = this.$refs.termsModal
      let myModal = new bootstrap.Modal(termsModal, {
        keyboard: false,
      })
      myModal.show()
    },
  },
  computed: {
    orderedMainList() {
      return this.cadetList.results
    },
    orderedCadetCategories() {
      return this.categories.results
    },
    orderedSubdivisions() {
      return this.subdivisions.results.filter(
          (subdivision) => subdivision.subdivision_category == "1",
      )
    },
    orderedGroups() {
      return this.groups.results
    },
    orderedRanks() {
      return this.ranks.results
    },
    orderedSpecialities() {
      return this.specialities.results
    },
    orderedPositions() {
      return this.positions.results.filter(
          (position) => position.position_category == "1",
      )
    },
    orderedMaritalStatuses() {
      return this.maritalStatuses.results
    },
    orderedSpecializations() {
      return this.specializations.results
    },
    orderedDirectionOrds() {
      return this.directionsOrd.results
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
    ...mapGetters({
      groups: "groups/getList",
      ranks: "ranks/getList",
      subdivisions: "subdivisions/getList",
      specialities: "specialities/getList",
      positions: "positions/getList",
      categories: "personCategories/getList",
      maritalStatuses: "maritalStatuses/getList",
      specializations: "specializations/getList",
      directionsOrd: "directionsORD/getList",
      componentOrgans: "componentOrgans/getList",
      passportIssueAuthorities: "passportAuthorities/getList",
      foreignLanguages: "foreignLanguages/getList",
      militaryOffices: "militaryOffices/getList",
      graduationReasons: "graduationReasons/getList",
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
