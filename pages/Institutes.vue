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
          <template v-if="status.loading">
            <v-col v-for="i in 3" :key="i" cols="12" sm="6" md="4" lg="auto">
              <v-skeleton-loader type="card" min-width="200" />
            </v-col>
          </template>
          <v-col
            v-for="institute in filteredInstitutes"
            :key="institute.id"
            cols="12"
            sm="6"
            md="4"
            lg="auto"
          >
            <v-hover #default="{ hover }">
              <v-card
                class="object"
                :elevation="hover ? 8 : 1"
                :min-width="['lg', 'xl'].includes($mq) ? '240px' : ''"
                :to="`/testseries?institute=${institute.id}`"
              >
                <v-img
                  :src="require('@/assets/images/bg/circle.svg')"
                  max-height="80"
                  class="hot white--text font-weight-bold"
                >
                  <v-card-title class="text-truncate">
                    {{ institute.name }}
                  </v-card-title>
                </v-img>
                <v-divider />
                <v-card-text class="text-center">
                  <v-img
                    class="mx-auto"
                    max-width="150px"
                    :src="require('@/assets/images/icons/institute.png')"
                  >
                    <template #placeholder>
                      <v-skeleton-loader type="image" min-width="200" />
                    </template>
                  </v-img>
                </v-card-text>
                <v-divider />
                <v-card-text class="text-center">
                  <span v-if="institute.city">{{ institute.city }}, {{ institute.state }}</span>
                </v-card-text>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </StandardLayout>
</template>

<script>
import { mapGetters } from "vuex"
import StandardLayout from "@/layouts/StandardLayout"
import utils from "@/js/utils"

export default {
  components: {
    StandardLayout
  },
  data() {
    return {
      batchId: 0,
      rollNumber: "",
      joiningKey: "",
      searchInstitute: "",
      filteredInstitutes: [],
      selectedTestSeries: {}
    }
  },
  watch: {
    searchInstitute(newValue, oldValue) {
      this.filteredInstitutes = this.institutes.filter((institute) =>
        institute.name.toLowerCase().includes(newValue.toLowerCase())
      )
    },
    institutes(newList, oldList) {
      if (this.filteredInstitutes.length === 0) this.filteredInstitutes = this.institutes
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
      user: "user"
    }),
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
      set() {}
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
      set() {}
    }
  },
  mounted() {},
  methods: {
    formatDate(dateString) {
      return utils.formatDate(dateString)
    },
    join() {
      const data = {
        rollNumber: this.rollNumber,
        joiningKey: this.joiningKey
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
    }
  }
}
</script>

<style module lang="scss">
@import "~@/sass/colors";
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
