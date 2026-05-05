import { authApi } from "@/api/auth/authAPI"
import { getLocalToken, saveLocalToken, removeLocalToken } from "@/utils"
import { jwtDecode } from "jwt-decode"

const state = () => ({
  token: null,
  refreshToken: null,
  permissions: [],
  isLoggedIn: false,
  isLogInError: null,
  user: { is_preloaded_data: true, is_staff: false },
})

// getters
const getters = {
  getToken(state) {
    return state.token
  },
  getRefreshToken(state) {
    return state.refreshToken
  },
  getIsLoggedIn(state) {
    return state.isLoggedIn
  },
  getIsLogInError(state) {
    return state.isLogInError
  },
  getUser(state) {
    return state.user
  },
  getPermissions(state) {
    return state.permissions
  },
}

// actions
const actions = {
  async actionLogIn({ commit }, payload) {
    commit("errors/clearErrorsList", null, {
      root: true,
    })
    try {
      let { username, password } = payload
      const response = await authApi.logInGetToken(username, password)
      const data = await response.data
      const token = data.access
      const refreshToken = data.refresh
      // const decoded = jwtDecode(token)
      if (token) {
        saveLocalToken(token)
        commit("setToken", token)
        commit("setRefreshToken", refreshToken)
        // commit("setPermissions", decoded.permissions)
        commit("setLoggedIn", true)
        commit("setIsLogInError", false)

        const response = await authApi.getUserData()
        const userData = await response.data
        commit("setUserData", userData)
      }
    } catch (error) {}
  },

  async actionCheckLoggedIn({ state, commit, dispatch }) {
    if (!state.isLoggedIn) {
      let token = state.token
      if (!token) {
        const localToken = getLocalToken()
        if (localToken) {
          commit("setToken", localToken)
          token = localToken
        }
      }
      if (token) {
        try {
          const response = await authApi.getUserData()
          const userData = await response.data
          commit("setUserData", userData)
          commit("setLoggedIn", true)
        } catch (error) {
          dispatch("actionRemoveLogIn")
        }
      } else {
        dispatch("actionRemoveLogIn")
      }
    }
  },

  async actionRemoveLogIn({ state, commit }) {
    removeLocalToken()
    commit("setToken", null)
    commit("setLoggedIn", false)
    commit("setUserData", { is_preloaded_data: true, is_staff: false })
  },
}

// mutations
const mutations = {
  setLoggedIn(state, payload) {
    state.isLoggedIn = payload
  },
  setToken(state, payload) {
    state.token = payload
  },
  setRefreshToken(state, payload) {
    state.refreshToken = payload
  },
  setUserData(state, payload) {
    state.user = payload
  },
  setIsLogInError(state, payload) {
    state.isLogInError = payload
  },
  setPermissions(state, payload) {
    state.permissions = payload
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
