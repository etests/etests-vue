import createCache from "vuex-cache"

export const plugins = [createCache()]

export const strict = false

export const state = () => {}

export const mutations = {
  joinInstitute(state, id) {
    if (state.auth.user && Array.isArray(state.auth.user.joined)) {
      state.auth.user.joined.push(id)
    }
  }
}

export const getters = {
  loggedIn: (state) => state.auth.loggedIn,
  user: (state) => state.auth.user
}
