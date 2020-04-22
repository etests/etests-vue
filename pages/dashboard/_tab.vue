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
              <v-text-field solo-inverted flat label="Enter Joining Key" v-model="joiningKey" />
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

export default {
  middleware: "login",
  components: {
    DashboardLayout,
    InstituteLayout
  },
  head() {
    return {
      title: this.$auth.user ? this.$auth.user.name + " - Dashboard" : "Dashboard"
    }
  },
  data() {
    return {
      joiningKey: "",
      joinLoading: false,
      loading: true,
      editing: false,
      controls: {
        institute: [
          {
            name: "Tests",
            color: "hot",
            icon: "mdi-file-document",
            cards: [
              {
                component: () => import("@/components/institute/Tests"),
                cols: {
                  sm: 12,
                  md: 8
                }
              }
            ]
          },
          {
            name: "Test Series",
            color: "cool",
            icon: "mdi-book-minus",
            cards: [
              {
                component: () => import("@/components/institute/TestSeries"),
                cols: {
                  sm: 12,
                  md: 8
                }
              }
            ]
          },
          {
            name: "Students",
            color: "warm",
            icon: "mdi-account-multiple",
            cards: [
              {
                component: () => import("@/components/institute/Students"),
                cols: {
                  sm: 12,
                  md: 8
                }
              }
            ]
          },
          {
            name: "Transactions",
            color: "chill",
            icon: "mdi-currency-inr",
            cards: [
              {
                component: () => import("@/components/institute/Transactions"),
                cols: {
                  sm: 12,
                  md: 12
                }
              }
            ]
          },
          {
            name: "Profile",
            color: "plume",
            icon: "mdi-account-circle",
            cards: [
              {
                component: () => import("@/components/institute/Profile"),
                cols: {
                  sm: 12,
                  md: 12
                }
              },
              {
                component: () => import("@/components/common/ChangePassword"),
                cols: {
                  sm: 12,
                  md: 4
                }
              }
            ]
          }
        ],

        student: [
          {
            name: "Tests",
            color: "cool",
            icon: "mdi-file-document",
            cards: [
              {
                component: () => import("@/components/student/Tests"),
                cols: {
                  sm: 12,
                  md: 8
                }
              }
            ]
          },
          {
            name: "Free Tests",
            color: "chill",
            icon: "mdi-currency-usd-off",
            cards: [
              {
                component: () => import("@/components/student/FreeTests"),
                cols: {
                  sm: 12,
                  md: 8
                }
              }
            ]
          },
          {
            name: "My Test Series",
            color: "hot",
            icon: "mdi-book-minus",
            cards: [
              {
                component: () => import("@/components/student/TestSeries"),
                cols: {
                  sm: 12,
                  md: 8
                }
              }
            ]
          },
          {
            name: "Report",
            color: "warm",
            icon: "mdi-chart-line",
            cards: [
              {
                component: () => import("@/components/student/Report"),
                cols: {
                  sm: 12,
                  md: 12
                }
              }
            ]
          },
          {
            name: "Profile",
            color: "plume",
            icon: "mdi-account-circle",
            cards: [
              {
                component: () => import("@/components/student/Profile"),
                cols: {
                  sm: 12,
                  md: 12
                }
              },
              {
                component: () => import("@/components/common/ChangePassword"),
                cols: {
                  sm: 12,
                  md: 6
                }
              }
            ]
          }
        ],

        staff: [
          {
            name: "Tests",
            icon: "mdi-file-document",
            color: "hot",
            cards: [
              {
                component: () => import("@/components/staff/Tests"),
                cols: {
                  sm: 12,
                  md: 8
                }
              }
            ]
          },
          {
            name: "Question Bank",
            icon: "mdi-book-multiple",
            color: "chill",
            link: { path: "/questionbank" },
            cards: []
          },
          {
            name: "Annotate",
            icon: "mdi-pencil-box-outline",
            color: "warm",
            link: { path: "/annotate" },
            cards: []
          },

          {
            name: "Profile",
            color: "plume",
            icon: "mdi-account-circle",
            cards: [
              {
                component: () => import("@/components/staff/Profile"),
                cols: {
                  sm: 12,
                  md: 12
                }
              },
              {
                component: () => import("@/components/common/ChangePassword"),
                cols: {
                  sm: 12,
                  md: 4
                }
              }
            ]
          }
        ]
      }
    }
  },
  methods: {
    join() {
      if (!this.joiningKey || this.joiningKey.length == 0) this.$toast.info("Enter joining key!")
      else {
        this.joinLoading = true
        this.$store
          .dispatch("institutes/join", {
            id: this.institute.id,
            joiningKey: this.joiningKey
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
    }
  },
  computed: {
    tab() {
      return this.$route.params.tab
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
    }
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
  }
}
</script>
