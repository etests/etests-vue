export const state = () => ({
  status: {},
  dialog: { tab: 0, show: false }
})

export const getters = {
  dialog: (state) => state.dialog
}

export const actions = {
  sendResetCode({ commit }, { email }) {
    commit("sendResetCodeRequest", { email })

    return this.$axios.post("/password/request/", { email }).then(
      (response) => {
        commit("sendResetCodeSuccess", response.data)
        this.$toast.success(response.data)
        return response.data
      },
      (error) => {
        commit("sendResetCodeFailure", error.message)
        this.$toast.error(error.message)
        throw error
      }
    )
  },
  submitResetCode({ commit }, data) {
    commit("submitResetCodeRequest")

    return this.$axios.post("/password/reset/", data).then(
      (response) => {
        commit("submitResetCodeSuccess", response.data)
        this.$toast.success(response.data)
        return response.data
      },
      (error) => {
        commit("submitResetCodeFailure", error.message)
        this.$toast.error(error.message)
        throw error
      }
    )
  },
  changePassword({ commit }, data) {
    commit("changePasswordRequest")
    return this.$axios.post("/password/change/", data).then(
      (response) => {
        commit("changePasswordSuccess")
        this.$toast.success(response.data)
        return response.data
      },
      (error) => {
        commit("changePasswordFailure", error.message)
        this.$toast.error(error.message)
        throw error
      }
    )
  },
  register({ commit }, data) {
    commit("registerRequest", data)
    return this.$axios.post("/register/", data).then(
      (response) => {
        commit("registerSuccess", response.data)
        return response.data
      },
      (error) => {
        commit("registerFailure", error.message)
        this.$toast.error(error.message)
        throw error
      }
    )
  },
  verify({ commit }, data) {
    commit("verifyRequest")

    return this.$axios.post("/verify/", data).then(
      (response) => {
        commit("verifySuccess", response.data)
        return response.data
      },
      (error) => {
        commit("verifyFailure", error.message)
        this.$toast.error(error.message)
        throw error
      }
    )
  }
}

export const mutations = {
  changeAuthTab(state, index) {
    if (index === 0 || index === 1) state.dialog.tab = index
  },
  toggleAuthDialog(state, value) {
    if (value) state.dialog.show = true
    else state.dialog.show = false
  },
  sendResetCodeRequest(state, email) {
    state.status = { sending: true, email }
  },
  sendResetCodeSuccess(state, message) {
    state.status = { sent: true, message }
  },
  sendResetCodeFailure(state, error) {
    state.status = { sendCodeError: true, error }
  },
  submitResetCodeRequest(state) {
    state.status = { resetting: true }
  },
  submitResetCodeSuccess(state, message) {
    state.status = { reset: true, message }
  },
  submitResetCodeFailure(state, error) {
    state.status = { submitResetError: true, error }
  },
  changePasswordRequest(state) {
    state.status.changing = true
  },
  changePasswordSuccess(state) {
    state.status.changed = true
  },
  changePasswordFailure(state, error) {
    state.status.error = error
  },
  registerRequest(state) {
    state.status = { registering: true }
  },
  registerSuccess(state, message) {
    state.status = { registered: true, message }
  },
  registerFailure(state, error) {
    state.status = { error }
  },
  verifyRequest(state) {
    state.status = { verifying: true }
  },
  verifySuccess(state, message) {
    state.status = { verified: true, message }
  },
  verifyFailure(state, error) {
    state.status = { submitResetError: true, error }
  }
}
