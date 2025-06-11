const state = () => ({ isCommonLoading: true, someObj: { field1: "ff" } })

const getters = {
  getIsCommonLoading(state) {
    return state.isCommonLoading
  },
}

const actions = {
  async actionGetCommonLists({ dispatch, commit }, payload) {
    await dispatch("encouragementKinds/actionGetList", null, {
      root: true,
    })
    await dispatch("punishmentKinds/actionGetList", null, { root: true })
    await dispatch("ranks/actionGetList", null, { root: true })
    await dispatch("groups/actionGetList", null, { root: true })
    await dispatch("subdivisions/actionGetList", null, { root: true })
    await dispatch("positions/actionGetList", null, { root: true })
    await dispatch("specialities/actionGetList", null, { root: true })
    await dispatch("specializations/actionGetList", null, { root: true })
    await dispatch("directionsORD/actionGetList", null, { root: true })
    await dispatch("maritalStatuses/actionGetList", null, { root: true })
    await dispatch("componentOrgans/actionGetList", null, { root: true })
    await dispatch("passportAuthorities/actionGetList", null, { root: true })
    await dispatch("foreignLanguages/actionGetList", null, { root: true })
    await dispatch("foreignLanguageLevels/actionGetList", null, {
      root: true,
    })
    await dispatch("militaryOffices/actionGetList", null, { root: true })
    await dispatch("graduationReasons/actionGetList", null, { root: true })
    await dispatch("educationForms/actionGetList", null, { root: true })
    await dispatch("rankGroups/actionGetList", null, { root: true })
    await dispatch("orderOwners/actionGetList", null, { root: true })
    await dispatch("gorovds/actionGetList", null, { root: true })
    await dispatch("rewards/actionGetList", null, { root: true })
    await dispatch("personCategories/actionGetList", null, { root: true })
    await dispatch("educationKind/actionGetList", null, { root: true })
    await dispatch("educationLevel/actionGetList", null, { root: true })
    await dispatch("educationLocalityKind/actionGetList", null, {
      root: true,
    })
    await dispatch("degreeOfKinship/actionGetList", null, { root: true })
    await dispatch("socialStatus/actionGetList", null, { root: true })
    await dispatch("entranceCategory/actionGetList", null, { root: true })
    await dispatch("countryRegion/actionGetList", null, { root: true })
    await dispatch("documentType/actionGetList", null, { root: true })
    await dispatch("privileges/actionGetList", null, { root: true })
    await dispatch("ppflCategories/actionGetList", null, { root: true })
    await dispatch("vpkCategories/actionGetList", null, { root: true })
    await dispatch("medals/actionGetList", null, { root: true })
    await dispatch("inWhoseInterests/actionGetList", null, { root: true })
    await dispatch("profiling/actionGetList", null, { root: true })
    await dispatch("healthGroup/actionGetList", null, { root: true })
    await dispatch("educationalInstitutions/actionGetList", null, {
      root: true,
    })
    await dispatch("admissionQuota/actionGetList", null, { root: true })
    await dispatch("culturalMassEvents/actionGetList", null, { root: true })
    await dispatch("publicOrganizations/actionGetList", null, { root: true })
    commit("setIsCommonLoading", false)
  },
}

const mutations = {
  setIsCommonLoading(state, payload) {
    state.isCommonLoading = payload
  },
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
}
