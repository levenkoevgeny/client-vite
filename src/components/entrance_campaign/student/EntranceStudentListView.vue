<template>
  <base-list-layout
      :is-loading="isLoading"
      :main-list-length="studentList.count"
      title="Личные дела"
      :load-more-data="null"
  >
    <template v-slot:add-button>
      <button class="btn btn-warning" @click="showStudentAddModal">
        Добавить личное дело
      </button>
    </template>

    <template v-slot:modals>
      <div
          class="modal fade"
          id="studentAddModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
          ref="studentAddModal"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                Добавление личного дела
              </h1>
              <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
              ></button>
            </div>

            <form @submit.prevent="addNewStudentForEntrance">
              <div class="modal-body">
                <div class="mb-3">
                  <label for="id_last_name_rus" class="form-label"
                  >Фамилия</label
                  >
                  <input
                      type="text"
                      class="form-control"
                      id="id_last_name_rus"
                      v-model="studentNewForm.last_name_rus"
                      required
                  />
                </div>
                <div class="mb-3">
                  <label for="id_first_name_rus" class="form-label">Имя</label>
                  <input
                      type="text"
                      class="form-control"
                      id="id_first_name_rus"
                      v-model="studentNewForm.first_name_rus"
                      required
                  />
                </div>
                <div class="mb-3">
                  <label for="id_patronymic_rus" class="form-label"
                  >Отчество</label
                  >
                  <input
                      type="text"
                      class="form-control"
                      id="id_patronymic_rus"
                      v-model="studentNewForm.patronymic_rus"
                      required
                  />
                </div>
                <div class="mb-3">
                  <label for="id_date_of_birth" class="form-label"
                  >Дата рождения</label
                  >
                  <input
                      type="date"
                      class="form-control"
                      id="id_date_of_birth"
                      v-model="studentNewForm.date_of_birth"
                      required
                  />
                </div>
              </div>
              <div class="modal-footer">
                <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                    ref="studentAddModalCloseButton"
                >
                  Закрыть без сохранения
                </button>
                <button type="submit" class="btn btn-primary">Сохранить</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </template>

    <template v-slot:thead>
      <tr>
        <th scope="col">Фамилия, имя, отчество</th>
        <th scope="col">Имя</th>
        <th scope="col">Отчество</th>
        <th scope="col">Дата рождения</th>
      </tr>
    </template>
    <template v-slot:tbody>
      <tr
          class="align-middle"
          v-for="student in orderedStudents"
          :key="student.id"
          @dblclick="
          $router.push({
            name: 'entrance-student-input-form',
            params: { id: student.id },
          })
        "
      >
        <td>
          {{ student.last_name_rus }}
        </td>
        <td>
          {{ student.first_name_rus }}
        </td>
        <td>
          {{ student.patronymic_rus }}
        </td>
        <td>{{ student.date_of_birth }}</td>
      </tr>
    </template>

    <template v-slot:search-form>
      <div class="mb-3">
        <label for="last_name_rus" class="form-label">Фамилия</label>
        <input
            type="text"
            id="last_name_rus"
            class="form-control"
            v-model="searchForm.last_name_rus__icontains"
        />
      </div>
      <div class="mb-3">
        <label for="gender" class="form-label">Пол</label>
        <select
            class="form-select"
            aria-label="Default select example"
            v-model="searchForm.gender"
        >
          <option selected value="">--------</option>
          <option value="1">Мужской</option>
          <option value="0">Женский</option>
        </select>
      </div>

      <div class="row">
        <div class="col-6">
          <div class="mb-3">
            <label for="date_of_birth__gte" class="form-label"
            >Дата рождения (с)</label
            >
            <input
                type="date"
                class="form-control"
                id="date_of_birth__gte"
                v-model="searchForm.date_of_birth__gte"
            />
          </div>
        </div>
        <div class="col-6">
          <div class="mb-3">
            <label for="date_of_birth__lte" class="form-label"
            >Дата рождения (по)</label
            >
            <input
                type="date"
                class="form-control"
                id="date_of_birth__lte"
                v-model="searchForm.date_of_birth__lte"
            />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <div class="mb-3">
            <label for="age_gte" class="form-label">Возраст (с)</label>
            <input
                type="number"
                class="form-control"
                id="age_gte"
                v-model="searchForm.age_gte"
            />
          </div>
        </div>
        <div class="col-6">
          <div class="mb-3">
            <label for="age_lte" class="form-label">Возраст (по)</label>
            <input
                type="number"
                class="form-control"
                id="age_lte"
                v-model="searchForm.age_lte"
            />
          </div>
        </div>
      </div>
    </template>
    <template v-slot:search-form-clear-button>
      <button type="button" class="btn btn-primary" @click="clearFilter">
        Сбросить фильтр
      </button>
    </template>
  </base-list-layout>
</template>

<script>
import NavigationLayout from "@/components/layouts/NavigationLayout.vue";
import { globalStudentAPIForEntranceInstance } from "@/api/student/studentAPI.js";
import { debounce } from "lodash/function";
import { mapGetters } from "vuex";
import BaseListLayout from "@/components/layouts/BaseListLayout.vue";
export default {
  name: "EntranceStudentListView",
  components: { NavigationLayout, BaseListLayout },
  data() {
    return {
      isLoading: true,
      isError: false,
      studentList: { count: 0, results: [], previous: null, next: null },
      studentAPIInstance: globalStudentAPIForEntranceInstance,
      searchForm: Object.assign(
          {},
          globalStudentAPIForEntranceInstance.searchObj,
      ),
      studentNewForm: {
        category: 3,
        subdivision: 8,
        last_name_rus: "",
        first_name_rus: "",
        patronymic_rus: "",
        date_of_birth: null,
        entrance_year: new Date().getFullYear(),
      },
    };
  },
  async created() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      this.isLoading = true;
      const response = await this.studentAPIInstance.getItemsList();
      this.studentList = await response.data;
      this.isLoading = false;
    },
    showStudentAddModal() {
      let addModal = this.$refs.studentAddModal;
      let myModal = new bootstrap.Modal(addModal, {
        keyboard: false,
      });
      myModal.show();
    },
    async addNewStudentForEntrance() {
      this.isLoading = true;
      const response = await this.studentAPIInstance.addItem(
          this.studentNewForm,
      );
      const newItem = response.data;
      this.studentList.results.unshift(newItem);
      this.studentList.count = this.studentList.count + 1;
      this.$refs.studentAddModalCloseButton.click();
      this.studentNewForm = {
        category: 3,
        last_name_rus: "",
        first_name_rus: "",
        patronymic_rus: "",
        date_of_birth: null,
        entrance_year: new Date().getFullYear(),
      };
      this.isLoading = false;
    },
    debouncedSearch: debounce(async function () {
      this.isLoading = true;
      this.studentAPIInstance.searchObj = this.searchForm;
      const studentAResponse = await this.studentAPIInstance.getItemsList();
      this.studentList = await studentAResponse.data;
      this.isLoading = false;
    }, 500),
    clearFilter() {
      this.searchForm = Object.assign(
          {},
          this.studentAPIInstance.searchObjDefault,
      );
    },
  },
  computed: {
    orderedStudents() {
      return this.studentList.results;
    },
    orderedSubdivisions() {
      return this.subdivisions.results.filter(
          (subdivision) => subdivision.subdivision_category == "1",
      );
    },
    ...mapGetters({
      subdivisions: "subdivisions/getList",
    }),
  },
  watch: {
    searchForm: {
      handler(newValue, oldValue) {
        this.debouncedSearch();
      },
      deep: true,
    },
  },
};
</script>

<style scoped></style>
