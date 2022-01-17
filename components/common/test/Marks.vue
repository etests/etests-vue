<template>
  <v-card class="page">
    <v-card-title>
      {{ testName.toUpperCase() }}
      <v-spacer />
      <v-btn
        v-if="report.result && report.test.answers"
        color="primary"
        :to="{ path: 'review', query: { id: report.id, demo: demo ? 1 : undefined } }"
        target="_blank"
      >
        review &amp; solution
      </v-btn>
      <v-btn v-else disabled>
        review &amp; solution
      </v-btn>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="records"
      hide-default-footer
      :hide-default-header="$mq === 'xs'"
    />
  </v-card>
</template>

<script>
export default {
  props: {
    report: {
      required: true,
      type: Object,
    },
    demo: {
      required: false,
      default: false,
    },
  },
  data() {
    return {
      reviewing: false,
      headers: [
        {
          text: "Subject",
          align: "center",
          sortable: false,
          value: "name",
        },
        {
          text: "Marks Scored",
          value: "score",
          align: "center",
          sortable: false,
        },
        {
          text: "Maximum Marks",
          value: "maxMarks",
          align: "center",
          sortable: false,
        },
        {
          text: "Rank",
          value: "rank",
          align: "center",
          sortable: false,
        },
      ],
      subjectTopics: [],
    }
  },
  computed: {
    subjects() {
      const subjects = {}
      this.subjectTopics.forEach((subject) => {
        subjects[subject.id] = subject.name
      })
      return subjects
    },
    testName() {
      if (this.report) return this.report.test.name
      else return ""
    },
    marks() {
      if (this.report) return this.report.marks
      else return 0
    },
    noOfSections() {
      if (this.report) return this.report.marks.maxMarks.length - 1
      else return 0
    },
    sections() {
      if (this.report) return this.report.test.sections
      else return {}
    },
    sectionWiseMarks() {
      if (this.report) return this.report.marks.sectionWise
      else return {}
    },
    records() {
      const a = []
      if (this.report) {
        for (let i = 0; i < this.sections.length; i++) {
          const b = { name: "", maxMarks: 0, score: 0 }
          b.name = this.subjects[this.sections[i].subject]
          b.maxMarks = this.marks.maxMarks[i]
          b.score = this.sectionWiseMarks[i]
          b.rank = this.report.ranks ? this.report.ranks.sectionWise[i] : "-"
          a.push(b)
        }
        a.push({
          name: "Overall",
          maxMarks: this.marks.maxMarks[this.marks.maxMarks.length - 1],
          score: this.marks.total,
          rank: this.report.ranks ? this.report.ranks.overall : "-",
        })
      }
      return a
    },
  },

  created() {
    this.$store.cache.dispatch("subjects/list").then((subjects) => {
      this.subjectTopics = subjects
    })
  },
}
</script>

<style module lang="scss">
@import "~@/styles/components";
.marksTable {
  width: 98%;
  margin: auto;
  border-radius: 8px;
  border: 1px solid #eee;
  margin-bottom: 12px;
  td {
    text-align: left;
  }
}
</style>
