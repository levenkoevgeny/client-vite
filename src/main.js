import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import vSelect from "vue-select"

import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { faUserGraduate } from "@fortawesome/free-solid-svg-icons"
import { faPersonBreastfeeding } from "@fortawesome/free-solid-svg-icons"
import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons"
import { faCreditCardAlt } from "@fortawesome/free-solid-svg-icons"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { faTable } from "@fortawesome/free-solid-svg-icons"
import { faLanguage } from "@fortawesome/free-solid-svg-icons"
import { faFlask } from "@fortawesome/free-solid-svg-icons"
import { faSchool } from "@fortawesome/free-solid-svg-icons"
import { faBriefcase } from "@fortawesome/free-solid-svg-icons"
import { faPersonMilitaryRifle } from "@fortawesome/free-solid-svg-icons"
import { faMedal } from "@fortawesome/free-solid-svg-icons"
import { faStairs } from "@fortawesome/free-solid-svg-icons"
import { faPeopleRoof } from "@fortawesome/free-solid-svg-icons"
import { faDiamondTurnRight } from "@fortawesome/free-solid-svg-icons"
import { faPencil } from "@fortawesome/free-solid-svg-icons"
import { faStar } from "@fortawesome/free-regular-svg-icons"
import { faFileWord } from "@fortawesome/free-regular-svg-icons"
import { faFileExcel } from "@fortawesome/free-regular-svg-icons"
import { faFileExport } from "@fortawesome/free-solid-svg-icons"
import { faListCheck } from "@fortawesome/free-solid-svg-icons"
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons"
import { faCaretUp } from "@fortawesome/free-solid-svg-icons"
import { faCaretDown } from "@fortawesome/free-solid-svg-icons"
import { faCakeCandles } from "@fortawesome/free-solid-svg-icons"
import { faLock } from "@fortawesome/free-solid-svg-icons"
import { faLockOpen } from "@fortawesome/free-solid-svg-icons"
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { faFilter } from "@fortawesome/free-solid-svg-icons"
import { faPrint } from "@fortawesome/free-solid-svg-icons"
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import { faKey } from "@fortawesome/free-solid-svg-icons"
import { faDatabase } from "@fortawesome/free-solid-svg-icons"
import { faCalculator } from "@fortawesome/free-solid-svg-icons"
import { faCamera } from "@fortawesome/free-solid-svg-icons"
import { faImage } from "@fortawesome/free-solid-svg-icons"
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons"
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"
import { faBook } from "@fortawesome/free-solid-svg-icons"
import { faFile } from "@fortawesome/free-solid-svg-icons"
import { faSliders } from "@fortawesome/free-solid-svg-icons"
import { faArrowUp } from "@fortawesome/free-solid-svg-icons"
import { faArrowDown } from "@fortawesome/free-solid-svg-icons"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { faSearchPlus } from "@fortawesome/free-solid-svg-icons"
import { faSearchMinus } from "@fortawesome/free-solid-svg-icons"
import { faSun } from "@fortawesome/free-solid-svg-icons"
import { faArrowsAlt } from "@fortawesome/free-solid-svg-icons"
import { faRedo } from "@fortawesome/free-solid-svg-icons"
import { faAdjust } from "@fortawesome/free-solid-svg-icons"
import { faArrowsAltH } from "@fortawesome/free-solid-svg-icons"
import { faArrowsAltV } from "@fortawesome/free-solid-svg-icons"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { faAddressCard } from "@fortawesome/free-solid-svg-icons"
import { faTicket } from "@fortawesome/free-solid-svg-icons"
import { faUser } from "@fortawesome/free-solid-svg-icons"
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons"
import { faDoorOpen } from "@fortawesome/free-solid-svg-icons"
import { faBookmark } from "@fortawesome/free-solid-svg-icons"
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons"
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons"
import { faChevronRight } from "@fortawesome/free-solid-svg-icons"
import axios from "axios"
import "../public/vue-select.css"
import "../public/favorite-icon.css"
import PrimeVue from "primevue/config"
import { MyPreset } from "@/preset/primevue-preset.js"

