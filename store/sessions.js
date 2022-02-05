export const state = () => ({
  status: {},
  session: null,
  all: { items: [] },
})

export const getters = {
  sessions: (state) => state.items,
  session: (state) => state.session,
}

export const actions = {
  start({ commit }, id) {
    commit("startRequest", id)
    return this.$axios.post(`/tests/${id}/sessions/`).then(
      (response) => {
        commit("startSuccess", response.data)
        return response.data
      },
      (error) => {
        commit("startFailure", error.message)
        throw error
      }
    )
  },
  list({ commit }) {
    commit("listRequest")
    return this.$axios.get("/sessions/").then(
      (response) => {
        commit("listSuccess", response.data)
        return response.data
      },
      (error) => {
        commit("listFailure", error.message)
        throw error
      }
    )
  },
  update({ commit }, data) {
    commit("updateRequest", data)

    return this.$axios.patch(`/sessions/${data.id}/`, data).then(
      (response) => {
        commit("updateSuccess", response.data)
        return response.data
      },
      (error) => {
        commit("updateFailure", error.message)
        this.$toast.error(error.message)
        throw error
      }
    )
  },
}

export const mutations = {
  startRequest(state) {
    state.status = { loading: true }
  },
  startSuccess(state, session) {
    state.status = { exists: true }
    state.session = session
  },
  startFailure(state, error) {
    state.status = { error }
  },
  listRequest(state) {
    state.status = { loading: true }
  },
  listSuccess(state, sessions) {
    state.status = {}
    state.all.items = sessions
  },
  listFailure(state, error) {
    state.status = { error }
  },
  updateRequest(state, data) {
    state.status = { updating: true }
  },
  updateSuccess(state, data) {
    state.status = { updated: true }
    state.session = data
  },
  updateFailure(state, error) {
    state.status = { error: error }
  },
}
