<template>
  <v-app>
    <v-overlay v-if="loading" color="transparent">
      <v-progress-circular color="primary" indeterminate size="64" />
    </v-overlay>
    <InstituteLayout v-else-if="joinDialog">
      <v-col cols="12" class="mt-5">
        <v-form>
          <v-card class="object ma-auto" flat outlined max-width="600">
            <v-card-title> Join {{ institute.user.name }} </v-card-title>
            <v-divider />
            <v-card-text>
              <v-select
                v-model="batch"
                solo-inverted
                flat
                :items="
                  batches.map((batch, i) => {
                    return { text: batch.name, value: batch.id }
                  })
                "
                label="Select batch"
              />
              <v-text-field solo-inverted flat label="Roll Number" v-model="rollNumber" />
              <v-text-field solo-inverted flat label="Joining Key" v-model="joiningKey" />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" @click="join" :loading="joinLoading">Submit</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-col>
    </InstituteLayout>
    <DashboardLayout :controls="controls[$auth.user.scope[0]]" v-else-if="$auth.user" :tab="tab" />
  </v-app>
</template>

<script>
import DashboardLayout from "@/layouts/DashboardLayout.vue"
import InstituteLayout from "@/layouts/InstituteLayout.vue"
import controls from "@/js/controls"

export default {
  middleware: "login",
  components: {
    DashboardLayout,
    InstituteLayout,
  },
  head() {
    return {
      title: this.$auth.user ? this.$auth.user.name + " - Dashboard" : "Dashboard",
    }
  },
  data() {
    return {
      batch: null,
      rollNumber: "",
      joiningKey: "",
      joinLoading: false,
      loading: true,
      editing: false,
      controls: controls,
    }
  },
  methods: {
    join() {
      if (!this.joiningKey || this.joiningKey.length == 0) this.$toast.info("Enter joining key!")
      else {
        this.joinLoading = true
        this.$store
          .dispatch("enrollments/create", {
            batch: this.batch,
            rollNumber: this.rollNumber,
            joiningKey: this.joiningKey,
          })
          .then(
            (response) => {
              this.joinLoading = false
            },
            (error) => {
              this.joinLoading = false
            }
          )
      }
    },
  },
  created() {
    if (this.$handle !== "public" && this.$auth.loggedIn && this.$auth.hasScope("student")) {
      var params = { institute__handle: this.$handle }
      this.$store.cache.dispatch("batches/listSimple", params)
    }
  },
  computed: {
    tab() {
      return this.$route.query.tab
    },
    institute() {
      return this.$store.getters["institutes/institute"]
    },
    joinDialog() {
      return (
        this.$handle !== "public" &&
        this.$auth.loggedIn &&
        this.$auth.hasScope("student") &&
        (!this.$auth.user.joined || !this.$auth.user.joined.includes(this.institute.id))
      )
    },
    batches() {
      return this.$store.state.batches.items
    },
  },
  mounted() {
    if (this.$handle && this.$handle !== "public") {
      this.$store.cache.dispatch("institutes/get", this.$handle).then(
        (response) => {
          this.loading = false
        },
        (error) => {
          this.loading = false
        }
      )
    } else this.loading = false
  },
}
</script>
