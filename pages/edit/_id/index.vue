<template>
  <v-overlay v-if="loading" color="transparent">
    <v-progress-circular color="primary" indeterminate size="64" />
  </v-overlay>
  <component :is="layout" v-else-if="!started || completed">
    <v-card v-if="demo && completed" :class="[$style.card, 'py-10 elevation-3']">
      <v-card-title class="title">
        {{ test.name }}
      </v-card-title>
      <v-card-text class="subheading text-left px-3">
        You have finished creating your demo test. Now you can go ahead and attempt the test you
        have created.
      </v-card-text>
      <v-row mt-4>
        <v-col cols="12">
          <v-btn text color="success" @click="attemptTest">
            Attempt the test
          </v-btn>
          <v-btn text color="info" @click="completed = false">
            Re-edit this test
          </v-btn>
          <v-btn text color="error" @click="deleteTest">
            Start afresh
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
    <v-card v-else-if="error" class="page px-5">
      <v-row justify="center" align="center">
        <v-col cols="12" :class="[$style.error, $style.message]">
          {{ error }}
        </v-col>
      </v-row>
    </v-card>
  </component>
  <client-only v-else-if="test !== null && !completed">
    <EditTest :test-data="test" @update="updateTest" @save="saveTest" />
  </client-only>
</template>

<script>
import { mapState } from "vuex"
import EditTest from "@/components/common/test/EditTest"
import Review from "@/pages/review/_id/index"
import Marks from "@/components/common/test/Marks"
import Analysis from "@/components/common/test/Analysis"
import InstituteLayout from "@/layouts/InstituteLayout"
import StandardLayout from "@/layouts/StandardLayout"
import { testTemplate } from "@/js/test"
import { demoTests } from "@/js/demoTests"

export default {
  head() {
    return {
      title: this.test ? this.test.name : "Edit Test"
    }
  },
  data() {
    return {
      demo: this.$route.query.demo,
      id: parseInt(this.$route.params.id) || 10000000000,
      test: null,
      started: false,
      loading: false,
      completed: false,
      error: null
    }
  },
  computed: {
    ...mapState({
      storedTest: (state) => state.tests.test,
      status: (state) => state.tests.status
    }),
    layout() {
      return this.$handle == "public" ? StandardLayout : InstituteLayout
    }
  },
  created() {
    this.startEdit()
  },
  methods: {
    startEdit() {
      this.loading = true
      if (!this.demo) {
        this.$store.cache.dispatch("tests/get", this.id).then(
          (test) => {
            this.test = test
            if (process.client) localStorage.setItem("editing", this.id)
            this.started = true
            this.loading = false
          },
          (error) => {
            this.error = this.status.error
          }
        )
      } else {
        const test = testTemplate
        this.test = test
        if (process.client) localStorage.setItem("editing", this.id)
        this.started = true
        this.loading = false
      }
    },
    updateTest(newTest) {
      this.test = newTest
    },
    saveTest() {
      if (this.demo) {
        this.completed = true
        if (process.client) localStorage.removeItem("editing")
      } else {
        this.$store.cache.dispatch("tests/update", this.test)
      }
    },
    attemptTest() {
      const session = demoTests.newSession(this.test)
      session.testId = this.id
      if (process.client) localStorage.setItem("session", JSON.stringify(session))
      this.$router.push(`/demo/${this.id}`)
    },
    deleteTest() {
      if (process.client) localStorage.removeItem("session")
      location.reload()
    }
  },
  components: {
    StandardLayout,
    EditTest
  }
}
</script>

<style module lang="scss">
@import "~@/sass/components";
.card {
  width: 100%;
  margin: 25px auto;
}
.loading,
.error {
  margin-top: 150px;
  min-height: 250px;
}
</style>
