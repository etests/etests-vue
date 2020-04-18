export const state = () => ({
  status: {},
  items: []
})

export const getters = {
  students: (state) => state.items
}

export const actions = {
  list({ commit }) {
    commit("listRequest")

    return this.$axios.get("/students/").then(
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
  listSuccess(state, students) {
    state.status = {}
    state.items = students
  },
  listFailure(state, error) {
    state.status = { error }
  }
}
