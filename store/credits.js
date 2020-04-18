export const state = () => ({
  status: {},
  credits: null
})

export const getters = {
  credits: (state) => state.credits
}

export const actions = {
  get({ commit }) {
    commit("getRequest")
    return this.$axios.get("/credits/").then(
      (response) => {
        commit("getSuccess", response.data)
        return response.data
      },
      (error) => {
        commit("getFailure", error.message)
        throw error
      }
    )
  }
}

export const mutations = {
  getRequest(state) {
    state.status = { loading: true }
  },
  getSuccess(state, credits) {
    state.status = { exists: true }
    state.credits = credits
  },
  getFailure(state, error) {
    state.status = { error }
  }
}
