export const state = () => ({
  status: {},
  batch: {},
  items: []
})

export const getters = {
  batches: (state) => state.items,
  batch: (state) => state.batch
}

export const actions = {
  get({ commit }, id) {
    commit("getRequest", id)

    return this.$axios.get("/batches/", id).then(
      (response) => {
        commit("getSuccess", response.data)
        this.$toast.success("Batch fetched successfully!")
        return response.data
      },
      (error) => {
        commit("getFailure", error.message)
        this.$toast.error(error.message)
        throw error
      }
    )
  },
  create({ commit }, data) {
    commit("createRequest", data)

    return this.$axios.post("/batches/", data).then(
      (response) => {
        commit("createSuccess", response.data)
        this.$toast.success("Batch created successfully!")
        return response.data
      },
      (error) => {
        commit("createFailure", error.message)
        this.$toast.error(error.message)
        throw error
      }
    )
  },
  update({ commit }, data) {
    commit("updateRequest", data)

    return this.$axios.patch("/batches/", data).then(
      (response) => {
        commit("updateSuccess", response.data)
        this.$toast.success("Batch update successfully!")
        return response.data
      },
      (error) => {
        commit("updateFailure", error.message)
        this.$toast.error(error.message)
        throw error
      }
    )
  },
  join({ commit }, { id, data }) {
    commit("joinRequest", data)

    return this.$axios.patch(`/enrollments/${id}/`, data).then(
      (_) => {
        commit("joinSuccess", data)
        this.$toast.success("Joined successfully!")
        return response.data
      },
      (error) => {
        commit("joinFailure", error.message)
        this.$toast.error(error.message)
        throw error
      }
    )
  },
  newEnrollments({ commit }, data) {
    commit("newEnrollmentsSuccess", data)
  },
  remove({ commit }, id) {
    commit("removeRequest", id)

    return this.$axios.delete("/batches/", id).then(
      (_) => {
        commit("removeSuccess", id)
        this.$toast.success("Batch removed successfully!")
      },
      (error) => {
        commit("removeFailure", error.message)
        this.$toast.error(error.message)
        throw error
      }
    )
  },
  removeStudent({ commit }, id) {
    commit("removeStudentSuccess", id)
  },
  list({ commit }) {
    commit("listRequest")

    return this.$axios.get("/batches/simple/").then(
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
  detailedList({ commit }) {
    commit("detailedListRequest")

    return this.$axios.get("/batches/").then(
      (response) => {
        commit("detailedListSuccess", response.data)
        return response.data
      },
      (error) => {
        commit("detailedListFailure", error.message)
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
  getSuccess(state, batch) {
    state.status = {}
    state.batch = batch
  },
  getFailure(state, error) {
    state.status = { error }
  },
  listRequest(state) {
    state.status = { loading: true }
  },
  listSuccess(state, batches) {
    state.items = batches
  },
  listFailure(state, error) {
    state.status = { error }
  },
  detailedListRequest(state) {
    state.status = { loading: true }
  },
  detailedListSuccess(state, batches) {
    state.items = batches
  },
  detailedListFailure(state, error) {
    state.status = { error }
  },
  createRequest(state, data) {
    state.status = { creating: true }
  },
  createSuccess(state, data) {
    state.status = { created: true, batch: data }
    state.items.push(data)
  },
  createFailure(state, error) {
    state.status = { error: error }
  },
  updateRequest(state, data) {
    state.status = { creating: true }
  },
  updateSuccess(state, data) {
    state.status = { created: true, batch: data }
  },
  updateFailure(state, error) {
    state.status = { error: error }
  },
  joinRequest(state, id) {
    state.status = { joining: true, id: id }
  },
  joinSuccess(state, data) {
    state.status = { joined: true, id: data["roll_number"] }
    this.dispatch("profile/joinInstitute", data.institute)
  },
  joinFailure(state, error) {
    state.status = { error: error }
  },
  newEnrollmentsSuccess(state, data) {
    data.forEach((item) => {
      let batch = state.items.find((batch) => batch.id === item.batch)
      batch.enrollments.push(item)
    })
  },
  removeRequest(state, id) {
    state.status = { removing: true, id: id }
  },
  removeSuccess(state, id) {
    state.status = { removed: true, id: id }
    state.items = state.items.filter((batch) => batch.id !== id)
  },
  removeFailure(state, error) {
    state.status = { error: error }
  },
  removeStudentSuccess(state, id) {
    state.items.forEach((item, i) => {
      let index = item.enrollments.findIndex((e) => e.id === id)
      if (index >= 0) item.enrollments.splice(index, 1)
    })
  }
}
