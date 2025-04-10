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
        min-height: calc(100vh - 260px);
        max-height: calc(100vh - 260px);
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
            <th scope="col">Фото</th>
            <!--            <th scope="col">-->
            <!--              <div class="d-flex flex-row align-items-center">-->
            <!--                <nobr>id</nobr>-->
            <!--                <div class="dropdown">-->
            <!--                  <button-->
            <!--                    class="btn dropdown-toggle"-->
            <!--                    type="button"-->
            <!--                    data-bs-toggle="dropdown"-->
            <!--                    aria-expanded="false"-->
            <!--                  ></button>-->
            <!--                  <ul class="dropdown-menu">-->
            <!--                    <li>-->
            <!--                      <button class="dropdown-item" @click="setOrdering('id')">-->
            <!--                        А -> Я-->
            <!--                      </button>-->
            <!--                    </li>-->
            <!--                    <li>-->
            <!--                      <button class="dropdown-item" @click="setOrdering('-id')">-->
            <!--                        Я -> А-->
            <!--                      </button>-->
            <!--                    </li>-->
            <!--                  </ul>-->
            <!--                </div>-->
            <!--              </div>-->
            <!--            </th>-->
            <th scope="col">Активный</th>
            <th scope="col">
              <div class="d-flex flex-row align-items-center">
                <nobr>Категория</nobr>
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
                        @click="setOrdering('category__category')"
                      >
                        А -> Я
                      </button>
                    </li>
                    <li>
                      <button
                        class="dropdown-item"
                        @click="setOrdering('-category__category')"
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
          </tr>
          <tr>
            <th></th>
            <th></th>
            <!--            <th scope="col"></th>-->
            <th>
              <select class="form-select" v-model="searchForm.is_active">
                <option selected value="">-------</option>
                <option value="true" key="1">Да</option>
                <option value="false" key="0">Нет</option>
              </select>
            </th>
            <th style="min-width: 200px">
              <v-select
                v-model="searchForm.category__in"
                :options="orderedCadetCategories"
                label="category"
                :reduce="(category) => category.id"
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
            <td>
              <img
                v-if="cadet.photo"
                :src="cadet.photo"
                class="img-thumbnail bg-body border-0"
                alt="..."
                style="width: 50px"
              />
              <img
                v-else
                src="../../assets/without_photo.jpg"
                class="img-thumbnail bg-body border-0"
                alt="..."
                style="width: 50px"
              />
            </td>
            <!--            <td>{{ cadet.id }}</td>-->
            <td v-if="cadet.is_active"></td>
            <td v-else class="text-center">
              <font-awesome-icon :icon="['fas', 'lock']" />
            </td>
            <td>{{ cadet.get_category }}</td>
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
        { fieldName: "Фамилия", fieldValue: "last_name_rus" },
        { fieldName: "Имя", fieldValue: "first_name_rus" },
        { fieldName: "Отчество", fieldValue: "patronymic_rus" },
        { fieldName: "Дата рождения", fieldValue: "date_of_birth" },
        { fieldName: "Возраст", fieldValue: "get_age" },
        { fieldName: "Пол", fieldValue: "get_gender" },
        {
          fieldName: "Факультет",
          fieldValue: "get_subdivision",
        },
        {
          fieldName: "Группа",
          fieldValue: "get_group",
        },
        {
          fieldName: "Звание",
          fieldValue: "get_rank",
        },
        {
          fieldName: "Должность",
          fieldValue: "get_position",
        },
        {
          fieldName: "Специализация",
          fieldValue: "get_specialization",
        },
        {
          fieldName: "Направление ОРД",
          fieldValue: "get_direction_ord",
        },
        {
          fieldName: "Специальность",
          fieldValue: "get_speciality",
        },
        {
          fieldName: "Комплектующий орган",
          fieldValue: "get_component_organ",
        },
        {
          fieldName: "Личный номер (жетон)",
          fieldValue: "personal_number_mvd",
        },
        {
          fieldName: "Дата поступления",
          fieldValue: "academy_start_date",
        },
        {
          fieldName: "Дата окончания",
          fieldValue: "academy_end_date",
        },
        {
          fieldName: "Военкомат",
          fieldValue: "get_military_office",
        },

        { fieldName: "Место рождения", fieldValue: "place_of_birth" },
        {
          fieldName: "Место жительства (проживания)",
          fieldValue: "address_residence",
        },
        {
          fieldName: "Место жительства (регистрация)",
          fieldValue: "address_registration",
        },
        {
          fieldName: "Номер телефона",
          fieldValue: "phone_number",
        },
        {
          fieldName: "Семейное положение",
          fieldValue: "marital_status",
        },
        {
          fieldName: "Номер паспорта",
          fieldValue: "passport_number",
        },
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
          fieldName: "Идентификационный номер",
          fieldValue: "identification_number",
        },
        {
          fieldName: "Снят с воинского учета",
          fieldValue: "removed_from_military_registration",
        },
        {
          fieldName: "Причина окончания",
          fieldValue: "get_graduation_reason",
        },
        {
          fieldName: "Причина окончания (Статья)",
          fieldValue: "graduation_reason_article",
        },
        {
          fieldName: "Причина окончания (доп. данные)",
          fieldValue: "graduation_extra_data",
        },
        {
          fieldName: "Прибыл из ГО-РОВД",
          fieldValue: "get_arrived_from_go_rovd",
        },
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
      let thead = this.$refs.thead
      console.log(thead.getBoundingClientRect())
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
      this.$axios
        .get(
          `${this.BACKEND_PROTOCOL}://${this.BACKEND_HOST}:${this.BACKEND_PORT}/api/list-export/${queryString}`,
          { responseType: "blob" },
        )
        .then((response) => {
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
    async updatePaginator(url) {
      this.isLoading = true
      try {
        const response = await this.cadetAPIInstance.updateList(url)
        this.cadetList = await response.data
      } catch (error) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
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

>>> {
  --vs-controls-color: #664cc3;
  --vs-border-color: #664cc3;

  --vs-dropdown-bg: #282c34;
  --vs-dropdown-color: #cc99cd;
  --vs-dropdown-option-color: #cc99cd;

  --vs-selected-bg: #664cc3;
  --vs-selected-color: #eeeeee;

  --vs-search-input-color: #eeeeee;

  --vs-dropdown-option--active-bg: #664cc3;
  --vs-dropdown-option--active-color: #eeeeee;
}
</style>
