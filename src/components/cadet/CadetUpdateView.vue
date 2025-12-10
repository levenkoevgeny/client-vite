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
      <div class="d-flex flex-row align-items-end justify-content-start">
        <div
          style="height: 70px"
          class="d-flex flex-row align-items-center justify-content-start"
        >
          <h1 class="text-decoration-underline me-4">
            Личное дело ({{ currentCadetData.last_name_rus }}
            {{ currentCadetData.first_name_rus }})
          </h1>
        </div>

        <div
          style="height: 70px"
          class="d-flex flex-row align-items-center justify-content-start"
          title="В избранное"
        >
          <label class="heart-checkbox">
            <input
              type="checkbox"
              id="isFavoriteCadet"
              :checked="getIfThisCadetIsInFavorite"
              @change="favoriteCheckBoxChanged"
            />
            <font-awesome-icon
              :icon="['fas', 'bookmark']"
              class="heart-icon"
              style="font-size: 2rem"
            />
          </label>
        </div>
      </div>

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
            <div class="shadow p-3 mb-3" id="simple-list-personal-data">
              <div class="card border-0">
                <div class="card-body">
                  <h5 class="card-title">Личные данные</h5>
                  <div class="row">
                    <div class="col-lg-4">
                      <div
                        class="text-center m-3 border"
                        style="position: relative"
                      >
                        <img
                          v-if="currentCadetData.photo"
                          :src="currentCadetData.photo"
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
                          name="photo_file"
                          accept="image/png, image/jpeg"
                          style="position: absolute; bottom: 10px; left: 10px"
                        />
                      </div>
                    </div>
                    <div class="col-lg-8">
                      <!--                      <h1>статус - {{ getCadetStatus }}</h1>-->
                      <div class="d-flex flex-row">
                        <h3 class="me-3" v-if="currentCadetData.get_age">
                          Возраст - {{ currentCadetData.get_age }} лет
                        </h3>
                        <h3 class="me-3" v-else>Возраст - нет данных</h3>
                        <h3 v-if="currentCadetData.get_next_rank_time">
                          Следующее звание
                          {{ currentCadetData.get_next_rank_time }}
                        </h3>
                      </div>

                      <div
                        class="row d-flex justify-content-start align-items-center"
                      >
                        <div class="col-lg-4">
                          <div class="mb-3">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                v-model="currentCadetData.is_active"
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
                        <div class="col-lg-4"></div>
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
                              v-model="currentCadetData.last_name_rus"
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
                              v-model="currentCadetData.first_name_rus"
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
                              v-model="currentCadetData.patronymic_rus"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-lg-4">
                          <div class="mb-3">
                            <label class="form-label" for="id_category"
                              >Категория:</label
                            >
                            <select
                              class="form-select"
                              name="category"
                              id="id_category"
                              v-model="currentCadetData.category"
                            >
                              <option value="" selected>---------</option>
                              <option
                                v-for="category in orderedCadetCategories"
                                :value="category.id"
                                :key="category.id"
                              >
                                {{ category.category }}
                              </option>
                            </select>
                          </div>
                        </div>
                        <div class="col-lg-4">
                          <div class="mb-3">
                            <label
                              class="form-label"
                              for="id_personal_number_mvd"
                              >Личный номер (жетон)</label
                            >
                            <input
                              type="text"
                              class="form-control"
                              name="personal_number_mvd"
                              id="id_personal_number_mvd"
                              v-model="currentCadetData.personal_number_mvd"
                            />
                          </div>
                        </div>
                        <div class="col-lg-4">
                          <div class="mb-3">
                            <label class="form-label" for="id_category"
                              >Факультет</label
                            >
                            <select
                              class="form-select"
                              name="subdivision"
                              id="id_subdivision"
                              v-model="currentCadetData.subdivision"
                            >
                              <option value="" selected>---------</option>
                              <option
                                v-for="subdivision in orderedSubdivisions"
                                :value="subdivision.id"
                                :key="subdivision.id"
                              >
                                {{ subdivision.subdivision_name }}
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-lg-4">
                          <div class="mb-3">
                            <label class="form-label" for="id_category"
                              >Группа</label
                            >
                            <select
                              class="form-select"
                              name="subdivision"
                              id="id_subdivision"
                              v-model="currentCadetData.group"
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
                        <div class="col-lg-4">
                          <div class="mb-3">
                            <label class="form-label" for="id_category"
                              >Звание</label
                            >
                            <input
                              class="form-control"
                              type="text"
                              v-model="currentCadetData.get_rank"
                              disabled
                            />
                          </div>
                        </div>
                        <div class="col-lg-4">
                          <div class="mb-3">
                            <label class="form-label" for="id_category"
                              >Должность</label
                            >
                            <input
                              class="form-control"
                              type="text"
                              v-model="currentCadetData.get_position"
                              disabled
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
                              v-model="currentCadetData.date_of_birth"
                              @input="makeInputDefaultNullValueIfEmpty"
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
                              v-model="currentCadetData.place_of_birth"
                            />
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-lg-12">
                          <div class="mb-3">
                            <label class="form-label" for="id_place_of_birth"
                              >Образование</label
                            >
                            <input type="text" class="form-control" disabled />
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-lg-12">
                          <div class="mb-3">
                            <label class="form-label" for="id_place_of_birth"
                              >Действующее дисциплинарное взыскание</label
                            >
                            <input type="text" class="form-control" disabled />
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-lg-12">
                          <div class="mb-3">
                            <label class="form-label" for="id_place_of_birth"
                              >Список поощрений</label
                            >
                            <input type="text" class="form-control" disabled />
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
                              v-model="currentCadetData.phone_number"
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
                              v-model="currentCadetData.address_residence"
                            />
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-lg-12">
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
                              v-model="currentCadetData.address_registration"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="shadow p-3 mb-3 rounded" id="simple-list-passport-data">
              <div class="card border-0">
                <div class="card-body">
                  <h5 class="card-title">Паспортные данные</h5>
                  <div class="row">
                    <div class="col-xl-2">
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
                          v-model="currentCadetData.passport_number"
                        />
                      </div>
                    </div>
                    <div class="col-xl-2">
                      <div class="mb-3">
                        <label class="form-label" for="id_identification_number"
                          >Идентификационный номер</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          name="identification_number"
                          maxlength="100"
                          id="id_identification_number"
                          v-model="currentCadetData.identification_number"
                        />
                      </div>
                    </div>
                    <div class="col-xl-2">
                      <div class="mb-3">
                        <label class="form-label" for="id_passport_issue_date"
                          >Дата выдачи паспорта:</label
                        >
                        <input
                          type="date"
                          class="form-control"
                          name="passport_issue_date"
                          id="id_passport_issue_date"
                          v-model="currentCadetData.passport_issue_date"
                          @input="makeInputDefaultNullValueIfEmpty"
                        />
                      </div>
                    </div>
                    <div class="col-xl-2">
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
                          v-model="currentCadetData.passport_validity_period"
                          @input="makeInputDefaultNullValueIfEmpty"
                        />
                      </div>
                    </div>
                    <div class="col-xl-4">
                      <div class="mb-3">
                        <label
                          class="form-label"
                          for="id_passport_issue_authority"
                          >Орган выдачи паспорта:</label
                        >

                        <input
                          type="text"
                          class="form-control"
                          name="passport_issue_authority"
                          id="id_passport_issue_authority"
                          v-model="
                            currentCadetData.passport_issue_authority_text
                          "
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="shadow p-3 mb-3 rounded" id="simple-list-academy-data">
              <div class="card border-0">
                <div class="card-body">
                  <h5 class="card-title">Обучение в Академии МВД</h5>
                  <div class="row">
                    <div class="col-lg-3">
                      <div class="mb-3">
                        <label class="form-label" for="id_category"
                          >Факультет</label
                        >
                        <select
                          class="form-select"
                          name="subdivision"
                          id="id_subdivision"
                          v-model="currentCadetData.subdivision"
                        >
                          <option value="" selected>---------</option>
                          <option
                            v-for="subdivision in orderedSubdivisions"
                            :value="subdivision.id"
                            :key="subdivision.id"
                          >
                            {{ subdivision.subdivision_name }}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div class="col-lg-3">
                      <div class="mb-3">
                        <label class="form-label" for="id_category"
                          >Группа</label
                        >
                        <select
                          class="form-select"
                          name="subdivision"
                          id="id_subdivision"
                          v-model="currentCadetData.group"
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
                        <label class="form-label" for="id_category"
                          >Специализация</label
                        >
                        <select
                          class="form-select"
                          name="subdivision"
                          id="id_subdivision"
                          v-model="currentCadetData.specialization"
                        >
                          <option value="" selected>---------</option>
                          <option
                            v-for="specialization in orderedSpecializations"
                            :value="specialization.id"
                            :key="specialization.id"
                          >
                            {{ specialization.specialization_name }}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div class="col-lg-3">
                      <div class="mb-3">
                        <label class="form-label" for="id_category"
                          >Направление ОРД</label
                        >
                        <select
                          class="form-select"
                          name="subdivision"
                          id="id_subdivision"
                          v-model="currentCadetData.direction_ord"
                        >
                          <option value="" selected>---------</option>
                          <option
                            v-for="directionOrd in orderedDirectionsOrd"
                            :value="directionOrd.id"
                            :key="directionOrd.id"
                          >
                            {{ directionOrd.direction_name }}
                          </option>
                        </select>
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
                          v-model="currentCadetData.academy_start_date"
                          id="id_subdivision"
                          name="academy_start_date"
                          @input="makeInputDefaultNullValueIfEmpty"
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
                          v-model="currentCadetData.academy_end_date"
                          id="id_subdivision"
                          name="academy_end_date"
                          @input="makeInputDefaultNullValueIfEmpty"
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
                          v-model="currentCadetData.graduation_reason"
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
                          v-model="currentCadetData.graduation_reason_article"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-6">
                      <div class="mb-3">
                        <label class="form-label" for="id_subdivision"
                          >Номер зачетной книжки</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          v-model="currentCadetData.student_record_book_number"
                        />
                      </div>
                    </div>
                    <div class="col-lg-3">
                      <div class="mb-3">
                        <label class="form-label" for="id_subdivision"
                          >Дата выдачи зачетной книжки</label
                        >
                        <input
                          type="date"
                          class="form-control"
                          v-model="
                            currentCadetData.student_record_book_date_issue
                          "
                        />
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
                          v-model="currentCadetData.graduation_extra_data"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="shadow p-3 mb-3 rounded"
              id="simple-list-military-office-data"
            >
              <div class="card border-0">
                <div class="card-body">
                  <h5 class="card-title">Воинский учет</h5>
                  <div class="row">
                    <div class="col-4">
                      <div class="mb-3">
                        <label class="form-label" for="id_category"
                          >С воинского учета снят</label
                        >
                        <input
                          type="date"
                          class="form-control"
                          v-model="
                            currentCadetData.removed_from_military_registration
                          "
                          name="removed_from_military_registration"
                          @input="makeInputDefaultNullValueIfEmpty"
                        />
                      </div>
                    </div>
                    <div class="col-4">
                      <div class="mb-3">
                        <label class="form-label" for="id_military_office"
                          >Военкомат</label
                        >

                        <select
                          class="form-select"
                          name="subdivision"
                          id="id_military_office"
                          v-model="currentCadetData.military_office"
                        >
                          <option value="" selected>---------</option>
                          <option
                            v-for="militaryOffice in orderedMilitaryOffices"
                            :value="militaryOffice.id"
                            :key="militaryOffice.id"
                          >
                            {{ militaryOffice.military_office }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="shadow p-3 mb-3 rounded" id="simple-list-parents-data">
              <div class="card border-0">
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
                                v-model="currentCadetData.father_last_name"
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
                                v-model="currentCadetData.father_first_name"
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
                                v-model="currentCadetData.father_patronymic"
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
                                v-model="currentCadetData.father_date_of_birth"
                                @input="makeInputDefaultNullValueIfEmpty"
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
                                v-model="currentCadetData.father_phone_number"
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
                                v-model="currentCadetData.father_place_of_work"
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
                                v-model="currentCadetData.mother_last_name"
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
                                v-model="currentCadetData.mother_first_name"
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
                                v-model="currentCadetData.mother_patronymic"
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
                                v-model="currentCadetData.mother_date_of_birth"
                                @input="makeInputDefaultNullValueIfEmpty"
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
                                v-model="currentCadetData.mother_phone_number"
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
                                v-model="currentCadetData.mother_place_of_work"
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
            <RankHistoryCadetComponent
              :cadet-id="$route.params.id"
              :order-owners-list="orderOwners"
            />
            <EducationHistoryCadetComponent :cadet-id="$route.params.id" />
            <ForeignLanguagesCadetComponent :cadet-id="$route.params.id" />
            <!--            <ScientificWorksCadetComponent :cadet-id="$route.params.id" />-->
            <JobCadetComponent :cadet-id="$route.params.id" />
            <ArmyServiceCadetComponent
              :cadet-id="$route.params.id"
              :order-owners-list="orderOwners"
            />
            <MVDServiceCadetComponent
              :cadet-id="$route.params.id"
              :order-owners-list="orderOwners"
            />
            <RewardCadetComponent
              :cadet-id="$route.params.id"
              :order-owners-list="orderOwners"
            />
            <EncouragementCadetComponent
              :cadet-id="$route.params.id"
              :order-owners-list="orderOwners"
            />
            <PunishmentCadetComponent
              :cadet-id="$route.params.id"
              :order-owners-list="orderOwners"
            />
            <PositionCadetComponent
              :cadet-id="$route.params.id"
              :order-owners-list="orderOwners"
            />
            <SpecialityCadetComponent
              :cadet-id="$route.params.id"
              :order-owners-list="orderOwners"
            />
            <RelativesCadetComponent :cadet-id="$route.params.id" />

            <div class="shadow p-3 mb-3" id="simple-list-anketa">
              <div class="card border-0">
                <div class="card-body">
                  <h5 class="card-title mb-3">Анкета</h5>
                  <div class="row">
                    <div class="col-xl-6">
                      <div class="form-floating mb-3">
                        <select
                          id="id_vpk"
                          class="form-select"
                          v-model="currentCadetData.vpk"
                        >
                          <option :value="null">---------</option>
                          <option
                            :value="vpk.id"
                            v-for="vpk in orderedVpkCategories"
                          >
                            {{ vpk.category }}
                          </option>
                        </select>
                        <label for="id_vpk">Военно-патриотический клуб</label>
                      </div>
                    </div>
                    <div class="col-xl-6">
                      <div class="form-floating mb-3">
                        <input
                          id="id_vpk_data"
                          type="text"
                          class="form-control form-control-sm"
                          placeholder="Данные по ВПК"
                          v-model="currentCadetData.vpk_data"
                        />
                        <label for="id_vpk_data">Данные по ВПК</label>
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-xl-3">
                      <div class="form-check mb-3">
                        <input
                          id="id_aims_to_graduate_with_honors"
                          class="form-check-input"
                          type="checkbox"
                          v-model="
                            currentCadetData.aims_to_graduate_with_honors
                          "
                        />
                        <label
                          class="form-check-label"
                          for="id_aims_to_graduate_with_honors"
                        >
                          Претендует на аттестат с отличием
                        </label>
                      </div>
                    </div>
                    <div class="col-xl-3">
                      <div class="form-check mb-3">
                        <input
                          id="id_is_olympiad_winner"
                          class="form-check-input"
                          type="checkbox"
                          v-model="currentCadetData.is_olympiad_winner"
                        />
                        <label
                          class="form-check-label"
                          for="id_is_olympiad_winner"
                        >
                          Победитель республиканских или региональных олимпиад
                        </label>
                      </div>
                    </div>

                    <div class="col-xl-3">
                      <div class="form-check mb-3">
                        <input
                          id="id_has_achievements_in_sports"
                          class="form-check-input"
                          type="checkbox"
                          v-model="currentCadetData.has_achievements_in_sports"
                        />
                        <label
                          class="form-check-label"
                          for="id_has_achievements_in_sports"
                        >
                          Достижения в спорте
                        </label>
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-xl-3">
                      <div class="form-check mb-3">
                        <input
                          id="id_is_class_vpn"
                          class="form-check-input"
                          type="checkbox"
                          v-model="currentCadetData.is_class_vpn"
                        />
                        <label class="form-check-label" for="id_is_class_vpn">
                          Класс военно-патриотической направленности
                        </label>
                      </div>
                    </div>
                    <div class="col-xl-3">
                      <div class="form-check mb-3">
                        <input
                          id="id_is_class_pn"
                          class="form-check-input"
                          type="checkbox"
                          v-model="currentCadetData.is_class_pn"
                        />
                        <label class="form-check-label" for="id_is_class_pn">
                          Класс правовой направленности
                        </label>
                      </div>
                    </div>
                    <div class="col-xl-3">
                      <div class="form-check mb-3">
                        <input
                          id="id_is_class_other"
                          class="form-check-input"
                          type="checkbox"
                          v-model="currentCadetData.is_class_other"
                        />
                        <label class="form-check-label" for="id_is_class_other">
                          Профильный класс иной направленности
                        </label>
                      </div>
                      <div class="form-floating mb-3">
                        <input
                          id="id_class_other_extra_data"
                          type="text"
                          class="form-control form-control-sm"
                          placeholder="Доп. данные к классу иной
                              направленности"
                          v-model="currentCadetData.class_other_extra_data"
                        />
                        <label for="id_class_other_extra_data"
                          >Доп. данные к классу иной направленности</label
                        >
                      </div>
                    </div>
                    <div class="col-xl-3"></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="shadow p-3 mb-3" id="simple-list-med">
              <div class="card border-0">
                <div class="card-body">
                  <h5 class="card-title mb-3">Данные мед. освидет.</h5>
                  <div class="row">
                    <div class="col-xl-4">
                      <div class="form-floating mb-3">
                        <select
                          id="id_health_group"
                          class="form-select"
                          v-model="currentCadetData.health_group"
                        >
                          <option :value="null">---------</option>
                          <option
                            :value="health_group.id"
                            v-for="health_group in orderedHealthGroups"
                          >
                            {{ health_group.health_group }}
                          </option>
                        </select>
                        <label for="id_health_group"
                          >Группа предназначения</label
                        >
                      </div>
                    </div>
                    <div class="col-xl-4">
                      <div class="form-floating mb-3">
                        <select
                          id="id_ppfl_test"
                          class="form-select"
                          v-model="currentCadetData.ppfl_test"
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
                          >Категория профессионального соответствия</label
                        >
                      </div>
                    </div>
                    <div class="col-xl-4">
                      <div class="form-floating mb-3">
                        <select
                          id="id_medical_age_group"
                          class="form-select"
                          aria-label="Floating label select example"
                          v-model="currentCadetData.medical_age_group"
                        >
                          <option :value="null">---------</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                        </select>
                        <label for="id_medical_age_group"
                          >Медико-возрастная группа</label
                        >
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-xl-2">
                      <div class="form-check">
                        <input
                          id="id_passed_medical_examination"
                          class="form-check-input"
                          type="checkbox"
                          v-model="currentCadetData.passed_medical_examination"
                        />
                        <label
                          class="form-check-label"
                          for="id_passed_medical_examination"
                        >
                          Окончательное мед. освидетельствование
                        </label>
                      </div>
                    </div>
                    <div class="col-xl-2">
                      <div class="form-check">
                        <input
                          id="id_passed_medical_examination"
                          class="form-check-input"
                          type="checkbox"
                          v-model="currentCadetData.fit_for_service"
                        />
                        <label
                          class="form-check-label"
                          for="id_passed_medical_examination"
                        >
                          Годен к службе
                        </label>
                      </div>
                    </div>
                    <div class="col-xl-2">
                      <div class="form-floating mb-3">
                        <input
                          id="id_passed_medical_examination_date"
                          class="form-control"
                          name="passed_medical_examination_date"
                          placeholder="Дата прохождения"
                          type="date"
                          v-model="
                            currentCadetData.passed_medical_examination_date
                          "
                          @input="makeInputDefaultNullValueIfEmpty"
                        />
                        <label
                          class="form-check-label"
                          for="id_passed_medical_examination_date"
                          >Дата прохождения
                        </label>
                      </div>
                    </div>
                    <div class="col-xl-6">
                      <div class="form-floating mb-3">
                        <textarea
                          id="id_passed_medical_examination_extra_data"
                          class="form-control"
                          placeholder="Примечание по медицинской комиссии"
                          rows="2"
                          v-model="
                            currentCadetData.passed_medical_examination_extra_data
                          "
                        ></textarea>
                        <label for="id_passed_medical_examination_extra_data"
                          >Примечание по медицинской комиссии</label
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="shadow p-3 mb-3" id="simple-list-entrance">
              <div class="card border-0">
                <div class="card-body">
                  <h5 class="card-title mb-3">
                    Сведения из вступительной кампании
                  </h5>
                  <div class="row">
                    <div class="col-xl-4">
                      <div class="form-check mb-3">
                        <input
                          id="id_needs_increased_attention"
                          class="form-check-input"
                          type="checkbox"
                          v-model="currentCadetData.needs_increased_attention"
                        />
                        <label
                          class="form-check-label"
                          for="id_needs_increased_attention"
                        >
                          Требует повышенного внимания
                        </label>
                      </div>
                      <div class="form-check mb-3">
                        <input
                          id="id_needs_psychological_support"
                          class="form-check-input"
                          type="checkbox"
                          v-model="currentCadetData.needs_psychological_support"
                        />
                        <label
                          class="form-check-label"
                          for="id_needs_psychological_support"
                        >
                          Требует психологического сопровождения
                        </label>
                      </div>
                      <div class="form-check mb-3">
                        <input
                          id="id_is_risk_group"
                          class="form-check-input"
                          type="checkbox"
                          v-model="currentCadetData.is_risk_group"
                        />
                        <label class="form-check-label" for="id_is_risk_group"
                          >Группа риска</label
                        >
                      </div>
                      <div class="form-check mb-3">
                        <input
                          id="id_has_conviction"
                          class="form-check-input"
                          type="checkbox"
                          v-model="currentCadetData.has_conviction"
                        />
                        <label class="form-check-label" for="id_has_conviction"
                          >Судимость</label
                        >
                      </div>
                      <div class="form-check mb-3">
                        <input
                          id="id_has_dactocard"
                          class="form-check-input"
                          type="checkbox"
                          v-model="currentCadetData.has_dactocard"
                        />
                        <label class="form-check-label" for="id_has_dactocard"
                          >Дактилоскопирование</label
                        >
                      </div>
                      <div class="form-check mb-3">
                        <input
                          id="id_has_gusb_check"
                          class="form-check-input"
                          type="checkbox"
                          v-model="currentCadetData.has_gusb_check"
                        />
                        <label class="form-check-label" for="id_has_gusb_check"
                          >Проверка ГУСБ</label
                        >
                      </div>
                      <div class="form-check mb-3">
                        <input
                          id="id_has_employee_in_family"
                          class="form-check-input"
                          type="checkbox"
                          v-model="currentCadetData.has_employee_in_family"
                        />
                        <label
                          class="form-check-label"
                          for="id_has_employee_in_family"
                          >Сотрудники в семье</label
                        >
                      </div>
                      <div class="form-check mb-3">
                        <input
                          id="is_is_orphan"
                          class="form-check-input"
                          type="checkbox"
                          v-model="currentCadetData.is_orphan"
                        />
                        <label class="form-check-label" for="is_is_orphan"
                          >Сирота</label
                        >
                      </div>
                      <div class="form-check mb-3">
                        <input
                          id="id_is_employee"
                          class="form-check-input"
                          type="checkbox"
                          v-model="currentCadetData.is_employee"
                        />
                        <label class="form-check-label" for="id_is_employee"
                          >Сотрудник</label
                        >
                      </div>
                    </div>
                    <div class="col-xl-4">
                      <p>Сертификаты</p>
                      <div class="form-check mb-3">
                        <input
                          id="id_has_certificate_ideas_for_Belarus"
                          class="form-check-input"
                          type="checkbox"
                          v-model="
                            currentCadetData.has_certificate_ideas_for_Belarus
                          "
                        />
                        <label
                          class="form-check-label"
                          for="id_has_certificate_ideas_for_Belarus"
                          >100 идей для Беларуси</label
                        >
                      </div>
                      <div class="form-check mb-3">
                        <input
                          id="id_has_certificate_kind_heart"
                          class="form-check-input"
                          type="checkbox"
                          v-model="currentCadetData.has_certificate_kind_heart"
                        />
                        <label
                          class="form-check-label"
                          for="id_has_certificate_kind_heart"
                          >Доброе сердце</label
                        >
                      </div>

                      <div class="form-check mb-3">
                        <input
                          id="id_has_polygraph"
                          class="form-check-input"
                          type="checkbox"
                          v-model="currentCadetData.has_polygraph"
                        />
                        <label class="form-check-label" for="id_has_polygraph"
                          >Полиграф</label
                        >
                      </div>
                    </div>
                    <div class="col-xl-4">
                      <div class="form-check mb-3">
                        <input
                          id="id_is_law_class"
                          class="form-check-input"
                          type="checkbox"
                          v-model="currentCadetData.is_law_class"
                        />
                        <label class="form-check-label" for="id_is_law_class"
                          >Правовой класс</label
                        >
                      </div>
                      <div class="form-check mb-3">
                        <input
                          id="id_is_law_enforcement"
                          class="form-check-input"
                          type="checkbox"
                          v-model="currentCadetData.is_law_enforcement"
                        />
                        <label
                          class="form-check-label"
                          for="id_is_law_enforcement"
                          >Охрана правопорядка</label
                        >
                      </div>
                      <div class="form-check mb-3">
                        <input
                          id="id_is_fired"
                          class="form-check-input"
                          type="checkbox"
                          v-model="currentCadetData.is_fired"
                        />
                        <label class="form-check-label" for="id_is_fired"
                          >Уволен</label
                        >
                      </div>
                      <div class="form-check mb-3">
                        <input
                          id="id_took_documents"
                          class="form-check-input"
                          type="checkbox"
                          v-model="currentCadetData.took_documents"
                        />
                        <label class="form-check-label" for="id_took_documents"
                          >Забрал документы</label
                        >
                      </div>

                      <div class="form-check mb-3">
                        <input
                          id="id_is_vv"
                          class="form-check-input"
                          type="checkbox"
                          v-model="currentCadetData.is_vv"
                        />
                        <label class="form-check-label" for="id_is_vv"
                          >ВВ</label
                        >
                      </div>
                      <div class="form-check mb-3">
                        <input
                          id="id_is_fp"
                          class="form-check-input"
                          type="checkbox"
                          v-model="currentCadetData.is_fp"
                        />
                        <label class="form-check-label" for="id_is_fp"
                          >ФП</label
                        >
                      </div>
                    </div>
                  </div>

                  <div class="border border-1 my-4"></div>

                  <div class="row">
                    <div class="col-xxl-6">
                      <h6>Выбор специальностей</h6>
                      <div class="row">
                        <div class="col-6">
                          <div class="form-floating mb-3">
                            <select
                              id="id_s1"
                              class="form-select"
                              v-model="currentCadetData.speciality_1"
                              disabled
                            >
                              <option :value="null">---------</option>
                              <option
                                :value="quota.id"
                                v-for="quota in orderedAdmissionQuotes_select_1"
                              >
                                {{ quota.quota_verbose_name }}
                              </option>
                            </select>
                            <label for="id_s1">Специальность 1</label>
                          </div>
                          <div class="form-floating mb-3">
                            <select
                              id="id_s2"
                              class="form-select"
                              v-model="currentCadetData.speciality_2"
                              disabled
                            >
                              <option :value="null">---------</option>
                              <option
                                :value="quota.id"
                                v-for="quota in orderedAdmissionQuotes_select_2"
                              >
                                {{ quota.quota_verbose_name }}
                              </option>
                            </select>
                            <label for="id_s2">Специальность 2</label>
                          </div>
                          <div class="form-floating mb-3">
                            <select
                              id="id_s3"
                              class="form-select"
                              v-model="currentCadetData.speciality_3"
                              disabled
                            >
                              <option :value="null">---------</option>
                              <option
                                :value="quota.id"
                                v-for="quota in orderedAdmissionQuotes_select_3"
                              >
                                {{ quota.quota_verbose_name }}
                              </option>
                            </select>
                            <label for="id_s3">Специальность 3</label>
                          </div>
                          <div class="form-floating mb-3">
                            <select
                              id="id_s4"
                              class="form-select"
                              v-model="currentCadetData.speciality_4"
                              disabled
                            >
                              <option :value="null">---------</option>
                              <option
                                :value="quota.id"
                                v-for="quota in orderedAdmissionQuotes_select_4"
                              >
                                {{ quota.quota_verbose_name }}
                              </option>
                            </select>
                            <label for="id_s4">Специальность 4</label>
                          </div>
                          <div class="form-floating mb-3">
                            <select
                              id="id_s5"
                              class="form-select"
                              v-model="currentCadetData.speciality_5"
                              disabled
                            >
                              <option :value="null">---------</option>
                              <option
                                :value="quota.id"
                                v-for="quota in orderedAdmissionQuotes_select_5"
                              >
                                {{ quota.quota_verbose_name }}
                              </option>
                            </select>
                            <label for="id_s5">Специальность 5</label>
                          </div>
                          <div class="form-floating mb-3">
                            <select
                              id="id_s6"
                              class="form-select"
                              v-model="currentCadetData.speciality_6"
                              disabled
                            >
                              <option :value="null">---------</option>
                              <option
                                :value="quota.id"
                                v-for="quota in orderedAdmissionQuotes_select_6"
                              >
                                {{ quota.quota_verbose_name }}
                              </option>
                            </select>
                            <label for="id_s6">Специальность 6</label>
                          </div>
                          <div class="form-floating mb-3">
                            <select
                              id="id_s7"
                              class="form-select"
                              v-model="currentCadetData.speciality_7"
                              disabled
                            >
                              <option :value="null">---------</option>
                              <option
                                :value="quota.id"
                                v-for="quota in orderedAdmissionQuotes_select_7"
                              >
                                {{ quota.quota_verbose_name }}
                              </option>
                            </select>
                            <label for="id_s7">Специальность 7</label>
                          </div>
                          <div class="form-floating mb-3">
                            <select
                              id="id_s8"
                              class="form-select"
                              v-model="currentCadetData.speciality_8"
                              disabled
                            >
                              <option :value="null">---------</option>
                              <option
                                :value="quota.id"
                                v-for="quota in orderedAdmissionQuotes_select_8"
                              >
                                {{ quota.quota_verbose_name }}
                              </option>
                            </select>
                            <label for="id_s7">Специальность 8</label>
                          </div>
                          <div class="form-floating mb-3">
                            <select
                              id="id_s9"
                              class="form-select"
                              v-model="currentCadetData.speciality_9"
                              disabled
                            >
                              <option :value="null">---------</option>
                              <option
                                :value="quota.id"
                                v-for="quota in orderedAdmissionQuotes_select_9"
                              >
                                {{ quota.quota_verbose_name }}
                              </option>
                            </select>
                            <label for="id_s7">Специальность 9</label>
                          </div>
                        </div>

                        <div class="col-6">
                          <div class="form-floating mb-3">
                            <select
                              id="id_privilege"
                              class="form-select"
                              v-model="currentCadetData.privilege_1"
                              disabled
                            >
                              <option :value="null">---------</option>
                              <option
                                :value="privilege.id"
                                v-for="privilege in orderedPrivileges"
                              >
                                {{ privilege.privilege }}
                              </option>
                            </select>
                            <label for="id_privilege">Льгота 1</label>
                          </div>
                          <div class="form-floating mb-3">
                            <select
                              id="id_privilege"
                              class="form-select"
                              v-model="currentCadetData.privilege_2"
                              disabled
                            >
                              <option :value="null">---------</option>
                              <option
                                :value="privilege.id"
                                v-for="privilege in orderedPrivileges"
                              >
                                {{ privilege.privilege }}
                              </option>
                            </select>
                            <label for="id_privilege">Льгота 2</label>
                          </div>
                          <div class="form-floating mb-3">
                            <select
                              id="id_privilege"
                              class="form-select"
                              v-model="currentCadetData.privilege_3"
                              disabled
                            >
                              <option :value="null">---------</option>
                              <option
                                :value="privilege.id"
                                v-for="privilege in orderedPrivileges"
                              >
                                {{ privilege.privilege }}
                              </option>
                            </select>
                            <label for="id_privilege">Льгота 3</label>
                          </div>
                          <div class="form-floating mb-3">
                            <select
                              id="id_privilege"
                              class="form-select"
                              v-model="currentCadetData.privilege_4"
                              disabled
                            >
                              <option :value="null">---------</option>
                              <option
                                :value="privilege.id"
                                v-for="privilege in orderedPrivileges"
                              >
                                {{ privilege.privilege }}
                              </option>
                            </select>
                            <label for="id_privilege">Льгота 4</label>
                          </div>
                          <div class="form-floating mb-3">
                            <select
                              id="id_privilege"
                              class="form-select"
                              v-model="currentCadetData.privilege_5"
                              disabled
                            >
                              <option :value="null">---------</option>
                              <option
                                :value="privilege.id"
                                v-for="privilege in orderedPrivileges"
                              >
                                {{ privilege.privilege }}
                              </option>
                            </select>
                            <label for="id_privilege">Льгота 5</label>
                          </div>
                          <div class="form-floating mb-3">
                            <select
                              id="id_privilege"
                              class="form-select"
                              v-model="currentCadetData.privilege_6"
                              disabled
                            >
                              <option :value="null">---------</option>
                              <option
                                :value="privilege.id"
                                v-for="privilege in orderedPrivileges"
                              >
                                {{ privilege.privilege }}
                              </option>
                            </select>
                            <label for="id_privilege">Льгота 6</label>
                          </div>
                          <div class="form-floating mb-3">
                            <select
                              id="id_privilege"
                              class="form-select"
                              v-model="currentCadetData.privilege_7"
                              disabled
                            >
                              <option :value="null">---------</option>
                              <option
                                :value="privilege.id"
                                v-for="privilege in orderedPrivileges"
                              >
                                {{ privilege.privilege }}
                              </option>
                            </select>
                            <label for="id_privilege">Льгота 7</label>
                          </div>
                          <div class="form-floating mb-3">
                            <select
                              id="id_privilege"
                              class="form-select"
                              v-model="currentCadetData.privilege_8"
                              disabled
                            >
                              <option :value="null">---------</option>
                              <option
                                :value="privilege.id"
                                v-for="privilege in orderedPrivileges"
                              >
                                {{ privilege.privilege }}
                              </option>
                            </select>
                            <label for="id_privilege">Льгота 8</label>
                          </div>
                          <div class="form-floating mb-3">
                            <select
                              id="id_privilege"
                              class="form-select"
                              v-model="currentCadetData.privilege_9"
                              disabled
                            >
                              <option :value="null">---------</option>
                              <option
                                :value="privilege.id"
                                v-for="privilege in orderedPrivileges"
                              >
                                {{ privilege.privilege }}
                              </option>
                            </select>
                            <label for="id_privilege">Льгота 9</label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-xxl-6">
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
                              <th class="text-center table-primary">
                                Белорусский
                              </th>
                              <th class="text-center table-warning">
                                Обществоведение
                              </th>
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
                                  v-model="currentCadetData.rus_bel_ct_number"
                                  disabled
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
                                  v-model="
                                    currentCadetData.social_science_ct_number
                                  "
                                  disabled
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
                                  v-model="
                                    currentCadetData.foreign_lang_ct_number
                                  "
                                  disabled
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
                                  v-model="currentCadetData.rus_score_ct"
                                  @input="makeInputDefaultNullValueIfEmpty"
                                  disabled
                                />
                                <span class="text-center table-success"
                                  >Минимум 10</span
                                >
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
                                  v-model="currentCadetData.bel_score_ct"
                                  @input="makeInputDefaultNullValueIfEmpty"
                                  disabled
                                />
                                <span class="text-center table-success"
                                  >Минимум 10</span
                                >
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
                                  v-model="
                                    currentCadetData.social_science_score_ct
                                  "
                                  @input="makeInputDefaultNullValueIfEmpty"
                                  disabled
                                />
                                <span class="text-center table-success"
                                  >Минимум 25</span
                                >
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
                                  v-model="
                                    currentCadetData.foreign_lang_score_ct
                                  "
                                  @input="makeInputDefaultNullValueIfEmpty"
                                  disabled
                                />
                                <span class="text-center table-success"
                                  >Минимум 15</span
                                >
                              </td>
                            </tr>
                            <tr>
                              <td class="text-center table-primary">
                                <select
                                  class="form-select"
                                  v-model="currentCadetData.rus_ct_choice"
                                  disabled
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
                                  v-model="currentCadetData.bel_ct_choice"
                                  disabled
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
                                  v-model="
                                    currentCadetData.social_science_ct_choice
                                  "
                                  disabled
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
                                  v-model="
                                    currentCadetData.foreign_lang_ct_choice
                                  "
                                  disabled
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
                              <th class="text-center table-primary">
                                Белорусский
                              </th>
                              <th class="text-center table-warning">
                                Обществоведение
                              </th>
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
                                  v-model="currentCadetData.rus_score_cert"
                                  @input="makeInputDefaultNullValueIfEmpty"
                                  disabled
                                />
                              </td>
                              <td class="text-center table-primary">
                                <input
                                  name="bel_score_cert"
                                  type="number"
                                  class="form-control text-center"
                                  v-model="currentCadetData.bel_score_cert"
                                  @input="makeInputDefaultNullValueIfEmpty"
                                  disabled
                                />
                              </td>
                              <td class="text-center table-warning">
                                <input
                                  name="social_science_score_cert"
                                  type="number"
                                  class="form-control text-center"
                                  v-model="
                                    currentCadetData.social_science_score_cert
                                  "
                                  @input="makeInputDefaultNullValueIfEmpty"
                                  disabled
                                />
                              </td>
                              <td class="text-center table-success">
                                <input
                                  name="foreign_lang_score_cert"
                                  type="number"
                                  class="form-control text-center"
                                  v-model="
                                    currentCadetData.foreign_lang_score_cert
                                  "
                                  @input="makeInputDefaultNullValueIfEmpty"
                                  disabled
                                />
                              </td>
                            </tr>
                            <tr>
                              <td
                                colspan="2"
                                class="text-center table-primary fw-bold"
                              >
                                Средний балл (аттестата)
                              </td>
                              <td
                                colspan="2"
                                class="text-center table-primary fw-bold"
                              >
                                Сумма (рус. + бел.)
                              </td>
                            </tr>
                            <tr>
                              <td colspan="2" class="text-center table-primary">
                                <div class="d-flex flex-row">
                                  <input
                                    type="number"
                                    class="form-control text-center"
                                    name="education_average_score"
                                    v-model="
                                      currentCadetData.education_average_score
                                    "
                                    @input="makeInputDefaultNullValueIfEmpty"
                                    disabled
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
                  </div>
                </div>
              </div>
            </div>

            <div class="shadow p-3 mb-3" id="simple-list-ok">
              <div class="card border-0">
                <div class="card-body">
                  <h5 class="card-title mb-3">Примечания / замечания для ОК</h5>
                  <div class="mb-3">
                    <label class="form-label" for="id_extra_data"
                      >Примечание для отдела кадров</label
                    >
                    <textarea
                      id="id_extra_data"
                      class="form-control"
                      rows="2"
                      v-model="currentCadetData.extra_data"
                    ></textarea>
                  </div>
                  <div class="mb-3">
                    <label class="form-label" for="id_comments_on_personal_file"
                      >Замечания по личному делу</label
                    >
                    <textarea
                      id="id_comments_on_personal_file"
                      class="form-control"
                      rows="3"
                      v-model="currentCadetData.comments_on_personal_file"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div class="shadow p-3 mb-3 rounded" id="simple-list-docs">
              <div class="card border-0">
                <div class="card-body">
                  <h5 class="card-title mb-3">Отсканированные документы</h5>
                  <div class="m-3">
                    <div v-if="currentCadetData.attached_documents">
                      <div class="d-flex flex-row my-2"></div>

                      <object
                        :data="currentCadetData.attached_documents"
                        type="application/pdf"
                        ref="objectWithDocument"
                        width="100%"
                        height="700"
                      >
                        <p>
                          <b>Ошибка загрузки pdf документа.</b> Попробуйте
                          скачать его
                          <a :href="currentCadetData.attached_documents"
                            >отсюда</a
                          >.
                        </p>
                      </object>
                    </div>

                    <div v-else class="mb-3"></div>
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
            <div class="shadow p-2 mb-5 rounded">
              <div class="card border-0">
                <div class="card-body">
                  <div class="list-group">
                    <h3>Навигация по разделам</h3>
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
                      href="#simple-list-military-office-data"
                      >Воинский учет</a
                    >
                    <a
                      class="list-group-item list-group-item-action rounded-1"
                      href="#simple-list-parents-data"
                      >Данные о родителях</a
                    >
                    <a
                      class="list-group-item list-group-item-action rounded-1"
                      href="#simple-list-rank-data"
                      >Присвоение званий</a
                    >

                    <a
                      class="list-group-item list-group-item-action rounded-1"
                      href="#simple-list-education-data"
                      >Образование</a
                    >
                    <a
                      class="list-group-item list-group-item-action rounded-1"
                      href="#simple-list-foreign-language-data"
                      >Иностранные языки</a
                    >
                    <a
                      class="list-group-item list-group-item-action rounded-1"
                      href="#simple-list-job-data"
                      >Трудовая деятельность</a
                    >
                    <a
                      class="list-group-item list-group-item-action rounded-1"
                      href="#simple-list-army-service-data"
                      >Прохождение службы в ВС РБ</a
                    >
                    <a
                      class="list-group-item list-group-item-action rounded-1"
                      href="#simple-list-mvd-service-data"
                      >Прохождение службы в МВД РБ</a
                    >
                    <a
                      class="list-group-item list-group-item-action rounded-1"
                      href="#simple-list-rewards-data"
                      >Награды</a
                    >
                    <a
                      class="list-group-item list-group-item-action rounded-1"
                      href="#simple-list-encouragements-data"
                      >Поощрения</a
                    >
                    <a
                      class="list-group-item list-group-item-action rounded-1"
                      href="#simple-list-punishments-data"
                      >Дисциплинарные взыскания</a
                    >
                    <a
                      class="list-group-item list-group-item-action rounded-1"
                      href="#simple-list-positions-data"
                      >Должности</a
                    >
                    <a
                      class="list-group-item list-group-item-action rounded-1"
                      href="#simple-list-specialities-data"
                      >Специальности</a
                    >
                    <a
                      class="list-group-item list-group-item-action rounded-1"
                      href="#simple-list-marital-status-data"
                      >Семейное положение</a
                    >
                    <a
                      class="list-group-item list-group-item-action rounded-1"
                      href="#simple-list-anketa"
                      >Анкета</a
                    >
                    <a
                      class="list-group-item list-group-item-action rounded-1"
                      href="#simple-list-med"
                      >Данные мед. освидет
                    </a>
                    <a
                      class="list-group-item list-group-item-action rounded-1"
                      href="#simple-list-entrance"
                      >Сведения из вступительной</a
                    >
                    <a
                      class="list-group-item list-group-item-action rounded-1"
                      href="#simple-list-ok"
                      >Примечания / замечания ОК
                    </a>
                    <a
                      class="list-group-item list-group-item-action rounded-1"
                      href="#simple-list-docs"
                      >Отсканированные документы
                    </a>
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
import getCadetAPIInstance from "@/api/cadet/cadetAPI"
import { globalCadetAPIInstance } from "@/api/cadet/cadetAPI"

import { debounce } from "lodash/function"
import { defineAsyncComponent } from "vue"

const ArmyServiceCadetComponent = defineAsyncComponent(
  () => import("@/components/cadet/service/ArmyServiceCadetComponent.vue"),
)
const MVDServiceCadetComponent = defineAsyncComponent(
  () => import("@/components/cadet/service/MVDServiceCadetComponent.vue"),
)
const JobCadetComponent = defineAsyncComponent(
  () => import("@/components/cadet/job/JobCadetComponent.vue"),
)
const RewardCadetComponent = defineAsyncComponent(
  () => import("@/components/cadet/reward/RewardCadetComponent.vue"),
)
const PunishmentCadetComponent = defineAsyncComponent(
  () => import("@/components/cadet/punishment/PunishmentCadetComponent.vue"),
)
const PositionCadetComponent = defineAsyncComponent(
  () => import("@/components/cadet/position/PositionCadetComponent.vue"),
)
const SpecialityCadetComponent = defineAsyncComponent(
  () => import("@/components/cadet/speciality/SpecialityCadetComponent.vue"),
)
const RankHistoryCadetComponent = defineAsyncComponent(
  () => import("@/components/cadet/rank/RankHistoryCadetComponent.vue"),
)
const EncouragementCadetComponent = defineAsyncComponent(
  () =>
    import("@/components/cadet/encouragement/EncouragementCadetComponent.vue"),
)
const EducationHistoryCadetComponent = defineAsyncComponent(
  () =>
    import("@/components/cadet/education/EducationHistoryCadetComponent.vue"),
)
const ForeignLanguagesCadetComponent = defineAsyncComponent(
  () =>
    import("@/components/cadet/languages/ForeignLanguagesCadetComponent.vue"),
)
const RelativesCadetComponent = defineAsyncComponent(
  () => import("@/components/cadet/relatives/RelativesCadetComponent.vue"),
)

import "vue-select/dist/vue-select.css"
import { mapGetters } from "vuex"

export default {
  name: "CadetUpdateView",
  components: {
    RankHistoryCadetComponent,
    EncouragementCadetComponent,
    EducationHistoryCadetComponent,
    ForeignLanguagesCadetComponent,
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
      options: [],
      selected: "",
      isLoading: true,
      currentCadetData: {
        is_preloaded_data: true,
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
        student_record_book_number: "",
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
        foreign_language_was: "",
        foreign_language_will_be: "",
        subdivision: "",
        group: "",
        academy_start_date: "",
        academy_end_date: "",
        graduation_reason: "",
        graduation_reason_article: "",
        graduation_extra_data: "",
        specialization: "",
        direction_ord: "",
        component_organ: "",
        entrance_category: "",
        arrived_from_go_rovd: "",
        social_status: "",
        region_for_medical_examination: "",
        military_office: "",
        extra_data: "",
        vpk: "",
        vpk_data: "",
        aims_to_graduate_with_honors: "",
        is_class_vpn: "",
        is_class_pn: "",
        is_class_other: "",
        has_achievements_in_sports: "",
        is_olympiad_winner: "",
        health_group: "",
        ppfl_test: "",
        medical_age_group: "",
        needs_increased_attention: "",
        needs_psychological_support: "",
        is_risk_group: "",
        has_conviction: "",
        has_dactocard: "",
        has_gusb_check: "",
        has_employee_in_family: "",
        is_orphan: "",
        passed_medical_examination: "",
        passed_medical_examination_extra_data: "",
        has_certificate_ideas_for_Belarus: "",
        has_certificate_kind_heart: "",
        is_employee: "",
        speciality_1: "",
        speciality_2: "",
        speciality_3: "",
        speciality_4: "",
        speciality_5: "",
        speciality_6: "",
        speciality_7: "",
        speciality_8: "",
        speciality_9: "",
        privilege_1: "",
        privilege_2: "",
        privilege_3: "",
        privilege_4: "",
        privilege_5: "",
        privilege_6: "",
        privilege_7: "",
        privilege_8: "",
        privilege_9: "",
        get_score_sum: "",
      },
      cadetAPIInstance: getCadetAPIInstance(),
      globalCadetAPIInstance: globalCadetAPIInstance,
      BACKEND_PROTOCOL: import.meta.env.VITE_APP_BACKEND_PROTOCOL,
      BACKEND_HOST: import.meta.env.VITE_APP_BACKEND_HOST,
      BACKEND_PORT: import.meta.env.VITE_APP_BACKEND_PORT,
    }
  },
  async created() {
    await this.loadData(this.$route.params.id)
  },
  methods: {
    async loadData(cadetId) {
      try {
        const res = await this.cadetAPIInstance.getItemData(cadetId)
        this.currentCadetData = await res.data
      } catch (error) {
      } finally {
        this.isLoading = false
      }
    },
    debouncedUpdate: debounce(async function () {
      try {
        const { photo, attached_documents, sign_image, ...rest } =
          this.currentCadetData
        await this.cadetAPIInstance.updateItem(rest)
      } catch (e) {
      } finally {
      }
    }, 500),
    async uploadPhoto() {
      if (this.$refs.uploadedPhoto.files.length) {
        let formData = new FormData()
        formData.append("photo", this.$refs.uploadedPhoto.files[0])

        const response = await this.cadetAPIInstance.updatePhotoOrAnyFile(
          this.currentCadetData.id,
          formData,
        )

        this.currentCadetData = {
          ...this.currentCadetData,
          photo: response.data.photo,
        }
      }
    },
    makeInputDefaultNullValueIfEmpty(event) {
      if (event.target.value.trim().length === 0) {
        this.currentStudentData[event.target.name] = null
      }
    },
    favoriteCheckBoxChanged(event) {
      this.$store.dispatch("favoriteCadets/actionAddOrDeleteFromFavorites", {
        cadet: this.currentCadetData.id,
        checked: event.target.checked,
      })
      let ids_array = globalCadetAPIInstance.searchObj.ids.split(",")
      let index = ids_array.indexOf(this.currentCadetData.id.toString())
      if (index !== -1) {
        ids_array.splice(index, 1)
      }
      if (ids_array.length > 0) {
        globalCadetAPIInstance.searchObj.ids = ids_array.join(",")
      } else
        globalCadetAPIInstance.searchObj.ids = "1111111111111111111111111111111"
    },
  },
  computed: {
    orderedCadetCategories() {
      return this.categories.results ? this.categories.results : []
    },
    orderedSubdivisions() {
      return this.subdivisions.results.filter(
        (subdivision) => subdivision.subdivision_category == "1",
      )
    },
    orderedGroups() {
      return this.groups.results
    },
    orderedSpecializations() {
      return this.specializations.results
    },
    orderedDirectionsOrd() {
      return this.directionsORD.results
    },
    orderedPassportIssueAuthorities() {
      return this.passportIssueAuthorities.results
    },
    orderedMilitaryOffices() {
      return this.militaryOffices.results
    },
    orderedGraduationReasons() {
      return this.graduationReasons.results
    },
    orderedVpkCategories() {
      return this.vpkCategories.results
    },
    orderedHealthGroups() {
      return this.healthGroups.results
        .filter((healthGroup) => healthGroup.ownership_category === "1")
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
    orderedPpflCategories() {
      return this.ppflCategories.results.filter(
        (ppfl) => ppfl.ownership_category === "1",
      )
    },
    orderedAdmissionQuotes_select_1() {
      if (this.currentCadetData.speciality_2 === 12) {
        return this.orderedAdmissionQuotes.filter((item) => item.id === 10)
      } else if (this.currentCadetData.speciality_2 === 10) {
        return this.orderedAdmissionQuotes.filter((item) => item.id === 12)
      } else {
        return this.orderedAdmissionQuotes.filter(
          (item) =>
            item.id !== this.currentCadetData.speciality_2 &&
            item.id !== this.currentCadetData.speciality_3 &&
            item.id !== this.currentCadetData.speciality_4 &&
            item.id !== this.currentCadetData.speciality_5 &&
            item.id !== this.currentCadetData.speciality_6 &&
            item.id !== this.currentCadetData.speciality_7 &&
            item.id !== this.currentCadetData.speciality_8 &&
            item.id !== this.currentCadetData.speciality_9,
        )
      }
    },
    orderedAdmissionQuotes_select_2() {
      if (this.currentCadetData.speciality_1 === 10) {
        return this.orderedAdmissionQuotes.filter((item) => item.id === 12)
      } else if (this.currentCadetData.speciality_1 === 12) {
        return this.orderedAdmissionQuotes.filter((item) => item.id === 10)
      } else {
        return this.orderedAdmissionQuotes.filter(
          (item) =>
            item.id !== this.currentCadetData.speciality_1 &&
            item.id !== this.currentCadetData.speciality_3 &&
            item.id !== this.currentCadetData.speciality_4 &&
            item.id !== this.currentCadetData.speciality_5 &&
            item.id !== this.currentCadetData.speciality_6 &&
            item.id !== this.currentCadetData.speciality_7 &&
            item.id !== this.currentCadetData.speciality_8 &&
            item.id !== this.currentCadetData.speciality_9,
        )
      }
    },
    orderedAdmissionQuotes_select_3() {
      return this.orderedAdmissionQuotes.filter(
        (item) =>
          item.id !== this.currentCadetData.speciality_1 &&
          item.id !== this.currentCadetData.speciality_2 &&
          item.id !== this.currentCadetData.speciality_4 &&
          item.id !== this.currentCadetData.speciality_5 &&
          item.id !== this.currentCadetData.speciality_6 &&
          item.id !== this.currentCadetData.speciality_7 &&
          item.id !== this.currentCadetData.speciality_8 &&
          item.id !== this.currentCadetData.speciality_9,
      )
    },
    orderedAdmissionQuotes_select_4() {
      return this.orderedAdmissionQuotes.filter(
        (item) =>
          item.id !== this.currentCadetData.speciality_1 &&
          item.id !== this.currentCadetData.speciality_2 &&
          item.id !== this.currentCadetData.speciality_3 &&
          item.id !== this.currentCadetData.speciality_5 &&
          item.id !== this.currentCadetData.speciality_6 &&
          item.id !== this.currentCadetData.speciality_7 &&
          item.id !== this.currentCadetData.speciality_8 &&
          item.id !== this.currentCadetData.speciality_9,
      )
    },
    orderedAdmissionQuotes_select_5() {
      return this.orderedAdmissionQuotes.filter(
        (item) =>
          item.id !== this.currentCadetData.speciality_1 &&
          item.id !== this.currentCadetData.speciality_2 &&
          item.id !== this.currentCadetData.speciality_3 &&
          item.id !== this.currentCadetData.speciality_4 &&
          item.id !== this.currentCadetData.speciality_6 &&
          item.id !== this.currentCadetData.speciality_7 &&
          item.id !== this.currentCadetData.speciality_8 &&
          item.id !== this.currentCadetData.speciality_9,
      )
    },
    orderedAdmissionQuotes_select_6() {
      return this.orderedAdmissionQuotes.filter(
        (item) =>
          item.id !== this.currentCadetData.speciality_1 &&
          item.id !== this.currentCadetData.speciality_2 &&
          item.id !== this.currentCadetData.speciality_3 &&
          item.id !== this.currentCadetData.speciality_4 &&
          item.id !== this.currentCadetData.speciality_5 &&
          item.id !== this.currentCadetData.speciality_7 &&
          item.id !== this.currentCadetData.speciality_8 &&
          item.id !== this.currentCadetData.speciality_9,
      )
    },
    orderedAdmissionQuotes_select_7() {
      return this.orderedAdmissionQuotes.filter(
        (item) =>
          item.id !== this.currentCadetData.speciality_1 &&
          item.id !== this.currentCadetData.speciality_2 &&
          item.id !== this.currentCadetData.speciality_3 &&
          item.id !== this.currentCadetData.speciality_4 &&
          item.id !== this.currentCadetData.speciality_5 &&
          item.id !== this.currentCadetData.speciality_6 &&
          item.id !== this.currentCadetData.speciality_8 &&
          item.id !== this.currentCadetData.speciality_9,
      )
    },
    orderedAdmissionQuotes_select_8() {
      return this.orderedAdmissionQuotes.filter(
        (item) =>
          item.id !== this.currentCadetData.speciality_1 &&
          item.id !== this.currentCadetData.speciality_2 &&
          item.id !== this.currentCadetData.speciality_3 &&
          item.id !== this.currentCadetData.speciality_4 &&
          item.id !== this.currentCadetData.speciality_5 &&
          item.id !== this.currentCadetData.speciality_6 &&
          item.id !== this.currentCadetData.speciality_7 &&
          item.id !== this.currentCadetData.speciality_9,
      )
    },
    orderedAdmissionQuotes_select_9() {
      return this.orderedAdmissionQuotes.filter(
        (item) =>
          item.id !== this.currentCadetData.speciality_1 &&
          item.id !== this.currentCadetData.speciality_2 &&
          item.id !== this.currentCadetData.speciality_3 &&
          item.id !== this.currentCadetData.speciality_4 &&
          item.id !== this.currentCadetData.speciality_5 &&
          item.id !== this.currentCadetData.speciality_6 &&
          item.id !== this.currentCadetData.speciality_7 &&
          item.id !== this.currentCadetData.speciality_8,
      )
    },
    orderedAdmissionQuotes() {
      return this.admissionQuota.results
        .filter((quota) => quota.ownership_category === "1")
        .sort((a, b) => {
          const admission_codeA = a.quota_verbose_name
          const admission_codeB = b.quota_verbose_name
          if (admission_codeA < admission_codeB) {
            return -1
          }
          if (admission_codeA > admission_codeB) {
            return 1
          }
          return 0
        })
    },
    orderedPrivileges() {
      return this.privileges.results
    },
    get_score_sum() {
      let education_average_score = this.currentCadetData
        .education_average_score
        ? parseInt(this.currentCadetData.education_average_score)
        : 0
      let rus_score_ct = this.currentCadetData.rus_score_ct
        ? this.currentCadetData.rus_score_ct
        : 0
      let bel_score_ct = this.currentCadetData.bel_score_ct
        ? this.currentCadetData.bel_score_ct
        : 0
      let social_science_score_ct = this.currentCadetData
        .social_science_score_ct
        ? this.currentCadetData.social_science_score_ct
        : 0
      let foreign_lang_score_ct = this.currentCadetData.foreign_lang_score_ct
        ? this.currentCadetData.foreign_lang_score_ct
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
      let counter = 0
      this.average_score_calculation.certificate.forEach((item) => {
        if (item.selectValue !== 0 && item.selectValue !== "") {
          counter = counter + parseInt(item.selectValue)
        }
      })
      this.average_score_calculation.diploma.forEach((item) => {
        if (item.selectValue !== 0 && item.selectValue !== "") {
          counter = counter + parseInt(item.selectValue)
        }
      })
      if (this.getAverageScoreCount() > 0) {
        return ((counter / this.getAverageScoreCount()) * 10).toFixed()
      } else return 0
    },
    getARussianAndBelorussianSumScore() {
      let scoreSum = ""
      if (
        isFinite(this.currentCadetData.rus_score_cert) &&
        this.currentCadetData.rus_score_cert !== null &&
        isFinite(this.currentCadetData.bel_score_cert)
      ) {
        scoreSum =
          this.currentCadetData.rus_score_cert +
          this.currentCadetData.bel_score_cert
        return scoreSum
      }
      return scoreSum
    },
    getCadetStatus() {
      return ""
      // if (this.currentCadetData.academy_end_date) {
      //   if (dayjs().isBefore(dayjs(this.currentCadetData.academy_end_date))) {
      //     return "Обучается"
      //   } else
      //     return `Дата окончания обучения - ${this.currentCadetData.academy_end_date || "Нет данных"}, причина - ${this.currentCadetData.get_graduation_reason || "Нет данных"},
      //   статья - ${this.currentCadetData.graduation_reason_article || "Нет данных"}`
      // } else return "Нет данных о дате отчисления"
    },
    getIfThisCadetIsInFavorite() {
      return this.favoriteCadetsIdsInString.includes(
        this.currentCadetData.id.toString(),
      )
    },
    ...mapGetters({
      groups: "groups/getList",
      ranks: "ranks/getList",
      subdivisions: "subdivisions/getList",
      specialities: "specialities/getList",
      specializations: "specializations/getList",
      directionsORD: "directionsORD/getList",
      positions: "positions/getList",
      orderOwners: "orderOwners/getList",
      categories: "personCategories/getList",
      militaryOffices: "militaryOffices/getList",
      graduationReasons: "graduationReasons/getList",
      passportIssueAuthorities: "passportAuthorities/getList",
      vpkCategories: "vpkCategories/getList",
      token: "auth/getToken",
      isCommonLoading: "common/getIsCommonLoading",
      healthGroups: "healthGroup/getList",
      ppflCategories: "ppflCategories/getList",
      admissionQuota: "admissionQuota/getList",
      privileges: "privileges/getList",
      favoriteCadets: "favoriteCadets/getList",
      favoriteCadetsIdsInString: "favoriteCadets/getMainListIdsInString",
    }),
  },
  watch: {
    currentCadetData: {
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

<style scoped></style>
