import { createRouter, createWebHistory } from "vue-router"
import { CadetMainView, CadetListView, CadetItemView } from "@/components/cadet"

import {
  EntranceMainView,
  EntranceCadetMainView,
  EntranceCadetListView,
  EntranceCadetInputForm,
  EntranceCadetTableView,
  EntranceNavigationView,
  EntranceFPKPRKMainView,
  EntranceFPKPRKListView,
  EntranceFPKPRKInputForm,
  EntranceStudentMainView,
  EntranceStudentListView,
  EntranceStudentInputForm,
  EntranceStudentTableView,
  EntranceFPKPRKTableView,
} from "@/components/entrance_campaign"
import { CadetUpdateView, CadetListOkView } from "@/components/cadet"
import {
  FPKMainView,
  FPKListView,
  FPKUpdateView,
  FPKPRKTableView,
} from "@/components/fpk/index.js"
import store from "@/store"

import {
  EmployeeMainView,
  EmployeeList,
  EmployeeItemView,
  EmployeeUpdateView,
} from "@/components/employee"

import {
  StudentMainView,
  StudentList,
  StudentItemView,
  StudentUpdateView,
  StudentDocsMakeView,
} from "@/components/student"

import {
  ElectronicQueueMain,
  ElectronicQueueListAdmin,
  QueueProcessingView,
  QueueListUser,
} from "@/components/electronic_queue"

import LoginView from "@/components/auth/LoginView.vue"
import NavigationPage from "@/components/NavigationPage.vue"
import BaseViewForStore from "@/components/BaseViewForStore.vue"
import UserListView from "@/components/auth/UserListView.vue"
import UserMainView from "@/components/auth/UserMainView.vue"
import UserActionsView from "@/components/auth/UserActionsView.vue"

import {
  NotFoundView,
  NetworkErrorView,
  ServerErrorView,
} from "@/components/errors"

import {
  PassOfficeNavigation,
  PassOfficeView,
  PassOfficeCadetListView,
  PassOfficeStudentListView,
  PassOfficeEmployeeListView,
  PassOfficeFPKPRKListView,
  PassOfficeFPKPRKItemView,
  PassOfficeCadetItemView,
  PassOfficeStudentItemView,
} from "@/components/passOffice/index.js"

import { OOITView } from "@/components/entrance_campaign"

