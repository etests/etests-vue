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
  update({ commit }, data) {
    commit("updateRequest", data)

    return this.$axios.patch("/students/", data).then(
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
    if (data.joiningKey) state.joiningKey = data.joiningKey
    if (data.students) state.items = data.students
    state.status = {}
  },
  listFailure(state, error) {
    state.status = { error }
  },
  updateRequest(state, data) {
    state.status = { updating: true }
  },
  updateSuccess(state, data) {
    if (data.joiningKey) state.joiningKey = data.joiningKey
    if (data.students) state.items = data.students
    state.status = {}
    state.status = { updated: true }
  },
  updateFailure(state, error) {
    state.status = { error: error }
  }
}
