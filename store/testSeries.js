export const state = () => ({
  status: { loading: true },
  testSeries: {},
  items: []
})

export const getters = {
  allTestSeries: (state) => state.items,
  testSeries: (state) => state.testSeries
}
export const actions = {
  get({ commit }, id) {
    commit("getRequest", id)

    this.$axios.get("/testseries/user/", id).then(
      (response) => {
        commit("getSuccess", response.data)
        this.$toast.success("Test Series fetched successfully!")
        return response.data
      },
      (error) => {
        commit("getFailure", error.message)
        this.$toast.error(error.message)
      }
    )
  },
  create({ commit }, data) {
    commit("createRequest", data)

    this.$axios.post("/testseries/user/", data).then(
      (response) => {
        commit("createSuccess", response.data)
        this.$toast.success("Test Series created successfully!")
      },
      (error) => {
        commit("createFailure", error.message)
        this.$toast.error(error.message)
      }
    )
  },
  update({ commit }, data) {
    commit("updateRequest", data.id)

    this.$axios.patch(`/testseries/user/${data.id}/`, data).then(
      (_) => {
        commit("updateSuccess", data)
        this.$toast.success("Test Series updated successfully!")
      },
      (error) => {
        commit("updateFailure", error.message)
        this.$toast.error(error.message)
      }
    )
  },
  remove({ commit }, id) {
    commit("removeRequest", id)

    this.$axios.delete(`/testseries/user/${id}/`, id).then(
      (_) => {
        commit("removeSuccess", id)
        this.$toast.success("Test Series removed successfully!")
      },
      (error) => {
        commit("removeFailure", error.message)
        this.$toast.error(error.message)
      }
    )
  },
  list({ commit }, params) {
    commit("listRequest")

    this.$axios.get("/testseries/user/", { params }).then(
      (response) => {
        commit("listSuccess", response.data)
        return response.data
      },
      (error) => commit("listFailure", error)
    )
  },
  addTest({ commit }, test) {
    commit("addTestSuccess", test)
  },
  removeTest({ commit }, id) {
    commit("removeTestSuccess", id)
  }
}
export const mutations = {
  getRequest(state) {
    state.status = { loading: true }
  },
  getSuccess(state, testSeries) {
    state.status = { loading: false }
    state.testSeries = testSeries
  },
  getFailure(state, error) {
    state.status = { error, loading: false }
  },
  updateRequest(state, id) {
    state.status = { updating: true, id }
  },
  updateSuccess(state, data) {
    state.status = { updated: true, id: data.id }
    const item = state.items.find((item) => {
      return item.id === data.id
    })
    for (const key in data) {
      item[key] = data[key]
    }
  },
  updateFailure(state, error) {
    state.status = { error }
  },
  listRequest(state) {
    state.status = { loading: true }
  },
  listSuccess(state, testSeries) {
    state.status = { loading: false }
    state.items = testSeries
  },
  listFailure(state, error) {
    state.status = { error, loading: false }
  },
  createRequest(state, data) {
    state.status = { creating: true }
  },
  createSuccess(state, data) {
    state.items.push(data)
    state.status = { created: true, testSeries: data }
  },
  createFailure(state, error) {
    state.status = { error }
  },
  removeRequest(state, id) {
    state.status = { removing: true, id: id }
  },
  removeSuccess(state, id) {
    state.status = { removed: true, id: id }
    state.items = state.items.filter((item) => item.id !== id)
  },
  removeFailure(state, error) {
    state.status = { error }
  },
  addTestSuccess(state, test) {
    const item = state.items.filter((item) => test.testSeries.includes(item.id))
    item.forEach((testSeries) => testSeries.tests.push(test))
  },
  removeTestSuccess(state, id) {
    state.items.forEach((item) => {
      item.tests = item.tests.filter((test) => test.id !== id)
    })
  }
}
