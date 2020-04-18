export const state = () => ({
  status: {},
  items: []
})

export const getters = {
  transactions: (state) => state.items
}

export const actions = {
  get({ commit }) {
    commit("getRequest")
    return this.$axios.get("/transactions/").then(
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
  getSuccess(state, transactions) {
    state.status = { exists: true }
    state.items = transactions
  },
  getFailure(state, error) {
    state.status = { error }
  }
}
