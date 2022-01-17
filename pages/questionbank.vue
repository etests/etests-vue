<template>
  <v-app>
    <v-container fluid class="px-0">
      <v-dialog v-model="testDialog" max-width="600px">
        <v-card :class="$style.dialog">
          <v-card-title :class="$style.title">
            Export Test
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-text-field v-model="test.name" solo-inverted flat label="Test Name" />
              <v-text-field v-model="test.timeAlotted" solo-inverted flat label="Time Alotted" />
              <div v-for="(section, i) in test.sections" :key="i">
                <span
                  v-if="
                    subjects.length &&
                    subjects.find((subject) => subject.value === section.subject) !== undefined
                  "
                  class="body-1 primary--text font-weight-bold text-uppercase"
                >
                  {{
                    typeof section.subject === "number"
                      ? subjects.find((subject) => subject.value === section.subject).text
                      : section.subject
                  }}
                </span>
                <span class="body-1">
                  {{ section.end - section.start + 1 }} Question{{
                    section.end === section.start ? "" : "s"
                  }}
                </span>
              </div>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" text @click="testDialog = false">
              Close
            </v-btn>
            <v-btn
              color="primary"
              @click="
                exportTest()
                testDialog = false
              "
            >
              Export
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-app-bar class="white" app flat dense>
        <nuxt-link to="/">
          <v-toolbar-title :class="$style.logo">
            <v-img :class="$style.img" :src="require('@/assets/logos/etests.png')" />
            <span>eTests Question Bank</span>
          </v-toolbar-title>
        </nuxt-link>
      </v-app-bar>

      <v-main>
        <v-row justify="space-around" align="start" align-content="center" class="px-2">
          <v-col cols="12" lg="7">
            <v-skeleton-loader v-if="status.loading" type="paragraph" max-width="50%" />
            <div v-else-if="questionIndex >= 0">
              <div
                v-if="
                  subjects.length &&
                  subjects.find((subject) => subject.value === questions[questionIndex].subject) !==
                    undefined
                "
              >
                <span class="primary--text text-uppercase">
                  {{
                    subjects.find((subject) => subject.value === questions[questionIndex].subject)
                      .text
                  }}
                </span>
                <span
                  v-if="
                    questions[questionIndex].topic !== null &&
                    topics[questions[questionIndex].subject].find(
                      (topic) => topic.value === questions[questionIndex].topic
                    ) !== undefined
                  "
                >
                  {{
                    topics[questions[questionIndex].subject].find(
                      (topic) => topic.value === questions[questionIndex].topic
                    ).text
                  }}
                </span>
              </div>
              <div v-if="questions[questionIndex].type !== null">
                {{ questionTypes[questions[questionIndex].type].text }}
              </div>
              <div v-if="questions[questionIndex].difficulty !== null">
                {{ difficultyLevels[questions[questionIndex].difficulty].text }}
              </div>
            </div>
            <v-skeleton-loader v-if="status.loading" type="image" height="250" />
            <v-carousel
              v-else-if="questions && questions.length"
              v-model="questionIndex"
              :height="['xs', 'sm', 'md'].includes($mq) ? 250 : '500'"
              hide-delimiter-background
              hide-delimiters
              class="mx-auto"
            >
              <v-carousel-item v-for="(question, i) in questions" :key="i">
                <v-sheet color="white" tile>
                  <v-row align="start" justify="center" class="fill-height">
                    <v-btn
                      absolute
                      top
                      right
                      fab
                      small
                      class="mt-8"
                      :color="selectedQuestions.indexOf(i) !== -1 ? 'success' : 'grey lighten-1'"
                      :depressed="selectedQuestions.indexOf(i) === -1"
                      @click="toggleSelected(i)"
                    >
                      <v-icon size="30" v-text="'mdi-check'" />
                    </v-btn>
                    <div
                      v-ripple="{ center: true, class: 'success--text' }"
                      :class="$style.question"
                      style="cursor: pointer;"
                      @click="toggleSelected(i)"
                      v-html="question.text"
                    />
                  </v-row>
                </v-sheet>
              </v-carousel-item>
            </v-carousel>

            <v-card v-else width="600" height="300" class="mx-auto">
              <v-row
                align="center"
                justify="center"
                class="fill-height primary--text title text-uppercase"
              >
                <span v-if="status.loaded">
                  no questions found
                </span>
                <span v-else>
                  please apply filters
                </span>
              </v-row>
            </v-card>
          </v-col>
          <v-col cols="12" md="10" lg="4" class="px-5">
            <v-row>
              <v-col cols="6">
                <v-select
                  v-model="question.type"
                  outlined
                  clearable
                  :items="questionTypes"
                  label="Type"
                  @change="changeType"
                />
              </v-col>
              <v-col cols="6">
                <v-select
                  v-model="question.difficulty"
                  outlined
                  clearable
                  :items="difficultyLevels"
                  label="Difficulty"
                />
              </v-col>
            </v-row>
            <v-autocomplete
              v-model="question.subject"
              outlined
              append-icon="mdi-chevron-down"
              :items="subjects"
              persistent-hint
              prepend-inner-icon="mdi-book"
              label="Subject"
              style="max-width: 450px;"
            />
            <v-autocomplete
              v-model="question.topic"
              outlined
              append-icon="mdi-chevron-down"
              :items="topics[question.subject]"
              persistent-hint
              prepend-inner-icon="mdi-file"
              label="Topic"
              style="max-width: 450px;"
            />
            <v-combobox
              v-model="question.tags"
              solo-inverted
              flat
              chips
              clearable
              label="Tags"
              multiple
              style="max-width: 450px;"
            >
              <template #selection="{ attrs, item, select, selectedQuestions }">
                <v-chip
                  v-bind="attrs"
                  :input-value="selectedQuestions"
                  close
                  @click="select"
                  @click:close="removeTag(item)"
                >
                  <strong>{{ item }}</strong>
                </v-chip>
              </template>
            </v-combobox>
            <v-row>
              <v-col cols="6">
                <v-skeleton-loader v-if="status.loading" type="button" />
                <v-btn v-else color="primary" @click="find">
                  <v-icon>mdi-magnify</v-icon>
                  search
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-skeleton-loader v-if="status.loading" type="button" />
                <v-btn v-else color="primary" @click="testDialog = true">
                  <v-icon>mdi-download</v-icon>
                  export
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-main>
      <v-navigation-drawer
        width="250"
        permanent
        app
        right
        :mini-variant="['xs', 'sm'].includes($mq)"
        mini-variant-width="60"
        fixed
      >
        <v-sheet class="mx-auto my-1">
          <v-item-group show-arrows>
            <v-item v-for="(question, i) in questions" :key="i">
              <v-btn
                class="ma-2"
                dark
                :color="selectedQuestions.indexOf(i) !== -1 ? 'success' : 'info'"
                :depressed="questionIndex !== i"
                fab
                small
                @click="questionIndex = i"
              >
                {{ i + 1 }}
              </v-btn>
            </v-item>
            <v-item v-if="questions && questionIndex === questions.length - 1">
              <v-btn class="white ma-2" fab small @click="nextQuestion()">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-item>
            <template v-if="status.loading">
              <v-item v-for="i in 18" :key="`loading-${i}`" class="ma-2">
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
  head() {
    return {
      title: "Question Bank",
    }
  },
  middleware: "public",
  data() {
    return {
      drawer: false,
      testDialog: false,
      questionTypes: [
        { value: 0, text: "Single Correct" },
        { value: 1, text: "Multiple Correct" },
        { value: 2, text: "Numerical" },
        { value: 3, text: "Matrix Match" },
      ],
      difficultyLevels: [
        { value: 0, text: "Very Easy" },
        { value: 1, text: "Easy" },
        { value: 2, text: "Medium" },
        { value: 3, text: "Hard" },
        { value: 4, text: "Very Hard" },
      ],
      labels: {
        options: ["A", "B", "C", "D"],
        answers: ["P", "Q", "R", "S", "T"],
      },
      question: {
        text: "",
        answer: [],
        solution: "",
        type: null,
        difficulty: null,
        topic: null,
        subject: null,
        tags: [],
      },
      questions: [],
      questionIndex: -1,
      selectedQuestions: [],
      subjectTopics: [],
      test: testTemplate,
    }
  },
  computed: {
    status() {
      return this.$store.state.questions.status
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
    },
  },
  watch: {
    selectedQuestions(newValue, oldValue) {
      const questions = []
      const answers = []
      newValue.forEach((i) => {
        questions.push(this.questions[i])
      })
      questions.sort((a, b) => {
        if (a.subject < b.subject) return -1
        if (a.subject > b.subject) return 0
        return 0
      })
      questions.forEach((question, i) => {
        let { id, answer, solution, difficulty, tags, ...cleanedQuestion } = question
        cleanedQuestion = {
          status: 4,
          optionCount: 4,
          correctMarks: 4,
          partialMarks: 0,
          incorrectMarks: 1,
          topic: this.topics[cleanedQuestion.subject][cleanedQuestion.topic],
          ...cleanedQuestion,
        }
        questions[i] = cleanedQuestion
        answers.push({
          answer,
          solution,
        })
      })
      const sections = [
        {
          start: 0,
          end: 0,
          subject: 1,
        },
      ]
      let currentIndex = 0
      questions.forEach((question, i) => {
        questions[i].section = currentIndex
        if (
          (i < questions.length - 1 && question.subject !== questions[i + 1].subject) ||
          i === questions.length - 1
        ) {
          sections[currentIndex].end = i
          sections[currentIndex].subject = question.subject
          if (i !== questions.length - 1)
            sections.push({
              start: i + 1,
              end: i + 1,
              subject: 1,
            })
          delete questions[i].subject
          currentIndex++
        }
      })
      this.test.sections = sections
      this.test.questions = questions
      this.test.answers = answers
    },
  },
  created() {
    this.$store.cache.dispatch("subjects/list").then((subjects) => {
      this.subjectTopics = subjects
    })
    this.find()
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
    clear() {
      this.question.text = ""
      this.question.answer = ""
      this.question.solution = ""
    },
    changeType(type) {
      this.question.type = type
      if (type === 3) {
        this.question.answer = [[], [], [], []]
      } else this.question.answer = []
    },
    addQuestion() {
      let question = { ...this.question }
      if (this.questionIndex >= 0) {
        question = { ...this.currentQuestion }
        question.text = ""
      }
      question.answer = []
      if (question.type === 3) question.answer = [[], [], [], []]
      this.questions.push(question)
      this.questionIndex = this.questions.length - 1
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
        this.$store.cache.dispatch("questions/next").then((questions) => {
          this.questions = this.questions.concat(questions)
          this.changeQuestion(this.questionIndex + 1)
        })
    },
    toggleSelected(i) {
      if (!this.selectedQuestions.includes(i)) this.selectedQuestions.push(i)
      else this.selectedQuestions = this.selectedQuestions.filter((s) => s !== i)
      setTimeout(this.nextQuestion, 300)
    },
    removeTag(item) {
      this.question.tags.splice(this.question.tags.indexOf(item), 1)
      this.question.tags = [...this.question.tags]
    },
    save() {
      this.$store.cache.dispatch("questions/save", this.questions)
    },
    find() {
      const params = {
        type: this.question.type,
        difficulty: this.question.difficulty,
        topic: this.question.topic,
        subject: this.question.subject,
      }
      this.$store.cache.dispatch("questions/list", params).then((questions) => {
        this.questions = questions
      })
    },
    exportTest() {
      utils.downloadData(this.test)
    },
  },
}
</script>
<style module lang="scss">
@import "~@/styles/components";
.card {
  padding: 10px 20px;
  width: 100%;
  border-radius: 8px;
  font-family: "Montserrat Light", Arial, Helvetica, sans-serif;
  text-align: left;
  margin-bottom: 12px;
}
.question {
  padding: 20px 0;
  margin-top: 40px;

  img {
    max-width: 100%;
    max-height: 100%;
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
