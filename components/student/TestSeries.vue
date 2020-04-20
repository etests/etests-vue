<template>
  <client-only>
    <v-card v-if="selected === -1" class="page">
      <v-card-title>
        Test Series
        <v-spacer />

        <v-btn icon large @click="expanded = !expanded">
          <v-icon>
            <template v-if="expanded">
              mdi-arrow-collapse
            </template>
            <template v-else>
              mdi-arrow-expand
            </template>
          </v-icon>
        </v-btn>
      </v-card-title>
      <v-divider />
      <v-card-text v-if="expanded">
        <v-row justify="center" justify-sm="start" justify-lg="start">
          <template v-if="status.loading">
            <v-col v-for="i in 3" :key="i" cols="12" sm="6" md="4" lg="auto">
              <v-skeleton-loader type="card" min-width="200" />
            </v-col>
          </template>
          <v-col
            v-for="(testSeries, i) in testSeriesList"
            :key="i"
            cols="12"
            sm="6"
            md="4"
            lg="auto"
          >
            <TestSeriesCard
              :test-series="testSeries"
              @click="selectedTestSeries = testSeries"
              @select="selected = i"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text v-else class="px-0">
        <template v-if="status.loading">
          <v-skeleton-loader v-for="i in 4" :key="i" type="list-item" />
        </template>
        <v-list>
          <v-list-item-group>
            <v-list-item
              v-for="(testSeries, i) in testSeriesList.slice(0, 5)"
              :key="i"
              dense
              @click="selected = i"
            >
              <v-list-item-content>
                {{ testSeries.name }}
              </v-list-item-content>
              <v-spacer />
              <v-list-item-icon>
                <v-icon v-if="testSeries.tests.length" color="primary">
                  mdi-folder
                </v-icon>
                <v-icon v-else color="primary">
                  mdi-folder-open
                </v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card-text>
    </v-card>
    <TestList
      v-else
      :tests="testSeriesList[selected].tests"
      :loading="status.loading"
      :test-series="{
        name: testSeriesList[selected].name,
        id: testSeriesList[selected].id
      }"
      :expand="expanded"
      @close="selected = -1"
      @toggle="expanded = !expanded"
    />
  </client-only>
</template>

<script>
import TestSeriesCard from "./TestSeriesCard"
import TestList from "./TestList"
import utils from "@/js/utils"

export default {
  components: {
    TestSeriesCard,
    TestList
  },
  props: {
    expand: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selected: -1,
      pagination: {
        descending: true,
        rowsPerPage: 10
      }
    }
  },
  computed: {
    status() {
      return this.$store.state.testSeries.status
    },
    testSeriesList() {
      return this.$store.state.testSeries.items
    },
    expanded: {
      get() {
        return this.expand
      },
      set(value) {
        this.$emit("toggle")
      }
    }
  },
  created() {
    this.$store.cache.dispatch("testSeries/list")
  },
  methods: {
    formatDate(dateString) {
      return utils.formatDate(dateString)
    }
  }
}
</script>

<style module lang="scss">
.dialog {
  border: 1px solid #dadce0;
  border-radius: 5px;
  font-family: "Open Sans", Roboto, Arial, sans-serif;
  text-align: left;
  .title {
    font-size: 1.375rem;
    line-height: 1.75rem;
    color: #5e5766;
  }
  .listBox {
    margin: 10px auto 5px;
    padding: 10px;
    width: 100%;
    height: 300px;
    border: 1px solid #999;
    border-radius: 5px;
  }
}
</style>
