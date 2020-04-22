<template>
  <v-app>
    <v-container fluid class="px-0">
      <v-app-bar class="white" app flat dense>
        <nuxt-link to="/annotate">
          <v-toolbar-title :class="$style.logo">
            <v-img :class="$style.img" :src="require('@/assets/logos/etests.png')" />
            <span>eTests Annotate</span>
          </v-toolbar-title>
        </nuxt-link>
        <v-spacer />
        <v-btn text rounded color="primary" to="/">
          Home
        </v-btn>
      </v-app-bar>

      <v-content>
        <v-col v-if="isNaN(selectedSubject)" cols="12">
          <v-card class="page" max-width="450">
            <v-card-title>Select a subject</v-card-title>
            <v-divider />
            <v-card-text class="mx-0 px-0">
              <v-list>
                <v-list-item-group v-model="selectedSubject" color="primary">
                  <v-list-item
                    v-for="(subject, i) in subjectChoices"
                    :key="i"
                    class="pl-5"
                    @change="$router.push(`/annotate/${i}`)"
                  >
                    <v-list-item-icon>
                      <v-icon v-text="subject.icon" />
                    </v-list-item-icon>
                    <v-list-item-content v-text="subject.text" />
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
        <v-row
          v-for="(question, i) in questions"
          v-else
          v-show="i === questionIndex"
          :key="i"
          justify="center"
          align="start"
          class="px-2"
        >
          <v-col cols="12" lg="7">
            <v-skeleton-loader v-if="status.loading" type="image" max-width="600" />
            <div v-else :class="$style.question" v-html="question.text" />

            <v-skeleton-loader v-if="status.loading" type="list-item-avatar@4" max-width="400" />
            <v-col v-else-if="isStaff && !isSmallScreen" cols="12">
              <v-radio-group
                v-if="question.type === 0"
                v-model="question.answer"
                :mandatory="false"
                disabled
              >
                <v-radio
                  v-for="j in question.optionCount || 4"
                  :key="j"
                  :on-icon="`mdi-alpha-${letter('a', j - 1, true)}-circle`"
                  :off-icon="`mdi-alpha-${letter('a', j - 1, true)}-circle-outline`"
                  class="mb-2"
                />
              </v-radio-group>

              <div v-else-if="question.type === 1" class="mt-5">
                <v-checkbox
                  v-for="j in question.optionCount || 4"
                  :key="j"
                  v-model="question.answer"
                  :value="j - 1"
                  :on-icon="`mdi-alpha-${letter('a', j - 1, true)}-circle`"
                  :off-icon="`mdi-alpha-${letter('a', j - 1, true)}-circle-outline`"
                  multiple
                  height="0"
                  class="mt-0 mb-1"
                  disabled
                />
              </div>

              <div v-else-if="question.type === 2" class="mt-5">
                <v-text-field
                  v-model="question.answer"
                  label="Answer (integer or decimal number)"
                  type="number"
                  disabled
                  @keyup="saveQuestion(q)"
                />
              </div>
              <div v-else-if="question.type === 3" cols="12" class="mt-5">
                <v-row>
                  <v-col shrink mx-3 />
                  <v-col v-for="j in labels.answers.length" :key="`label-answer-${j}`" shrink>
                    <v-checkbox
                      height="0"
                      class="mt-0 mb-1"
                      :off-icon="`mdi-alpha-${letter('p', j - 1, true)}`"
                      disabled
                    />
                  </v-col>
                </v-row>
                <v-row v-for="i in labels.options.length" :key="`label-option-${i}`">
                  <v-col shrink>
                    <v-checkbox
                      height="0"
                      class="mt-0 mb-1"
                      :off-icon="`mdi-alpha-${letter('a', i - 1, true)}-circle`"
                      disabled
                    />
                  </v-col>

                  <v-col v-for="j in labels.answers.length" :key="`${i}-${j}`" shrink>
                    <v-checkbox
                      v-model="question.answer[i - 1]"
                      :value="j - 1"
                      off-icon="mdi-radiobox-blank"
                      on-icon="mdi-radiobox-marked"
                      multiple
                      height="0"
                      class="mt-0 mb-1"
                      disabled
                    />
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-col>

          <v-col cols="12" lg="5">
            <v-row>
              <v-col cols="6">
                <v-select
                  v-if="isStaff"
                  v-model="question.type"
                  solo-inverted
                  flat
                  :items="questionTypes"
                  label="Type"
                />
              </v-col>
              <v-col cols="6">
                <v-select
                  v-if="isStaff"
                  v-model="question.difficulty"
                  solo-inverted
                  flat
                  :items="difficultyLevels"
                  label="Difficulty"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  v-model="question.subject"
                  solo-inverted
                  flat
                  append-icon="mdi-chevron-down"
                  :items="subjects"
                  persistent-hint
                  prepend-inner-icon="mdi-book-open"
                  label="Subject"
                  :disabled="!isStaff"
                />
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-model="question.topic"
                  solo-inverted
                  flat
                  append-icon="mdi-chevron-down"
                  :items="topics[question.subject]"
                  persistent-hint
                  prepend-inner-icon="mdi-file-document-box"
                  label="Topic"
                  clearable
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-content>

      <v-footer v-if="!isNaN(selectedSubject)" fixed app inset>
        <v-row class="text-center">
          <v-col cols="4">
            <v-btn
              text
              color="primary"
              :disabled="questionIndex === 0 || status.loading"
              @click="previousQuestion()"
            >
              <v-icon>mdi-chevron-left</v-icon>
              last
            </v-btn>
          </v-col>
          <v-col cols="4">
            <v-btn
              color="primary"
              :loading="status.saving"
              :disabled="status.loading"
              @click="save()"
            >
              save
            </v-btn>
          </v-col>
          <v-col cols="4">
            <v-btn text color="primary" :disabled="status.loading" @click="nextQuestion()">
              skip
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-footer>

      <v-navigation-drawer
        v-if="!isNaN(selectedSubject) && !['xs', 'sm'].includes($mq)"
        width="240"
        permanent
        app
        right
      >
        <v-sheet class="mx-auto my-1">
          <v-item-group show-arrows>
            <v-item v-for="(question, i) in questions" :key="i" class="ma-2">
              <v-btn
                :color="questionIndex === i ? 'success' : 'info'"
                :depressed="questionIndex !== i"
                fab
                small
                @click="questionIndex = i"
              >
                {{ i + 1 }}
              </v-btn>
            </v-item>
            <template v-if="status.loading">
              <v-item v-for="i in 19" :key="`loading-${i}`" class="ma-2">
                <v-btn color="grey lighten-1" depressed fab small />
              </v-item>
            </template>
          </v-item-group>
        </v-sheet>
      </v-navigation-drawer>
    </v-container>
  </v-app>
