export const state = () => ({
  status: {},
  result: null
})

export const getters = {
  result: (state) => state.result
}

export const actions = {
  get({ commit }, id) {
    commit("getRequest", id)

    return this.$axios.get(`/results/${id}`).then(
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
  getSuccess(state, result) {
    state.status = { exists: true }
    state.result = result
  },
  getFailure(state, error) {
    state.status = { error }
  }
}
