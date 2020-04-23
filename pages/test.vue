<template>
  <div>
    <client-only>
      <v-dialog v-model="exitDialog" persistent max-width="400">
        <v-card>
          <v-card-title>
            You tried to exit the test.
          </v-card-title>
          <v-card-text style="text-align:left">
            The test was submitted automatically.
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" text @click="exitDialog = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <Review v-if="reviewing" :report="report" :demo="demo" @close="reviewing = false" />
      <component :is="layout" v-else-if="!started || completed">
        <v-col v-if="completed && report !== null" cols="12">
          <Marks :report="report" :demo="demo" @review="reviewing = true" />
          <Analysis v-if="report && report.result" :report="report" />
          <v-card v-else :class="[$style.card, $style.message]">
            Analysis of your test is not generated yet.
          </v-card>
        </v-col>
        <v-row justify="center" align="center">
          <v-col v-if="error" cols="12">
            <v-card flat>
              <v-card-text :class="[$style.error, 'text-center']" v-html="error" />
            </v-card>
          </v-col>
          <v-overlay v-else-if="loading">
            <v-progress-circular color="primary" indeterminate size="64" />
          </v-overlay>
          <v-col v-else-if="!started" class="px-5" cols="12">
            <Instructions>
              <v-btn class="primary mx-auto" @click="startTest">
                Start Test
              </v-btn>
            </Instructions>
          </v-col>
        </v-row>
      </component>
      <template v-else-if="session !== null && !completed">
        <Test :session-data="session" @update="updateSession" @exit="exitDialog = true" />
      </template>
    </client-only>
  </div>
</template>

<script>
import { mapState } from "vuex"
import Instructions from "@/components/common/test/Instructions"
import Test from "@/components/common/test/Test"
import Review from "@/components/common/test/Review"
import Marks from "@/components/common/test/Marks"
import Analysis from "@/components/common/test/Analysis"
import InstituteLayout from "@/layouts/InstituteLayout"
import StandardLayout from "@/layouts/StandardLayout"
import { demoTests } from "@/js/demoTests"

export default {
  head() {
    return {
      title: this.session ? this.session.test.name : "Start Test",
      meta: [
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=yes, minimal-ui"
        }
      ]
    }
  },
  data() {
    return {
      demo: !!this.$route.query.demo,
      id: parseInt(this.$route.query.id),
      session: null,
      started: false,
      loading: false,
      completed: false,
      reviewing: false,
      error: null,
      report: null,
      exitDialog: false
    }
  },
  computed: {
    ...mapState({
      status: (state) => state.sessions.status
    }),
    layout() {
      return this.$handle == "public" ? StandardLayout : InstituteLayout
    }
  },
  created() {
    if (process.client) this.resumeTest()
  },
  methods: {
    resumeTest() {
      if (!this.id) {
        this.id = 0
        this.demo = true
      }
      if (process.client && localStorage.getItem("session")) {
        const session = JSON.parse(localStorage.getItem("session"))
        if (session && this.demo === session.isDemo && session.testId === this.id) {
          this.startTest()
        } else if (session && (this.demo !== session.isDemo || session.testId !== this.id))
          localStorage.removeItem("session")
      }
    },
    startTest() {
      this.loading = true
      if (!this.demo) {
        let storedSession = null
        if (localStorage.getItem("session"))
          storedSession = JSON.parse(localStorage.getItem("session"))

        this.$store.cache.dispatch("sessions/start", this.id).then(
          (session) => {
            session.testId = this.id
            session.isDemo = false
            if (storedSession !== null && storedSession.id === session.id) {
              storedSession.test = session.test
              this.session = storedSession
            } else this.session = session
            const { test, ...newSession } = session
            localStorage.setItem("session", JSON.stringify(newSession))
            this.started = true
            this.loading = false
          },
          (error) => {
            this.error = this.status.error
          }
        )

        if (this.session && !this.session.practice)
          setInterval(this.syncSession, parseInt(this.getRandom(18, 30) * 60 * 1000))
      } else {
        let session = null
        if (process.client && localStorage.getItem("session")) {
          session = JSON.parse(localStorage.getItem("session"))
        }
        if (session !== null && session.test && session.testId === this.id) {
          this.session = session
          this.started = true
        } else if (demoTests.tests.length > this.id) {
          if (session === null) session = demoTests.newSession(demoTests.tests[this.id])
          else session.test = demoTests.tests[this.id]
          session.testId = this.id
          if (process.client) localStorage.setItem("session", JSON.stringify(session))
          this.session = session
          this.started = true
        } else {
          this.error = "This test does not exist."
        }
      }
    },
    async submitTest() {
      this.loading = true
      this.completed = true
      this.$nuxt.$loading.start()
      if (this.demo && this.session.isDemo) {
        this.report = demoTests.getResult(this.session)
        if (process.client) localStorage.removeItem("session")
        this.loading = false
        this.$nuxt.$loading.finish()
      } else {
        this.$store.cache.dispatch("sessions/update", this.session).then(
          (session) => {
            this.report = session
            localStorage.removeItem("session")
            this.loading = false
            this.$nuxt.$loading.finish()
          },
          (error) => {
            this.$nuxt.$loading.fail()
          }
        )
      }
    },
    updateSession(newSession) {
      if (newSession) {
        this.session = newSession
        let { test, ...session } = newSession
        session.testId = this.id
        if (process.client) localStorage.session = JSON.stringify(session)
        if (newSession.duration <= 0 || newSession.completed) {
          this.submitTest()
        }
      }
    }
  },
  components: {
    StandardLayout,
    Instructions,
    Test,
    Review,
    Marks,
    Analysis
  }
}
</script>

<style module lang="scss">
@import "~@/sass/components";
.error {
  margin-top: 150px;
  min-height: 250px;
  font: 1.5em "Montserrat";
}
</style>
