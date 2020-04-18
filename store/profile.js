export const state = () => ({ status: {}, user: null, all: {} })

export const getters = {
  users: (state) => state.all,
  user: (state) => state.user,
  profile: (state, getters) => getters.user && getters.user.profile,
  details: (state, getters) => getters.user && getters.user.details
}

export const actions = {
  updateProfile({ commit }, data) {
    commit("updateProfileRequest")
    this.$axios.patch("/profile/", data).then(
      (response) => {
        commit("updateProfileSuccess", response.data)
        this.$toast.success("Updated Successfully!")
      },
      (error) => {
        commit("updateProfileFailure", error.message)
        this.$toast.error(error.message)
        throw error
      }
    )
  },
  joinInstitute({ commit }, id) {
    commit("joinInstituteSuccess", id)
  }
}

export const mutations = {
  updateProfileRequest(state, data) {
    state.status = { updating: true }
  },
  updateProfileSuccess(state, data) {
    state.status = { updated: true }
    state.user.profile = data
    localStorage.user = JSON.stringify(state.user)
  },
  updateProfileFailure(state, error) {
    state.status = { error: error }
  },
  listRequest(state) {
    state.all = { loading: true }
  },
  listSuccess(state, users) {
    state.all = { items: users }
  },
  listFailure(state, error) {
    state.all = { error }
  },
  joinInstituteSuccess(state, id) {
    if (state.user.details && !state.user.details.institutes.includes(id)) {
      state.user.details.institutes.push(id)
      localStorage.user = JSON.stringify(state.user)
    }
  }
}
