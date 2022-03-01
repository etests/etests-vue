<template>
  <client-only>
    <TestLayout
      :sections="sections"
      :section-index.sync="sectionIndex"
      :show-panel="panel"
      @changePanel="
        (value) => {
          this.panel = value
        }
      "
    >
      <template slot="controls">
        <v-btn
          v-if="currentQuestion.type !== 3"
          color="success lighten-1"
          class="subheading"
          small
          outlined
          icon
        >
          +{{ currentQuestion.correctMarks }}
        </v-btn>
        <v-btn
          v-if="[1, 3].includes(currentQuestion.type)"
          color="info lighten-1"
          class="subheading"
          small
          outlined
          icon
        >
          +{{ currentQuestion.partialMarks }}
        </v-btn>
        <v-btn color="error lighten-1" class="subheading" small outlined icon>
          -{{ currentQuestion.incorrectMarks }}
        </v-btn>
        <v-chip color="indigo" outlined>
          {{ questionTypes[currentQuestion.type].text }}
        </v-chip>
        <v-chip rounded class="white primary--text mb-1">
          <v-icon color="primary">
            mdi-clock
          </v-icon>
          <strong v-if="session"> &nbsp; {{ getMinutes(currentAnswer.timeElapsed) }} </strong>
          <strong v-else>&nbsp; Time</strong>
        </v-chip>
      </template>

      <template slot="info" />

      <template slot="text-image">
        <v-chip color="grey darken-2" class="my-4" outlined small>
          <strong>
            Q{{ questionIndex + 1 }} &nbsp;
            <span style="text-transform: uppercase;" v-if="topics">
              {{ topics[currentQuestion.topic] }}
            </span>
          </strong>
        </v-chip>
        <template v-for="(question, i) in questions">
          <div
            v-if="questionIndex === i"
            :key="i"
            :class="$style.question"
            v-html="question.text"
          />
        </template>
      </template>

      <v-row slot="options">
        <template v-for="(question, q) in questions">
          <AnswerField
            v-show="questionIndex === q"
            :key="q"
            v-model="answers[q].answer"
            :question="question"
            disabled
          />
        </template>
      </v-row>

      <v-sheet slot="review" v-if="session">
        <div :class="`${statusColor(currentResult.status)}--text subheading`" class="pt-2">
          {{ statusText(currentResult.status) }}
        </div>
        <div>Answer: {{ formatAnswer(questionIndex) }}</div>
        <div>Marks obtained: {{ currentResult.marks }}</div>
        <div class="my-2">
          <nuxt-link to @click.native="solutionDialog = true">
            See Solution
          </nuxt-link>
        </div>
        <v-bottom-sheet v-model="solutionDialog">
          <template v-for="(answer, i) in test.answers">
            <v-sheet
              v-if="questionIndex === i"
              :key="i"
              :class="$style.question"
              min-height="200px"
              max-height="400px"
              style="overflow: scroll;"
              v-html="answer.solution"
            />
          </template>
        </v-bottom-sheet>
      </v-sheet>

      <template slot="footer">
        <v-btn
          v-shortkey="['arrowleft']"
          small
          :disabled="this.questionIndex === 0"
          :outlined="this.questionIndex === 0"
          color="primary"
          @shortkey="previousQuestion()"
          @click="previousQuestion()"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <v-spacer />

        <v-menu :open-on-hover="!small" top offset-y :hide-on-content-click="true">
          <template #activator="{ on }">
            <v-btn text small color="primary" :max-width="small ? 100 : 'auto'" v-on="on">
              <span class="text-truncate" :style="small ? 'max-width:100px;' : ''">
                {{ subjectLookup[currentSection.subject] }}
              </span>
              <v-icon small>
                mdi-chevron-down
              </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(section, index) in sections"
              :key="index"
              @click="changeSection(index)"
            >
              <v-list-item-title> {{ subjectLookup[section.subject] }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-spacer />

        <v-btn
          v-shortkey="['arrowright']"
          small
          :disabled="this.questionIndex === this.questions.length - 1"
          :outlined="this.questionIndex === this.questions.length - 1"
          color="primary"
          @shortkey="nextQuestion()"
          @click="nextQuestion()"
        >
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
      </template>

      <template slot="test-name">
        {{ test.name }}
      </template>

      <template slot="questions-panel" v-if="session">
        <span v-for="(question, i) in questions" :key="i">
          <v-btn
            v-if="question.section === sectionIndex"
            fab
            :small="!small"
            :x-small="small"
            dark
            :text="i !== questionIndex"
            :class="statusColor(session.result.questionWiseMarks[i].status)"
            @click="
              changeQuestion(i)
              panel = !small || !panel
            "
          >
            <span>{{ i + 1 }}</span>
          </v-btn>
        </span>
      </template>
    </TestLayout>
  </client-only>
</template>

<script>
import { mapState } from "vuex"
import AnswerField from "@/components/common/test/AnswerField"
import TestLayout from "@/layouts/TestLayout.vue"
import { testTemplate } from "@/js/test"

export default {
  middleware: "login",
  components: {
    TestLayout,
    AnswerField,
  },
  head() {
    return {
      title: this.test ? "Review - " + this.test.name : "Review",
    }
  },
  data() {
    return {
      id: parseInt(this.$route.params.id),
      demo: !!this.$route.query.demo,
      panel: null,
      questionTypes: [
        { value: 0, text: "Single Correct" },
        { value: 1, text: "Multiple Correct" },
        { value: 2, text: "Numerical" },
        { value: 3, text: "Matrix Match" },
        { value: 4, text: "One Word Answer" },
        { value: 5, text: "Subjective" },
      ],
      labels: {
        options: ["A", "B", "C", "D"],
        answers: ["P", "Q", "R", "S", "T"],
      },
      sectionIndex: 0,
      questionIndex: 0,
      solutionDialog: false,
      subjectTopics: [],
    }
  },
  methods: {
    letter(start, index, order) {
      const small = "abcdefghijklmnopqrstuvwxyz"
      const caps = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      const size = small.length
      return order
        ? small[(small.indexOf(start) + index) % size]
        : caps[(caps.indexOf(start) + index) % size]
    },
    isEmpty(x) {
      return x === null || x === "" || (Array.isArray(x) && x.every(this.isEmpty))
    },
    statusCode(status) {
      if (Array.isArray(status)) {
        if (status.every((v) => v === 0)) return 0
        else if (status.every((v) => v === 2)) return 2
        else if (status.some((v) => v === 2)) return 3
        else return 1
      } else return status
    },
    statusColor(status) {
      switch (this.statusCode(status)) {
        case 0:
          return "grey"
        case 1:
          return "error"
        case 2:
          return "green"
        case 3:
          return "info"
        default:
          return "grey"
      }
    },
    statusText(status) {
      switch (this.statusCode(status)) {
        case 0:
          return "Unattempted"
        case 1:
          return "Incorrect"
        case 2:
          return "Correct"
        case 3:
          return "Partially Correct"
        default:
          return "Unattempted"
      }
    },
    formatAnswer(i) {
      switch (this.questions[i].type) {
        case 0:
          return this.letter("A", this.test.answers[i].answer - 1, 0)
        case 1:
          return this.test.answers[i].answer
            .map((answer) => this.letter("A", answer - 1, 0))
            .sort()
            .join(", ")
        case 2:
          return this.test.answers[i].answer
        case 3:
          return this.test.answers[i].answer
            .map(
              (option, index) =>
                "[" +
                option
                  .map((answer) => this.letter("P", answer - 1, 0))
                  .sort()
                  .join(", ") +
                "]"
            )
            .join(", ")
        default:
          return ""
      }
    },
    validQuestionIndex(i) {
      return i >= 0 && i <= this.questions.length - 1
    },
    validSectionIndex(i) {
      return i >= 0 && i <= this.sections.length - 1
    },
    changeSection(i) {
      if (this.validSectionIndex(i)) {
        this.sectionIndex = i
        if (this.currentQuestion && this.currentQuestion.section !== i)
          this.changeQuestion(this.currentSection.start)
      }
    },
    changeQuestion(i) {
      if (this.validQuestionIndex(i)) {
        this.questionIndex = i
        if (this.currentQuestion.section !== this.sectionIndex)
          this.changeSection(this.currentQuestion.section)
      }
    },
    previousQuestion() {
      this.changeQuestion(this.questionIndex - 1)
    },
    nextQuestion() {
      this.changeQuestion(this.questionIndex + 1)
    },
    getMinutes(time) {
      return Math.floor(time / 60) + "m " + (time % 60) + "s"
    },
  },
  computed: {
    ...mapState({
      status: (state) => state.results.status,
      session: (state) => state.results.result,
    }),
    small() {
      return ["xs", "sm"].includes(this.$mq)
    },
    subjects() {
      const subjects = {}
      this.subjectTopics.forEach((subject) => {
        subjects[subject.id] = subject.name
      })
      return subjects
    },
    subjectLookup() {
      const subjects = {}
      this.subjectTopics.forEach((subject) => {
        subjects[subject.id] = subject.name
      })
      return subjects
    },
    topics() {
      const topics = {}
      this.subjectTopics.forEach((subject) => {
        subject.topics.forEach((topic) => {
          topics[topic.id] = topic.name
        })
      })
      return topics
    },
    test() {
      if (this.session) return this.session.test
      else return testTemplate
    },
    time() {
      return this.session.duration
    },
    sections() {
      return this.test.sections
    },
    questions() {
      return this.test.questions
    },
    response() {
      if (this.session) return this.session.response
      else return this.test.answers
    },
    answers() {
      return this.response
    },
    currentQuestion() {
      return this.test.questions[this.questionIndex]
    },
    correctAnswer() {
      return this.test.answers[this.questionIndex]
    },
    currentAnswer() {
      return this.response[this.questionIndex]
    },
    currentSection() {
      return this.test.sections[this.sectionIndex]
    },
    currentResult() {
      if (this.session) return this.session.result.questionWiseMarks[this.questionIndex]
      else return {}
    },
  },
  created() {
    this.$store.cache.dispatch("subjects/list").then((subjects) => {
      this.subjectTopics = subjects
    })
    this.$store.cache.dispatch("results/get", this.id)
  },
}
</script>

<style module lang="scss">
.question {
  margin: 20px 0 0;
  pointer-events: none;

  img {
    width: auto;
    max-width: min(100%, 900px);
  }
}
</style>
