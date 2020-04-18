<template>
  <v-card class="page">
    <v-card-title>
      <v-btn v-if="testSeries" icon color="black" @click="$emit('close')">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <span v-if="testSeries">
        {{ testSeries.name }}
      </span>
      <span v-else>
        {{ title }}
      </span>

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
      <v-col cols="12" md="6" lg="4">
        <v-text-field
          v-model="testSearch"
          solo-inverted
          flat
          dense
          label="Search Tests"
          append-icon="mdi-magnify"
          color="black"
          class="mt-1 text-capitalize"
        />
      </v-col>
      <v-col cols="12" class="text-left">
        <v-data-table
          :headers="testHeaders"
          :items="tests"
          :search="testSearch"
          :expanded.sync="expandedRows"
          :single-expand="true"
          sort-by="activationTime"
          :sort-desc="true"
          :hide-default-header="['xs', 'sm'].includes($mq)"
          :loading="loading"
          loading-text="Loading..."
          @click:row="toggleRow"
        >
          <template #item.status="{ item }">
            <span v-if="item.status === 0">Inactive</span>
            <span v-else-if="item.status === 1">Active</span>
            <span v-else-if="item.status <= 3">Ended</span>
            <span v-else-if="item.status === 4">Ranks Declared</span>
          </template>
          <template #item.actions="">
            <v-icon>mdi-chevron-down</v-icon>
          </template>
          <template #expanded-item="{ item }">
            <td v-if="item.sessions" colspan="4">
              <v-row class="text-center">
                <v-col cols="12" md="3" offset-md="9">
                  <v-btn
                    v-if="!item.sessions.length && item.status === 1"
                    color="success"
                    @click="$router.push(`/test/${item.id}`)"
                  >
                    Start this test
                  </v-btn>
                  <v-btn disabled v-else-if="item.sessions.length && item.status === 1">
                    Attempted
                  </v-btn>
                  <v-btn
                    v-else-if="item.status > 1"
                    color="info"
                    @click="$router.push(`/test/${item.id}`)"
                  >
                    Practice Attempt
                  </v-btn>
                </v-col>
              </v-row>
              <v-row v-for="session in item.sessions" :key="session.id" class="text-md-center">
                <v-col cols="12" md="3" offset-md="3">
                  <span v-if="session.practice" class="info--text">Practice</span>
                  <span v-else class="success--text">Ranked</span>
                </v-col>
                <v-col cols="12" md="3">
                  Attempted at: {{ formatDate(session.checkinTime) }}
                </v-col>
                <v-col cols="12" md="3">
                  <v-btn
                    v-if="!session.completed"
                    icon
                    text
                    color="info"
                    @click="$router.push(`/test/${item.id}`)"
                  >
                    <v-icon>mdi-play-pause</v-icon>
                  </v-btn>
                  <v-btn
                    v-if="session.completed"
                    icon
                    text
                    color="success"
                    @click="$router.push(`/result/${session.id}`)"
                  >
                    <v-icon>mdi-file-chart</v-icon>
                  </v-btn>
                  <v-btn
                    v-if="session.completed && item.status > 1"
                    icon
                    text
                    color="warning"
                    @click="
                      $router.push({
                        path: '/result',
                        params: { id: session.id, review: true }
                      })
                    "
                  >
                    <v-icon>mdi-file-find</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </td>
          </template>
        </v-data-table>
      </v-col>
    </v-card-text>
    <v-card-text v-else class="px-0">
      <template v-if="loading">
        <v-skeleton-loader v-for="i in 4" :key="i" type="list-item" />
      </template>
      <v-list v-else>
        <v-list-item-group>
          <v-list-item
            v-for="(test, i) in tests.slice(0, 5)"
            :key="i"
            dense
            :to="`/test/${test.id}`"
            target="_blank"
          >
            <v-list-item-content>
              {{ test.name }}
            </v-list-item-content>
            <v-spacer />
            <v-list-item-icon>
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
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card-text>
  </v-card>
</template>
<script>
import { mapState } from "vuex"
import utils from "@/js/utils"

export default {
  props: {
    title: {
      type: String,
      default: "Tests"
    },
    tests: {
      type: Array,
      required: true
    },
    testSeries: {
      type: Object,
      required: false,
      default: null
    },
    expand: {
      type: Boolean,
      required: false,
      default: false
    },
    loading: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      test: {},
      testSearch: "",
      testHeaders: [
        { align: "center", text: "Test Id", value: "id" },
        { align: "center", text: "Name", value: "name" },
        {
          align: "center",
          text: "Status",
          value: "status"
        },
        { align: "center", sortable: false, text: "Actions", value: "actions" }
      ],
      expandedRows: []
    }
  },
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
      status: (state) => state.tests.status
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
    formatDate(dateString) {
      return utils.formatDate(dateString)
    },
    formatDuration(duration) {
      return utils.formatDuration(duration)
    },
    toggleRow(value) {
      const i = this.expandedRows.indexOf(value)
      if (i === -1) this.expandedRows.push(value)
      else this.expandedRows.splice(i, 1)
    }
  }
}
</script>

<style module lang="scss">
.table {
  width: 100%;
  border-radius: 8px;
  padding: 20px 0;
  td {
    font-family: "Montserrat", Arial, Helvetica, sans-serif;
  }
}
</style>
