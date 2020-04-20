<template>
  <client-only>
    <v-card v-if="selected === -1" class="page">
      <v-card-title>
        Test Series
        <v-spacer />
        <v-btn v-if="expanded" color="primary" @click="newTestSeriesDialog = true">
          new test series
        </v-btn>
        <v-btn v-else icon large @click="newTestSeriesDialog = true">
          <v-icon>mdi-plus-circle-outline</v-icon>
        </v-btn>

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
        <v-list v-else>
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
      <v-dialog v-model="newTestSeriesDialog" max-width="400">
        <v-card class="page">
          <v-card-title>
            New Test Series
            <v-spacer />

            <v-btn icon @click="newTestSeriesDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider class="mb-5" />
          <v-card-text>
            <v-text-field
              v-model="newTestSeries.name"
              prepend-inner-icon="mdi-folder-plus"
              solo-inverted
              flat
              label="Test Series Name"
            />
            <v-text-field
              v-model="newTestSeries.price"
              prepend-inner-icon="mdi-currency-inr"
              solo-inverted
              flat
              label="Price"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" text @click="newTestSeriesDialog = false">
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              @click="
                create(newTestSeries)
                newTestSeriesDialog = false
              "
            >
              create
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
    <TestList
      v-else
      :tests="testSeriesList[selected].tests"
      :test-series="{
        name: testSeriesList[selected].name,
        id: testSeriesList[selected].id,
        price: testSeriesList[selected].price,
        visible: testSeriesList[selected].visible
      }"
      :expand="expanded"
      @close="selected = -1"
      @toggle="expanded = !expanded"
    />
  </client-only>
</template>

<script>
import { mapState, mapActions } from "vuex"
import TestList from "./TestList"

import TestSeriesCard from "./TestSeriesCard"

export default {
  props: {
    expand: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selected: -1,
      newTestSeries: {
        name: "",
        price: null
      },
      newTestSeriesDialog: false
    }
  },
  created() {
    this.$store.cache.dispatch("testSeries/list")
  },
  computed: {
    ...mapState({
      testSeriesList: (state) => state.testSeries.items,
      status: (state) => state.testSeries.status
    }),
    expanded: {
      get() {
        return this.expand
      },
      set(value) {
        this.$emit("toggle")
      }
    }
  },
  methods: {
    ...mapActions({
      create: "testSeries/create",
      update: "testSeries/update"
    })
  },
  components: {
    TestSeriesCard,
    TestList
  }
}
</script>
