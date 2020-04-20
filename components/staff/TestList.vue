<template>
  <client-only>
    <v-card class="page">
      <v-dialog v-if="test" v-model="rankDialog" fullscreen hide-overlay>
        <v-card flat>
          <v-toolbar class="primary" dark extended flat>
            <v-spacer />
            <v-btn icon @click="rankDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-row>
            <v-card class="page" max-width="90%" style="margin-top: -64px;">
              <v-card-title v-show="status.loaded"> {{ test.name }} Ranks </v-card-title>
              <v-skeleton-loader v-show="status.loading" type="card" />
              <RankList v-show="status.loaded" :rank-list="rankList(test.id)" />
            </v-card>
          </v-row>
        </v-card>
      </v-dialog>

      <v-dialog v-if="test" v-model="deleteDialog" max-width="400">
        <v-card>
          <v-card-title>Delete {{ test.name }}</v-card-title>
          <v-card-text>
            You will not be able to restore this test if you continue.
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="error" text @click="deleteDialog = false">
              Cancel
            </v-btn>
            <v-btn color="error" @click="deleteTest(test.id)">
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <TestForm
        v-if="createTestDialog"
        :new-test="true"
        :institute-id="user.id"
        :show="createTestDialog"
        :aits="testSeries"
        @toggle="
          (value) => {
            this.createTestDialog = value
          }
        "
      />
      <TestForm
        v-if="editTestDialog"
        :show="editTestDialog"
        :test-data="test"
        :aits="testSeries"
        @toggle="
          (value) => {
            this.editTestDialog = value
          }
        "
      />
      <v-card-title>
        <v-btn v-if="testSeries" icon color="black" @click="$emit('close')">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <span v-if="testSeries">
          {{ testSeries.name }}
        </span>
        <span v-else>
          Tests
        </span>

        <template v-if="testSeries">
          <template v-if="expanded">
            <v-btn
              v-if="!testSeries.visible"
              text
              :loading="status.publishing && status.id === testSeries.id"
              @click="publishDialog = true"
            >
              Publish
            </v-btn>
            <v-chip v-else label class="grey lighten-3 mx-3">
              Published
            </v-chip>
          </template>
          <template v-else>
            <v-btn
              v-if="!testSeries.visible"
              icon
              large
              :loading="status.publishing && status.id === testSeries.id"
              @click="publishDialog = true"
            >
              <v-icon>mdi-cloud-upload</v-icon>
            </v-btn>
            <v-icon v-else color="primary" class="mx-3">
              mdi-cloud-check
            </v-icon>
          </template>
        </template>

        <v-spacer />

        <v-btn v-if="expanded" color="primary" @click="createTestDialog = true">
          new test
        </v-btn>
        <v-btn v-else icon large @click="createTestDialog = true">
          <v-icon>mdi-plus-circle-outline</v-icon>
        </v-btn>

        <v-btn
          v-if="testSeries && expanded"
          text
          color="error"
          @click="deleteTestSeriesDialog = true"
        >
          Delete
        </v-btn>
        <v-btn v-else-if="testSeries" icon large @click="deleteTestSeriesDialog = true">
          <v-icon>
            mdi-delete
          </v-icon>
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
            :search="testSearch"
            :items="tests"
            sort-by="id"
            :sort-desc="true"
            :loading="loading"
            loading-text="Loading..."
          >
            <template #item.activationTime="{ item }">
              {{ formatDate(item.activationTime, false) }}
            </template>
            <template #item.closingTime="{ item }">
              {{ formatDate(item.closingTime, false) }}
            </template>
            <template #item.status="{ item }">
              <span v-if="item.status === 0">Inactive</span>
              <span v-else-if="item.status === 1">Running</span>
              <span v-else>Finished</span>
            </template>
            <template #item.actions="{ item }">
              <v-btn
                rounded
                icon
                small
                color="warning"
                @click="
                  test = item
                  editTestDialog = true
                "
              >
                <v-icon small>
                  mdi-dns
                </v-icon>
              </v-btn>
              <v-btn rounded icon small color="info" :to="`/edit/${item.id}`" target="_blank">
                <v-icon small>
                  mdi-pencil
                </v-icon>
              </v-btn>
              <v-btn
                icon
                small
                color="error lighten-1"
                @click="
                  test = item
                  deleteDialog = true
                "
              >
                <v-icon small>
                  mdi-delete
                </v-icon>
              </v-btn>
              <v-btn v-if="item.status <= 1" icon small color="success lighten-1" disabled="">
                <v-icon small>
                  mdi-file-chart
                </v-icon>
              </v-btn>
              <v-btn
                v-else
                icon
                small
                color="success lighten-1"
                @click="
                  test = item
                  getRankList(item.id)
                  rankDialog = true
                "
              >
                <v-icon small>
                  mdi-file-chart
                </v-icon>
              </v-btn>
              <v-btn icon small color="indigo" @click="exportTest(item.id)">
                <v-icon small>
                  mdi-download
                </v-icon>
              </v-btn>
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
              :to="`/edit/${test.id}`"
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

      <v-dialog v-if="testSeries" v-model="publishDialog" max-width="400">
        <v-card>
          <v-card-title>Publish {{ testSeries.name }}?</v-card-title>
          <v-card-text>
            This will make the test series publicly visible.
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" text @click="publishDialog = false">
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              @click="
                updateTestSeries({ id: testSeries.id, visible: true })
                publishDialog = false
              "
            >
              Publish
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-if="testSeries" v-model="deleteTestSeriesDialog" max-width="400">
        <v-card>
          <v-card-title>Delete {{ testSeries.name }}?</v-card-title>
          <v-card-text>
            You will not be able to restore this test series if you continue.
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="error" text @click="deleteTestSeriesDialog = false">
              cancel
            </v-btn>
            <v-btn color="error" @click="deleteTestSeries(testSeries.id)">
              delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </client-only>
