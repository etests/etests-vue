export const state = () => ({
  status: {},
  joiningKey: null,
  items: []
})

export const getters = {
  status: (state) => state.status,
  students: (state) => state.items,
  joiningKey: (state) => state.joiningKey
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
  },
  key({ commit }) {
    commit("keyRequest")

    return this.$axios.get("/joining_key/").then(
      (response) => {
        commit("keySuccess", response.data)
        return response.data
      },
      (error) => {
        commit("keyFailure", error.message)
        this.$toast.error(error.message)
        throw error
      }
    )
  },
  remove({ commit }, id) {
    commit("removeRequest", id)

    return this.$axios.delete(`/students/${id}/`).then(
      (_) => {
        commit("removeSuccess", id)
        this.$toast.success("Student removed")
      },
      (error) => {
        commit("removeFailure", error.message)
        this.$toast.error(error.message)
        throw error
      }
    )
  },
  update({ commit }, data) {
    commit("updateRequest", data)

    return this.$axios.patch("/joining_key/", data).then(
      (response) => {
        commit("updateSuccess", data)
        this.$toast.success("Updated successfully!")
        return response.data
      },
      (error) => {
        commit("updateFailure", error.message)
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
  listSuccess(state, data) {
    state.items = data
    state.status = {}
  },
  listFailure(state, error) {
    state.status = { error }
  },
  keyRequest(state) {
    state.status = { loading: true }
  },
  keySuccess(state, data) {
    state.joiningKey = data.joiningKey
    state.status = {}
  },
  keyFailure(state, error) {
    state.status = { error }
  },

  removeRequest(state, id) {
    state.status = { removing: true }
  },
  removeSuccess(state, id) {
    state.status = { removed: true }
    state.items = state.items.filter((item) => item.id != id)
  },
  removeFailure(state, error) {
    state.status = { error: error }
  },
  updateRequest(state, data) {
    state.status = { updating: true }
  },
  updateSuccess(state, data) {
    state.joiningKey = data.joiningKey
    state.status = {}
    state.status = { updated: true }
  },
  updateFailure(state, error) {
    state.status = { error: error }
  }
}
