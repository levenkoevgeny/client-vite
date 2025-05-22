import { createStore } from "vuex"
import common from "@/store/modules/common"
import encouragementKinds from "@/store/modules/encouragementKinds"
import ranks from "@/store/modules/ranks"
import rankGroups from "@/store/modules/rankGroups"
import groups from "@/store/modules/groups"
import subdivisions from "@/store/modules/subdivisions"
import positions from "@/store/modules/positions"
import orderOwners from "@/store/modules/orderOwners"
import personCategories from "@/store/modules/personCategories"
import specialities from "@/store/modules/specialities"
import specializations from "@/store/modules/specializations"
import directionsORD from "@/store/modules/directionsORD"
import maritalStatuses from "@/store/modules/maritalStatuses"
import componentOrgans from "@/store/modules/componentOrgans"
import passportAuthorities from "@/store/modules/passportAuthorities"
import foreignLanguages from "@/store/modules/foreignLanguages"
import militaryOffices from "@/store/modules/militaryOffices"
import graduationReasons from "@/store/modules/graduationReasons"
import educationForms from "@/store/modules/educationForms"
import punishmentKinds from "@/store/modules/punishmentKinds"
import gorovds from "@/store/modules/gorovds"
import rewards from "@/store/modules/rewards"
import foreignLanguageLevels from "@/store/modules/foreignLanguageLevels"
import auth from "@/store/modules/auth"
import educationKind from "@/store/modules/educationKind"
import educationLevel from "@/store/modules/educationLevel"
import educationLocalityKind from "@/store/modules/educationLocalityKind"
import degreeOfKinship from "@/store/modules/degreeOfKinship"
import socialStatus from "@/store/modules/socialStatus"
import entranceCategory from "@/store/modules/entranceCategory"
import countryRegion from "@/store/modules/countryRegion"
import educationalInstitutions from "@/store/modules/educationalInstitutions"
import documentType from "@/store/modules/documentType"
import privileges from "@/store/modules/privileges"
import ppflCategories from "@/store/modules/ppflCategories"
import vpkCategories from "@/store/modules/vpkCategories"
import errors from "@/store/modules/errors"
import medals from "@/store/modules/medals"
import inWhoseInterests from "@/store/modules/inWhoseInterests.js"
import profiling from "@/store/modules/profiling.js"
import admissionQuota from "@/store/modules/admissionQuota.js"

const store = createStore({
  modules: {
    auth,
    common,
    ranks,
    rankGroups,
    groups,
    encouragementKinds,
    punishmentKinds,
    subdivisions,
    positions,
    orderOwners,
    militaryOffices,
    gorovds,
    componentOrgans,
    rewards,
    specialities,
    specializations,
    personCategories,
    directionsORD,
    maritalStatuses,
    passportAuthorities,
    foreignLanguages,
    foreignLanguageLevels,
    graduationReasons,
    educationForms,
    educationKind,
    educationLevel,
    educationLocalityKind,
    degreeOfKinship,
    socialStatus,
    entranceCategory,
    countryRegion,
    educationalInstitutions,
    documentType,
    privileges,
    ppflCategories,
    vpkCategories,
    errors,
    medals,
    inWhoseInterests,
    profiling,
    admissionQuota,
  },
})

export default store
