export const state = () => ({
  status: {},
  testSeries: {},
  items: []
})

export const getters = {
  status: (state) => state.status,
  allTestSeries: (state) => state.items,
  testSeries: (state) => state.testSeries
}

export const actions = {
  get({ commit }, id) {
    commit("getRequest", id)

    return this.$axios.get(`/testseries/${id}`).then(
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
  list({ commit }, params) {
    commit("listRequest")

    return this.$axios.get("/testseries/", { params }).then(
      (response) => {
        commit("listSuccess", response.data)
        return response.data
      },
      (error) => {
        commit("listFailure", error.message)
        this.$toast.error(error.message)
        throw error
      }
    )
  }
}

export const mutations = {
  getRequest(state) {
    state.status = { loading: true }
  },
  getSuccess(state, testSeries) {
    state.status = {}
    state.testSeries = testSeries
  },
  getFailure(state, error) {
    state.status = { error }
  },
  listRequest(state) {
    state.status = { loading: true }
  },
  listSuccess(state, testSeries) {
    state.status = {}
    state.items = testSeries
  },
  listFailure(state, error) {
    state.status = { error }
  }
}
