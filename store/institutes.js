export const state = () => ({
  institute: null,
  status: {},
  joined: [],
  items: []
})

export const getters = {
  institute: (state) => state.institute,
  theme: (state) => {
    if (state.institute && state.institute.settings && state.institute.settings.color)
      return state.institute.settings.color
    else return "#2cce74"
  },
  institutes: (state) => state.items,
  status: (state) => state.status,
  joinedInstitutes: (state) => state.joined,
  editable: (state, getters, rootState, rootGetters) => {
    return (
      rootGetters.loggedIn &&
      rootGetters.user.scope.includes("institute") &&
      getters.institute &&
      getters.institute.handle === rootGetters.user.handle
    )
  }
}
export const actions = {
  get({ commit }, handle) {
    commit("getRequest")
    return this.$axios.get(`/institutes/${handle}/`).then(
      (response) => {
        commit("getSuccess", response.data)
        return response.data
      },
      (error) => {
        commit("getFailure", error.message)
        throw error
      }
    )
  },
  getJoined({ commit }) {
    commit("getJoinedRequest")
    return this.$axios.get("/institutes/joined/").then(
      (response) => {
        commit("getJoinedSuccess", response.data)
        return response.data
      },
      (error) => {
        commit("getJoinedFailure", error.message)
        this.$toast.error(error.message)
        throw error
      }
    )
  },
  update({ commit }, data) {
    commit("updateRequest")

    return this.$axios.patch(`/institutes/${data.handle}/`, data).then(
      (response) => {
        commit("updateSuccess", data)
        return response.data
      },
      (error) => {
        commit("updateFailure", error.message)
        this.$toast.error(error.message)
        throw error
      }
    )
  },
  list({ commit }) {
    commit("listRequest")

    return this.$axios.get("/institutes/").then(
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
  contact({ commit }, data) {
    commit("contactRequest")

    return this.$axios.post("/contacts/", data).then(
      (response) => {
        commit("contactSuccess", data)
        this.$toast.success("Successful")
        return response.data
      },
      (error) => {
        commit("contactFailure", error.message)
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
  getSuccess(state, institute) {
    state.institute = institute
    state.status = {}
  },
  getFailure(state, error) {
    state.status = { error }
  },
  updateRequest(state) {
    state.status = { updating: true }
  },
  updateSuccess(state, data) {
    state.status = { updated: true }
    Object.assign(state.institute, data)
  },
  updateFailure(state, error) {
    state.status = { error: error }
  },
  listRequest(state) {
    state.status = { loading: true }
  },
  listSuccess(state, institutes) {
    state.status = {}
    state.items = institutes
  },
  listFailure(state, error) {
    state.status = { error }
  },
  getJoinedRequest(state) {
    state.status = { loading: true }
  },
  getJoinedSuccess(state, institutes) {
    state.joined = institutes
    state.status = {}
  },
  getJoinedFailure(state, error) {
    state.status = { error }
  },
  contactRequest(state) {
    state.status = { loading: true }
  },
  contactSuccess(state, data) {
    state.status = {}
    Object.assign(state.institute, data)
  },
  contactFailure(state, error) {
    state.status = { error: error }
  }
}
