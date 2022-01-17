<template>
  <TestList :tests="tests" :expand="expanded" :loading="loading" @toggle="expanded = !expanded" />
</template>

<script>
import { mapState } from "vuex"
import TestList from "./TestList"

export default {
  components: {
    TestList,
  },
  data() {
    return {
      expanded: true,
    }
  },
  created() {
    this.$store.cache.dispatch("tests/list")
  },
  computed: {
    ...mapState({
      status: (state) => state.tests.status,
      tests: (state) => state.tests.all.items,
    }),
    loading() {
      return this.$store.state.tests.status.loading
    },
  },
}
</script>
