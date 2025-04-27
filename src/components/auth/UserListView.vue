<template>
  <base-list-layout
    :is-loading="isLoading"
    :main-list-length="mainItemList.count"
    title="Список пользователей"
    :load-more-data="loadMoreData"
  >
    <template v-slot:modals>
      <!-- add modal-->
      <div
        class="modal fade"
        id="mainItemAddModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        ref="mainItemAddModal"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                Создание пользователя
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div class="modal-body">
              <div class="mb-3">
                <label for="id_username_create" class="form-label"
                  >Имя пользователя</label
                >
                <input
                  id="id_username_create"
                  type="text"
                  class="form-control"
                  v-model="itemForm.username"
                  @blur="v$.itemForm.username.$touch"
                />
                <div class="my-2">
                  <p
                    v-for="error of v$.itemForm.username.$errors"
                    class="bg-danger-subtle p-2 rounded-2"
                    :key="error.$uid"
                  >
                    {{ error.$message }}
                  </p>
                </div>
              </div>
              <div class="mb-3">
                <label for="id_password_create" class="form-label"
                  >Пароль</label
                >
                <input
                  id="id_password_create"
                  type="password"
                  class="form-control"
                  v-model="itemForm.password"
                  @blur="v$.itemForm.password.$touch"
                />
                <div class="my-2">
                  <p
                    v-for="error of v$.itemForm.password.$errors"
                    class="bg-danger-subtle p-2 rounded-2"
                    :key="error.$uid"
                  >
                    {{ error.$message }}
                  </p>
                </div>
              </div>
              <div class="mb-3">
                <label for="id_repeat_password_create" class="form-label"
                  >Пароль (повтор)</label
                >
                <input
                  id="id_repeat_password_create"
                  type="password"
                  class="form-control"
                  v-model="itemForm.repeat_password"
                  @blur="v$.itemForm.repeat_password.$touch"
                />
                <div class="my-2">
                  <p
                    v-for="error of v$.itemForm.repeat_password.$errors"
                    class="bg-danger-subtle p-2 rounded-2"
                    :key="error.$uid"
                  >
                    {{ error.$message }}
                  </p>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                ref="mainItemAddModalCloseButton"
              >
                Закрыть
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                @click="addNewItem"
                :disabled="this.v$.itemForm.$invalid"
                v-if="this.v$.$pending"
              >
                Проверка
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                @click="addNewItem"
                :disabled="this.v$.itemForm.$invalid"
                v-else
              >
                Добавить запись
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        class="modal fade"
        id="mainItemUpdateModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        ref="mainItemUpdateModal"
      >
        <div class="modal-dialog modal-dialog-centered modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                Редактирование записи
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div
              class="modal-body"
              style="max-height: calc(100vh - 270px); overflow-y: auto"
            >
              <div class="container-fluid">
                <div class="row">
                  <div class="col-xl-4">
                    <div
                      class="my-3 d-flex justify-content-center align-items-center flex-column"
                    >
                      <img
                        v-if="selectedItem.avatar"
                        :src="selectedItem.avatar"
                        class="rounded-circle"
                        alt="..."
                        style="
                          width: 90%;
                          height: 90%;
                          max-height: 300px;
                          max-width: 300px;
                        "
                      />
                      <img
                        v-else
                        src="../../assets/without_photo.jpg"
                        class="rounded-circle"
                        alt="..."
                        style="
                          width: 90%;
                          height: 90%;
                          max-height: 300px;
                          max-width: 300px;
                        "
                      />

                      <div class="m-3">
                        <div v-if="selectedItem.avatar">
                          <div class="d-flex flex-column my-2">
                            <div class="mx-3">
                              <input
                                class="form-control"
                                ref="uploadedAvatar"
                                type="file"
                                accept="image/png, image/jpeg"
                                v-on:change="uploadAvatar"
                              />
                            </div>
                            <div class="d-flex align-items-end">
                              <button
                                type="button"
                                class="btn btn-link"
                                @click="deleteAvatar"
                              >
                                Удалить фото профиля
                              </button>
                            </div>
                          </div>
                        </div>

                        <div v-else>
                          <div class="mb-3">
                            <label for="formFile" class="form-label"
                              >Выберите изображение для загрузки</label
                            >
                            <input
                              id="formFile"
                              class="form-control"
                              ref="uploadedAvatar"
                              type="file"
                              accept="image/png, image/jpeg"
                              v-on:change="uploadAvatar"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-xl-8">
                    <div class="form-check mb-3">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="id_is_active"
                        v-model="selectedItem.is_active"
                      />
                      <label class="form-check-label" for="id_is_active">
                        Запись активна
                      </label>
                    </div>
                    <div class="mb-3">
                      <label for="id_username" class="form-label"
                        >Имя пользователя</label
                      >
                      <input
                        id="id_username"
                        type="text"
                        class="form-control"
                        v-model="selectedItem.username"
                        required
                      />
                      <div class="my-2">
                        <p
                          v-for="error of v$.selectedItem.username.$errors"
                          class="bg-danger-subtle p-2 rounded-2"
                          :key="error.$uid"
                        >
                          {{ error.$message }}
                        </p>
                      </div>
                    </div>
                    <div class="row mb-3">
                      <div class="col-6">
                        <label for="id_last_name" class="form-label"
                          >Фамилия</label
                        >
                        <input
                          id="id_last_name"
                          type="text"
                          class="form-control"
                          v-model="selectedItem.last_name"
                        />
                      </div>
                      <div class="col-6">
                        <label for="id_first_name" class="form-label"
                          >Имя</label
                        >
                        <input
                          id="id_first_name"
                          type="text"
                          class="form-control"
                          v-model="selectedItem.first_name"
                        />
                      </div>
                    </div>

                    <div class="row mb-3">
                      <div class="col-12">
                        <label for="id_workplace" class="form-label"
                          >Номер рабочего места при приеме документов</label
                        >
                        <input
                          id="id_workplace"
                          type="text"
                          class="form-control"
                          v-model="selectedItem.workplace"
                        />
                      </div>
                    </div>

                    <div class="form-check mb-3">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="id_is_staff"
                        v-model="selectedItem.is_staff"
                      />
                      <label class="form-check-label" for="id_is_staff">
                        Статус персонала
                      </label>
                    </div>
                    <div class="form-check mb-3">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="id_is_superuser"
                        v-model="selectedItem.is_superuser"
                      />
                      <label class="form-check-label" for="id_is_superuser">
                        Статус суперпользователя
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                ref="mainItemUpdateModalCloseButton"
              >
                Закрыть
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="updateMainItemInList"
                :disabled="this.v$.selectedItem.$invalid"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        class="modal fade"
        id="mainItemUpdatePasswordModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        ref="mainItemUpdatePasswordModal"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                Смена пароля
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div
              class="modal-body"
              style="max-height: calc(100vh - 270px); overflow-y: auto"
            >
              <div class="container-fluid">
                <div>
                  <div class="mb-3">
                    <label for="id_password_change" class="form-label"
                      >Введите новый пароль</label
                    >
                    <input
                      id="id_password_change"
                      type="password"
                      class="form-control"
                      v-model="passwordChangeForm.newPassword"
                      @blur="v$.passwordChangeForm.newPassword.$touch"
                    />
                    <div class="my-2">
                      <p
                        v-for="error of v$.passwordChangeForm.newPassword
                          .$errors"
                        class="bg-danger-subtle p-2 rounded-2"
                        :key="error.$uid"
                      >
                        {{ error.$message }}
                      </p>
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="id_repeat_password_change" class="form-label"
                      >Новый пароль (повтор)</label
                    >
                    <input
                      id="id_repeat_password_change"
                      type="password"
                      class="form-control"
                      v-model="passwordChangeForm.repeatedPassword"
                      @blur="v$.passwordChangeForm.repeatedPassword.$touch"
                    />
                    <div class="my-2">
                      <p
                        v-for="error of v$.passwordChangeForm.repeatedPassword
                          .$errors"
                        class="bg-danger-subtle p-2 rounded-2"
                        :key="error.$uid"
                      >
                        {{ error.$message }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                ref="mainItemUpdatePasswordModalCloseButton"
              >
                Закрыть
              </button>
              <button
                type="button"
                class="btn btn-primary"
                :disabled="this.v$.passwordChangeForm.$invalid"
                @click="changePassword"
              >
                Сменить пароль
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:add-button>
      <button
        class="btn btn-warning"
        :disabled="isLoading"
        @click="
          () => {
            showAddNewMainItemModal()
            this.v$.$reset()
          }
        "
      >
        Добавить запись
      </button>
    </template>
    <template v-slot:delete-selected-button> </template>
    <template v-slot:thead>
      <tr>
        <th></th>
        <th>Активный</th>
        <th>Имя пользователя</th>
        <th>Фамилия</th>
        <th>Имя</th>
        <th>Статус персонала</th>
        <th>Статус суперпользователя</th>
        <th>Дата создания записи</th>
        <th>Дата последнего редактирования записи</th>
        <th></th>
      </tr>
    </template>
    <template v-slot:tbody>
      <tr
        v-for="user in orderedMainList"
        :key="user.id"
        @dblclick.stop="showUpdateMainItemModalInList(user.id)"
      >
        <td class="text-center p-3">
          <img
            v-if="user.avatar"
            :src="user.avatar"
            class="rounded-circle"
            alt="..."
            style="height: 50px; width: 50px"
          />
          <img
            v-else
            src="../../assets/without_photo.jpg"
            class="rounded-circle"
            alt="..."
            style="height: 50px; width: 50px"
          />
        </td>
        <td v-if="user.is_active" class="text-center">
          <font-awesome-icon :icon="['fas', 'check']" />
        </td>
        <td v-else></td>
        <td>{{ user.username }}</td>

        <td>{{ user.last_name }}</td>
        <td>{{ user.first_name }}</td>
        <td v-if="user.is_staff" class="text-center">
          <font-awesome-icon :icon="['fas', 'check']" />
        </td>
        <td v-else></td>
        <td v-if="user.is_superuser" class="text-center">
          <font-awesome-icon :icon="['fas', 'check']" />
        </td>
        <td v-else></td>
        <td>
          {{
            new Date(user.date_joined).toLocaleString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
            })
          }}
        </td>
        <td>
          {{
            new Date(user.date_time_updated).toLocaleString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
            })
          }}
        </td>
        <td>
          <button
            class="btn btn-light"
            @click="showPasswordChangeModal(user.id)"
          >
            <font-awesome-icon :icon="['fas', 'key']" />
          </button>
        </td>
      </tr>
    </template>
    <template v-slot:search-form>
      <div class="row">
        <div class="col-12">
          <div class="mb-3">
            <label for="id_is_active_search" class="form-label"
              >Запись активна</label
            >
            <select
              id="id_is_active_search"
              class="form-select"
              v-model="searchForm.is_active"
            >
              <option value="">-----</option>
              <option value="true" key="1">Да</option>
              <option value="false" key="0">Нет</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="id_username__icontains" class="form-label"
              >Имя пользователя</label
            >
            <input
              type="text"
              class="form-control"
              id="id_username__icontains"
              v-model="searchForm.username__icontains"
            />
          </div>
          <div class="mb-3">
            <label for="id_last_name__icontains" class="form-label"
              >Фамилия</label
            >
            <input
              type="text"
              class="form-control"
              id="id_last_name__icontains"
              v-model="searchForm.last_name__icontains"
            />
          </div>
          <div class="mb-3">
            <label for="id_is_staff_search" class="form-label"
              >Статус персонала</label
            >
            <select
              id="id_is_staff_search"
              class="form-select"
              v-model="searchForm.is_staff"
            >
              <option value="">-----</option>
              <option value="true" key="1">Да</option>
              <option value="false" key="0">Нет</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="id_is_superuser_search" class="form-label"
              >Статус суперпользователя</label
            >
            <select
              id="id_is_superuser_search"
              class="form-select"
              v-model="searchForm.is_superuser"
            >
              <option value="">-----</option>
              <option value="true" key="1">Да</option>
              <option value="false" key="0">Нет</option>
            </select>
          </div>
        </div>
      </div>
      <button type="button" class="btn btn-primary" @click="clearFilter">
        Сбросить фильтр
      </button>
    </template>
  </base-list-layout>
