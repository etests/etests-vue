<template>
  <TestList :tests="tests" :expand="expanded" :loading="loading" @toggle="expanded = !expanded" />
</template>

<script>
import { mapState } from "vuex"
import TestList from "./TestList"

export default {
  components: {
    TestList
  },
  props: {
    expand: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.$store.cache.dispatch("tests/list")
  },
  computed: {
    ...mapState({
      status: (state) => state.tests.status,
      tests: (state) => state.tests.all.items
    }),
    loading() {
      return this.$store.state.tests.status.loading
    },
    expanded: {
      get() {
        return this.expand
      },
      set(value) {
        this.$emit("toggle")
      }
    }
  }
}
</script>
