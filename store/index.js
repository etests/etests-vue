import createCache from "vuex-cache"

export const plugins = [createCache()]

export const strict = false

export const state = () => {}

export const mutations = {
  joinInstitute(state, id) {
    if (
      state.auth.user &&
      Array.isArray(state.auth.user.joined) &&
      !state.auth.user.joined.includes(id)
    ) {
      state.auth.user.joined.push(id)
    }
  },
  leaveInstitute(state, id) {
    if (state.auth.user && Array.isArray(state.auth.user.joined)) {
      state.auth.user.joined = state.auth.user.joined.filter((i) => i != id)
    }
  }
}

export const getters = {
  loggedIn: (state) => state.auth.loggedIn,
  user: (state) => state.auth.user
}
