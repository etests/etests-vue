<template>
  <StandardLayout>
    <v-text-field
      slot="search"
      v-model="searchExam"
      solo-inverted
      flat
      dense
      label="Search Exams"
      append-icon="mdi-magnify"
      color="black"
      class="mt-7 hidden-sm-and-down"
    />
    <v-col cols="12">
      <v-row>
        <template v-if="status.loading">
          <v-col v-for="i in 3" :key="i" cols="12" sm="6" md="4" lg="auto">
            <v-skeleton-loader type="card" min-width="200" />
          </v-col>
        </template>
        <v-col v-for="exam in filteredExams" :key="exam.id" cols="12" sm="6" md="4" lg="auto">
          <v-hover #default="{ hover }">
            <v-card
              class="object"
              :elevation="hover ? 8 : 1"
              :max-width="['lg', 'xl'].includes($mq) ? '200px' : ''"
              @click="$router.push(`/testseries?exams=${exam.id}`)"
            >
              <v-img width="200px" height="170px" class="mx-auto" :src="exam.image">
                <template #placeholder>
                  <v-skeleton-loader type="image" min-width="200" />
                </template>
              </v-img>
              <v-divider />
              <v-card-subtitle>{{ exam.name }}</v-card-subtitle>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </v-col>
  </StandardLayout>
</template>

<script>
import { mapState } from "vuex"
import StandardLayout from "@/layouts/StandardLayout"
import utils from "@/js/utils"

export default {
  components: {
    StandardLayout
  },
  data() {
    return {
      searchExam: "",
      filteredExams: [],
      selectedTestSeries: {}
    }
  },
  watch: {
    searchExam(newValue, oldValue) {
      this.filteredExams = this.exams.filter((exam) =>
        exam.name.toLowerCase().includes(newValue.toLowerCase())
      )
    },
    exams(newList, oldList) {
      if (this.filteredExams.length === 0) this.filteredExams = this.exams
    }
  },
  created() {
    this.$store.cache.dispatch("exams/list")
  },
  computed: {
    ...mapState({
      status: (state) => state.exams.status,
      examList: (state) => state.exams.items
    }),
    exams() {
      return [].concat(this.examList).sort((a, b) => {
        if (a.position < b.position) return -1
        else if (a.position > b.position) return 1
        else return 0
      })
    },
    examDialog: {
      get() {
        if (this.$route.hash)
          return this.exams.find((exam) => exam.id === this.$route.hash.replace("#", "")) || false
        else return false
      },
      set() {}
    }
  },
  mounted() {},
  methods: {
    formatDate(dateString) {
      return utils.formatDate(dateString)
    }
  }
}
</script>

<style module lang="scss">
@import "~@/sass/colors";
.dialog {
  border: 1px solid #dadce0;
  border-radius: 5px;
  font-family: "Montserrat Light", Arial, Helvetica, sans-serif;
  text-align: left;
  .title {
    font-size: 1.375rem;
    line-height: 1.75rem;
    color: #5e5766;
  }
}
</style>
