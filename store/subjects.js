export const state = () => ({
  status: {},
  items: []
})

export const getters = {
  subjects: (state) => state.items
}

export const actions = {
  list({ commit }, params) {
    commit("getRequest")
    return this.$axios.get("/subjects/", { params }).then(
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
  }
}

export const mutations = {
  getRequest(state) {
    state.status = { loading: true }
  },
  getSuccess(state, data) {
    state.status = { loaded: true }
    state.items = data.results
  },
  getFailure(state, error) {
    state.status = { error: error }
  }
}
