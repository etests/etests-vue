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
        <v-col v-for="exam in filteredExams" :key="exam.id" cols="12" sm="6" md="4" lg="auto">
          <v-card
            class="object"
            hover
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
        </v-col>
      </v-row>
    </v-col>
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
      title: "Exams",
    }
  },
  data() {
    return {
      searchExam: "",
      selectedTestSeries: {},
    }
  },
  created() {
    this.$store.cache.dispatch("exams/list")
  },
  computed: {
    ...mapGetters({
      status: "exams/status",
      examList: "exams/exams",
    }),
    filteredExams() {
      return this.exams.filter((exam) =>
        exam.name.toLowerCase().includes(this.searchExam.toLowerCase())
      )
    },
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
      set() {},
    },
  },
  mounted() {},
  methods: {
    formatDate(dateString) {
      return utils.formatDate(dateString)
    },
  },
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
