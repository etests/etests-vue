export const state = () => ({
  status: {},
  generated: null,
  items: []
})

export const getters = {
  enrollments: (state) => state.items
}

export const actions = {
  create({ commit }, data) {
    commit("createRequest")
    return this.$axios.post("/enrollments/", data).then(
      (response) => {
        commit("createSuccess", response.data)
        return response.data
      },
      (error) => {
        commit("createFailure", error.message)
        this.$toast.error(error.message)
        throw error
      }
    )
  },
  remove({ commit }, id) {
    commit("removeRequest", id)

    return this.$axios.delete(`/enrollments/${id}`).then(
      (_) => {
        commit("removeSuccess", id)
        this.$toast.success("Student removed successfully!")
      },
      (error) => {
        commit("removeFailure", error.message)
        this.$toast.error(error.message)
        throw error
      }
    )
  },
  list({ commit }, data) {
    commit("listRequest")
    return this.$axios.get("/list/", data).then(
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
  createRequest(state) {
    state.status = { loading: true }
  },
  createSuccess(state, data) {
    state.status = { loaded: true }
    state.generated = data
    state.items.concat(data)
    this.dispatch("batches/newEnrollments", data)
  },
  clearGenerated(state) {
    state.generated = null
    state.status = {}
  },
  createFailure(state, error) {
    state.status = { error }
  },
  listRequest(state) {
    state.status = { loading: true }
  },
  listSuccess(state, enrollments) {
    state.status = { exists: true }
    state.items = enrollments
  },
  listFailure(state, error) {
    state.status = { error }
  },
  removeRequest(state, id) {
    state.status = { removing: true, id: id }
  },
  removeSuccess(state, id) {
    state.status = { removed: true, id: id }
    state.items = state.items.filter((item) => item.id !== id)
    this.dispatch("batches/removeStudent", id)
  },
  removeFailure(state, error) {
    state.status = { error: error }
  }
}
