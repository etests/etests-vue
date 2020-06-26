export const state = () => ({
  status: {},
  items: []
})

export const actions = {
  list({ commit }, { params }) {
    commit("listRequest")

    return this.$axios.get("/batches/", { params }).then(
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
  listRequest(state) {
    state.status = { loading: true }
  },
  listSuccess(state, batches) {
    state.items = batches
  },
  listFailure(state, error) {
    state.status = { error }
  }
}
