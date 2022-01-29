<template>
  <v-col cols="12">
    <v-dialog v-model="timeUp" max-width="400">
      <v-card>
        <v-card-title class="text-center">
          Your time is up!
        </v-card-title>
        <v-card-text>
          <v-progress-circular size="50" color="primary" indeterminate class="ma-0" />
          <br />
          <br />Submitting test...
        </v-card-text>
        <v-card-actions>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="submitDialog" max-width="400">
      <v-card>
        <v-card-title>End Test</v-card-title>
        <v-card-text>
          Are you sure you want to submit this test?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="submitDialog = false">
            Cancel
          </v-btn>
          <v-btn
            dark
            color="primary"
            :loading="submitting"
            @click="
              loader = 'loading'
              submitTest()
            "
          >
            submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      <template slot="help">
        <v-dialog v-model="helpDialog" :fullscreen="small" max-width="600">
          <v-card>
            <v-card-title>
              Help
              <v-spacer />
              <v-btn icon @click="helpDialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-subtitle>
              The questions palette displayed on the right side of screen can be used for navigating
              through questions. It will show the status of each question as per the following color
              scheme:
            </v-card-subtitle>
            <v-card-text>
              <ul>
                <li>
                  <v-btn autofocus fab dark small>
                    <span>1</span>
                  </v-btn>
                  Not Not Visited: You haven't visited the question yet
                </li>
                <li>
                  <v-btn fab dark small color="error"> <span>2</span> </v-btn>Visited Unanswered:
                  You have visited the question but not answered yet
                </li>
                <li>
                  <v-btn fab dark small color="info"> <span>3</span> </v-btn>Unanswered and Marked:
                  You haven't answered the question but marked it to review later.
                </li>
                <li>
                  <v-btn fab dark small color="green"> <span>4</span> </v-btn>Answered: You have
                  >Answered: You have answered the question
                </li>
                <li>
                  <v-btn fab dark small color="purple"> <span>5</span> </v-btn>Answered and Marked:
                  You have answered the question and marked it to review later
                </li>
              </ul>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn icon @click="helpDialog = true">
          <v-icon large class="primary--text">
            mdi-help-circle-outline
          </v-icon>
        </v-btn>
      </template>

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
        <br v-if="small" />
        <v-chip rounded class="white primary--text mb-1" style="width: 100px;">
          <v-icon color="primary">
            mdi-clock
          </v-icon>
          <strong>&nbsp; {{ time }}</strong>
        </v-chip>
        <v-btn small dark color="primary" @click="submitDialog = true">
          <span>end test</span>
        </v-btn>
      </template>

      <template slot="page-view-activator" slot-scope="{ on }">
        <v-btn icon v-on="on">
          <v-icon large class="primary--text">
            mdi-page-layout-footer
          </v-icon>
        </v-btn>
      </template>

      <template slot="timer">
        <v-chip rounded text-color="primary" color="white">
          <v-icon>mdi-clock</v-icon>
          &nbsp; {{ time }}
        </v-chip>
      </template>

      <v-row slot="page-view" align="center" justify="center" style="margin-top: -64px;">
        <v-col v-for="(question, i) in questions" :key="i" cols="12">
          <v-card class="object ma-auto">
            <v-card-title>
              Question {{ i + 1 }}

              <v-spacer />

              <v-btn
                v-if="question.type !== 3"
                color="success lighten-1"
                class="subheading"
                small
                outlined
                icon
              >
                +{{ question.correctMarks }}
              </v-btn>
              <v-btn
                v-if="[1, 3].includes(question.type)"
                color="info lighten-1"
                class="subheading"
                small
                outlined
                icon
              >
                +{{ question.partialMarks }}
              </v-btn>
              <v-btn color="error lighten-1" class="subheading" small outlined icon>
                -{{ question.incorrectMarks }}
              </v-btn>
              <v-chip color="indigo" outlined>
                {{ questionTypes[question.type].text }}
              </v-chip>
            </v-card-title>

            <v-divider />

            <v-card-text>
              <div :class="$style.question" v-html="question.text" />
              <AnswerField
                v-model="answers[i].answer"
                :question="question"
                @change="saveQuestion(i)"
              />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" class="text-center">
          <v-btn dark color="primary" @click="submitDialog = true">
            <span>end test</span>
          </v-btn>
        </v-col>
      </v-row>

      <template slot="text-image">
        <v-chip color="grey darken-2" outlined small>
          <strong>Q{{ questionIndex + 1 }}</strong>
        </v-chip>

        <v-btn
          color="info"
          rounded
          outlined
          small
          @click="
            markForReview(questionIndex)
            nextQuestion()
          "
        >
          <v-icon small>
            mdi-comment-eye-outline
          </v-icon>
          <span>review later</span>
          <v-icon small>
            mdi-chevron-right
          </v-icon>
        </v-btn>
        <template v-for="(question, i) in questions">
          <div
            v-if="questionIndex === i"
            :key="i"
            :class="$style.question"
            v-html="question.text"
          />
        </template>
      </template>

      <div slot="clear">
        <v-btn
          color="error"
          rounded
          outlined
          small
          @click="clearQuestion(questionIndex)"
          :disabled="isEmpty(currentAnswer.answer)"
        >
          <v-icon small>
            mdi-close
          </v-icon>
          <span>Clear response</span>
        </v-btn>
      </div>

      <v-row slot="options">
        <template v-for="(question, q) in questions">
          <AnswerField
            v-show="questionIndex === q"
            :key="q"
            v-model="answers[q].answer"
            :question="question"
            @change="saveQuestion(q)"
          />
        </template>
      </v-row>

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
              <v-list-item-title>
                {{ subjectLookup[section.subject] }}
              </v-list-item-title>
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

      <template slot="questions-panel">
        <span v-for="(question, i) in questions" :key="i">
          <v-btn
            v-if="question.section === sectionIndex"
            fab
            :small="!small"
            :x-small="small"
            dark
            :text="i !== questionIndex"
            :class="statusColor(response[i].status)"
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
  </v-col>
