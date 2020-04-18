<template>
  <TestList
    title="Free Tests"
    :tests="tests"
    :expand="expanded"
    :loading="loading"
    @toggle="expanded = !expanded"
  />
</template>

<script>
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
  data() {
    return {}
  },
  computed: {
    tests() {
      return this.$store.state.tests.free.items
    },
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
  },
  created() {
    this.$store.cache.dispatch("tests/getFree")
  }
}
</script>