const routes = [
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFoundView },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { requiresAuth: false },
  },

  {
    path: "",
    name: "base",
    redirect: { path: "navigation" },
    component: BaseViewForStore,
    meta: { requiresAuth: true },
    children: [
      {
        path: "navigation",
        name: "navigation",
        component: NavigationPage,
      },
      {
        path: "pass-office",
        name: "pass-office-main",
        component: PassOfficeView,
        meta: { requiresAuth: true },
        children: [
          {
            path: "",
            component: PassOfficeNavigation,
            name: "pass-office-navigation",
          },
          {
            path: "cadets",
            component: PassOfficeCadetListView,
            name: "pass-office-cadet",
          },
          {
            path: "cadets/:id/update",
            component: PassOfficeCadetItemView,
            name: "pass-office-cadet-update",
          },
          {
            path: "employees",
            component: PassOfficeEmployeeListView,
            name: "pass-office-employees",
          },
          {
            path: "students",
            component: PassOfficeStudentListView,
            name: "pass-office-students",
          },
          {
            path: "students/:id/update",
            component: PassOfficeStudentItemView,
            name: "pass-office-student-update",
          },
          {
            path: "students/card-blanks",
            component: () =>
              import(
                "@/components/passOffice/student/StudentCardBlanksView.vue"
              ),
            name: "pass-office-student-card-blanks",
          },
          {
            path: "fpk-prk",
            component: PassOfficeFPKPRKListView,
            name: "pass-office-fpk-prk",
          },
          {
            path: "fpk-prk/:id/update",
            component: PassOfficeFPKPRKItemView,
            name: "pass-office-fpk-prk-update",
          },
        ],
      },

      {
        path: "cadet",
        name: "cadet-main",
        component: CadetMainView,
        meta: { requiresAuth: true },
        children: [
          {
            path: "",
            component: CadetListView,
            name: "cadet",
          },
          {
            path: "full",
            component: CadetListOkView,
            name: "cadet-full",
          },
          {
            path: ":id",
            component: CadetItemView,
            name: "cadet-view",
          },
          {
            path: ":id/update",
            component: CadetUpdateView,
            name: "cadet-update",
          },
          {
            path: "encouragement",
            component: () =>
              import(
                "@/components/cadet/encouragement/EncouragementListView.vue"
              ),
            name: "cadet-encouragement",
          },
          {
            path: "punishment",
            component: () =>
              import("@/components/cadet/punishment/PunishmentListView.vue"),
            name: "cadet-punishment",
          },
          {
            path: "positions",
            component: () =>
              import("@/components/cadet/position/PositionListView.vue"),

            name: "cadet-positions",
          },
          {
            path: "rank-histories",
            component: () =>
              import("@/components/cadet/rank/RankHistoryListView.vue"),
            name: "cadet-rank-histories",
          },
          {
            path: "specialities",
            component: () =>
              import("@/components/cadet/speciality/SpecialityHistoryView.vue"),
            name: "cadet-specialities",
          },
          {
            path: "fired",
            component: () =>
              import("@/components/cadet/fired/FiredCadetComponent.vue"),
            name: "cadet-fired",
          },
        ],
      },
      {
        path: "employee",
        name: "employee-main",
        component: EmployeeMainView,
        children: [
          {
            path: "",
            component: EmployeeList,
            name: "employee",
          },
          {
            path: ":id",
            component: EmployeeItemView,
            name: "employee-view",
          },
          {
            path: ":id/update",
            component: EmployeeUpdateView,
            name: "employee-update",
          },
          {
            path: "employee-encouragement",
            component: () =>
              import(
                "@/components/cadet/encouragement/EncouragementListView.vue"
              ),
            name: "encouragement",
          },
          {
            path: "employee-punishment",
            component: () =>
              import("@/components/cadet/punishment/PunishmentListView.vue"),
            name: "punishment",
          },
          {
            path: "employee-positions",
            component: () =>
              import("@/components/cadet/position/PositionListView.vue"),
            name: "positions",
          },
          {
            path: "employee-rank-histories",
            component: () =>
              import("@/components/cadet/rank/RankHistoryListView.vue"),
            name: "rank-histories",
          },
          // {
          //   path: "fired",
          //   component: () =>
          //     import("@/components/cadet/fired/FiredCadetComponent.vue"),
          //   name: "fired",
          // },
        ],
      },
      {
        path: "student",
        name: "student-main",
        component: StudentMainView,
        children: [
          {
            path: "",
            component: StudentList,
            name: "student",
          },
          {
            path: "table-view",
            component: () =>
              import("@/components/student/StudentTableView.vue"),
            name: "student-table-view",
          },
          {
            path: "reports",
            component: StudentDocsMakeView,
            name: "student-reports",
          },
          {
            path: ":id",
            component: StudentItemView,
            name: "student-view",
          },
          {
            path: ":id/update",
            component: StudentUpdateView,
            name: "student-update",
          },
        ],
      },
      {
        path: "dictionaries",
        name: "dictionaries-main",
        component: () =>
          import("@/components/dictionaries/DictionaryMainView.vue"),
        children: [
          {
            path: "groups",
            component: () =>
              import("@/components/dictionaries/group/GroupListView.vue"),
            name: "dictionaries-groups",
          },
          {
            path: "ranks",
            component: () =>
              import("@/components/dictionaries/rank/RankListView.vue"),
            name: "dictionaries-ranks",
          },
          {
            path: "rank-groups",
            component: () =>
              import(
                "@/components/dictionaries/rank_groups/RankGroupsListView.vue"
              ),
            name: "dictionaries-rank-groups",
          },
          {
            path: "encouragements",
            component: () =>
              import(
                "@/components/dictionaries/encouragement/EncouragementKindListView.vue"
              ),
            name: "dictionaries-encouragements",
          },
          {
            path: "punishments",
            component: () =>
              import(
                "@/components/dictionaries/punishment/PunishmentKindListView.vue"
              ),
            name: "dictionaries-punishments",
          },
          {
            path: "subdivisions",
            component: () =>
              import(
                "@/components/dictionaries/subdivision/SubdivisionListView.vue"
              ),
            name: "dictionaries-subdivisions",
          },
          {
            path: "positions",
            component: () =>
              import(
                "@/components/dictionaries/position/PositionNameListView.vue"
              ),
            name: "dictionaries-positions",
          },
          {
            path: "order-owners",
            component: () =>
              import(
                "@/components/dictionaries/orderOwner/OrderOwnerListView.vue"
              ),
            name: "order-owners",
          },
          {
            path: "militaryoffices",
            component: () =>
              import(
                "@/components/dictionaries/militaryoffice/MilitaryOfficeListView.vue"
              ),
            name: "dictionaries-militaryoffices",
          },
          {
            path: "go-rovd",
            component: () =>
              import("@/components/dictionaries/go-rovd/GOROVDListView.vue"),
            name: "dictionaries-go-rovd",
          },
          {
            path: "component-organs",
            component: () =>
              import(
                "@/components/dictionaries/componentorgan/ComponentOrganListView.vue"
              ),
            name: "dictionaries-component-organ",
          },
          {
            path: "rewards",
            component: () =>
              import("@/components/dictionaries/reward/RewardListView.vue"),
            name: "dictionaries-rewards",
          },
          {
            path: "specialities",
            component: () =>
              import(
                "@/components/dictionaries/speciality/SpecialityListView.vue"
              ),
            name: "dictionaries-speciality",
          },
          {
            path: "specializations",
            component: () =>
              import(
                "@/components/dictionaries/specialization/SpecializationListView.vue"
              ),
            name: "dictionaries-specializations",
          },
          {
            path: "person-categories",
            component: () =>
              import(
                "@/components/dictionaries/personCategories/PersonCategoriesListView.vue"
              ),
            name: "dictionaries-person-categories",
          },
          {
            path: "ord-directions",
            component: () =>
              import(
                "@/components/dictionaries/directionsORD/DirectionsORDListView.vue"
              ),
            name: "dictionaries-ord-directions",
          },
          {
            path: "marital-statuses",
            component: () =>
              import(
                "@/components/dictionaries/maritalStatus/MaritalStatusesListView.vue"
              ),
            name: "dictionaries-marital-statuses",
          },
          {
            path: "passport-authorities",
            component: () =>
              import(
                "@/components/dictionaries/passportAuthority/PassportAuthoritiesListView.vue"
              ),
            name: "dictionaries-passport-authorities",
          },
          {
            path: "passport-foreign-languages",
            component: () =>
              import(
                "@/components/dictionaries/foreignLanguages/ForeignLanguagesListView.vue"
              ),
            name: "dictionaries-foreign-languages",
          },
          {
            path: "graduation-reasons",
            component: () =>
              import(
                "@/components/dictionaries/graduationReasons/GraduationReasonsListView.vue"
              ),
            name: "dictionaries-graduation-reasons",
          },
          {
            path: "education-forms",
            component: () =>
              import(
                "@/components/dictionaries/educationForms/EducationFormsListView.vue"
              ),
            name: "dictionaries-education-forms",
          },
          {
            path: "passport-foreign-language-levels",
            component: () =>
              import(
                "@/components/dictionaries/foreignLanguageLevels/ForeignLanguageLevelsListView.vue"
              ),
            name: "dictionaries-foreign-language-levels",
          },
          {
            path: "entrance-categories",
            component: () =>
              import(
                "@/components/dictionaries/entranceCategory/EntranceCategoryListView.vue"
              ),
            name: "dictionaries-entrance-categories",
          },
          {
            path: "social-statuses",
            component: () =>
              import(
                "@/components/dictionaries/socialStatus/SocialStatusListView.vue"
              ),
            name: "dictionaries-social-statuses",
          },
          {
            path: "education-kinds",
            component: () =>
              import(
                "@/components/dictionaries/educationKind/EducationKindListView.vue"
              ),
            name: "dictionaries-education-kinds",
          },
          {
            path: "education-levels",
            component: () =>
              import(
                "@/components/dictionaries/educationLevel/EducationLevelListView.vue"
              ),
            name: "dictionaries-education-levels",
          },
          {
            path: "education-location-kinds",
            component: () =>
              import(
                "@/components/dictionaries/educationLocationKind/EducationLocationKindList.vue"
              ),
            name: "dictionaries-education-location-kinds",
          },
          {
            path: "vpk-categories",
            component: () =>
              import(
                "@/components/dictionaries/VPKCategory/VPKCategoryListView.vue"
              ),
            name: "dictionaries-vpk-categories",
          },
          {
            path: "pfl-categories",
            component: () =>
              import(
                "@/components/dictionaries/PFLCategory/PFLCategoryListView.vue"
              ),
            name: "dictionaries-pfl-categories",
          },
          {
            path: "privileges",
            component: () =>
              import(
                "@/components/dictionaries/privilege/PrivilegeListView.vue"
              ),
            name: "dictionaries-privileges",
          },
          {
            path: "document-types",
            component: () =>
              import(
                "@/components/dictionaries/documentType/DocumentTypeListView.vue"
              ),
            name: "dictionaries-document-types",
          },
          {
            path: "in-whose-interests",
            component: () =>
              import(
                "@/components/dictionaries/inWhoseInterests/InWhoseInterestsListView.vue"
              ),
            name: "dictionaries-in-whose-interests",
          },
        ],
      },
      {
        path: "/entrance",
        component: EntranceMainView,
        meta: { requiresAuth: true, title: "Вступительная кампания" },
        name: "entrance-main",
        children: [
          {
            path: "",
            component: EntranceNavigationView,
            name: "entrance-navigation",
          },
          {
            path: "cadet",
            component: EntranceCadetMainView,
            name: "entrance-cadet-main",
            children: [
              {
                path: "",
                component: EntranceCadetListView,
                name: "entrance-cadet-list",
              },
              {
                path: ":id/update",
                component: EntranceCadetInputForm,
                name: "entrance-cadet-input-form",
              },
              {
                path: "table-view",
                component: EntranceCadetTableView,
                name: "entrance-cadet-table-view",
              },
              {
                path: "ooit",
                component: OOITView,
                name: "entrance-cadet-ooit",
              },
            ],
          },
          {
            path: "fpk-prk-mag",
            component: EntranceFPKPRKMainView,
            name: "entrance-fpk-prk-mag-main",
            children: [
              {
                path: "",
                component: EntranceFPKPRKListView,
                name: "entrance-fpk-prk-mag-list",
              },
              {
                path: ":id/update",
                component: EntranceFPKPRKInputForm,
                name: "entrance-fpk-prk-mag-input-form",
              },
              {
                path: "table-view",
                component: EntranceFPKPRKTableView,
                name: "entrance-fpk-prk-table-view",
              },
            ],
          },
          {
            path: "student",
            component: EntranceStudentMainView,
            name: "entrance-student-main",
            children: [
              {
                path: "",
                component: EntranceStudentListView,
                name: "entrance-student-list",
              },
              {
                path: ":id/update",
                component: EntranceStudentInputForm,
                name: "entrance-student-input-form",
              },
              {
                path: "table-view",
                component: EntranceStudentTableView,
                name: "entrance-student-table-view",
              },
            ],
          },
        ],
      },
      {
        path: "/users",
        component: UserMainView,
        meta: { requiresAuth: true },
        name: "users-main",
        children: [
          {
            path: "",
            component: UserListView,
            name: "users-list",
          },
          {
            path: "actions",
            component: UserActionsView,
            name: "users-actions",
          },
        ],
      },
      {
        path: "electronic-queue",
        component: ElectronicQueueMain,
        meta: { requiresAuth: true, title: "Электронная очередь" },
        name: "electronic-queue-main",
        children: [
          {
            path: "",
            component: QueueListUser,
            name: "queue-list",
            children: [
              {
                path: ":id/processing",
                component: QueueProcessingView,
                name: "queue-list-processing",
              },
            ],
          },
          {
            path: "admin",
            component: ElectronicQueueListAdmin,
            name: "queue-list-admin",
          },
        ],
      },
      {
        path: "/fpk-mag",
        component: FPKMainView,
        meta: { requiresAuth: true },
        name: "fpk-mag-main",
        children: [
          {
            path: "",
            component: FPKListView,
            name: "fpk-mag-list",
          },
          {
            path: ":id/update",
            component: FPKUpdateView,
            name: "fpk-mag-update",
          },
          {
            path: "table-view",
            component: FPKPRKTableView,
            name: "fpk-prk-table-view",
          },
        ],
      },
    ],
  },
  {
    path: "/network-error",
    component: NetworkErrorView,
    name: "network-error",
  },
  {
    path: "/server-error",
    component: ServerErrorView,
    name: "server-error",
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from) => {
  await store.dispatch("auth/actionCheckLoggedIn")
  const isLoggedIn = store.getters["auth/getIsLoggedIn"]
  document.title = to.meta?.title || "КИС"
  if (to.meta.requiresAuth && !isLoggedIn) {
    return {
      path: "/login",
      query: { redirect: to.fullPath },
    }
  }
})

export default router