</template>

<script>
import AnswerField from "./AnswerField"
import TestLayout from "@/layouts/TestLayout"
import StandardLayout from "@/layouts/StandardLayout"

export default {
  components: {
    TestLayout,
    AnswerField,
  },
  props: ["sessionData"],
  data() {
    return {
      id: this.$route.params.id,
      error: false,
      submitting: false,
      timeUp: false,
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
      swipeActions: {
        left: () => this.nextQuestion(),
        right: () => this.previousQuestion(),
      },
      helpDialog: false,
      submitDialog: false,
      pageView: false,
      session: this.sessionData,
      subjectTopics: [],
    }
  },
  computed: {
    subjectLookup() {
      const subjects = {}
      this.subjectTopics.forEach((subject) => {
        subjects[subject.id] = subject.name
      })
      return subjects
    },
    small() {
      return ["xs", "sm"].includes(this.$mq)
    },
    test() {
      return this.session.test
    },
    time() {
      return this.session.duration
    },
    sectionIndex: {
      get() {
        return this.session.current.sectionIndex
      },
      set(value) {
        this.session.current.sectionIndex = value
      },
    },
    questionIndex: {
      get() {
        return this.session.current.questionIndex
      },
      set(value) {
        this.session.current.questionIndex = value
      },
    },
    sections() {
      return this.test.sections
    },
    questions() {
      return this.test.questions
    },
    response() {
      return this.session.response
    },
    answers() {
      return this.response
    },
    currentQuestion() {
      return this.test.questions[this.questionIndex]
    },
    currentAnswer() {
      return this.response[this.questionIndex]
    },
    currentSection() {
      return this.test.sections[this.sectionIndex]
    },
  },
  watch: {
    questionIndex(newQuestion, oldQuestion) {
      this.updateStatus(newQuestion)
    },
  },
  created() {
    this.$store.cache.dispatch("subjects/list").then((subjects) => {
      this.subjectTopics = subjects
    })

    // if(!this.session.practice && !this.test.aits){
    //   window.addEventListener('beforeunload', this.exitTest);
    //   window.addEventListener('blur', this.exitTest);
    // }
  },
  mounted() {
    setInterval(this.updateTime, 1000)
    const vm = this
    setInterval(function () {
      vm.$emit("update", vm.session)
    }, 5000)
  },
  methods: {
    getRandom(min, max) {
      return Math.random() * (max - min) + min
    },
    isEmpty(x) {
      return x === null || x === "" || (Array.isArray(x) && x.every(this.isEmpty))
    },
    statusColor(status) {
      switch (status) {
        case 0:
          return "grey darken-2"
        case 1:
          return "error"
        case 2:
          return "info"
        case 3:
          return "green"
        case 4:
          return "purple"
        default:
          return "grey"
      }
    },
    markForReview(i) {
      if (this.isEmpty(this.answers[i].answer)) this.response[i].status = 2
      else this.response[i].status = 4
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
      this.updateStatus(i)
    },
    previousQuestion() {
      this.changeQuestion(this.questionIndex - 1)
    },
    nextQuestion() {
      this.changeQuestion(this.questionIndex + 1)
    },
    clearQuestion(i) {
      if (this.validQuestionIndex(i)) {
        if (this.questions[i].type === 3) this.answers[i].answer = [[], [], [], []]
        else this.answers[i].answer = []
        this.response[i].status = 1
      }
    },
    saveQuestion(i) {
      if (this.validQuestionIndex(i) && !this.isEmpty(this.answers[i].answer))
        this.response[i].status = 3
      else this.clearQuestion(i)
    },
    updateStatus(i) {
      if (this.response) {
        if (this.validQuestionIndex(i) && this.response[i].status === 0) this.response[i].status = 1
      }
    },
    updateTime() {
      if (this.session && !this.session.completed) {
        this.response[this.questionIndex].timeElapsed += 1

        const currentTime = new Date()
        const checkinTime = new Date(Date.parse(this.session.checkinTime))
        const durationSplit = this.session.test.timeAlotted.split(":")
        if (durationSplit.length < 3) durationSplit.push("0")

        const duration =
          (parseInt(durationSplit[0] * 60 * 60) +
            parseInt(durationSplit[1] * 60) +
            parseInt(durationSplit[2])) *
          1000

        let clock = duration - (currentTime - checkinTime)
        if (clock < 0) clock = 0
        if (clock <= 1000) {
          this.timeUp = true
          this.submitTest()
        }

        const hours = Math.floor(clock / (1000 * 60 * 60))
        clock -= hours * 60 * 60 * 1000
        const minutes = Math.floor(clock / (1000 * 60))
        clock -= minutes * 60 * 1000
        const seconds = Math.floor(clock / 1000)

        this.session.duration =
          hours + ":" + ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2)
      }
    },
    exitTest() {
      this.$emit("exit")
      this.submitTest()
    },
    submitTest() {
      this.session.completed = true
      this.submitting = true
      const vm = this
      setTimeout((_) => {
        vm.$emit("update")
      }, 100)
    },
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
.card {
  width: 100%;
  min-height: 400px;
  padding: 25px auto;
}
.message {
  font-family: "Open Sans", Arial, sans-serif;
  font-size: 22pt;
  margin: 10px auto;
}
.questionText {
  font-size: 1rem;
  letter-spacing: 0.02em;
  color: #606164;
}
.option {
  font-size: 1rem;
  position: relative;
  padding-left: 30px;
  margin-bottom: 5px;
  color: #787878;
  .optionLetter {
    position: absolute;
    left: 0;
  }
}
</style>
