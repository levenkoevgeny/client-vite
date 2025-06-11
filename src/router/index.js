import { createRouter, createWebHistory } from "vue-router"
import { CadetMainView, CadetListView, CadetItemView } from "@/components/cadet"
import { PunishmentListView } from "@/components/cadet/punishment"
import { EncouragementListView } from "@/components/cadet/encouragement"
import { PositionListView } from "@/components/cadet/position"
import { RankHistoryListView } from "@/components/cadet/rank"
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
} from "@/components/entrance_campaign"
import { SpecialityHistoryView } from "@/components/cadet/speciality"
import { CadetUpdateView, CadetListOkView } from "@/components/cadet"
import { FiredCadetComponent } from "@/components/cadet/fired"
import {
    FPKMainView,
    FPKListView,
    FPKUpdateView,
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

import {
    DictionaryMainView,
    GroupListView,
    RankListView,
    RankGroupsListView,
    EncouragementKindListView,
    PunishmentKindListView,
    SubdivisionListView,
    PositionNameListView,
    MilitaryOfficeListView,
    GOROVDListView,
    ComponentOrganListView,
    RewardListView,
    SpecialityListView,
    SpecializationListView,
    OrderOwnerListView,
    PersonCategoriesListView,
    DirectionsORDListView,
    MaritalStatusesListView,
    PassportAuthoritiesListView,
    ForeignLanguagesListView,
    GraduationReasonsListView,
    EducationFormsListView,
    ForeignLanguageLevelsListView,
    EntranceCategoryListView,
    SocialStatusListView,
    EducationKindListView,
    EducationLevelListView,
    EducationLocationKindList,
    VPKCategoryListView,
    PFLCategoryListView,
    PrivilegeListView,
    DocumentTypeListView,
    InWhoseInterestsListView,
} from "@/components/dictionaries"

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
    PassOfficeView,
    PassOfficeCadetListView,
    PassOfficeStudentListView,
    PassOfficeEmployeeListView,
    PassOfficeFPKPRKListView,
    PassOfficeCadetItemView,
} from "@/components/passOffice/index.js"
import EntranceFPKPRKTableView from "@/components/entrance_campaign/fpk_prk/EntranceFPKPRKTableView.vue"

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
                        path: "fpk-prk",
                        component: PassOfficeFPKPRKListView,
                        name: "pass-office-fpk-prk",
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
                        component: EncouragementListView,
                        name: "cadet-encouragement",
                    },
                    {
                        path: "punishment",
                        component: PunishmentListView,
                        name: "cadet-punishment",
                    },
                    {
                        path: "positions",
                        component: PositionListView,
                        name: "cadet-positions",
                    },
                    {
                        path: "rank-histories",
                        component: RankHistoryListView,
                        name: "cadet-rank-histories",
                    },
                    {
                        path: "specialities",
                        component: SpecialityHistoryView,
                        name: "cadet-specialities",
                    },
                    {
                        path: "fired",
                        component: FiredCadetComponent,
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
                        component: EncouragementListView,
                        name: "encouragement",
                    },
                    {
                        path: "employee-punishment",
                        component: PunishmentListView,
                        name: "punishment",
                    },
                    {
                        path: "employee-positions",
                        component: PositionListView,
                        name: "positions",
                    },
                    {
                        path: "employee-rank-histories",
                        component: RankHistoryListView,
                        name: "rank-histories",
                    },
                    {
                        path: "fired",
                        component: FiredCadetComponent,
                        name: "fired",
                    },
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
                component: DictionaryMainView,
                children: [
                    {
                        path: "groups",
                        component: GroupListView,
                        name: "dictionaries-groups",
                    },
                    {
                        path: "ranks",
                        component: RankListView,
                        name: "dictionaries-ranks",
                    },
                    {
                        path: "rank-groups",
                        component: RankGroupsListView,
                        name: "dictionaries-rank-groups",
                    },
                    {
                        path: "encouragements",
                        component: EncouragementKindListView,
                        name: "dictionaries-encouragements",
                    },
                    {
                        path: "punishments",
                        component: PunishmentKindListView,
                        name: "dictionaries-punishments",
                    },
                    {
                        path: "subdivisions",
                        component: SubdivisionListView,
                        name: "dictionaries-subdivisions",
                    },
                    {
                        path: "positions",
                        component: PositionNameListView,
                        name: "dictionaries-positions",
                    },
                    {
                        path: "order-owners",
                        component: OrderOwnerListView,
                        name: "order-owners",
                    },
                    {
                        path: "militaryoffices",
                        component: MilitaryOfficeListView,
                        name: "dictionaries-militaryoffices",
                    },
                    {
                        path: "go-rovd",
                        component: GOROVDListView,
                        name: "dictionaries-go-rovd",
                    },
                    {
                        path: "component-organs",
                        component: ComponentOrganListView,
                        name: "dictionaries-component-organ",
                    },
                    {
                        path: "rewards",
                        component: RewardListView,
                        name: "dictionaries-rewards",
                    },
                    {
                        path: "specialities",
                        component: SpecialityListView,
                        name: "dictionaries-speciality",
                    },
                    {
                        path: "specializations",
                        component: SpecializationListView,
                        name: "dictionaries-specializations",
                    },
                    {
                        path: "person-categories",
                        component: PersonCategoriesListView,
                        name: "dictionaries-person-categories",
                    },
                    {
                        path: "ord-directions",
                        component: DirectionsORDListView,
                        name: "dictionaries-ord-directions",
                    },
                    {
                        path: "marital-statuses",
                        component: MaritalStatusesListView,
                        name: "dictionaries-marital-statuses",
                    },
                    {
                        path: "passport-authorities",
                        component: PassportAuthoritiesListView,
                        name: "dictionaries-passport-authorities",
                    },
                    {
                        path: "passport-foreign-languages",
                        component: ForeignLanguagesListView,
                        name: "dictionaries-foreign-languages",
                    },
                    {
                        path: "graduation-reasons",
                        component: GraduationReasonsListView,
                        name: "dictionaries-graduation-reasons",
                    },
                    {
                        path: "education-forms",
                        component: EducationFormsListView,
                        name: "dictionaries-education-forms",
                    },
                    {
                        path: "passport-foreign-language-levels",
                        component: ForeignLanguageLevelsListView,
                        name: "dictionaries-foreign-language-levels",
                    },
                    {
                        path: "entrance-categories",
                        component: EntranceCategoryListView,
                        name: "dictionaries-entrance-categories",
                    },
                    {
                        path: "social-statuses",
                        component: SocialStatusListView,
                        name: "dictionaries-social-statuses",
                    },
                    {
                        path: "education-kinds",
                        component: EducationKindListView,
                        name: "dictionaries-education-kinds",
                    },
                    {
                        path: "education-levels",
                        component: EducationLevelListView,
                        name: "dictionaries-education-levels",
                    },
                    {
                        path: "education-location-kinds",
                        component: EducationLocationKindList,
                        name: "dictionaries-education-location-kinds",
                    },
                    {
                        path: "vpk-categories",
                        component: VPKCategoryListView,
                        name: "dictionaries-vpk-categories",
                    },
                    {
                        path: "pfl-categories",
                        component: PFLCategoryListView,
                        name: "dictionaries-pfl-categories",
                    },
                    {
                        path: "privileges",
                        component: PrivilegeListView,
                        name: "dictionaries-privileges",
                    },
                    {
                        path: "document-types",
                        component: DocumentTypeListView,
                        name: "dictionaries-document-types",
                    },
                    {
                        path: "in-whose-interests",
                        component: InWhoseInterestsListView,
                        name: "dictionaries-in-whose-interests",
                    },
                ],
            },
            {
                path: "/entrance",
                component: EntranceMainView,
                meta: { requiresAuth: true },
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
                meta: { requiresAuth: true },
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

    if (to.meta.requiresAuth && !isLoggedIn) {
        return {
            path: "/login",
            query: { redirect: to.fullPath },
        }
    }
})

export default router
