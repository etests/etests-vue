export const state = () => ({
  status: {},
  test: {},
  all: { items: [] },
  free: { items: [] },
  rankLists: [],
})

export const getters = {
  tests: (state) => state.all.items,
  test: (state) => state.test,
  rankLists: (state) => state.rankLists,
  freeTests: (state) => state.free.items,
}
export const actions = {
  get({ commit }, id) {
    commit("getRequest", id)

    return this.$axios.get(`/tests/${id}/`).then(
      (response) => {
        commit("getSuccess", response.data)
        return response.data
      },
      (error) => {
        commit("getFailure", error.message)
        this.$toast.error(error.message)
        throw error
      }
    )
  },
  create({ commit }, data) {
    commit("createRequest", data)

    return this.$axios.post("/tests/", data).then(
      (response) => {
        commit("createSuccess", response.data)
        this.$toast.success("Test created successfully!")
        return response.data
      },
      (error) => {
        commit("createFailure", error.message)
        this.$toast.error(error.message)
        throw error
      }
    )
  },
  update({ commit }, data) {
    commit("updateRequest", data)

    return this.$axios.patch(`/tests/${data.id}/`, data).then(
      (response) => {
        commit("updateSuccess", data)
        this.$toast.success("Test updated successfully!")
        return response.data
      },
      (error) => {
        commit("updateFailure", error.message)
        this.$toast.error(error.message)
        throw error
      }
    )
  },
  remove({ commit }, id) {
    commit("removeRequest", id)

    return this.$axios.delete(`/tests/${id}/`).then(
      (_) => {
        commit("removeSuccess", id)
        this.$toast.success("Test deleted successfully!")
      },
      (error) => {
        commit("removeFailure", error.message)
        this.$toast.error(error.message)
        throw error
      }
    )
  },
  list({ commit }) {
    commit("listRequest")

    return this.$axios.get("/tests/").then(
      (response) => {
        commit("listSuccess", response.data)
        return response.data
      },
      (error) => {
        commit("listFailure", error.message)
        throw error
      }
    )
  },
  getFree({ commit }) {
    commit("getFreeRequest")

    return this.$axios.get("/tests/free/").then(
      (response) => {
        commit("getFreeSuccess", response.data)
        return response.data
      },
      (error) => {
        commit("getFreeFailure", error.message)
        throw error
      }
    )
  },
  getRankList({ commit }, id) {
    commit("getRankListRequest", id)

    return this.$axios.get(`/ranks/${id}/`, { params: { id } }).then(
      (response) => {
        commit("getRankListSuccess", { id, ranks: response.data })
        return response.data
      },
      (error) => {
        commit("getRankListFailure", error.message)
        this.$toast.error(error.message)
        throw error
      }
    )
  },
}
export const mutations = {
  clearStatus(state) {
    state.status = {}
  },
  getRequest(state) {
    state.status = { loading: true }
  },
  getSuccess(state, test) {
    state.status = { loaded: true }
    state.test = test
  },
  getFailure(state, error) {
    state.status = { error }
  },
  listRequest(state) {
    state.status = { loading: true }
  },
  listSuccess(state, tests) {
    state.status = { exists: true }
    state.all = { items: tests }
  },
  listFailure(state, error) {
    state.status = { error }
  },
  getFreeRequest(state) {
    state.status = { loading: true }
  },
  getFreeSuccess(state, tests) {
    state.status = { loaded: true }
    state.free = { items: tests }
  },
  getFreeFailure(state, error) {
    state.status = { error }
  },
  generateRanksRequest(state) {
    state.status = { loading: true }
  },
  generateRanksSuccess(state, data) {
    state.status = { loaded: true, message: data.message }
    const testIndex = state.all.items.findIndex((item) => item.id === data.id)
    if (testIndex !== -1) state.all.items[testIndex].status = 4
  },
  generateRanksFailure(state, error) {
    state.status = { error }
  },
  createRequest(state, data) {
    state.status = { creating: true }
  },
  createSuccess(state, data) {
    if (data.testSeries && data.testSeries.length) {
      this.dispatch("testSeries/addTest", data, {
        root: true,
      })
    } else state.all.items.push(data)
    state.status = { created: true, test: data }
  },
  createFailure(state, error) {
    state.status = { error: error }
  },
  updateRequest(state, data) {
    state.status = { updating: true }
  },
  updateSuccess(state, data) {
    state.status = { updated: true, test: data }
  },
  updateFailure(state, error) {
    state.status = { error: error }
  },
  removeRequest(state, id) {
    state.status = { removing: true, id: id }
  },
  removeSuccess(state, id) {
    state.status = { removed: true, id: id }
    state.all.items = state.all.items.filter((test) => test.id !== id)
    this.dispatch("testSeries/removeTest", id, {
      root: true,
    })
  },
  removeFailure(state, error) {
    state.status = { error: error }
  },
  getRankListRequest(state) {
    state.status = { loading: true }
  },
  getRankListSuccess(state, data) {
    state.status = { ranksFetched: true }
    if (state.rankLists.findIndex((rankList) => rankList.id === data.id) === -1) {
      state.rankLists.push(data)
    }
  },
  getRankListFailure(state, error) {
    state.status = { error }
  },
}