export const axiosInstance = axios.create()

library.add(faSliders)
library.add(faArrowUp)
library.add(faArrowDown)
library.add(faArrowLeft)
library.add(faArrowRight)
library.add(faSearchPlus)
library.add(faSearchMinus)
library.add(faSun)
library.add(faArrowsAlt)
library.add(faRedo)
library.add(faAdjust)
library.add(faArrowsAltH)
library.add(faArrowsAltV)
library.add(faSearch)

library.add(faUserGraduate)
library.add(faPersonBreastfeeding)
library.add(faHandHoldingDollar)
library.add(faCreditCardAlt)
library.add(faStar)
library.add(faPlus)
library.add(faTrash)
library.add(faTable)
library.add(faLanguage)
library.add(faFlask)
library.add(faSchool)
library.add(faBriefcase)
library.add(faPersonMilitaryRifle)
library.add(faMedal)
library.add(faStairs)
library.add(faPeopleRoof)
library.add(faDiamondTurnRight)
library.add(faPencil)
library.add(faFileWord)
library.add(faFileExcel)
library.add(faFileExport)
library.add(faListCheck)
library.add(faCircleXmark)
library.add(faCaretUp)
library.add(faCaretDown)
library.add(faCakeCandles)
library.add(faLock)
library.add(faCheck)
library.add(faLockOpen)
library.add(faFilter)
library.add(faArrowRightFromBracket)
library.add(faPrint)
library.add(faKey)
library.add(faDatabase)
library.add(faCalculator)
library.add(faCamera)
library.add(faImage)
library.add(faFloppyDisk)
library.add(faEnvelope)
library.add(faBook)
library.add(faFile)
library.add(faAddressCard)
library.add(faTicket)
library.add(faUser)
library.add(faCalendarDays)
library.add(faDoorOpen)
library.add(faBookmark)
library.add(faExclamationCircle)
library.add(faChevronLeft)
library.add(faChevronRight)

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = `Bearer ${store.getters["auth/getToken"]}`
    return config
  },
  function (response) {
    return response
  },
  async function (error) {
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  function (response) {
    return response
  },
  async function (error) {
    console.log("axios interceptor", error)
    if (error.code === "ERR_NETWORK") {
      window.location.href = "/network-error"
      return Promise.reject(error)
    }
    switch (error.response.status) {
      case 401:
        if (error.response.data.code) {
          store.commit("errors/setErrorList", {
            errorCode: "token_not_valid",
            errorStatus: error.status,
            errorMessage: "Ошибка авторизации",
          })
        } else {
          store.commit("errors/setErrorList", {
            errorStatus: error.status,
            errorMessage: "Ошибка авторизации",
          })
        }
        await store.dispatch("auth/actionRemoveLogIn")
        await router.replace({ name: "login" })
        break
      case 403:
        store.commit("errors/setErrorList", {
          errorStatus: error.status,
          errorMessage: "У Вас нет прав для просмотра этого ресурса",
        })
        // await store.dispatch("auth/actionRemoveLogIn")
        await router.replace({ name: "login" })
        break
      case 404:
        store.commit("errors/setErrorList", {
          errorStatus: error.status,
          errorMessage: "URL Not found",
        })
        return Promise.reject(error)
      case 500:
        await router.replace({ name: "server-error" })
        break
      default:
        store.commit("errors/setErrorList", {
          errorStatus: error.status,
          errorMessage: error.response.data,
        })
        console.log("axios interceptor", error)
        return Promise.reject(error)
    }
  },
)

const app = createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .component("v-select", vSelect)
  .use(router)
  .use(store)
  .use(PrimeVue, {
    theme: {
      preset: MyPreset,
      options: {
        darkModeSelector: ".prime-dark",
      },
    },
    locale: {
      clear: "Очистить",
      apply: "Применить",
      addRule: "Добавить правило",
      removeRule: "Удалить правило",
      emptySearchMessage: "Совпадений не найдено",
    },
  })

app.config.globalProperties.$axios = axiosInstance

app.mount("#app")

export default app
