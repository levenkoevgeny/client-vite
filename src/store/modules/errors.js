const state = () => ({ errorsList: [] })

const getters = {
  getErrorsList(state) {
    return state.errorsList
  },
}

const mutations = {
  setErrorList(state, payload) {
    if (
      !state.errorsList.some(
        (error) => error.errorMessage === payload.errorMessage,
      )
    ) {
      state.errorsList = [...state.errorsList, payload]
    }
  },
  clearErrorsList(state) {
    state.errorsList = []
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
}