</template>

<script>
import getUsersAPIInstance from "@/api/auth/usersAPI.js"
import { mapGetters } from "vuex"
import BaseListLayout from "@/components/layouts/BaseListLayout.vue"
import { showAddNewMainItemModal, clearFormData } from "../../../utils.js"
import { debounce } from "lodash/function"
import useVuelidate from "@vuelidate/core"
import { required, helpers, sameAs } from "@vuelidate/validators"

export default {
  name: "UserListView",
  components: {
    BaseListLayout,
  },
  data() {
    return {
      mainItemAPIInstance: getUsersAPIInstance(),
      mainItemList: { count: 0, results: [], previous: null, next: null },
      isLoading: true,
      BACKEND_PROTOCOL: import.meta.env.VITE_APP_BACKEND_PROTOCOL,
      BACKEND_HOST: import.meta.env.VITE_APP_BACKEND_HOST,
      BACKEND_PORT: import.meta.env.VITE_APP_BACKEND_PORT,
      itemForm: Object.assign({}, getUsersAPIInstance().formData),
      searchForm: Object.assign({}, getUsersAPIInstance().searchObj),
      selectedItem: {
        is_active: false,
        username: "",
        last_name: "",
        first_name: "",
        workplace: "",
        is_staff: false,
        is_superuser: false,
      },
      passwordChangeForm: {
        id: undefined,
        newPassword: "",
        repeatedPassword: "",
      },
      deleteItemId: "",
    }
  },
  setup() {
    return { v$: useVuelidate() }
  },
  validations() {
    const loginRegex = helpers.regex(/^[a-zA-Z\d]*$/)
    const passwordRegex = helpers.regex(
      /(?=.*[0-9])(?=.*[!@#$%^&*_])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*_]{8,}/,
    )
    const same = sameAs(this.itemForm.password)
    const sameUpdatePassword = sameAs(this.passwordChangeForm.newPassword)
    // проверка на уникальность имени пользователя при создании записи
    const isUserNameTaken = helpers.withAsync(async (value) => {
      if (value === "") return true
      const response = await this.mainItemAPIInstance.getUserNames(value)
      return response.data.results.length <= 0
    })
    // проверка на уникальность имени пользователя при редактировании записи
    const isUserNameTakenWhileUpdate = helpers.withAsync(async (value) => {
      if (value === "") return true
      const response = await this.mainItemAPIInstance.getUserNames(value)
      // убираем редактируемую запись из проверки
      const filteredList = response.data.results.filter(
        (item) => item.id !== this.selectedItem.id,
      )
      return filteredList.length <= 0
    })
    return {
      itemForm: {
        username: {
          required: helpers.withMessage("Поле не может быть пустым", required),
          loginRegex: helpers.withMessage(
            "Допускаются только латинские буквы или цифры",
            loginRegex,
          ),
          isUnique: helpers.withMessage(
            "Пользователь с таким именем уже присутствует в системе",
            isUserNameTaken,
          ),
          $autoDirty: true,
          $invalid: true,
        },
        password: {
          required: helpers.withMessage("Поле не может быть пустым", required),
          passwordRegex: helpers.withMessage(
            "Пароль не удовлетворяет минимальным требованиям безопасности (пароль должен состоять из не менее 8 символов в которых должны присутствовать строчные, прописные буквы, цифры, спецсимволы)",
            passwordRegex,
          ),
          $autoDirty: true,
          $invalid: true,
        },
        repeat_password: {
          required: helpers.withMessage("Поле не может быть пустым", required),
          same: helpers.withMessage("Введенные пароли не совпадают", same),
          $autoDirty: true,
          $invalid: true,
        },
      },
      selectedItem: {
        username: {
          required: helpers.withMessage("Поле не может быть пустым", required),
          loginRegex: helpers.withMessage(
            "Допускаются только латинские буквы или цифры",
            loginRegex,
          ),
          isUnique: helpers.withMessage(
            "Пользователь с таким именем уже присутствует в системе",
            isUserNameTakenWhileUpdate,
          ),
          $autoDirty: true,
        },
      },
      passwordChangeForm: {
        newPassword: {
          required: helpers.withMessage("Поле не может быть пустым", required),
          passwordRegex: helpers.withMessage(
            "Пароль не удовлетворяет минимальным требованиям безопасности (пароль должен состоять из не менее 8 символов в которых должны присутствовать строчные, прописные буквы, цифры, спецсимволы)",
            passwordRegex,
          ),
          $autoDirty: true,
          $invalid: true,
        },
        repeatedPassword: {
          required: helpers.withMessage("Поле не может быть пустым", required),
          sameUpdatePassword: helpers.withMessage(
            "Введенные пароли не совпадают",
            sameUpdatePassword,
          ),
          $autoDirty: true,
          $invalid: true,
        },
      },
    }
  },
  async created() {
    await this.loadData()
  },

  methods: {
    async loadData() {
      this.isLoading = true
      try {
        const response = await this.mainItemAPIInstance.getItemsList()
        this.mainItemList = await response.data
      } catch (error) {
      } finally {
        this.isLoading = false
      }
    },
    showAddNewMainItemModal,
    clearFormData,
    showPasswordChangeModal(userId) {
      this.passwordChangeForm = {
        id: undefined,
        newPassword: "",
        repeatedPassword: "",
      }
      this.v$.$reset()
      this.passwordChangeForm.id = userId
      let addModal = this.$refs.mainItemUpdatePasswordModal
      let myModal = new bootstrap.Modal(addModal, {
        keyboard: false,
      })
      myModal.show()
    },
    debouncedSearch: debounce(async function () {
      this.isLoading = true
      this.mainItemAPIInstance.searchObj = this.searchForm
      try {
        const userResponse = await this.mainItemAPIInstance.getItemsList()
        this.mainItemList = userResponse.data
      } catch (e) {
      } finally {
        this.isLoading = false
      }
    }, 500),
    async addNewItem() {
      if (!this.v$.itemForm.$invalid) {
        try {
          const response = await this.mainItemAPIInstance.addItem(this.itemForm)
          this.mainItemList.results.unshift(response.data)
          this.mainItemList.count = this.mainItemList.results.length
        } catch (error) {
        } finally {
          this.$refs.mainItemAddModalCloseButton.click()
        }
      }
    },
    async showUpdateMainItemModalInList(id) {
      try {
        const response = await this.mainItemAPIInstance.getItemData(id)
        this.selectedItem = await response.data
        let updateModal = this.$refs.mainItemUpdateModal
        let myModal = new bootstrap.Modal(updateModal, {
          keyboard: false,
        })
        myModal.show()
      } catch (error) {}
    },
    async updateMainItemInList() {
      try {
        const { avatar, ...rest } = this.selectedItem

        const response = await this.mainItemAPIInstance.updateItemPartly(rest)
        const updatedUser = response.data

        if (updatedUser.id === this.currentAuthUser.id) {
          this.$store.commit("auth/setUserData", {
            ...this.currentAuthUser,
            ...updatedUser,
          })
        }

        let index = this.mainItemList.results.findIndex(
          (item) => item.id === updatedUser.id,
        )
        if (index > -1) {
          this.mainItemList.results[index] = updatedUser
        }
      } catch (error) {
      } finally {
        this.$refs.mainItemUpdateModalCloseButton.click()
      }
    },

    async uploadAvatar() {
      try {
        let formData = new FormData()
        formData.append("avatar", this.$refs.uploadedAvatar.files[0])

        const response = await this.mainItemAPIInstance.updatePhotoOrAnyFile(
          this.selectedItem.id,
          formData,
        )

        this.selectedItem = {
          ...this.selectedItem,
          avatar: response.data.avatar,
        }

        this.mainItemList.results.map((item) => {
          if (item.id === response.data.id) {
            item.avatar = response.data.avatar
          }
        })
      } catch (error) {
      } finally {
      }
    },

    async deleteAvatar() {
      try {
        const response = await this.mainItemAPIInstance.updatePhotoOrAnyFile(
          this.selectedItem.id,
          { avatar: null },
        )
        this.selectedItem = {
          ...this.selectedItem,
          avatar: response.data.avatar,
        }

        this.mainItemList.results.map((item) => {
          if (item.id === response.data.id) {
            item.avatar = response.data.avatar
          }
        })
      } catch (error) {
      } finally {
      }
    },
    clearFilter() {
      this.searchForm = Object.assign(
        {},
        this.mainItemAPIInstance.searchObjDefault,
      )
    },
    async loadMoreData() {
      const listElem = document.getElementById("infinite_list")
      if (
        listElem.scrollTop + listElem.clientHeight >=
        listElem.scrollHeight - 1
      ) {
        if (this.mainItemList.next) {
          try {
            const response = await this.mainItemAPIInstance.updateList(
              this.mainItemList.next,
            )

            const newData = await response.data
            this.mainItemList.results = [
              ...this.mainItemList.results,
              ...newData.results,
            ]
            this.mainItemList.next = newData.next
            this.mainItemList.previous = newData.previous
          } catch (error) {
            this.isError = true
          } finally {
          }
        }
      }
    },
    async changePassword() {
      try {
        await this.mainItemAPIInstance.updatePassword(
          this.passwordChangeForm.id,
          { password: this.passwordChangeForm.newPassword },
        )
      } catch (error) {
      } finally {
        this.$refs.mainItemUpdatePasswordModalCloseButton.click()
      }
    },
  },
  computed: {
    orderedMainList() {
      return this.mainItemList.results
    },
    ...mapGetters({
      currentAuthUser: "auth/getUser",
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
