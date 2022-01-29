export const state = () => ({ status: {}, profile: null })

export const getters = {
  profile: (state) => state.profile,
}

export const actions = {
  update({ commit }, data) {
    commit("updateRequest")
    return this.$axios.patch("/profile/", data).then(
      (response) => {
        commit("updateSuccess", response.data)
        this.$toast.success("Updated Successfully!")
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
  updateRequest(state) {
    state.status = { updating: true }
  },
  updateSuccess(state, data) {
    state.status = { updated: true }
    this.$auth.setUser(data)
  },
  updateFailure(state, error) {
    state.status = { error: error }
  },
}
