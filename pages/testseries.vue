<template>
  <StandardLayout>
    <v-text-field
      slot="search"
      v-model="searchTestSeries"
      solo-inverted
      flat
      dense
      label="Search Test Series"
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
            v-for="testSeries in filteredTestSeries"
            :key="testSeries.id"
            cols="12"
            sm="6"
            md="4"
            lg="auto"
            v-show="!status.loading"
          >
            <v-card
              class="object"
              hover
              :min-width="['xs', 'sm'].includes($mq) ? '240px' : ''"
              :width="['xs', 'sm'].includes($mq) ? '' : '250px'"
              :to="`/tests?testseries=${testSeries.id}`"
              height="270px"
            >
              <v-img :src="require('@/assets/images/bg/circle.svg')" max-height="120" class="plume">
                <v-card-text class="px-4 pt-8 pb-0 title text-truncate white--text">
                  {{ testSeries.name }}
                </v-card-text>
                <v-card-subtitle class="white--text">
                  {{ testSeries.institute }}
                </v-card-subtitle>
              </v-img>
              <v-divider />
              <v-card-text>
                <v-icon small color="success">
                  mdi-check-circle
                </v-icon>
                {{ testSeries.tests.length }} test{{ testSeries.tests.length === 1 ? "" : "s" }}
                <br />
                <v-icon small color="success">
                  mdi-check-circle
                </v-icon>
                <template v-if="testSeries.exams.length">
                  <span class="text-truncate">
                    {{ testSeries.exams.join(", ").substring(0, 20) }}...
                  </span>
                </template>
              </v-card-text>
              <v-divider class="mt-2 mb-0" />
              <v-card-actions>
                <v-row v-show="false" />
                <v-chip
                  v-if="testSeries.status !== 4"
                  color="success"
                  class="success--text text-uppercase font-weight-bold"
                >
                  <template v-if="testSeries.price > 0"> rs. {{ testSeries.price }}/- </template>
                  <template v-else>
                    free
                  </template>
                </v-chip>
                <v-chip v-else label small color="success">
                  Purchased
                </v-chip>

                <v-spacer />

                <v-icon
                  v-if="
                    loggedIn &&
                    $auth.hasScope('student') &&
                    testSeries.price !== 0 &&
                    testSeries.status < 4
                  "
                  color="warning"
                >
                  mdi-lock
                </v-icon>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <v-sheet
      v-show="!status.loading && filteredTestSeries.length === 0"
      class="text-center title plume--text ma-auto pa-12"
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
  head() {
    return {
      title: "Test Series",
    }
  },
  components: {
    StandardLayout,
  },
  data() {
    return {
      searchTestSeries: "",
      selectedTestSeries: {},
    }
  },
  watch: {
    $route(to, from) {
      if (to.query !== from.query) {
        location.reload()
      }
    },
  },
  created() {
    const params = this.$route.query
    this.$store.cache.dispatch("publicTestSeries/list", params)
  },
  computed: {
    ...mapGetters({
      status: "publicTestSeries/status",
      testSeriesList: "publicTestSeries/allTestSeries",
      loggedIn: "loggedIn",
      user: "user",
    }),
    filteredTestSeries() {
      return this.testSeriesList.filter((testSeries) =>
        testSeries.name.toLowerCase().includes(this.searchTestSeries.toLowerCase())
      )
    },
  },
}
</script>

<style module lang="scss">
.card {
  text-align: center;
  border-radius: 8px;
  height: 220px;
  width: 270px;
  margin: 20px 0;
  cursor: pointer;
}
.dialog {
  border: 1px solid #dadce0;
  border-radius: 5px;
  font-family: "Montserrat Light", Roboto, Arial, sans-serif;
  text-align: left;
  .title {
    font-size: 1.375rem;
    line-height: 1.75rem;
    color: #5e5766;
  }
}
.content {
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
  text-align: left;
  font-size: 1.375rem;
  line-height: 1.75rem;
  color: #7e777e;
}
</style>
