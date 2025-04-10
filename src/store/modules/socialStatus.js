import getSocialStatusAPIInstance from "@/api/cadet/socialStatuses"

import {
  baseState,
  baseGetters,
  baseMutations,
  getActionGetListFunction,
  getActionAddNewItem,
  getActionUpdateItem,
  getActionDeleteItem,
} from "@/store/baseSlice"

const mainAPIInstance = getSocialStatusAPIInstance()

const state = baseState

const getters = Object.assign({}, baseGetters)

const mutations = Object.assign({}, baseMutations)

const actions = {}

actions.actionGetList = getActionGetListFunction(mainAPIInstance)
actions.actionAddNewItem = getActionAddNewItem(mainAPIInstance)
actions.actionUpdateItem = getActionUpdateItem(mainAPIInstance)
actions.actionDeleteItem = getActionDeleteItem(mainAPIInstance)

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
