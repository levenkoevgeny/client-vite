import getFavoriteCadetsAPIInstance from "@/api/cadet/favoriteCadetsAPI.js"

export const state = () => ({
  mainList: [],
  mainListIdsInString: "",
})

const mutations = {
  setList(state, payload) {
    state.mainList = payload
  },
  setMainListIdsInString(state, payload) {
    state.mainListIdsInString = payload
  },
}

const getters = {
  getList(state) {
    return state.mainList
  },
  getMainListIdsInString(state) {
    if (state.mainList.length > 0) {
      const ids_array = []
      state.mainList.map((item) => ids_array.push(item.cadet))

      return ids_array.join(",")
    } else return "1111111111111111111111111111111"
  },
}

const actions = {
  async actionGetList({ commit, state }, payload) {
    const favoriteCadetsAPIInstance = getFavoriteCadetsAPIInstance()
    const response =
      await favoriteCadetsAPIInstance.get_favorite_cadets_for_current_user()
    commit("setList", response.data)
  },

  async actionAddOrDeleteFromFavorites({ dispatch, commit, state }, payload) {
    const favoriteCadetsAPIInstance = getFavoriteCadetsAPIInstance()
    const response =
      await favoriteCadetsAPIInstance.add_or_delete_from_favorites(payload)
    await dispatch("actionGetList")
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
