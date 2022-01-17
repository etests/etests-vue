<template>
  <StandardLayout>
    <v-text-field
      slot="search"
      v-model="searchInstitute"
      solo-inverted
      flat
      dense
      label="Search Institutes"
      append-icon="mdi-magnify"
      color="black"
      class="mt-7 hidden-sm-and-down"
    />

    <v-col cols="12">
      <v-card class="transparent elevation-0">
        <v-row justify="center" justify-sm="start" justify-lg="start">
          <v-col
            v-for="i in 3"
            :key="'loader-' + i"
            cols="12"
            sm="6"
            md="4"
            lg="auto"
            v-show="status.loading"
          >
            <v-skeleton-loader type="card" min-width="200" />
          </v-col>
          <v-col
            v-for="institute in filteredInstitutes"
            :key="institute.id"
            cols="12"
            sm="6"
            md="4"
            lg="auto"
          >
            <v-card
              class="object"
              hover
              :max-width="['lg', 'xl'].includes($mq) ? '240px' : ''"
              :to="`/testseries?institute=${institute.id}`"
            >
              <v-img
                class="white--text align-end"
                :src="require('@/assets/images/bg/building.png')"
                height="120"
              />
              <v-card-text class="position-relative">
                <v-avatar size="60" color="white" class="avatar-center mt-n6">
                  <v-img :src="require('@/assets/images/avatars/1.png')"></v-img>
                </v-avatar>
                <div class="d-flex justify-space-between flex-wrap pt-4">
                  <div class="me-2 mb-2">
                    <v-card-title class="text-body-2 font-weight-bold pt-0 px-0">
                      {{ institute.name }}
                    </v-card-title>
                    <v-card-subtitle class="text-xs pa-0">
                      Institute
                    </v-card-subtitle>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <v-sheet
      v-show="!status.loading && filteredInstitutes.length === 0"
      class="text-center title chill--text ma-auto pa-12"
    >
      Oops! Nothing Found
    </v-sheet>
  </StandardLayout>
</template>

<script>
import { mapGetters } from "vuex"
import StandardLayout from "@/layouts/StandardLayout"
import utils from "@/js/utils"

export default {
  components: {
    StandardLayout,
  },
  middleware: "public",
  head() {
    return {
      title: "Institutes",
    }
  },
  data() {
    return {
      batchId: 0,
      rollNumber: "",
      joiningKey: "",
      searchInstitute: "",
      selectedTestSeries: {},
    }
  },
  created() {
    this.$store.cache.dispatch("institutes/list")
  },
  computed: {
    ...mapGetters({
      institutes: "institutes/institutes",
      status: "institutes/status",
      batchStatus: "batches/sttus",
      loggedIn: "loggedIn",
      user: "user",
    }),
    filteredInstitutes() {
      return this.institutes.filter((institute) =>
        institute.name.toLowerCase().includes(this.searchInstitute.toLowerCase())
      )
    },
    instituteDialog: {
      get() {
        if (this.$route.hash)
          return (
            this.institutes.find(
              (institute) => institute.id === this.$route.hash.replace("#institute-", "")
            ) || false
          )
        else return false
      },
      set() {},
    },
    joinDialog: {
      get() {
        if (this.$route.hash)
          return (
            this.institutes.find(
              (institute) => institute.id === this.$route.hash.replace("#join-", "")
            ) || false
          )
        else return false
      },
      set() {},
    },
  },
  mounted() {},
  methods: {
    formatDate(dateString) {
      return utils.formatDate(dateString)
    },
    join() {
      const data = {
        rollNumber: this.rollNumber,
        joiningKey: this.joiningKey,
      }
      this.$store.cache.dispatch("batches/join", { id: this.batchId, data })
    },
    showJoinOption(id) {
      if (
        this.loggedIn &&
        this.user &&
        this.user.details &&
        this.user.details.institutes &&
        !this.user.details.institutes.includes(id)
      )
        return true
      else return false
    },
  },
}
</script>

<style module lang="scss">
@import "~@/styles/colors";
.dialog {
  border: 1px solid #dadce0;
  border-radius: 5px;
  font-family: "Montserrat", Arial, Helvetica, sans-serif;
  text-align: left;
  .title {
    font-size: 1.375rem;
    line-height: 1.75rem;
    color: #5e5766;
  }
}
.card {
  text-align: center;
  border-radius: 8px;
  height: 220px;
  width: 250px;
  margin: 5px 0;
}
.content {
  font-family: "Montserrat", Arial, Helvetica, sans-serif;
  font-weight: 600;
  padding: 20px;
  min-height: 160px;
  background-color: #fafafa;
  border-radius: 8px 8px 0 0;
  text-align: left;
  &:hover {
    background-color: #f5f5f5;
  }
}
.title {
  font-family: "Open Sans", Arial, Helvetica, sans-serif;
  font-weight: 700;
  text-align: left;
  font-size: 1.375rem;
  line-height: 1.75rem;
  color: #7e777e;
}
.about {
  text-align: justify;
  font-family: "Montserrat", Arial, Helvetica, sans-serif;
  font-weight: 400;
  font-size: 9pt;
  min-height: 125px;
}
</style>
