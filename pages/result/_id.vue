<template>
  <StandardLayout>
    <v-col v-if="report" cols="12" align="center">
      <Marks :report="report" />
      <Analysis v-if="report && report.result" :report="report" />
      <v-card v-else class="body-1 py-12">
        Analysis of your test is not generated yet.
      </v-card>
    </v-col>
    <v-col v-else-if="status.loading" cols="12">
      <v-card class="ma-auto text-center">
        <v-progress-circular :class="$style.loading" :size="50" color="primary" indeterminate />
      </v-card>
    </v-col>
    <v-col v-else cols="12" align="center">
      <v-col v-show="status.error" cols="12">
        <v-card class="body-1 py-12">
          You cannot access this result.
        </v-card>
      </v-col>
    </v-col>
  </StandardLayout>
</template>

<script>
import Analysis from "@/components/common/test/Analysis"
import Marks from "@/components/common/test/Marks"
import StandardLayout from "@/layouts/StandardLayout"

export default {
  middleware: "login",
  components: {
    StandardLayout,
    Analysis,
    Marks,
  },
  props: {
    review: {
      required: false,
      default: false,
      type: Boolean,
    },
  },
  head() {
    return {
      title: this.report ? "Result - " + this.report.test.name : "Result",
      meta: [
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=yes, minimal-ui",
        },
      ],
    }
  },
  data() {
    return {
      id: parseInt(this.$route.params.id),
      reviewing: this.review,
    }
  },
  computed: {
    report() {
      return this.$store.state.results.result
    },
    status() {
      return this.$store.state.results.status
    },
  },
  created() {
    this.$store.cache.dispatch("results/get", this.id)
  },
}
</script>
<style module lang="scss">
@import "~@/styles/components";
.loading {
  margin: 60px auto;
  min-height: 200px;
  text-align: center;
}
</style>
