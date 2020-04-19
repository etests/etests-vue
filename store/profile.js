export const state = () => ({ status: {}, profile: null })

export const getters = {
  profile: (state) => state.profile
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
  }
}

export const mutations = {
  updateProfileRequest(state) {
    state.status = { updating: true }
  },
  updateProfileSuccess(state, data) {
    state.status = { updated: true }
    this.$auth.setUser(data)
  },
  updateProfileFailure(state, error) {
    state.status = { error: error }
  }
}
