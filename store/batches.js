export const state = () => ({
  status: {},
  items: []
})

export const getters = {
  items: (state) => state.items,
  status: (state) => state.status
}

export const actions = {
  listSimple({ commit }, params) {
    commit("listSimpleRequest")
    return this.$axios.get("/batches/simple", { params }).then(
      (response) => {
        commit("listSimpleSuccess", response.data)
        return response.data
      },
      (error) => {
        commit("listSimpleFailure", error.message)
        this.$toast.error(error.message)
        throw error
      }
    )
  },
  list({ commit }, params) {
    commit("listRequest")

    return this.$axios.get("/batches/", { params }).then(
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

    return this.$axios.patch(`/batches/${data.id}/`, data).then(
      (response) => {
        commit("updateSuccess", response.data)
        this.$toast.success("Batch updated successfully!")
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
  }
}

export const mutations = {
  listRequest(state) {
    state.status = { loading: true }
  },
  listSuccess(state, batches) {
    state.items = batches
    state.status = { loaded: true }
  },
  listFailure(state, error) {
    state.status = { error }
  },
  listSimpleRequest(state) {
    state.status = { loading: true }
  },
  listSimpleSuccess(state, batches) {
    state.items = batches
  },
  listSimpleFailure(state, error) {
    state.status = { error }
  },
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
    state.status = { updating: true }
  },
  updateSuccess(state, data) {
    state.status = { updated: true }
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
  },
  changeStudentBatch(state, data) {
    state.items.forEach((item, i) => {
      let index = item.enrollments.findIndex((e) => e.id === data.id)
      if (index >= 0) item.enrollments.splice(index, 1)
    })
    let newBatchIndex = state.items.findIndex((e) => e.id === data.batch)
    state.items[newBatchIndex].enrollments.push(data)
  }
}
