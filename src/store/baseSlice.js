export const queryLimit = 1000

export const baseState = () => ({
  mainList: { count: "", results: [] },
})

export const baseGetters = {
  getList(state) {
    return state.mainList
  },
}

export const baseMutations = {
  setList(state, payload) {
    state.mainList = payload
  },
  addItemToList(state, payload) {
    state.mainList.results.push(payload)
    state.mainList.count = state.mainList.results.length
  },
  updateItemInList(state, payload) {
    let index = state.mainList.results.findIndex(
      (item) => item.id === payload.id,
    )
    if (index > -1) {
      state.mainList.results[index] = payload
    }
  },
  deleteItemInList(state, payload) {
    let index = state.mainList.results.findIndex(
      (item) => item.id === payload.id,
    )
    if (index > -1) {
      state.mainList.results.splice(index, 1)
    }
    state.mainList.count = state.mainList.results.length
  },
}

export function getActionGetListFunction(mainAPIInstance) {
  return async ({ commit }, payload) => {
    mainAPIInstance.searchObj = { ...payload, limit: queryLimit }
    try {
      const response = await mainAPIInstance.getItemsList()
      commit("setList", response.data)
    } catch (error) {}
  }
}

export function getActionAddNewItem(mainAPIInstance) {
  return async ({ commit }, payload) => {
    try {
      const response = await mainAPIInstance.addItem(payload)
      commit("addItemToList", response.data)
    } catch (error) {}
  }
}

export function getActionUpdateItem(mainAPIInstance) {
  return async ({ commit }, payload) => {
    try {
      const response = await mainAPIInstance.updateItem(payload)
      commit("updateItemInList", response.data)
    } catch (error) {}
  }
}

export function getActionDeleteItem(mainAPIInstance) {
  return async ({ commit }, payload) => {
    try {
      const response = await mainAPIInstance.deleteItem(payload)
      commit("deleteItemInList", response.data)
    } catch (error) {}
  }
}
