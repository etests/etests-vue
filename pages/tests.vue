<template>
  <component :is="layout">
    <v-col cols="12">
      <v-card class="page">
        <v-skeleton-loader v-if="!testSeries" type="heading" max-width="400" class="pa-5" />
        <v-img
          v-else
          :src="require('@/assets/images/bg/circle.svg')"
          max-height="120"
          class="plume"
        >
          <v-card-text class="title pt-5 pb-0">
            <v-btn dark icon text @click="$router.go(-1)">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            {{ testSeries.name }}
            <v-spacer />
            <Payment
              v-if="buying && user && user.country === 'NP'"
              :test-series="testSeries"
              @close="paymentDialog = false"
              @submit="testSeries.status = 4"
            />
            <RazorPay
              v-else
              :dialog="buying"
              :test-series="testSeries"
              @close="paymentDialog = false"
              @submit="testSeries.status = 4"
            />
            <template v-if="testSeries.price === 0" />
            <v-btn
              v-if="!$auth.loggedIn || testSeries.status === 0"
              depressed
              hover
              color="primary"
              @click="
                if (!$auth.loggedIn) $store.commit('tabs/toggleAuthDialog', true)
                paymentDialog = true
              "
            >
              buy
            </v-btn>
            <v-btn
              v-else-if="testSeries.status === 2"
              depressed
              hover
              color="primary"
              @click="paymentDialog = true"
            >
              buy
            </v-btn>
            <v-chip v-else-if="testSeries.status !== 1" label color="grey lighten-5">
              <template v-if="testSeries.status === 3">
                <v-icon color="success" small class="mr-2 mdi-spin">
                  mdi-sync
                </v-icon>
                verifying
              </template>
              <template v-else-if="testSeries.status === 4">
                <v-icon color="success" small class="mr-2">
                  mdi-check
                </v-icon>
                purchased
              </template>
            </v-chip>
          </v-card-text>
          <v-card-subtitle class="white--text ml-12">
            {{ testSeries.institute }}
          </v-card-subtitle>
        </v-img>
        <v-divider />
        <div v-if="!testSeries">
          <v-skeleton-loader
            v-for="i in 5"
            :key="i"
            type="list-item-avatar"
            max-width="400"
            class="pb-5 px-1"
          />
        </div>
        <v-card-text v-else class="mx-0 px-0">
          <v-list>
            <v-list-item-group color="primary">
              <v-list-item
                v-for="(test, i) in testSeries.tests"
                :key="i"
                :to="$auth.loggedIn && $auth.hasScope('student') ? `/test?id=${test.id}` : ''"
                @click="
                  if (!$auth.loggedIn) {
                    $store.commit('tabs/toggleAuthDialog', true)
                    $route.query.redirect = `/test?id=${test.id}`
                  }
                "
              >
                <v-list-item-icon class="ml-4">
                  <span v-if="test.status === 0" class="grey--text">
                    <v-icon color="grey" x-small>mdi-circle</v-icon> Inactive
                  </span>
                  <span v-else-if="test.status === 1" class="warm--text">
                    <v-icon x-small>mdi-circle</v-icon> Running
                  </span>
                  <span v-else-if="test.status > 1" class="hot--text">
                    <v-icon x-small>mdi-circle</v-icon> Finished
                  </span>
                </v-list-item-icon>
                <v-list-item-content>
                  {{ test.name }}
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>
        <!-- <v-dialog v-model="syllabusDialog" max-width="400">
        <v-card :class="$style.dialog">
          <v-card-title :class="$style.title">
            Syllabus
          </v-card-title>
          <v-card-text>
            {{ this.syllabus }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="syllabusDialog = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog> -->
      </v-card>
    </v-col>
  </component>
</template>
<script>
import { mapState } from "vuex"
import RazorPay from "@/components/common/RazorPay"
import Payment from "@/components/common/Payment"
import StandardLayout from "@/layouts/StandardLayout"
import InstituteLayout from "@/layouts/InstituteLayout"
import utils from "@/js/utils"
import { testTemplate } from "@/js/test"

export default {
  components: {
    StandardLayout,
    Payment,
    RazorPay,
  },
  head() {
    return {
      title: this.testSeries ? this.testSeries.name : "Tests",
    }
  },
  data() {
    return {
      id: this.$route.query.testseries,
      testSeries: null,
      paymentDialog: false,
      syllabus: null,
      syllabusDialog: false,
    }
  },
  computed: {
    ...mapState({
      loggedIn: (state) => state.auth.loggedIn,
      user: (state) => state.auth.user,
    }),
    buying() {
      return this.$auth.loggedIn && this.paymentDialog
    },
    layout() {
      return this.$handle == "public" ? StandardLayout : InstituteLayout
    },
  },
  created() {
    this.$store.cache.dispatch("publicTestSeries/get", this.id).then(
      (testSeries) => {
        this.testSeries = testSeries
      },
      (error) => {}
    )
  },
  methods: {
    formatDate: utils.formatDate,
    showSyllabus(syllabus) {
      this.syllabus = syllabus
      this.syllabusDialog = true
    },
  },
}
</script>