</template>

<script>
import { testTemplate } from "@/js/test"
import utils from "@/js/utils"

export default {
  middleware: "public",
  head() {
    return {
      title: !isNaN(this.selectedSubject)
        ? "Annotate - " + this.subjectChoices[this.selectedSubject].text
        : "Annotate"
    }
  },
  data() {
    return {
      drawer: false,
      selectedSubject: this.$route.query.subject,
      subjectChoices: [
        { value: 1, text: "Physics", icon: "mdi-lightbulb-on" },
        { value: 2, text: "Mathematics", icon: "mdi-math-compass" },
        { value: 3, text: "Chemistry", icon: "mdi-atom" },
        { value: 21, text: "Biology", icon: "mdi-leaf" }
      ],
      questionTypes: [
        { value: 0, text: "Single Correct" },
        { value: 1, text: "Multiple Correct" },
        { value: 2, text: "Numerical" },
        { value: 3, text: "Matrix Match" }
      ],
      difficultyLevels: [
        { value: 0, text: "Very Easy" },
        { value: 1, text: "Easy" },
        { value: 2, text: "Medium" },
        { value: 3, text: "Hard" },
        { value: 4, text: "Very Hard" }
      ],
      labels: {
        options: ["A", "B", "C", "D"],
        answers: ["P", "Q", "R", "S", "T"]
      },
      questionIndex: 0,
      emptyQuestion: {
        text:
          "<div style='text-align: center;'><strong>No questions found for annotation.</strong></div>",
        answer: [],
        solution: "",
        type: null,
        difficulty: null,
        tags: []
      },
      questions: [
        {
          text: "",
          answer: [],
          solution: "",
          type: null,
          difficulty: null,
          tags: []
        }
      ],
      selectedQuestions: [],
      subjectTopics: [],
      test: testTemplate
    }
  },
  computed: {
    isSmallScreen() {
      return ["xs", "sm"].includes(this.$mq)
    },
    status() {
      return this.$store.state.questions.status
    },
    isStaff() {
      return this.$auth.hasScope("staff")
    },
    subjects() {
      return this.subjectTopics.map((subject) => {
        return { value: subject.id, text: subject.name }
      })
    },
    topics() {
      const topics = {}
      this.subjectTopics.forEach((subject) => {
        topics[subject.id] = subject.topics.map((topic) => {
          return { value: topic.id, text: topic.name }
        })
      })
      return topics
    },
    currentQuestion() {
      return this.questions[this.questionIndex]
    }
  },
  watch: {
    $route(newValue, oldValue) {
      this.selectedSubject = newValue.query.subject
      if (this.selectedSubject) this.find()
    }
  },
  created() {
    this.$store.cache.dispatch("subjects/list").then((subjects) => {
      this.subjectTopics = subjects
      if (!isNaN(this.selectedSubject)) this.find()
    })
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
    difficultyColor(difficulty) {
      switch (difficulty) {
        case 0:
          return "indigo"
        case 1:
          return "info"
        case 2:
          return "success"
        case 3:
          return "warning"
        case 4:
          return "error"
        default:
          return "gray"
      }
    },
    validQuestionIndex(i) {
      return i >= 0 && i <= this.questions.length - 1
    },
    changeQuestion(i) {
      if (this.validQuestionIndex(i)) {
        this.questionIndex = i
        return true
      }
      return false
    },
    previousQuestion() {
      this.changeQuestion(this.questionIndex - 1)
    },
    nextQuestion() {
      if (this.questionIndex + 1 < this.questions.length)
        this.changeQuestion(this.questionIndex + 1)
      else
        this.$store
          .dispatch("questions/next", {
            subject: this.subjectChoices[this.selectedSubject].value
          })
          .then((questions) => {
            this.questions = this.questions.concat(questions)
            this.changeQuestion(this.questionIndex + 1)
          })
    },
    changeType(type) {
      this.currentQuestion.type = type
      if (type === 3) {
        this.currentQuestion.answer = [[], [], [], []]
      } else this.currentQuestion.answer = []
    },
    find() {
      this.$store
        .dispatch("questions/list", {
          subject: this.subjectChoices[this.selectedSubject].value
        })
        .then((questions) => {
          if (questions && questions.length) this.questions = questions
          else this.questions = [{ ...this.emptyQuestion }]
        })
    },
    save() {
      this.$store
        .dispatch("questions/save", {
          id: this.currentQuestion.id,
          difficulty: this.changeQuestion.difficulty,
          subject: this.changeQuestion.subject,
          topic: this.currentQuestion.topic
        })
        .then((_) => this.nextQuestion())
    }
  }
}
</script>
<style module lang="scss">
@import "~@/sass/components";
.card {
  padding: 10px 20px;
  width: 100%;
  border-radius: 8px;
  font-family: "Montserrat Light", Arial, Helvetica, sans-serif;
  text-align: left;
  margin-bottom: 12px;
}
.question {
  margin: 20px;
  pointer-events: none;

  img {
    max-width: 100%;
  }
}

p {
  font-family: "Montserrat Light", Arial, Helvetica, sans-serif;
}
.logo {
  margin-right: 10px;

  span {
    font-weight: 700;
  }
  .img {
    width: 20px;
    float: left;
    margin: 3px 5px 0;
  }
}
</style>
