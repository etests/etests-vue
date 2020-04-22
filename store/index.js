import createCache from "vuex-cache"

export const plugins = [createCache()]

export const strict = false

export const state = () => {}

export const mutations = {}

export const getters = {
  loggedIn: (state) => state.auth.loggedIn,
  user: (state) => state.auth.user
}