</template>
<script>
import { mapState, mapActions } from "vuex"
import utils from "@/js/utils"
import { testTemplate } from "@/js/test"
import TestForm from "@/components/institute/TestForm"
import RankList from "@/components/institute/RankList"

export default {
  props: {
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
      declareDialog: false,
      rankDialog: false,
      createTestDialog: false,
      deleteTestSeriesDialog: false,
      publishDialog: false,
      deleteDialog: false,
      editTestDialog: false,
      testSearch: "",
      testHeaders: [
        { align: "center", text: "Test Id", value: "id" },
        { align: "center", text: "Name", value: "name" },
        {
          align: "center",
          text: "Institute",
          value: "institute.name"
        },
        {
          align: "center",
          text: "Activation Time",
          value: "activationTime"
        },
        {
          align: "center",
          text: "Closing Time",
          value: "closingTime"
        },
        {
          align: "center",
          text: "Status",
          value: "status"
        },
        { align: "center", sortable: false, text: "Actions", value: "actions" }
      ]
    }
  },
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
      status: (state) => state.tests.status,
      rankLists: (state) => state.tests.rankLists
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
      updateTestSeries: "testSeries/update"
    }),
    formatDate: utils.formatDate,
    formatDuration: utils.formatDuration,
    deleteTestSeries(id) {
      this.$store.cache.dispatch("testSeries/remove", id).then((success) => {
        this.$emit("close")
      }, console.log)
    },
    deleteTest(id) {
      const { dispatch } = this.$store
      dispatch("tests/remove", id).then((this.deleteDialog = false))
    },
    getRankList(id) {
      this.$store.cache.dispatch("tests/getRankList", id)
    },
    rankList(id) {
      return this.rankLists.find((rankList) => rankList.id === id)
    },
    exportTest(testId) {
      this.$nuxt.$loading.start()
      this.$store.cache.dispatch("tests/get", testId).then(
        (test) => {
          utils.downloadData(test)
          this.$nuxt.$loading.finish()
        },
        (error) => {
          this.$nuxt.$loading.fail()
        }
      )
    }
  },
  watch: {
    declareDialog(newValue, oldValue) {
      if (!newValue) this.$store.commit("tests/clearStatus")
    },
    rankDialog(newValue, oldValue) {
      if (!newValue) this.$store.commit("tests/clearStatus")
    }
  },
  components: {
    TestForm,
    RankList
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
