export const state = () => ({
  status: {},
  previous: null,
  next: null,
  count: 0,
  items: []
})

export const getters = {
  questions: (state) => state.items
}

export const actions = {
  save({ commit }, data) {
    commit("saveRequest")
    return this.$axios.patch(`/questions/${data.id}/`, data).then(
      (response) => {
        commit("saveSuccess", response.data)
        this.$toast.success("Thank you!")
        return response.data
      },
      (error) => {
        commit("saveFailure", error.message)
        this.$toast.error(error.message)
        throw error
      }
    )
  },
  list({ commit }, params) {
    commit("getRequest")
    return this.$axios.get("/questions/", { params }).then(
      (response) => {
        commit("getSuccess", response.data)
        return response.data.results
      },
      (error) => {
        commit("getFailure", error.message)
        this.$toast.error(error.message)
        throw error
      }
    )
  },
  next({ dispatch, state }, params) {
    if (state.next) return dispatch("list", { ...params, page: state.next })
    else return []
  },
  previous({ dispatch, state }, params) {
    if (state.previous) return dispatch("list", { ...params, page: state.previous })
    else return []
  }
}

export const mutations = {
  saveSuccess(state, data) {
    state.status = { saved: true }
    state.items = data
  },
  saveRequest(state) {
    state.status = { saving: true }
    if (
      state.next === null &&
      state.previous &&
      (state.previous + 1) * state.items.length < state.count
    )
      state.status.loading = true
  },
  saveFailure(state, error) {
    state.status = { error: error }
  },
  getRequest(state) {
    state.status = { loading: true }
  },
  getSuccess(state, data) {
    state.status = { loaded: true }
    state.items = data.results
    state.previous = data.previous
    state.next = data.next
    state.count = data.count
  },
  getFailure(state, error) {
    state.status = { error: error }
  }
}
