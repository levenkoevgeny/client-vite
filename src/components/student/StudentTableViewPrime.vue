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

  <div
    class="modal fade"
    id="libraryCardErrorModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    ref="libraryCardErrorModal"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">
            Исправте следующие ошибки для формирования документа:
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div style="max-height: 350px; overflow-y: auto">
            <div
              class="alert alert-danger my-1"
              v-for="error in library_cards_error_array"
            >
              {{ error }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container-fluid" style="height: 92%">
    <div
      v-if="isLoading || isCommonLoading"
      style="height: calc(100vh - 170px)"
      class="d-flex justify-content-center align-items-center"
    >
      <div class="spinner-grow" style="width: 3rem; height: 3rem" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else class="h-100 d-flex flex-column">
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
          <div class="dropdown">
            <button
              class="btn btn-secondary dropdown-toggle me-3"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Выходные документы&nbsp;&nbsp;<font-awesome-icon
                :icon="['fas', 'print']"
              />
            </button>
            <ul class="dropdown-menu">
              <li>
                <a
                  class="dropdown-item"
                  @click="make_csv()"
                  style="cursor: pointer"
                  >txt для импорта в ALIS (по фильтру)
                </a>
              </li>
              <li>
                <a
                  class="dropdown-item"
                  @click="make_library_card()"
                  style="cursor: pointer"
                  >Читатательский билет (по выбранным записям)</a
                >
              </li>
              <li>
                <a
                  class="dropdown-item"
                  @click="make_examination_sheet()"
                  style="cursor: pointer"
                  >Экзаменационная ведомость</a
                >
              </li>
              <li>
                <a
                  class="dropdown-item"
                  @click="make_group_sheet()"
                  style="cursor: pointer"
                  >Список группы</a
                >
              </li>
            </ul>
          </div>
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

      <DataTable
        v-model:selection="selectedStudents"
        :value="orderedMainList"
        tableStyle="min-width: 50rem"
        v-model:filters="filters"
        @update:filters="updateSearchFormPrime"
        paginator
        @page="
          (event) => {
            console.log(event)
          }
        "
        v-model:rows="limit"
        v-model:first="offset"
        :rows-per-page-options="[1, 2, 3, 5, 50, 100, 200, 500]"
        scrollable
        scrollHeight="flex"
        filterDisplay="menu"
        selection-mode="multiple"
        @row-dblclick="
          ({ data }) => {
            $router.push({
              name: 'student-update',
              params: { id: data.id },
            })
          }
        "
      >
        <template #header>
          <div style="text-align: left">
            <MultiSelect
              name="selected-columns"
              filter
              :modelValue="selectedColumns"
              :options="columns"
              optionLabel="header"
              @update:modelValue="changeSelectedColumnsDisplay"
              display="chip"
              placeholder="Выберите колонки для отображения"
              :maxSelectedLabels="3"
              selectedItemsLabel="Выбрано {} колонок"
            />
          </div>
        </template>

        <Column style="width: 1%" selection-mode="multiple"></Column>

        <Column header="№ п.п." style="width: 1%">
          <template #body="{ index }">{{ index + 1 }}</template>
        </Column>
        <template v-for="column in selectedColumns">
          <template v-if="column.optionFilter">
            <Column
              :show-filter-operator="false"
              :show-filter-menu="true"
              :field="column.field"
              :header="column.header"
              :filter-match-mode-options="column.optionFilter"
              :pt="{
                columnheadercontent: { style: 'white-space: nowrap' },
              }"
              style="width: 10%"
            >
              <template #filter="{ filterModel }">
                <template v-if="column.inputType === 'multiSelect'">
                  <MultiSelect
                    display="chip"
                    filter
                    :maxSelectedLabels="3"
                    selectedItemsLabel="Выбрано {} колонок"
                    v-model="filterModel.value"
                    :options="getComputedDataByName(column.optionsName)"
                    :option-label="column.optLabel"
                    :option-value="column.optValue"
                  />
                </template>
                <template v-else-if="column.inputType === 'select'">
                  <Select
                    display="chip"
                    filter
                    :maxSelectedLabels="3"
                    v-model="filterModel.value"
                    :options="getComputedDataByName(column.optionsName)"
                    :option-label="column.optLabel"
                    :option-value="column.optValue"
                  />
                </template>
                <template v-else-if="column.inputType === 'number'">
                  <InputNumber
                    :useGrouping="false"
                    mode="decimal"
                    showButtons
                    v-model="filterModel.value"
                    fluid
                  />
                </template>

                <template v-else>
                  <InputText v-model="filterModel.value" />
                </template>
              </template>
              <template #body="slotProps">
                <template v-if="column.isBooleanField">
                  <font-awesome-icon
                    :icon="['fas', 'check']"
                    v-if="slotProps.data[slotProps.field]"
                  />
                </template>
                <template v-else>
                  {{ slotProps.data[slotProps.field] }}</template
                >
              </template>
            </Column>
          </template>
          <template v-else>
            <Column
              :pt="{
                columnheadercontent: { style: 'white-space: nowrap' },
              }"
              style="width: 10%"
              :field="column.field"
              :header="column.header"
            >
              <template #body="slotProps">
                <template v-if="column.isBooleanField">
                  <font-awesome-icon
                    :icon="['fas', 'check']"
                    v-if="slotProps.data[slotProps.field]"
                  />
                </template>
                <template v-else>
                  {{ slotProps.data[slotProps.field] }}</template
                >
              </template>
            </Column>
          </template>
        </template>
        <!--        <template #paginatorcontainer="{ prevPageCallback, nextPageCallback }">-->
        <!--          <div @click="(getPreviousStudent, prevPageCallback)" class="mt-3">-->
        <!--            <button class="btn btn-light" :disabled="!studentList.previous">-->
        <!--              <font-awesome-icon :icon="['fas', 'chevron-left']" />-->
        <!--            </button>-->
        <!--          </div>-->
        <!--          <div @click="nextPageCallback" class="mt-3">-->
        <!--            <button class="btn btn-light" :disabled="!studentList.next">-->
        <!--              <font-awesome-icon :icon="['fas', 'chevron-right']" />-->
        <!--            </button>-->
        <!--          </div>-->
        <!--        </template>-->
      </DataTable>
    </div>
  </div>
