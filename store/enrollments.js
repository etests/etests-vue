export const state = () => ({
  status: {},
  items: []
})

export const getters = {
  items: (state) => state.items,
  status: (state) => state.status
}

export const actions = {
  create({ commit }, data) {
    commit("createRequest")
    return this.$axios.post("/enrollments/student/", data).then(
      (response) => {
        commit("createSuccess", response.data)
        return response.data
      },
      (error) => {
        commit("createFailure", error.message)
        this.$toast.error(error.message)
        throw error
      }
    )
  },
  selfList({ commit }, params) {
    commit("selfListRequest")
    return this.$axios.get("/enrollments/student/", { params }).then(
      (response) => {
        commit("selfListSuccess", response.data)
        return response.data
      },
      (error) => {
        commit("selfListFailure", error.message)
        this.$toast.error(error.message)
        throw error
      }
    )
  },
  selfRemove({ commit }, id) {
    commit("selfRemoveRequest", id)

    return this.$axios.delete(`/enrollments/student/${id}`).then(
      (_) => {
        commit("selfRemoveSuccess", id)
        this.$toast.success("You left the batch.")
      },
      (error) => {
        commit("selfRemoveFailure", error.message)
        this.$toast.error(error.message)
        throw error
      }
    )
  },
  list({ commit }, data) {
    commit("listRequest")
    return this.$axios.get("/enrollments/", data).then(
      (response) => {
        commit("listSuccess", response.data)
        return response.data
      },
      (error) => {
        commit("listFailure", error.message)
        throw error
      }
    )
  },
  update({ commit }, data) {
    commit("updateRequest", data)

    return this.$axios.patch(`/enrollments/${data.id}/`, data).then(
      (response) => {
        commit("updateSuccess", response.data)
        this.$toast.success("Updated successfully!")
        return response.data
      },
      (error) => {
        commit("updateFailure", error.message)
        this.$toast.error(error.message)
        throw error
      }
    )
  },
  remove({ commit }, id) {
    commit("removeRequest", id)

    return this.$axios.delete(`/enrollments/${id}`).then(
      (_) => {
        commit("removeSuccess", id)
        this.$toast.success("Student removed successfully!")
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
  createRequest(state) {
    state.status = { loading: true }
  },
  createSuccess(state, data) {
    state.status = { loaded: true }
    if (data.id) this.commit("joinInstitute", data.institute)
    state.items.push(data)
  },
  createFailure(state, error) {
    state.status = { error }
  },
  selfListRequest(state) {
    state.status = { loading: true }
  },
  selfListSuccess(state, enrollments) {
    state.status = { exists: true }
    state.items = enrollments
  },
  selfListFailure(state, error) {
    state.status = { error }
  },
  selfRemoveRequest(state, id) {
    state.status = { removing: true, id: id }
  },
  selfRemoveSuccess(state, id) {
    state.status = { selfRemoved: true, id: id }
    var batch = state.items.find((b) => b.id == id)
    if (batch) {
      var batches = state.items.filter((b) => b.institute == batch.institute)
      if (batches.length <= 1) this.commit("leaveInstitute", batch.institute)
    }
    state.items = state.items.filter((item) => item.id !== id)
  },
  selfRemoveFailure(state, error) {
    state.status = { error: error }
  },
  listRequest(state) {
    state.status = { loading: true }
  },
  listSuccess(state, enrollments) {
    state.status = { exists: true }
    state.items = enrollments
  },
  listFailure(state, error) {
    state.status = { error }
  },
  removeRequest(state, id) {
    state.status = { removing: true, id: id }
  },
  removeSuccess(state, id) {
    state.status = { removed: true, id: id }
    state.items = state.items.filter((item) => item.id !== id)
    this.commit("batches/removeStudent", id)
  },
  removeFailure(state, error) {
    state.status = { error: error }
  },
  updateRequest(state, data) {
    state.status = { updating: true }
  },
  updateSuccess(state, data) {
    state.status = { updated: true }
    this.commit("batches/changeStudentBatch", data)
  },
  updateFailure(state, error) {
    state.status = { error: error }
  }
}
