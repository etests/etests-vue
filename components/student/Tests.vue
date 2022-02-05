<template>
  <TestList :tests="tests" :expand="expanded" :loading="loading" @toggle="expanded = !expanded" />
</template>

<script>
import TestList from "./TestList"

export default {
  components: {
    TestList,
  },
  props: {
    expand: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      expanded: true,
    }
  },
  computed: {
    tests() {
      return this.$store.state.tests.all.items
    },
    loading() {
      return this.$store.state.tests.status.loading
    },
  },
  created() {
    this.$store.cache.dispatch("tests/list")
  },
}
</script>
