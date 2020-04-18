export const state = () => ({
  status: {},
  buyers: []
})

export const getters = {
  buyers: (state) => state.buyers
}

export const actions = {
  activate({ commit }, data) {
    commit("activateRequest")
    return this.$axios.patch(`/payments/${data.transactionId}/`, data).then(
      (_) => {
        commit("activateSuccess")
        this.$toast.success("Test Series Activated!")
      },
      (error) => {
        commit("activateFailure", error.message)
        this.$toast.error(error.message)
        throw error
      }
    )
  },
  create({ commit }, data) {
    commit("createRequest")
    return this.$axios.post("/payments/gateway/", data).then(
      (response) => {
        commit("createSuccess")
        this.$toast.success("Payment details received successfully")
        return response.data
      },
      (error) => {
        commit("createFailure", error)
        this.$toast.error(error)
        throw error
      }
    )
  },
  get({ commit }) {
    commit("getRequest")
    return this.$axios.get("/payments/").then(
      (response) => {
        commit("getSuccess", response.data)
        return response.data
      },
      (error) => {
        commit("getFailure", error)
        throw error
      }
    )
  }
}

export const mutations = {
  activateSuccess(state) {
    state.status = { activated: true }
  },
  activateRequest(state) {
    state.status = { activating: true }
  },
  activateFailure(state, error) {
    state.status = { error: error }
  },
  createSuccess(state) {
    state.status = { created: true }
  },
  createRequest(state) {
    state.status = { creating: true }
  },
  createFailure(state, error) {
    state.status = { error: error }
  },
  getRequest(state) {
    state.status = { fetching: true }
  },
  getSuccess(state, data) {
    state.status = { fetched: true }
    state.buyers = data
  },
  getFailure(state, error) {
    state.status = { error: error }
  }
}
