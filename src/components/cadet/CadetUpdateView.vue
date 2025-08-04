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
        Личное дело ({{ currentCadetData.last_name_rus }}
        {{ currentCadetData.first_name_rus }})
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
                              disabled
                              v-model="currentCadetData.id"
                            />
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
                          v-model="currentCadetData.passport_number"
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
                          v-model="currentCadetData.passport_issue_date"
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
                          v-model="currentCadetData.passport_validity_period"
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
                          v-model="currentCadetData.passport_issue_authority"
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
                    <!--                  <a-->
                    <!--                    class="p-1 rounded"-->
                    <!--                    href="#simple-list-scientific-works-data"-->
                    <!--                    >Научные труды и изобретения</a-->
                    <!--                  >-->
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

import { debounce } from "lodash/function"
import { RankHistoryCadetComponent } from "@/components/cadet/rank"
import { EncouragementCadetComponent } from "@/components/cadet/encouragement"
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

export default {
  name: "CadetUpdateView",
  components: {
    RankHistoryCadetComponent,
    EncouragementCadetComponent,
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
      },
      cadetAPIInstance: getCadetAPIInstance(),
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
      token: "auth/getToken",
      isCommonLoading: "common/getIsCommonLoading",
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