</template>

<script>
import {
  MultiSelect,
  Select,
  Row,
  ColumnGroup,
  Column,
  DataTable,
  InputText,
  InputNumber,
} from "primevue"
import { globalStudentAPIInstance } from "@/api/student/studentAPI.js"
import { getQueryStringFromSearchForm } from "../../.././utils.js"
import { mapGetters } from "vuex"
import getGroupAPIInstance from "@/api/cadet/groupAPI.js"
import { FilterService as filterService } from "@primevue/core/api"

export default {
  name: "StudentTableViewPrime",
  components: {
    InputNumber,
    DataTable,
    Column,
    ColumnGroup,
    Row,
    MultiSelect,
    Select,
    InputText,
  },
  data() {
    return {
      isLoading: true,
      isExporting: false,
      isDocumentProcessing: false,
      limit: 1,
      offset: 0,
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
        {
          fieldName: "Место жительства (регистрация)",
          fieldValue: "address_registration",
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
          fieldName: "Группа по физичевкой культуре",
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
          fieldName: "Сумма баллов",
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
          fieldName: "Номер зачетной книжки",
          fieldValue: "student_record_book_number",
        },
        {
          fieldName: "Номер договора",
          fieldValue: "contract_number",
        },
        {
          fieldName: "Звание",
          fieldValue: "rank",
        },
        {
          fieldName: "Место работы и должность",
          fieldValue: "place_of_work",
        },
        {
          fieldName: "Место работы",
          fieldValue: "place_of_work",
        },
        {
          fieldName: "Наименование ведомства",
          fieldValue: "department",
        },
        {
          fieldName: "Из многодетной семьи",
          fieldValue: "is_from_large_family",
        },
        {
          fieldName: "Льгота",
          fieldValue: "get_privilege_1",
        },
        {
          fieldName: "ID считывателя карты пропуска",
          fieldValue: "get_pass_card_uuid",
        },
        {
          fieldName: "Номер бланка студенческого билета",
          fieldValue: "get_student_blank_number",
        },
      ],
      selectedFieldsForDataExport: ["last_name_rus", "first_name_rus"],
      searchForm: Object.assign({}, globalStudentAPIInstance.searchObj),
      studentList: { count: 0, results: [], previous: null, next: null },
      studentAPIInstance: globalStudentAPIInstance,
      columns: [
        {
          header: "Активный",
          field: "is_active",
          isBooleanField: true,
          inputType: "select",
          optionsName: "booleanOptions",
          optLabel: "activeType",
          optValue: "activeValue",
          optionFilter: [{ label: "Выберите", value: "exact" }],
        },
        {
          header: "Форма обучения",
          field: "get_education_form",
          inputType: "multiSelect",
          optionsName: "orderedEducationForms",
          optLabel: "education_form",
          optValue: "id",
          optionFilter: [{ label: "Выберите", value: "__in" }],
        },

        {
          header: "Курс",
          field: "year",
          inputType: "number",
          optionFilter: [{ label: "Равно", value: "exact" }],
        },

        {
          header: "Литера курса",
          field: "year_litera",
          optionFilter: [{ label: "Равно", value: "exact" }],
        },
        {
          header: "Группа",
          field: "get_group",
          inputType: "multiSelect",
          optionsName: "orderedGroups",
          optLabel: "group_name",
          optValue: "id",
          optionFilter: [{ label: "Выберите", value: "__in" }],
        },
        {
          header: "Фамилия",
          field: "last_name_rus",
          optionFilter: [{ label: "Содержит", value: "__icontains" }],
        },
        {
          header: "Имя",
          field: "first_name_rus",
          optionFilter: [{ label: "Содержит", value: "__icontains" }],
        },
        {
          header: "Отчество",
          field: "patronymic_rus",
          optionFilter: [{ label: "Содержит", value: "__icontains" }],
        },
        {
          header: "Номер зачетной книжки",
          field: "student_record_book_number",
          optionFilter: [{ label: "Содержит", value: "__icontains" }],
        },
        {
          header: "Номер договора",
          field: "contract_number",
          optionFilter: [{ label: "Содержит", value: "__icontains" }],
        },
        {
          header: "Год набора",
          field: "entrance_year",
          inputType: "number",
          optionFilter: [
            { label: "Больше или равно", value: "__gte" },
            { label: "Меньше или равно", value: "__lte" },
          ],
        },
        {
          header: "Сумма баллов",
          field: "score_sum",
          inputType: "number",
          optionFilter: [
            { label: "Больше или равно", value: "__gte" },
            { label: "Меньше или равно", value: "__lte" },
          ],
        },
        {
          header: "Социальный статус",
          field: "get_social_status",
          inputType: "multiSelect",
          optionsName: "orderedSocialStatuses",
          optLabel: "social_status",
          optValue: "id",
          optionFilter: [{ label: "Выберите", value: "__in" }],
        },
        {
          header: "Место работы и должность",
          field: "place_of_work",
          optionFilter: [{ label: "Содержит", value: "__icontains" }],
        },
        {
          header: "Возраст",
          field: "get_age",
          inputType: "number",
          optionFilter: [
            { label: "Больше или равно", value: "_gte" },
            { label: "Меньше или равно", value: "_lte" },
          ],
        },
        {
          header: "Пол",
          field: "get_gender",
          inputType: "select",
          optionsName: "genderOptions",
          optLabel: "genderName",
          optValue: "genderValue",
          optionFilter: [{ label: "Выберите", value: "exact" }],
        },
        {
          header: "Область и место проживания",
          field: "get_residence_region",
          inputType: "multiSelect",
          optionsName: "orderedCountryRegions",
          optLabel: "country_region",
          optValue: "id",
          optionFilter: [{ label: "Выберите", value: "__in" }],
        },
        {
          header: "Образование",
          field: "education_kind",
          inputType: "multiSelect",
          optionsName: "orderedEducationKinds",
          optLabel: "education",
          optValue: "id",
          optionFilter: [{ label: "Выберите", value: "__in" }],
        },
        {
          header: "Группа по физической культуре",
          field: "get_ppfl_test",
          inputType: "multiSelect",
          optionsName: "orderedPpflCategories",
          optLabel: "category",
          optValue: "id",
          optionFilter: [{ label: "Выберите", value: "__in" }],
        },
        {
          header: "Группа здоровья",
          field: "get_health_group",
          inputType: "multiSelect",
          optionsName: "orderedHealthGroups",
          optLabel: "health_group",
          optValue: "id",
          optionFilter: [{ label: "Выберите", value: "__in" }],
        },
        {
          header: "Иностранный язык (изучал в школе)",
          field: "get_foreign_language_was",
          inputType: "select",
          optionsName: "orderedForeignLanguages",
          optLabel: "foreign_language",
          optValue: "id",
          optionFilter: [{ label: "Выберите", value: "exact" }],
        },
        {
          header: "Иностранный язык (будет изучать)",
          field: "get_foreign_language_will_be",
          inputType: "select",
          optionsName: "orderedForeignLanguages",
          optLabel: "foreign_language",
          optValue: "id",
          optionFilter: [{ label: "Выберите", value: "exact" }],
        },
        {
          header: "ВПК",
          field: "get_vpk",
          inputType: "multiSelect",
          optionsName: "orderedVpkCategories",
          optLabel: "category",
          optValue: "id",
          optionFilter: [{ label: "Выберите", value: "__in" }],
        },
        {
          header: "ВПК (данные)",
          field: "vpk_data",
          optionFilter: [{ label: "Содержит", value: "__icontains" }],
        },
        {
          header: "Образование (город/село)",
          field: "get_education_location_kind",
          inputType: "multiSelect",
          optionsName: "orderedEducationLocalityKinds",
          optLabel: "education_location_kind",
          optValue: "id",
          optionFilter: [{ label: "Выберите", value: "__in" }],
        },
        {
          header: "Уровень образования",
          field: "get_education_level",
          inputType: "multiSelect",
          optionsName: "orderedEducationLevels",
          optLabel: "education_level",
          optValue: "id",
          optionFilter: [{ label: "Выберите", value: "__in" }],
        },
        {
          header: "Год окончания",
          field: "education_graduating_end_year",
          inputType: "number",
          optionFilter: [
            { label: "Больше или равно", value: "__gte" },
            { label: "Меньше или равно", value: "__lte" },
          ],
        },
        {
          header: "Медаль",
          field: "get_medal",
          inputType: "multiSelect",
          optionsName: "orderedMedals",
          optLabel: "medal_kind",
          optValue: "id",
          optionFilter: [{ label: "Выберите", value: "__in" }],
        },
        {
          header: "Количество баллов по русскому языку (сертификат)",
          field: "rus_score_ct",
          inputType: "number",
          optionFilter: [
            { label: "Больше или равно", value: "__gte" },
            { label: "Меньше или равно", value: "__lte" },
          ],
        },
        {
          header: "Что сдавал по русскому языку",
          field: "rus_ct_choice",
          inputType: "select",
          optionsName: "ctChoiceOptions",
          optLabel: "choice",
          optValue: "choiceValue",
          optionFilter: [{ label: "Выберите", value: "exact" }],
        },
        {
          header: "Количество баллов по белорусскому языку (сертификат)",
          field: "bel_score_ct",
          inputType: "number",
          optionFilter: [
            { label: "Больше или равно", value: "__gte" },
            { label: "Меньше или равно", value: "__lte" },
          ],
        },
        {
          header: "Что сдавал по белорусскому языку",
          field: "bel_ct_choice",
          inputType: "select",
          optionsName: "ctChoiceOptions",
          optLabel: "choice",
          optValue: "choiceValue",
          optionFilter: [{ label: "Выберите", value: "exact" }],
        },
        {
          header: "Количество баллов по обществоведению (сертификат)",
          field: "social_science_score_ct",
          inputType: "number",
          optionFilter: [
            { label: "Больше или равно", value: "__gte" },
            { label: "Меньше или равно", value: "__lte" },
          ],
        },
        {
          header: "Что сдавал по обществоведению",
          field: "social_science_ct_choice",
          inputType: "select",
          optionsName: "ctChoiceOptions",
          optLabel: "choice",
          optValue: "choiceValue",
          optionFilter: [{ label: "Выберите", value: "exact" }],
        },
        {
          header: "Количество баллов по иностранному языку (сертификат)",
          field: "foreign_lang_score_ct",
          inputType: "number",
          optionFilter: [
            { label: "Больше или равно", value: "__gte" },
            { label: "Меньше или равно", value: "__lte" },
          ],
        },
        {
          header: "Что сдавал по иностранному языку",
          field: "foreign_lang_ct_choice",
          inputType: "select",
          optionsName: "ctChoiceOptions",
          optLabel: "choice",
          optValue: "choiceValue",
          optionFilter: [{ label: "Выберите", value: "exact" }],
        },
        {
          header: "Средний балл (аттестат)",
          field: "education_average_score",
          inputType: "number",
          optionFilter: [
            { label: "Больше или равно", value: "__gte" },
            { label: "Меньше или равно", value: "__lte" },
          ],
        },
        {
          header: "3 ЦТ",
          field: "has_3_ct",
          isBooleanField: true,
          inputType: "select",
          optionsName: "booleanOptions",
          optLabel: "activeType",
          optValue: "activeValue",
          optionFilter: [{ label: "Выберите", value: "exact" }],
        },
        {
          header: "2 ЦЭ",
          field: "has_2_ce",
          isBooleanField: true,
          inputType: "select",
          optionsName: "booleanOptions",
          optLabel: "activeType",
          optValue: "activeValue",
          optionFilter: [{ label: "Выберите", value: "exact" }],
        },
        {
          header: "Количество баллов по русскому языку (аттестат)",
          field: "rus_score_cert",
          inputType: "number",
          optionFilter: [
            { label: "Больше или равно", value: "__gte" },
            { label: "Меньше или равно", value: "__lte" },
          ],
        },
        {
          header: "Количество баллов по белорусскому языку (аттестат)",
          field: "bel_score_cert",
          inputType: "number",
          optionFilter: [
            { label: "Больше или равно", value: "__gte" },
            { label: "Меньше или равно", value: "__lte" },
          ],
        },
        {
          header: "Количество баллов по обществоведению (аттестат)",
          field: "social_science_score_cert",
          inputType: "number",
          optionFilter: [
            { label: "Больше или равно", value: "__gte" },
            { label: "Меньше или равно", value: "__lte" },
          ],
        },
        {
          header: "Количество баллов по иностранному языку (аттестат)",
          field: "foreign_lang_score_cert",
          inputType: "number",
          optionFilter: [
            { label: "Больше или равно", value: "__gte" },
            { label: "Меньше или равно", value: "__lte" },
          ],
        },
        // {
        //   header: "Специальность (обучается)",
        //   field: "get_speciality",
        // },
        // {
        //   header: "Специальность (поступает)",
        //   field: "get_speciality_1",
        // },
        {
          header: "Примечание по личному делу",
          field: "extra_data",
        },
      ],
      selectedColumns: [],
      filters: {},
      searchNamesObj: {
        get_group: "group",
        get_age: "age",
        get_education_form: "education_form",
        get_social_status: "social_status",
        get_gender: "gender",
        get_residence_region: "residence_region",
        get_foreign_language_was: "foreign_language_was",
        get_foreign_language_will_be: "foreign_language_will_be",
        get_vpk: "vpk",
        get_education_location_kind: "education_location_kind",
        get_education_level: "education_level",
        get_medal: "medal",
        get_ppfl_test: "ppfl_test",
        get_health_group: "health_group",
      },
      selectedStudents: [],
      groupAPIInstance: getGroupAPIInstance(),
      library_cards_error_array: [],
    }
  },
  async created() {
    if (localStorage.getItem("filterSession")) {
      this.filters = JSON.parse(localStorage.getItem("filterSession"))
      await this.updateSearchFormPrime(this.filters)
    } else {
      await this.clearFilter()
    }
    if (localStorage.getItem("SessionSelectedColumnsByDisplay")) {
      this.selectedColumns = JSON.parse(
        localStorage.getItem("SessionSelectedColumnsByDisplay"),
      )
    }
    filterService.register("__icontains", () => true)
    filterService.register("__in", () => true)
    filterService.register("__gte", () => true)
    filterService.register("_gte", () => true)
    filterService.register("__lte", () => true)
    filterService.register("_lte", () => true)
    filterService.register("exact", () => true)
  },
  methods: {
    async loadData() {
      this.isLoading = true
      const response = await this.studentAPIInstance.getItemsList()
      this.studentList = await response.data
      this.isLoading = false
    },
    async clearFilter() {
      this.filters = {
        category: {
          value: [3, 4],
          matchMode: "__in",
        },
        is_active: {
          value: null,
          matchMode: "exact",
        },
        get_education_form: {
          value: null,
          matchMode: "__in",
        },
        year: {
          value: null,
          matchMode: "exact",
        },
        year_litera: {
          value: null,
          matchMode: "exact",
        },
        get_group: {
          value: null,
          matchMode: "__in",
        },
        last_name_rus: {
          value: null,
          matchMode: "__icontains",
        },
        first_name_rus: {
          value: null,
          matchMode: "__icontains",
        },
        patronymic_rus: {
          value: null,
          matchMode: "__icontains",
        },
        student_record_book_number: {
          value: null,
          matchMode: "__icontains",
        },
        contract_number: {
          value: null,
          matchMode: "__icontains",
        },
        entrance_year: {
          operator: "AND",
          constraints: [
            {
              value: null,
              matchMode: "__gte",
            },
          ],
        },
        score_sum: {
          operator: "AND",
          constraints: [
            {
              value: null,
              matchMode: "__gte",
            },
          ],
        },
        get_social_status: {
          value: null,
          matchMode: "__in",
        },
        place_of_work: {
          value: null,
          matchMode: "__icontains",
        },
        get_age: {
          operator: "AND",
          constraints: [
            {
              value: null,
              matchMode: "_gte",
            },
          ],
        },
        get_gender: {
          value: null,
          matchMode: "exact",
        },
        get_residence_region: {
          value: null,
          matchMode: "__in",
        },
        education_kind: {
          value: null,
          matchMode: "__in",
        },
        get_ppfl_test: {
          value: null,
          matchMode: "__in",
        },
        get_health_group: {
          value: null,
          matchMode: "__in",
        },
        get_foreign_language_was: {
          value: null,
          matchMode: "exact",
        },
        get_foreign_language_will_be: {
          value: null,
          matchMode: "exact",
        },
        get_vpk: {
          value: null,
          matchMode: "__in",
        },
        vpk_data: {
          value: null,
          matchMode: "__icontains",
        },
        get_education_location_kind: {
          value: null,
          matchMode: "__in",
        },
        get_education_level: {
          value: null,
          matchMode: "__in",
        },
        education_graduating_end_year: {
          operator: "AND",
          constraints: [
            {
              value: null,
              matchMode: "__gte",
            },
          ],
        },
        get_medal: {
          value: null,
          matchMode: "__in",
        },
        rus_score_ct: {
          operator: "AND",
          constraints: [
            {
              value: null,
              matchMode: "__gte",
            },
          ],
        },
        rus_ct_choice: {
          value: null,
          matchMode: "exact",
        },
        bel_score_ct: {
          operator: "AND",
          constraints: [
            {
              value: null,
              matchMode: "__gte",
            },
          ],
        },
        bel_ct_choice: {
          value: null,
          matchMode: "exact",
        },
        social_science_score_ct: {
          operator: "AND",
          constraints: [
            {
              value: null,
              matchMode: "__gte",
            },
          ],
        },
        social_science_ct_choice: {
          value: null,
          matchMode: "exact",
        },
        foreign_lang_score_ct: {
          operator: "AND",
          constraints: [
            {
              value: null,
              matchMode: "__gte",
            },
          ],
        },
        foreign_lang_ct_choice: {
          value: null,
          matchMode: "exact",
        },
        education_average_score: {
          operator: "AND",
          constraints: [
            {
              value: null,
              matchMode: "__gte",
            },
          ],
        },
        has_3_ct: {
          value: null,
          matchMode: "exact",
        },
        has_2_ce: {
          value: null,
          matchMode: "exact",
        },
        rus_score_cert: {
          operator: "AND",
          constraints: [
            {
              value: null,
              matchMode: "__gte",
            },
          ],
        },
        bel_score_cert: {
          operator: "AND",
          constraints: [
            {
              value: null,
              matchMode: "__gte",
            },
          ],
        },
        social_science_score_cert: {
          operator: "AND",
          constraints: [
            {
              value: null,
              matchMode: "__gte",
            },
          ],
        },
        foreign_lang_score_cert: {
          operator: "AND",
          constraints: [
            {
              value: null,
              matchMode: "__gte",
            },
          ],
        },
        // get_speciality: {
        //   value: null,
        // },
        // get_speciality_1: {
        //   value: null,
        // },
        extra_data: {
          value: null,
        },
      }
      await this.updateSearchFormPrime(this.filters)
    },
    changeSelectedColumnsDisplay(value) {
      this.selectedColumns = value
      // чтобы порядок был как в переменной
      // this.selectedColumns = this.columns.filter((col) =>
      //   value.find((val) => JSON.stringify(val) === JSON.stringify(col)),
      // )
      localStorage.setItem(
        "SessionSelectedColumnsByDisplay",
        JSON.stringify(this.selectedColumns),
      )
    },
    async updateSearchFormPrime(value) {
      localStorage.setItem("filterSession", JSON.stringify(value))
      let emptyObj = {}

      for (let key in value) {
        let searchName

        key in this.searchNamesObj
          ? (searchName = this.searchNamesObj[key])
          : (searchName = key)

        if ("constraints" in value[key]) {
          value[key].constraints.map((item) => {
            if (item.value !== null) {
              emptyObj[
                `${searchName}${item.matchMode === "exact" ? "" : item.matchMode}`
              ] = item.value
            }
          })
        } else {
          if (value[key].value !== null) {
            emptyObj[
              `${searchName}${value[key].matchMode === "exact" ? "" : value[key].matchMode}`
            ] = value[key].value
          }
        }
      }
      this.studentAPIInstance.searchObj = {
        ...emptyObj,
        offset: this.offset,
        limit: this.limit,
      }
      await this.loadData(this.studentAPIInstance.searchObj)
    },
    getComputedDataByName(name) {
      if (name in this) {
        return this[name]
      } else return []
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
      if (this.selectedFieldsForDataExport.length === 0) {
        alert("Выберите хотя бы одно поле для экспорта!")
      } else {
        this.isExporting = true
        let export_data = {}

        export_data.query_string = getQueryStringFromSearchForm(
          this.studentAPIInstance.searchObj,
        )
        export_data.fields_for_export =
          this.selectedFieldsForDataExport.toString()
        export_data.destination = destination
        if (this.studentAPIInstance.searchObj.ordering) {
          export_data.ordering =
            this.studentAPIInstance.searchObj.ordering.replace(",id", "")
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
    async make_csv() {
      try {
        let export_data = {}
        export_data.query_string = getQueryStringFromSearchForm(
          this.studentAPIInstance.searchObj,
        )
        this.studentAPIInstance.csv_export(export_data).then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement("a")
          link.href = url
          link.setAttribute("download", `fp_export.txt`)
          document.body.appendChild(link)
          link.click()
          this.isExporting = false
        })
      } catch (e) {
      } finally {
      }
    },
    async make_library_card() {
      this.library_cards_error_array = []
      this.selectedStudents.map((student) => {
        if (!student.subdivision) {
          this.library_cards_error_array.push(
            student.last_name_rus + " - не указан факультет",
          )
        }
        if (!student.date_of_birth) {
          this.library_cards_error_array.push(
            student.last_name_rus + " - не указана дата рождения",
          )
        }
        if (!student.year) {
          this.library_cards_error_array.push(
            student.last_name_rus + " - не указан курс",
          )
        }
        if (!student.academy_start_date) {
          this.library_cards_error_array.push(
            student.last_name_rus + " - не указана дата начала обучения",
          )
        }
      })

      if (this.library_cards_error_array.length) {
        let errorModal = this.$refs.libraryCardErrorModal
        let myModal = new bootstrap.Modal(errorModal, {
          keyboard: false,
        })
        myModal.show()
      } else {
        try {
          if (!this.selectedStudents.length) {
            alert("Не выбрано ни одной записи!")
          } else {
            let items_array = []
            this.selectedStudents.map((item) => items_array.push(item.id))
            const response =
              await this.studentAPIInstance.make_library_card(items_array)
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", "library_cards.docx")
            document.body.appendChild(link)
            link.click()
          }
        } catch (e) {
        } finally {
        }
      }
    },
    async make_examination_sheet() {
      let groups = this.studentAPIInstance.searchObj.group__in
      if (groups.length === 0) {
        alert("Не выбрано ни одной группы!")
      }
      if (groups.length > 1) {
        alert("Выбрано более одной группы!")
      }
      if (groups.length === 1) {
        const response = await this.groupAPIInstance.makeExamSheet(groups[0])
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", "exam-sheet.docx")
        document.body.appendChild(link)
        link.click()
      }
    },
    async make_group_sheet() {
      let groups = this.studentAPIInstance.searchObj.group__in
      if (groups.length === 0) {
        alert("Не выбрано ни одной группы!")
      }
      if (groups.length > 1) {
        alert("Выбрано более одной группы!")
      }
      if (groups.length === 1) {
        const response = await this.groupAPIInstance.makeGroupSheet(groups[0])
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", "group-sheet.docx")
        document.body.appendChild(link)
        link.click()
      }
    },
  },
  computed: {
    orderedMainList() {
      return this.studentList.results
    },
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
        (category) => category.ownership_category === "3",
      )
    },
    orderedHealthGroups() {
      return this.healthGroups.results.filter(
        (group) => group.ownership_category === "3",
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
    orderedGroups() {
      return this.groups.results
    },
    booleanOptions() {
      return [
        { activeType: "Да", activeValue: "true" },
        { activeType: "Нет", activeValue: "false" },
      ]
    },
    ctChoiceOptions() {
      return [
        { choice: "2024 ЦЭ", choiceValue: "2024 ЦЭ" },
        { choice: "2024 ЦТ", choiceValue: "2024 ЦТ" },
        { choice: "2025 ЦЭ", choiceValue: "2025 ЦЭ" },
        { choice: "2025 ЦТ", choiceValue: "2025 ЦТ" },
      ]
    },

    genderOptions() {
      return [
        { genderName: "Мужской", genderValue: "1" },
        { genderName: "Женский", genderValue: "0" },
      ]
    },
    ...mapGetters({
      groups: "groups/getList",
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
}
</script>

<style scoped></style>
