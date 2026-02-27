<template>
  <div v-if="isLoading">Загрузка...</div>
  <div v-else>
    <div class="container">
      <div class="mb-4"></div>
      <div class="row">
        <div class="col-md-4">
          <div>
            <img
              v-if="currentCadet.photo"
              :src="currentCadet.photo"
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
          </div>
        </div>
        <div class="col-md-8">
          <div>
            <div class="card-body">
              <h1 class="card-title">
                {{ currentCadet.last_name_rus || "Нет данных" }}
                {{ currentCadet.first_name_rus || "Нет данных" }}
                {{ currentCadet.patronymic_rus || "Нет данных" }}
              </h1>
              <br />
              <h5 class="my-0">
                Дата рождения - {{ currentCadet.date_of_birth || "Нет данных" }}
              </h5>
              <br />
              <h5 class="my-0">
                Адрес - {{ currentCadet.address_residence || "Нет данных" }}
              </h5>
              <br />
              <h5 class="my-0">
                Паспорт - {{ currentCadet.passport_number || "Нет данных" }},
                выдан -
                <span v-if="currentCadet.passport_issue_authority">
                  {{ currentCadet.get_passport_issue_authority }}
                </span>
                <span v-else>Нет данных</span>
              </h5>
              <br />
            </div>
          </div>
        </div>
      </div>
      <div class="my-3"></div>
      <div class="row">
        <div class="col-12">
          <div class="card shadow-sm p-3 mb-3 bg-body-tertiary rounded">
            <div class="card-body">
              <h5 class="card-title">
                <font-awesome-icon :icon="['fas', 'user-graduate']" />
                Обучение в Академии МВД
              </h5>
              Начало обучения -
              {{ currentCadet.academy_start_date || "Нет данных" }}<br />
              Окончание обучения -
              {{ currentCadet.academy_end_date || "Нет данных" }}<br />
              Факультет - {{ currentCadet.get_subdivision || "Нет данных"
              }}<br />
              Группа - {{ currentCadet.get_group || "Нет данных" }}<br />
              Специальность - {{ currentCadet.get_speciality || "Нет данных"
              }}<br />
              Специализация -
              {{ currentCadet.get_specialization || "Нет данных" }}<br />
              Направление ОРД -
              {{ currentCadet.get_direction_ord || "Нет данных" }}<br />
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card shadow-sm p-3 mb-3 bg-body-tertiary rounded">
            <div class="card-body">
              <h5 class="card-title">
                <font-awesome-icon :icon="['fas', 'person-breastfeeding']" />
                Сведения о родителях
              </h5>
              <div class="row">
                <div class="col-lg-6">
                  Мать - {{ currentCadet.get_mother_full_name || "Нет данных" }}
                  <br />
                  Дата рождения -
                  {{ currentCadet.mother_date_of_birth || "Нет данных" }} <br />
                  Место работы, должность -
                  {{ currentCadet.mother_place_of_work || "Нет данных" }} <br />
                  Номер телефона -
                  {{ currentCadet.mother_phone_number || "Нет данных" }} <br />
                  <hr class="divider d-lg-none" />
                </div>
                <div class="col-lg-6">
                  Отец - {{ currentCadet.get_father_full_name || "Нет данных" }}
                  <br />
                  Дата рождения -
                  {{ currentCadet.father_date_of_birth || "Нет данных" }} <br />
                  Место работы, должность -
                  {{ currentCadet.father_place_of_work || "Нет данных" }} <br />
                  Номер телефона -
                  {{ currentCadet.father_phone_number || "Нет данных" }} <br />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--      Кадры-->
      <div class="mb-2">
        <h3>Кадровый блок</h3>
        <ul class="nav nav-tabs" id="myTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button
              class="nav-link active"
              id="rank-tab"
              data-bs-toggle="tab"
              data-bs-target="#rank-tab-pane"
              type="button"
              role="tab"
              aria-controls="rank-tab-pane"
              aria-selected="false"
            >
              <font-awesome-icon :icon="['far', 'star']" />&nbsp;Звания
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              id="education-tab"
              data-bs-toggle="tab"
              data-bs-target="#education-tab-pane"
              type="button"
              role="tab"
              aria-controls="education-tab-pane"
              aria-selected="true"
            >
              <font-awesome-icon :icon="['fas', 'user-graduate']" />&nbsp;
              Образование
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              id="languages-tab"
              data-bs-toggle="tab"
              data-bs-target="#languages-tab-pane"
              type="button"
              role="tab"
              aria-controls="languages-tab-pane"
              aria-selected="true"
            >
              <font-awesome-icon :icon="['fas', 'language']" />&nbsp; Владение
              иностранными языками
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              id="scientific-works-tab"
              data-bs-toggle="tab"
              data-bs-target="#scientific-works-tab-pane"
              type="button"
              role="tab"
              aria-controls="scientific-works-tab-pane"
              aria-selected="true"
            >
              <font-awesome-icon :icon="['fas', 'flask']" />&nbsp; Научные труды
              и изобретения
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              id="job-tab"
              data-bs-toggle="tab"
              data-bs-target="#job-tab-pane"
              type="button"
              role="tab"
              aria-controls="job-tab-pane"
              aria-selected="true"
            >
              <font-awesome-icon :icon="['fas', 'briefcase']" />&nbsp; Трудовая
              деятельность
            </button>
          </li>
        </ul>
        <div class="tab-content" id="myTabContent">
          <div
            class="tab-pane fade show active"
            id="rank-tab-pane"
            role="tabpanel"
            aria-labelledby="rank-tab"
            tabindex="0"
          >
            <div class="card shadow-sm p-3 mb-3 bg-body-tertiary rounded">
              <div class="card-body">
                <div
                  style="max-height: 200px; overflow: auto"
                  v-if="orderedRankHistory.length > 0"
                >
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Звание</th>
                        <th>С какого числа присвоено звание</th>
                        <th>Дата приказа</th>
                        <th>Номер приказа</th>
                        <th>Чей приказ</th>
                        <th>Доп. информация</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="rankHistory in orderedRankHistory"
                        :key="rankHistory.id"
                        class="align-baseline"
                      >
                        <td>
                          {{ rankHistory.get_rank_str || "Нет данных" }}
                        </td>
                        <td>{{ rankHistory.rank_date }}</td>
                        <td>
                          {{ rankHistory.rank_order_date || "Нет данных" }}
                        </td>
                        <td>{{ rankHistory.rank_order_number }}</td>
                        <td>{{ rankHistory.get_rank_order_owner_str }}</td>
                        <td>
                          {{ rankHistory.rank_extra_data || "Нет данных" }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="fs-5" v-else>Записей нет</div>
                <PaginatorView
                  :update-paginator="getPaginatorUpdateFunction('rankHistory')"
                  :list-next="rankHistoryList.next"
                  :list-previous="rankHistoryList.previous"
                  v-if="rankHistoryList.previous || rankHistoryList.next"
                />
              </div>
            </div>
          </div>
          <div
            class="tab-pane fade show"
            id="education-tab-pane"
            role="tabpanel"
            aria-labelledby="education-tab"
            tabindex="0"
          >
            <div class="card shadow-sm p-3 mb-3 bg-body-tertiary rounded">
              <div class="card-body">
                <div
                  style="max-height: 200px; overflow: auto"
                  v-if="orderedEducationHistory.length > 0"
                >
                  <table class="table table-hover">
                    <thead style="position: sticky; top: 0">
                      <tr>
                        <th>Уровень</th>
                        <th>Вид учреждения образования</th>
                        <th>Уровень образования</th>
                        <th>Наименование учебного учреждения</th>
                        <th>Начало обучения</th>
                        <th>Окончание обучекния</th>
                        <th>Средний бал</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="educationHistory in orderedEducationHistory"
                        :key="educationHistory.id"
                        class="align-baseline"
                      >
                        <td>
                          {{
                            educationHistory.get_education_level_str ||
                            "Нет данных"
                          }}
                        </td>
                        <td>
                          {{
                            educationHistory.get_education_kind_str ||
                            "Нет данных"
                          }}
                        </td>
                        <td>
                          {{
                            educationHistory.get_education_level_str ||
                            "Нет данных"
                          }}
                        </td>
                        <td>
                          {{
                            educationHistory.education_graduated || "Нет данных"
                          }}
                        </td>
                        <td>
                          {{
                            educationHistory.education_graduating_start_year ||
                            "Нет данных"
                          }}
                        </td>
                        <td>
                          {{
                            educationHistory.education_graduating_end_year ||
                            "Нет данных"
                          }}
                        </td>
                        <td>
                          {{
                            educationHistory.education_average_score ||
                            "Нет данных"
                          }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <PaginatorView
                    :update-paginator="
                      getPaginatorUpdateFunction('educationHistory')
                    "
                    :list-next="educationHistoryList.next"
                    :list-previous="educationHistoryList.previous"
                    v-if="
                      educationHistoryList.previous || educationHistoryList.next
                    "
                  />
                </div>
                <div class="fs-5" v-else>Записей нет</div>
              </div>
            </div>
          </div>
          <div
            class="tab-pane fade show"
            id="languages-tab-pane"
            role="tabpanel"
            aria-labelledby="languages-tab"
            tabindex="0"
          >
            <div class="card shadow-sm p-3 mb-3 bg-body-tertiary rounded">
              <div class="card-body">
                <div
                  style="max-height: 200px; overflow: auto"
                  v-if="orderedCadetForeignLanguageLevel.length > 0"
                >
                  <table class="table table-hover">
                    <thead style="position: sticky; top: 0">
                      <tr>
                        <th>Язык</th>
                        <th>Уровень владения</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="forLang in orderedCadetForeignLanguageLevel"
                        :key="forLang.id"
                        class="align-baseline"
                      >
                        <td>
                          {{ forLang.get_foreign_language_str || "Нет данных" }}
                        </td>
                        <td>
                          {{
                            forLang.get_foreign_language_level_str ||
                            "Нет данных"
                          }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <PaginatorView
                    :update-paginator="
                      getPaginatorUpdateFunction('cadetForeignLanguageLevel')
                    "
                    :list-next="cadetForeignLanguageLevelList.next"
                    :list-previous="cadetForeignLanguageLevelList.previous"
                    v-if="
                      cadetForeignLanguageLevelList.previous ||
                      cadetForeignLanguageLevelList.next
                    "
                  />
                </div>
                <div class="fs-5" v-else>Записей нет</div>
              </div>
            </div>
          </div>
          <div
            class="tab-pane fade show"
            id="scientific-works-tab-pane"
            role="tabpanel"
            aria-labelledby="scientific-works-tab"
            tabindex="0"
          >
            <div class="card shadow-sm p-3 mb-3 bg-body-tertiary rounded">
              <div class="card-body">
                <!--                <div-->
                <!--                  style="max-height: 200px; overflow: auto"-->
                <!--                  v-if="orderedCadetForeignLanguageLevel.length > 0"-->
                <!--                >-->
                <!--                  <table class="table table-hover">-->
                <!--                    <thead style="position: sticky; top: 0">-->
                <!--                    <tr>-->
                <!--                      <th>Язык</th>-->
                <!--                      <th>Уровень владения</th>-->
                <!--                    </tr>-->
                <!--                    </thead>-->
                <!--                    <tbody>-->
                <!--                    <tr-->
                <!--                      v-for="forLang in orderedCadetForeignLanguageLevel"-->
                <!--                      :key="forLang.id"-->
                <!--                      class="align-baseline"-->
                <!--                    >-->
                <!--                      <td>-->
                <!--                        {{ forLang.get_foreign_language_str || "Нет данных" }}-->
                <!--                      </td>-->
                <!--                      <td>-->
                <!--                        {{ forLang.get_foreign_language_level_str || "Нет данных" }}-->
                <!--                      </td>-->
                <!--                    </tr>-->
                <!--                    </tbody>-->
                <!--                  </table>-->
                <!--                  <PaginatorView-->
                <!--                    :update-paginator="getPaginatorUpdateFunction('punishment')"-->
                <!--                    :list-next="punishmentList.next"-->
                <!--                    :list-previous="punishmentList.previous"-->
                <!--                    v-if="punishmentList.previous || punishmentList.next"-->
                <!--                  />-->
                <!--                </div>-->
                <!--                <div class="fs-5" v-else>Записей нет</div>-->
              </div>
            </div>
          </div>
          <div
            class="tab-pane fade show"
            id="job-tab-pane"
            role="tabpanel"
            aria-labelledby="job-tab"
            tabindex="0"
          >
            <div class="card shadow-sm p-3 mb-3 bg-body-tertiary rounded">
              <div class="card-body">
                <div
                  style="max-height: 200px; overflow: auto"
                  v-if="orderedJobHistory.length > 0"
                >
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th scope="col">Должность</th>
                        <th scope="col">Начало работы</th>
                        <th scope="col">Окончание работы</th>
                        <th scope="col">Организация</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="jobHistory in orderedJobHistory"
                        :key="jobHistory.id"
                        class="align-baseline"
                      >
                        <td>
                          {{ jobHistory.job_position || "Нет данных" }}
                        </td>
                        <td>
                          {{ jobHistory.job_start_year || "Нет данных" }}
                        </td>
                        <td>
                          {{ jobHistory.job_end_year || "Нет данных" }}
                        </td>
                        <td>
                          {{ jobHistory.organisation_name || "Нет данных" }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="fs-5" v-else>Записей нет</div>
                <PaginatorView
                  :update-paginator="getPaginatorUpdateFunction('jobHistory')"
                  :list-next="jobHistoryList.next"
                  :list-previous="jobHistoryList.previous"
                  v-if="jobHistoryList.previous || jobHistoryList.next"
                />
              </div>
            </div>
          </div>
        </div>

        <ul class="nav nav-tabs" id="myTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button
              class="nav-link active"
              id="army-tab"
              data-bs-toggle="tab"
              data-bs-target="#army-tab-pane"
              type="button"
              role="tab"
              aria-controls="army-tab-pane"
              aria-selected="true"
            >
              <font-awesome-icon
                :icon="['fas', 'person-military-rifle']"
              />&nbsp; Прохождение службы в ВС РБ
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              id="mvd-tab"
              data-bs-toggle="tab"
              data-bs-target="#mvd-tab-pane"
              type="button"
              role="tab"
              aria-controls="mvd-tab-pane"
              aria-selected="true"
            >
              <font-awesome-icon
                :icon="['fas', 'person-military-rifle']"
              />&nbsp; Прохождение службы в МВД РБ
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              id="reward-tab"
              data-bs-toggle="tab"
              data-bs-target="#reward-tab-pane"
              type="button"
              role="tab"
              aria-controls="reward-tab-pane"
              aria-selected="true"
            >
              <font-awesome-icon :icon="['fas', 'medal']" />&nbsp; Награды
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              id="encouragement-tab"
              data-bs-toggle="tab"
              data-bs-target="#encouragement-tab-pane"
              type="button"
              role="tab"
              aria-controls="encouragement-tab-pane"
              aria-selected="false"
            >
              <font-awesome-icon
                :icon="['fas', 'credit-card']"
              />&nbsp;Поощрения
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              id="punishment-tab"
              data-bs-toggle="tab"
              data-bs-target="#punishment-tab-pane"
              type="button"
              role="tab"
              aria-controls="punishment-tab-pane"
              aria-selected="true"
            >
              <font-awesome-icon :icon="['fas', 'hand-holding-dollar']" />&nbsp;
              Взыскания
            </button>
          </li>
        </ul>

        <div class="tab-content" id="myTabContent">
          <div
            class="tab-pane fade show active"
            id="army-tab-pane"
            role="tabpanel"
            aria-labelledby="army-tab"
            tabindex="0"
          >
            <div class="card shadow-sm p-3 mb-3 bg-body-tertiary rounded">
              <div class="card-body">
                <div
                  style="max-height: 200px; overflow: auto"
                  v-if="orderedArmyHistory.length > 0"
                >
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>С какого времени</th>
                        <th>По какое время</th>
                        <th>Должность</th>
                        <th>Место прохождения службы</th>
                        <th>Чей приказ</th>
                        <th>Номер приказа и дата</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="armyService in orderedArmyHistory"
                        :key="armyService.id"
                        class="align-baseline"
                      >
                        <td>
                          {{
                            armyService.military_service_start || "Нет данных"
                          }}
                        </td>
                        <td>
                          {{ armyService.military_service_end || "Нет данных" }}
                        </td>
                        <td>
                          {{ armyService.position || "Нет данных" }}
                        </td>
                        <td>
                          {{
                            armyService.military_organization || "Нет данных"
                          }}
                        </td>
                        <td>
                          {{ armyService.get_order_owner_str || "Нет данных" }}
                        </td>
                        <td>
                          {{ armyService.order_number || "" }} от
                          {{ armyService.order_date || "" }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="fs-5" v-else>Записей нет</div>
                <PaginatorView
                  :update-paginator="getPaginatorUpdateFunction('armyHistory')"
                  :list-next="armyHistoryList.next"
                  :list-previous="armyHistoryList.previous"
                  v-if="armyHistoryList.previous || armyHistoryList.next"
                />
              </div>
            </div>
          </div>
          <div
            class="tab-pane fade"
            id="mvd-tab-pane"
            role="tabpanel"
            aria-labelledby="mvd-tab"
            tabindex="0"
          >
            <div class="card shadow-sm p-3 mb-3 bg-body-tertiary rounded">
              <div class="card-body">
                <div
                  style="max-height: 200px; overflow: auto"
                  v-if="orderedMVDHistory.length > 0"
                >
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>С какого времени</th>
                        <th>По какое время</th>
                        <th>Должность</th>
                        <th>Место прохождения службы</th>
                        <th>Чей приказ</th>
                        <th>Номер приказа и дата</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="mvdService in orderedArmyHistory"
                        :key="mvdService.id"
                        class="align-baseline"
                      >
                        <td>
                          {{ mvdService.mvd_service_start || "Нет данных" }}
                        </td>
                        <td>
                          {{ mvdService.mvd_service_end || "Нет данных" }}
                        </td>
                        <td>
                          {{ mvdService.position || "Нет данных" }}
                        </td>
                        <td>
                          {{ mvdService.mvd_organization || "Нет данных" }}
                        </td>
                        <td>
                          {{ mvdService.get_order_owner_str || "Нет данных" }}
                        </td>
                        <td>
                          {{ mvdService.order_number || "" }} от
                          {{ mvdService.order_date || "" }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="fs-5" v-else>Записей нет</div>
                <PaginatorView
                  :update-paginator="getPaginatorUpdateFunction('armyHistory')"
                  :list-next="armyHistoryList.next"
                  :list-previous="armyHistoryList.previous"
                  v-if="armyHistoryList.previous || armyHistoryList.next"
                />
              </div>
            </div>
          </div>
          <div
            class="tab-pane fade"
            id="reward-tab-pane"
            role="tabpanel"
            aria-labelledby="reward-tab"
            tabindex="0"
          >
            <div class="card shadow-sm p-3 mb-3 bg-body-tertiary rounded">
              <div class="card-body">
                <div
                  style="max-height: 200px; overflow: auto"
                  v-if="orderedRewardHistory.length > 0"
                >
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Чем награжден</th>
                        <th>За что награжден</th>
                        <th>Номер приказа</th>
                        <th>Дата приказа</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="reward in orderedRewardHistory"
                        :key="reward.id"
                        class="align-baseline"
                      >
                        <td>{{ reward.get_reward_str || "Нет данных" }}</td>
                        <td>{{ reward.reason || "Нет данных" }}</td>
                        <td>{{ reward.order_number || "Нет данных" }}</td>
                        <td>{{ reward.reward_date || "Нет данных" }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="fs-5" v-else>Записей нет</div>
                <PaginatorView
                  :update-paginator="getPaginatorUpdateFunction('armyHistory')"
                  :list-next="armyHistoryList.next"
                  :list-previous="armyHistoryList.previous"
                  v-if="armyHistoryList.previous || armyHistoryList.next"
                />
              </div>
            </div>
          </div>
          <div
            class="tab-pane fade"
            id="encouragement-tab-pane"
            role="tabpanel"
            aria-labelledby="encouragement-tab"
            tabindex="0"
          >
            <div class="card shadow-sm p-3 mb-3 bg-body-tertiary rounded">
              <div class="card-body">
                <div
                  style="max-height: 200px; overflow: auto"
                  v-if="orderedEncouragements.length > 0"
                >
                  <table class="table table-hover">
                    <thead style="position: sticky; top: 0">
                      <tr>
                        <th>Поощрение</th>
                        <th>Дата</th>
                        <th>Приказ</th>
                        <th>Чей приказ</th>
                        <th>Фабула</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="encouragement in orderedEncouragements"
                        :key="encouragement.id"
                        style="cursor: pointer"
                        class="align-baseline"
                      >
                        <td>
                          {{
                            encouragement.get_encouragement_kind_str ||
                            "Нет данных"
                          }}
                        </td>
                        <td>{{ encouragement.encouragement_date }}</td>
                        <td>{{ encouragement.encouragement_order_number }}</td>
                        <td>
                          {{ encouragement.get_encouragement_order_owner }}
                        </td>
                        <td>{{ encouragement.extra_data || "Нет данных" }}</td>
                      </tr>
                    </tbody>
                  </table>
                  <PaginatorView
                    :update-paginator="
                      getPaginatorUpdateFunction('encouragement')
                    "
                    :list-next="encouragementList.next"
                    :list-previous="encouragementList.previous"
                    v-if="encouragementList.previous || encouragementList.next"
                  />
                </div>
                <div class="fs-5" v-else>Записей нет</div>
              </div>
            </div>
          </div>
          <div
            class="tab-pane fade show"
            id="punishment-tab-pane"
            role="tabpanel"
            aria-labelledby="punishment-tab"
            tabindex="0"
          >
            <div class="card shadow-sm p-3 mb-3 bg-body-tertiary rounded">
              <div class="card-body">
                <div
                  style="max-height: 200px; overflow: auto"
                  v-if="orderedPunishments.length > 0"
                >
                  <table class="table table-hover">
                    <thead style="position: sticky; top: 0">
                      <tr>
                        <th>Взыскание</th>
                        <th>Дата наложения</th>
                        <th>Приказ о наложении</th>
                        <th>Чей приказ</th>
                        <th>Фабула</th>
                        <th>Дата снятия</th>
                        <th>Приказ о снятии</th>
                        <th>Чей приказ</th>
                        <th>Фабула</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="punishment in orderedPunishments"
                        :key="punishment.id"
                        class="align-baseline"
                      >
                        <td>
                          {{
                            punishment.get_punishment_kind_str || "Нет данных"
                          }}
                        </td>
                        <td>
                          {{ punishment.punishment_start_date || "Нет данных" }}
                        </td>
                        <td>
                          {{
                            punishment.punishment_start_order_number ||
                            "Нет данных"
                          }}
                        </td>
                        <td>
                          {{
                            punishment.get_punishment_start_order_owner ||
                            "Нет данных"
                          }}
                        </td>
                        <td>
                          {{
                            punishment.punishment_start_extra_data ||
                            "Нет данных"
                          }}
                        </td>
                        <td>
                          {{
                            punishment.punishment_expiration_date ||
                            "Нет данных"
                          }}
                        </td>
                        <td>
                          {{
                            punishment.punishment_expiration_order_number ||
                            "Нет данных"
                          }}
                        </td>
                        <td>
                          {{
                            punishment.get_punishment_expiration_order_owner ||
                            "Нет данных"
                          }}
                        </td>
                        <td>
                          {{
                            punishment.punishment_expiration_extra_data ||
                            "Нет данных"
                          }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <PaginatorView
                    :update-paginator="getPaginatorUpdateFunction('punishment')"
                    :list-next="punishmentList.next"
                    :list-previous="punishmentList.previous"
                    v-if="punishmentList.previous || punishmentList.next"
                  />
                </div>
                <div class="fs-5" v-else>Записей нет</div>
              </div>
            </div>
          </div>
        </div>

        <ul class="nav nav-tabs" id="myTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button
              class="nav-link active"
              id="positions-tab"
              data-bs-toggle="tab"
              data-bs-target="#positions-tab-pane"
              type="button"
              role="tab"
              aria-controls="positions-tab-pane"
              aria-selected="true"
            >
              <font-awesome-icon :icon="['fas', 'stairs']" />&nbsp; Должности
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              id="specialities-tab"
              data-bs-toggle="tab"
              data-bs-target="#specialities-tab-pane"
              type="button"
              role="tab"
              aria-controls="specialities-tab-pane"
              aria-selected="true"
            >
              <font-awesome-icon :icon="['fas', 'diamond-turn-right']" />&nbsp;
              Специальности
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              id="marital-status-tab"
              data-bs-toggle="tab"
              data-bs-target="#marital-status-tab-pane"
              type="button"
              role="tab"
              aria-controls="marital-status-tab-pane"
              aria-selected="true"
            >
              <font-awesome-icon :icon="['fas', 'people-roof']" />&nbsp;
              Семейное положение
            </button>
          </li>
        </ul>

        <div class="tab-content" id="myTabContent">
          <div
            class="tab-pane fade show active"
            id="positions-tab-pane"
            role="tabpanel"
            aria-labelledby="positions-tab"
            tabindex="0"
          >
            <div class="card shadow-sm p-3 mb-3 bg-body-tertiary rounded">
              <div class="card-body">
                <div
                  style="max-height: 200px; overflow: auto"
                  v-if="orderedPositionHistory.length > 0"
                >
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Должность</th>
                        <th>Дата назначения</th>
                        <th>Приказ о назначении</th>
                        <th>Дата приказа</th>
                        <th>Чей приказ</th>
                        <th>Фабула</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="position in orderedPositionHistory"
                        :key="position.id"
                        class="align-baseline"
                      >
                        <td>{{ position.get_position_str || "Нет данных" }}</td>
                        <td>{{ position.position_date || "Нет данных" }}</td>
                        <td>
                          {{ position.position_order_number || "Нет данных" }}
                        </td>
                        <td>
                          {{ position.position_order_date || "Нет данных" }}
                        </td>
                        <td>
                          {{
                            position.get_position_order_owner_str ||
                            "Нет данных"
                          }}
                        </td>
                        <td>
                          {{ position.position_extra_data || "Нет данных" }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="fs-5" v-else>Записей нет</div>
                <PaginatorView
                  :update-paginator="
                    getPaginatorUpdateFunction('positionHistory')
                  "
                  :list-next="positionHistoryList.next"
                  :list-previous="positionHistoryList.previous"
                  v-if="
                    positionHistoryList.previous || positionHistoryList.next
                  "
                />
              </div>
            </div>
          </div>
          <div
            class="tab-pane fade"
            id="specialities-tab-pane"
            role="tabpanel"
            aria-labelledby="specialities-tab"
            tabindex="0"
          >
            <div class="card shadow-sm p-3 mb-3 bg-body-tertiary rounded">
              <div class="card-body">
                <div
                  style="max-height: 200px; overflow: auto"
                  v-if="orderedSpecialityHistory.length > 0"
                >
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Специальность</th>
                        <th>Приказ о назначении</th>
                        <th>Дата приказа</th>
                        <th>Чей приказ</th>
                        <th>Фабула</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="speciality in orderedSpecialityHistory"
                        :key="speciality.id"
                        class="align-baseline"
                      >
                        <td>
                          {{ speciality.get_speciality_str || "Нет данных" }}
                        </td>
                        <td>
                          {{
                            speciality.speciality_order_number || "Нет данных"
                          }}
                        </td>
                        <td>
                          {{ speciality.speciality_order_date || "Нет данных" }}
                        </td>
                        <td>
                          {{
                            speciality.get_speciality_order_owner_str ||
                            "Нет данных"
                          }}
                        </td>
                        <td>
                          {{ speciality.speciality_extra_data || "Нет данных" }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="fs-5" v-else>Записей нет</div>
                <PaginatorView
                  :update-paginator="
                    getPaginatorUpdateFunction('specialityHistory')
                  "
                  :list-next="specialityHistoryList.next"
                  :list-previous="specialityHistoryList.previous"
                  v-if="
                    specialityHistoryList.previous || specialityHistoryList.next
                  "
                />
              </div>
            </div>
          </div>
          <div
            class="tab-pane fade"
            id="marital-status-tab-pane"
            role="tabpanel"
            aria-labelledby="marital-status-tab"
            tabindex="0"
          >
            <div class="card shadow-sm p-3 mb-3 bg-body-tertiary rounded">
              <div class="card-body">
                <div
                  style="max-height: 200px; overflow: auto"
                  v-if="orderedRelatives.length > 0"
                >
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>
                          Фамилия, имя, отчество жены (мужа), детей и лиц,
                          находящихся на иждивении
                        </th>
                        <th>Степень родства</th>
                        <th>Дата рождения</th>
                        <th>Место рождения</th>
                        <th>
                          Основание: номер и дата свидетельства о браке, о
                          рождении, кем выдано
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="relative in orderedRelatives"
                        :key="relative.id"
                        class="align-baseline"
                      >
                        <td>{{ relative.kinship_data || "Нет данных" }}</td>
                        <td>
                          {{
                            relative.get_degree_of_kinship_str || "Нет данных"
                          }}
                        </td>
                        <td>{{ relative.date_of_birth || "Нет данных" }}</td>
                        <td>{{ relative.place_of_birth || "Нет данных" }}</td>
                        <td>{{ relative.document_data || "Нет данных" }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="fs-5" v-else>Записей нет</div>
                <PaginatorView
                  :update-paginator="getPaginatorUpdateFunction('relatives')"
                  :list-next="relativesList.next"
                  :list-previous="relativesList.previous"
                  v-if="relativesList.previous || relativesList.next"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--     Идеология -->
      <div class="mb-2">
        <h3>Идеология</h3>
        <ul class="nav nav-tabs" id="myTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button
              class="nav-link active"
              id="punishment-tab"
              data-bs-toggle="tab"
              data-bs-target="#"
              type="button"
              role="tab"
              aria-controls="punishment-tab-pane"
              aria-selected="true"
            >
              <font-awesome-icon :icon="['fas', 'hand-holding-dollar']" />&nbsp;
              Вкладка 1
            </button>
          </li>
        </ul>
        <div class="tab-content" id="myTabContent">
          <div
            class="tab-pane fade show active"
            id="punishment-tab-pane"
            role="tabpanel"
            aria-labelledby="punishment-tab"
            tabindex="0"
          ></div>
        </div>
      </div>
      <!--     УМУ -->
      <div class="mb-2">
        <h3>УМУ</h3>
        <ul class="nav nav-tabs" id="myTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button
              class="nav-link active"
              id="punishment-tab"
              data-bs-toggle="tab"
              data-bs-target="#punishment-tab-pane"
              type="button"
              role="tab"
              aria-controls="punishment-tab-pane"
              aria-selected="true"
            >
              <font-awesome-icon :icon="['fas', 'hand-holding-dollar']" />&nbsp;
              Вкладка 1
            </button>
          </li>
        </ul>
        <div class="tab-content" id="myTabContent">
          <div
            class="tab-pane fade show active"
            id="punishment-tab-pane"
            role="tabpanel"
            aria-labelledby="punishment-tab"
            tabindex="0"
          ></div>
        </div>
      </div>
      <!--     Научная работа -->
      <div class="mb-2">
        <h3>Научная работа</h3>
        <ul class="nav nav-tabs" id="myTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button
              class="nav-link active"
              id="punishment-tab"
              data-bs-toggle="tab"
              data-bs-target="#punishment-tab-pane"
              type="button"
              role="tab"
              aria-controls="punishment-tab-pane"
              aria-selected="true"
            >
              <font-awesome-icon :icon="['fas', 'hand-holding-dollar']" />&nbsp;
              Вкладка 1
            </button>
          </li>
        </ul>
        <div class="tab-content" id="myTabContent">
          <div
            class="tab-pane fade show active"
            id="punishment-tab-pane"
            role="tabpanel"
            aria-labelledby="punishment-tab"
            tabindex="0"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import getCadetAPIInstance from "@/api/cadet/cadetAPI"
import getEncouragementAPIInstance from "@/api/cadet/encouragementAPI"
import getPunishmentAPIInstance from "@/api/cadet/punishmentAPI"
import getRankHistoryAPIInstance from "@/api/cadet/rankHistoryAPI"
import getPositionHistoryAPIInstance from "@/api/cadet/positionHistoryAPI"
import getSpecialityHistoryAPIInstance from "@/api/cadet/specialityHistoryAPI"
import getEducationHistoryAPIInstance from "@/api/cadet/educationHistoryAPI"
import getJobHistoryAPIInstance from "@/api/cadet/jobHistoryAPI"
import getRewardHistoryAPIInstance from "@/api/cadet/rewardHistoryAPI"
import getArmyHistoryAPIInstance from "@/api/cadet/armyHistoryAPI"
import getMVDHistoryAPIInstance from "@/api/cadet/mvdHistoryAPI"
import getCadetForeignLanguageLevelAPIInstance from "@/api/cadet/cadetForeignLanguageLevelAPI"
import getRelativesAPIInstance from "@/api/cadet/relativesAPI"

import { PaginatorView } from "@/components/common"

export default {
  name: "CadetItemView",
  components: { PaginatorView },
  data() {
    return {
      currentCadet: {
        passport_issue_authority: {
          passport_issue_authority: "",
        },
      },
      encouragementList: { count: "", results: [], previous: null, next: null },
      encouragementKindList: {
        count: "",
        results: [],
        previous: null,
        next: null,
      },
      punishmentList: { count: "", results: [], previous: null, next: null },
      rankHistoryList: { count: "", results: [], previous: null, next: null },
      positionHistoryList: {
        count: "",
        results: [],
        previous: null,
        next: null,
      },
      specialityHistoryList: {
        count: "",
        results: [],
        previous: null,
        next: null,
      },
      educationHistoryList: {
        count: "",
        results: [],
        previous: null,
        next: null,
      },
      jobHistoryList: {
        count: "",
        results: [],
        previous: null,
        next: null,
      },
      rewardHistoryList: {
        count: "",
        results: [],
        previous: null,
        next: null,
      },
      armyHistoryList: {
        count: "",
        results: [],
        previous: null,
        next: null,
      },
      mvdHistoryList: {
        count: "",
        results: [],
        previous: null,
        next: null,
      },
      cadetForeignLanguageLevelList: {
        count: "",
        results: [],
        previous: null,
        next: null,
      },
      relativesList: {
        count: "",
        results: [],
        previous: null,
        next: null,
      },
      isLoading: true,
      isError: false,
      BACKEND_PROTOCOL: import.meta.env.VITE_APP_BACKEND_PROTOCOL,
      BACKEND_HOST: import.meta.env.VITE_APP_BACKEND_HOST,
      BACKEND_PORT: import.meta.env.VITE_APP_BACKEND_PORT,
      cadetAPIInstance: getCadetAPIInstance(),
      encouragementAPIInstance: getEncouragementAPIInstance(),
      punishmentAPIInstance: getPunishmentAPIInstance(),
      rankHistoryAPIInstance: getRankHistoryAPIInstance(),
      positionHistoryAPIInstance: getPositionHistoryAPIInstance(),
      specialityHistoryAPIInstance: getSpecialityHistoryAPIInstance(),
      educationHistoryAPIInstance: getEducationHistoryAPIInstance(),
      jobHistoryAPIInstance: getJobHistoryAPIInstance(),
      rewardHistoryAPIInstance: getRewardHistoryAPIInstance(),
      armyHistoryAPIInstance: getArmyHistoryAPIInstance(),
      mvdHistoryAPIInstance: getMVDHistoryAPIInstance(),
      cadetForeignLanguageLevelAPIInstance:
        getCadetForeignLanguageLevelAPIInstance(),
      relativesAPIInstance: getRelativesAPIInstance(),
    }
  },
  async created() {
    await this.loadData(this.$route.params.id)
  },
  methods: {
    async loadData(cadetId) {
      this.isLoading = true
      this.isError = false
      try {
        const [
          cadet,
          encouragements,
          punishments,
          ranks,
          positions,
          specialities,
          educations,
          jobs,
          rewards,
          armyServices,
          mvdServices,
          languageLevels,
          relatives,
        ] = await Promise.all([
          this.getCadetData(cadetId),
          this.getLoadListFunction("encouragement")(cadetId),
          this.getLoadListFunction("punishment")(cadetId),
          this.getLoadListFunction("rankHistory")(cadetId),
          this.getLoadListFunction("positionHistory")(cadetId),
          this.getLoadListFunction("specialityHistory")(cadetId),
          this.getLoadListFunction("educationHistory")(cadetId),
          this.getLoadListFunction("jobHistory")(cadetId),
          this.getLoadListFunction("rewardHistory")(cadetId),
          this.getLoadListFunction("armyHistory")(cadetId),
          this.getLoadListFunction("mvdHistory")(cadetId),
          this.getLoadListFunction("cadetForeignLanguageLevel")(cadetId),
          this.getLoadListFunction("relatives")(cadetId),
        ]).catch(() => (this.isError = true))
        this.currentCadet = cadet
        this.encouragementList = encouragements
        this.punishmentList = punishments
        this.rankHistoryList = ranks
        this.positionHistoryList = positions
        this.specialityHistoryList = specialities
        this.educationHistoryList = educations
        this.jobHistoryList = jobs
        this.rewardHistoryList = rewards
        this.armyHistoryList = armyServices
        this.mvdHistoryList = mvdServices
        this.cadetForeignLanguageLevelList = languageLevels
        this.relativesList = relatives
      } catch (e) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    async getCadetData(cadetId) {
      const res = await this.cadetAPIInstance.getItemData(cadetId)
      return res.data
    },

    getLoadListFunction(modelName) {
      return async (cadetId) => {
        this[`${modelName}APIInstance`].searchObj.cadet = cadetId
        const res = await this[`${modelName}APIInstance`].getItemsList()
        return res.data
      }
    },

    getPaginatorUpdateFunction(modelName) {
      return async (url) => {
        try {
          const response = await this[`${modelName}APIInstance`].updateList(url)
          this[`${modelName}List`] = await response.data
        } catch (error) {
          this.isError = true
        }
      }
    },
  },
  computed: {
    orderedEncouragements() {
      return this.encouragementList.results
    },
    orderedPunishments() {
      return this.punishmentList.results
    },
    orderedRankHistory() {
      return this.rankHistoryList.results
    },
    orderedEducationHistory() {
      return this.educationHistoryList.results
    },
    orderedJobHistory() {
      return this.jobHistoryList.results
    },
    orderedRewardHistory() {
      return this.rewardHistoryList.results
    },
    orderedArmyHistory() {
      return this.armyHistoryList.results
    },
    orderedMVDHistory() {
      return this.mvdHistoryList.results
    },
    orderedCadetForeignLanguageLevel() {
      return this.cadetForeignLanguageLevelList.results
    },
    orderedPositionHistory() {
      return this.positionHistoryList.results
    },
    orderedSpecialityHistory() {
      return this.specialityHistoryList.results
    },
    orderedRelatives() {
      return this.relativesList.results
    },
  },
}
</script>

<style scoped></style>
