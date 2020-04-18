<template>
  <div :class="$style.chartBox">
    <SectionLayout v-if="report.test.stats" heading="Comparison">
      <v-col cols="12" lg="8">
        <GChart
          :class="$style.chart"
          type="ColumnChart"
          :data="comparisonData"
          :options="chartOptions.chart"
          :resize-debounce="500"
        />
      </v-col>
    </SectionLayout>
    <SectionLayout heading="Topicwise score">
      <v-col v-for="(performanceData, i) in topicwisePerformance" :key="i" cols="12" md="6" lg="4">
        <GChart
          :class="$style.chart"
          type="ColumnChart"
          :data="performanceData"
          :options="getOptions(i)"
          :resize-debounce="500"
        />
      </v-col>
    </SectionLayout>
    <SectionLayout heading="Topicwise proportion of score">
      <v-col cols="12" class="text-left px-3 pb-3">
        Note: Topicwise proportion can be shown only for topics having a positive score.
      </v-col>
      <v-col v-for="(sectionData, i) in this.topicWiseScore" :key="i" cols="12" md="6" lg="4">
        <GChart
          v-if="isNotEmpty(sectionData)"
          :class="$style.chart"
          type="PieChart"
          :data="sectionData"
          :options="getOptions(i)"
          :resize-debounce="500"
        />
      </v-col>
    </SectionLayout>
    <SectionLayout heading="Weightage of topics">
      <v-col v-for="(sectionData, i) in this.topicWiseWeightage" :key="i" cols="12" md="6" lg="4">
        <GChart
          v-if="sectionData.length > 1"
          :class="$style.chart"
          type="PieChart"
          :data="sectionData"
          :options="getOptions(i)"
          :resize-debounce="500"
        />
      </v-col>
    </SectionLayout>
  </div>
</template>
<script src="vue-google-charts/dist/vue-google-charts.browser.js"></script>

<script>
import StandardLayout from "@/layouts/StandardLayout"
import SectionLayout from "@/layouts/SectionLayout"
import { GChart } from "vue-google-charts"

export default {
  props: ["report"],
  data() {
    return {
      id: this.$route.params.id,
      chartOptions: {
        chart: {
          legend: "none",
          tooltip: { isHtml: true }
        }
      },
      sectionWiseNegativeMarks: [],
      subjectTopics: []
    }
  },
  computed: {
    subjects() {
      let subjects = {}
      this.subjectTopics.forEach((subject) => {
        subjects[subject.id] = subject.name
      })
      return subjects
    },
    topics() {
      let topics = {}
      this.subjectTopics.forEach((subject) => {
        subject.topics.forEach((topic) => {
          topics[topic.id] = topic.name
        })
      })
      return topics
    },
    sections() {
      return this.report.test.sections
    },
    comparisonData() {
      let data = [["Section", "You", "Average", "Highest"]]
      this.report.test.sections.forEach((section, i) => {
        data.push([
          this.subjects[section.subject],
          this.report.marks.sectionWise[i],
          this.report.test.stats.average.sectionWise[i],
          this.report.test.stats.highest.sectionWise[i]
        ])
      })
      data.push([
        "Overall",
        this.report.marks.total,
        this.report.test.stats.average.overall,
        this.report.test.stats.highest.overall
      ])
      return data
    },
    topicWiseScoreBarData() {
      let data = new Array(this.report.test.sections.length)
      this.report.result.topicWiseMarks.forEach((section, i) => {
        data[i] = []
        data[i].push(["Topic", "Marks"])
        this.sectionWiseNegativeMarks.push([])
        for (let prop in section) {
          data[i].push([this.topics[prop], section[prop]])
        }
      })
      return data
    },
    topicWiseScore() {
      let data = new Array(this.report.test.sections.length)
      let questions = this.report.test.questions
      let questionWiseMarks = this.report.result.questionWiseMarks
      this.report.test.sections.forEach((section, i) => {
        data[i] = []
        data[i].push(["Topic", "Marks Scored"])
        let scored = {}
        for (let j = section.start; j <= section.end; j++) {
          let topic = questions[j].topic
          let score
          if (Array.isArray(questionWiseMarks[j].marks))
            score = questionWiseMarks[j].marks.reduce((a, b) => a + b, 0)
          else score = questionWiseMarks[j].marks
          if (scored.hasOwnProperty(topic)) scored[topic] += score
          else scored[topic] = score
        }
        for (let prop in scored) {
          data[i].push([this.topics[prop], Math.max(scored[prop], 0)])
        }
      })

      return data
    },
    topicWiseWeightage() {
      let data = new Array(this.report.test.sections.length)
      let questions = this.report.test.questions
      this.report.test.sections.forEach((section, i) => {
        data[i] = []
        data[i].push(["Topic", "Maximum Marks"])
        let weightage = {}
        for (let j = section.start; j <= section.end; j++) {
          let topic = questions[j].topic
          if (weightage.hasOwnProperty(topic)) weightage[topic] += questions[j].correctMarks
          else weightage[topic] = questions[j].correctMarks
        }
        for (let prop in weightage) {
          data[i].push([this.topics[prop], weightage[prop]])
        }
      })
      return data
    },
    topicwisePerformance() {
      let data = new Array(this.report.test.sections.length)
      for (let i = 0; i < data.length; i++) {
        data[i] = []
        data[i].push(["Topic", "Marks scored", "Maximum marks"])
        for (let j = 1; j < this.topicWiseScore[i].length; j++) {
          data[i].push([
            this.topicWiseScore[i][j][0],
            this.topicWiseScore[i][j][1],
            this.topicWiseWeightage[i][j][1]
          ])
        }
      }
      return data
    }
  },
  methods: {
    getOptions(i) {
      return {
        title: this.subjects[this.report.test.sections[i].subject],
        legend: "none"
      }
    },
    isNotEmpty(data) {
      for (let i = 1; i < data.length; i++) {
        if (data[i].length > 1 && data[i][1] > 0) return true
      }
      return false
    }
  },
  components: {
    StandardLayout,
    SectionLayout,
    GChart
  },
  created() {
    this.$store.cache.dispatch("subjects/list").then((subjects) => {
      this.subjectTopics = subjects
    })
  }
}
</script>

<style module lang="scss">
@import "~@/sass/colors";
.chartBox {
  width: 100%;
  margin: 50px auto;
}
.chart {
  width: 100%;
  height: 100%;
  min-height: 500px;
}
</style>
