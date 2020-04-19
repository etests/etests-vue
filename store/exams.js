export const state = () => ({
  status: { loading: false },
  items: []
})

export const getters = {
  status: (state) => state.status,
  exams: (state) => state.items
}

export const actions = {
  list({ commit }) {
    commit("listRequest")
    return this.$axios.get("/exams/").then(
      (response) => {
        commit("listSuccess", response.data)
        return response.data
      },
      (error) => {
        commit("listFailure", error.message)
        throw error
      }
    )
  }
}

export const mutations = {
  listRequest(state) {
    state.status = { loading: true }
  },
  listSuccess(state, exams) {
    state.status = { loading: false }
    state.items = exams
  },
  listFailure(state, error) {
    state.status = { error, loading: false }
  }
}
