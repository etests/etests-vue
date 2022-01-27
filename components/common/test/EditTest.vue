<template>
  <TestLayout
    :sections="sections"
    :section-index="sectionIndex"
    :show-panel="panel"
    @changePanel="
      (value) => {
        this.panel = value
      }
    "
  >
    <template slot="help">
      <v-dialog v-model="helpDialog" :fullscreen="small" max-width="800">
        <v-card>
          <v-card-title>
            Help
            <v-spacer />
            <v-btn icon @click="helpDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <EditorHelp />
        </v-card>
      </v-dialog>
      <v-btn icon @click="helpDialog = true">
        <v-icon large class="primary--text">
          mdi-help-circle-outline
        </v-icon>
      </v-btn>
    </template>
    <template slot="controls">
      <v-menu offset-y transition="slide-y-transition" :close-on-content-click="false">
        <template #activator="{ on }">
          <v-btn class="mx-0" text small v-on="on">
            Test
          </v-btn>
        </template>

        <input v-show="false" ref="import" type="file" @change="importTest" />
        <v-list>
          <v-list-item @click="exportTest">
            <v-list-item-action>
              <v-list-item-title> <v-icon>mdi-export</v-icon>&nbsp; Export </v-list-item-title>
            </v-list-item-action>
          </v-list-item>
          <v-list-item @click="$refs.import.click()">
            <v-list-item-action>
              <v-list-item-title> <v-icon>mdi-import</v-icon>&nbsp; Import </v-list-item-title>
            </v-list-item-action>
          </v-list-item>

          <v-list-item @click="checkCompleteness()">
            <v-list-item-action>
              <v-list-item-title> <v-icon>mdi-content-save</v-icon>&nbsp; Save </v-list-item-title>
            </v-list-item-action>
          </v-list-item>

          <v-dialog v-model="incompleteDialog" max-width="400">
            <v-card :class="$style.dialog">
              <v-card-title :class="$style.title">
                Note
              </v-card-title>
              <v-card-text>
                You have not entered the {{ missingInfo() }} for some of your questions. Do you
                still want to continue?
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="info" text @click="incompleteDialog = false">
                  Cancel
                </v-btn>
                <v-btn
                  dark
                  color="info"
                  @click="
                    saveTest()
                    incompleteDialog = false
                  "
                >
                  Continue
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-list>
      </v-menu>

      <v-dialog v-model="newSectionDialog" max-width="400px">
        <v-card>
          <v-card-title>
            Create new section
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-row>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="newSectionSubject"
                    solo-inverted
                    flat
                    :items="subjects"
                    :readonly="false"
                    label="Subject"
                    persistent-hint
                    prepend-inner-icon="mdi-book"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" text @click="newSectionDialog = false">
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              @click="
                addSection(newSectionSubject)
                newSectionDialog = false
              "
            >
              Create
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-menu offset-y transition="slide-y-transition" :close-on-content-click="false">
        <template #activator="{ on }">
          <v-btn class="mx-0" text small v-on="on">
            Section
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="newSectionDialog = true">
            <v-list-item-action>
              <v-list-item-title> <v-icon>mdi-plus</v-icon>&nbsp; New section </v-list-item-title>
            </v-list-item-action>
          </v-list-item>

          <v-list-item @click="(_) => {}">
            <v-list-item-action>
              <v-dialog v-model="editSectionDialog" max-width="400px">
                <template #activator="{ on: { click } }">
                  <v-list-item-title @click="click">
                    <v-icon>mdi-pencil</v-icon>&nbsp; Change subject
                  </v-list-item-title>
                </template>
                <v-card :class="$style.dialog">
                  <v-card-title>
                    <span :class="$style.title">Select a subject</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container grid-list-md>
                      <v-row>
                        <v-col cols="12">
                          <v-autocomplete
                            v-model="subjectName"
                            :items="subjects"
                            :readonly="false"
                            label="Subject"
                            persistent-hint
                            prepend-icon="mdi-book"
                          />
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn color="primary" text @click="editSectionDialog = false">
                      Cancel
                    </v-btn>
                    <v-btn
                      color="primary"
                      @click="
                        changeSectionSubject(sectionIndex, subjectName)
                        editSectionDialog = false
                      "
                    >
                      Done
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-list-item-action>
            <v-list-item-content />
          </v-list-item>

          <v-list-item @click="deleteSection(sectionIndex)">
            <v-list-item-action>
              <v-list-item-title>
                <v-icon>mdi-delete</v-icon>&nbsp; Delete section
              </v-list-item-title>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-menu offset-y transition="slide-y-transition" :close-on-content-click="false">
        <template #activator="{ on }">
          <v-btn class="mx-0" text small v-on="on">
            <span v-if="$mq === 'xs'">Que</span>
            <span v-else>Question</span>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="(_) => {}">
            <v-list-item-action>
              <v-menu offset-x transition="slide-x-transition" right>
                <template #activator="{ on: { click } }">
                  <v-list-item-title @click="click">
                    <v-icon>mdi-plus</v-icon>&nbsp; New question
                  </v-list-item-title>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(type, index) in questionTypes"
                    :key="index"
                    @click="addQuestion(type.value)"
                  >
                    <v-list-item-title>{{ type.text }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-list-item-action>
            <v-list-item-content />
          </v-list-item>

          <v-list-item v-if="currentQuestion.type <= 1" @click="(_) => {}">
            <v-menu offset-x transition="slide-x-transition" right>
              <template #activator="{ on: { click } }">
                <v-list-item-title @click="click">
                  <v-icon>mdi-format-list-bulleted</v-icon>&nbsp; Number of options
                </v-list-item-title>
              </template>
              <v-list>
                <v-list-item
                  v-for="n in 5"
                  :key="n"
                  @click="
                    currentQuestion.optionCount = n + 1
                    emptyQuestion.optionCount = n + 1
                    currentAnswer.answer = []
                  "
                >
                  <v-list-item-title>{{ n + 1 }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item>

          <v-list-item @click="clearQuestion(questionIndex)">
            <v-list-item-action>
              <v-list-item-title> <v-icon>mdi-close</v-icon>&nbsp; Clear answer </v-list-item-title>
            </v-list-item-action>
          </v-list-item>

          <v-list-item @click="deleteQuestion(questionIndex)">
            <v-list-item-action>
              <v-list-item-title>
                <v-icon>mdi-delete</v-icon>&nbsp; Delete question
              </v-list-item-title>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn class="mx-0" text small @click="solutionDialog = true">
        <span v-if="$mq === 'xs'">Sol</span>
        <span v-else>Solution</span>
      </v-btn>
      <v-bottom-sheet v-model="solutionDialog">
        <template v-for="(answer, i) in answers">
          <v-sheet
            v-show="questionIndex === i"
            :key="i"
            class="pa-2"
            min-height="200px"
            max-height="400px"
            style="overflow: scroll;"
          >
            <ckeditor v-model="answer.solution" :editor="editor" :config="editorConfig" />
          </v-sheet>
        </template>
      </v-bottom-sheet>
    </template>

    <template slot="info">
      <v-col cols="auto">
        <v-menu
          v-if="currentQuestion.type !== 3"
          open-on-hover
          offset-y
          transition="slide-y-transition"
          bottom
          max-height="300"
        >
          <template #activator="{ on }">
            <v-btn class="mx-0" icon color="success" rounded outlined small v-on="on">
              <span>+{{ currentQuestion.correctMarks }}</span>
            </v-btn>
          </template>
          <v-list min-width="60">
            <v-list-item v-for="n in 100" :key="n" @click="currentQuestion.correctMarks = n">
              <v-list-item-title>{{ n }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
      <v-col v-if="[1, 3].includes(currentQuestion.type)" cols="auto">
        <v-menu open-on-hover offset-y transition="slide-y-transition" bottom max-height="300">
          <template #activator="{ on }">
            <v-btn icon color="blue" rounded outlined small v-on="on">
              <span>+{{ currentQuestion.partialMarks }}</span>
            </v-btn>
          </template>
          <v-list min-width="60">
            <v-list-item v-for="n in 101" :key="n" @click="currentQuestion.partialMarks = n - 1">
              <v-list-item-title>{{ n - 1 }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
      <v-col cols="auto">
        <v-menu open-on-hover offset-y transition="slide-y-transition" bottom max-height="300">
          <template #activator="{ on }">
            <v-btn icon color="error" rounded outlined small v-on="on">
              <span>-{{ currentQuestion.incorrectMarks }}</span>
            </v-btn>
          </template>
          <v-list style="width: 75px;">
            <v-list-item
              v-for="n in [0, 0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 1, 2, 3, 4, 5, 10, 20, 25]"
              :key="n"
              @click="currentQuestion.incorrectMarks = n"
            >
              <v-list-item-title>{{ n }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
      <v-col cols="12" md="4">
        <v-menu open-on-hover offset-y transition="slide-y-transition" bottom>
          <template #activator="{ on }">
            <v-btn color="indigo" rounded outlined style="width: 95%;" v-on="on">
              <span>{{ questionTypes[currentQuestion.type].text }} &nbsp;</span>
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(type, index) in questionTypes"
              :key="index"
              @click="
                currentQuestion.type = type.value
                clearQuestion(questionIndex)
              "
            >
              <v-list-item-title>{{ type.text }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
      <v-col cols="12" md="4">
        <v-autocomplete
          v-model="currentQuestion.topic"
          outlined
          rounded
          dense
          append-icon="mdi-chevron-down"
          color="info"
          :items="topics[currentSection.subject]"
          class="mx-2"
          placeholder="Topic"
        />
      </v-col>
    </template>

    <template slot="text-image">
      <template v-for="(question, i) in questions">
        <div v-if="questionIndex === i" :key="i" :class="$style.editor">
          <ckeditor v-model="question.text" :editor="editor" :config="editorConfig" />
        </div>
      </template>
    </template>

    <v-row slot="options">
      <template v-for="(question, q) in questions">
        <v-col v-show="questionIndex === q" :key="q" cols="12" class="ml-2">
          {{ answers }}
          <v-radio-group
            v-if="question.type === 0"
            v-model="answers[q].answer"
            :mandatory="false"
            @change="saveQuestion(q)"
          >
            <v-radio
              v-for="j in question.optionCount || 4"
              :key="q + '-' + j"
              :on-icon="`mdi-alpha-${letter('a', j - 1, true)}-circle`"
              :off-icon="`mdi-alpha-${letter('a', j - 1, true)}-circle-outline`"
              class="mb-2"
              :value="j"
            />
          </v-radio-group>

          <div v-else-if="question.type === 1" class="mt-5">
            <v-checkbox
              v-for="j in question.optionCount || 4"
              :key="q + '-' + j"
              v-model="answers[q].answer"
              :value="j - 1"
              :on-icon="`mdi-alpha-${letter('a', j - 1, true)}-circle`"
              :off-icon="`mdi-alpha-${letter('a', j - 1, true)}-circle-outline`"
              multiple
              height="0"
              class="mt-0 mb-1"
              @change="saveQuestion(q)"
            />
          </div>

          <div v-else-if="question.type === 2" class="mt-5">
            <v-text-field
              v-model="answers[q].answer"
              label="Answer (integer or decimal number)"
              type="number"
              @keyup="saveQuestion(q)"
            />
          </div>
          <div v-else-if="question.type === 3" cols="12" class="mt-5">
            <v-row>
              <v-col cols="1" class="py-0" />
              <v-col
                v-for="j in labels.answers.length"
                :key="`${q}-label-answer-${j}`"
                cols="1"
                class="py-0"
              >
                <v-checkbox
                  height="0"
                  class="mt-0 mb-1"
                  :off-icon="`mdi-alpha-${letter('p', j - 1, true)}`"
                  disabled
                />
              </v-col>
            </v-row>
            <v-row v-for="i in labels.options.length" :key="`${q}-label-option-${i}`" justify-start>
              <v-col cols="1" class="py-0">
                <v-checkbox
                  height="0"
                  class="mt-0 mb-1"
                  :off-icon="`mdi-alpha-${letter('a', i - 1, true)}-circle`"
                  disabled
                />
              </v-col>

              <v-col
                v-for="j in labels.answers.length"
                :key="`${q}-${i}-${j}`"
                cols="1"
                class="py-0"
              >
                <v-checkbox
                  v-model="answers[q].answer[i - 1]"
                  :value="j - 1"
                  off-icon="mdi-radiobox-blank"
                  on-icon="mdi-radiobox-marked"
                  multiple
                  height="0"
                  class="mt-0 mb-1"
                  @change="saveQuestion(q)"
                />
              </v-col>
            </v-row>
          </div>
        </v-col>
      </template>
    </v-row>

    <template slot="footer">
      <v-btn
        v-shortkey="['arrowleft']"
        :icon="$mq === 'xs'"
        small
        :disabled="this.questionIndex === 0"
        :outlined="this.questionIndex === 0"
        color="primary"
        @shortkey="previousQuestion()"
        @click="previousQuestion()"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-btn
        v-shortkey="['arrowright']"
        :icon="$mq === 'xs'"
        small
        :disabled="this.questionIndex === this.questions.length - 1"
        :outlined="this.questionIndex === this.questions.length - 1"
        color="primary"
        @shortkey="nextQuestion()"
        @click="nextQuestion()"
      >
        <v-icon>mdi-arrow-right</v-icon>
      </v-btn>

      <v-spacer />

      <v-menu :open-on-hover="!small" bottom offset-y :hide-on-content-click="true">
        <template #activator="{ on }">
          <v-btn text small color="primary" :max-width="small ? 100 : 'auto'" v-on="on">
            <span class="text-truncate" :style="small ? 'max-width:100px;' : ''">
              {{ subjectLookup[currentSection.subject] }}
            </span>
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
      <v-menu offset-y top transition="slide-y-transition">
        <template #activator="{ on }">
          <v-btn icon small color="primary" v-on="on">
            <v-icon small>
              mdi-pencil
            </v-icon>
          </v-btn>
        </template>
        <v-list height="200" :dense="small">
          <v-list-item
            v-for="(subject, index) in subjects"
            :key="index"
            class="white"
            @click="currentSection.subject = subject.value"
          >
            <v-list-item-title>{{ subject.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn icon small color="primary" @click="newSectionDialog = true">
        <v-icon>mdi-plus</v-icon>
      </v-btn>

      <v-spacer />

      <v-btn small :icon="small" color="primary" @click="saveTest()">
        <v-icon v-if="small">
          mdi-content-save
        </v-icon>
        <span v-else>save</span>
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
          :class="statusColor(question.status)"
          @click="
            changeQuestion(i)
            panel = !small || !panel
          "
        >
          <span>{{ i + 1 }}</span>
        </v-btn>
      </span>
      <v-btn
        fab
        text
        :small="!small"
        :x-small="small"
        class="grey lighten-3"
        @click="addQuestion(currentQuestion.type)"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
  </TestLayout>
</template>

<script>
import EditorHelp from "./EditorHelp.vue"
import utils from "@/js/utils"
import TestLayout from "@/layouts/TestLayout.vue"

let ClassicEditor
let CKEditor

if (process.client) {
  ClassicEditor = require("ckeditor5-build-advanced")
  CKEditor = require("@ckeditor/ckeditor5-vue")
} else {
  CKEditor = { component: { template: "<div></div>" } }
}

export default {
  components: {
    TestLayout,
    EditorHelp,
    ckeditor: CKEditor.component,
  },
  props: ["testData"],
  data() {
    return {
      test: this.testData,
      editor: ClassicEditor,
      editorConfig: {
        height: 400,
        ckfinder: {
          openerMethod: "popup",
          uploadUrl: `${this.$config.apiURL}/questions/images/`,
          options: {
            resourceType: "Images",
          },
          extraPlugins: ["Mathematics"],
        },
      },
      panel: null,
      questionTypes: [
        { value: 0, text: "Single Correct" },
        { value: 1, text: "Multiple Correct" },
        { value: 2, text: "Numerical" },
        { value: 3, text: "Matrix Match" },
        // { value: 4, text: "One Word Answer" },
        // { value: 5, text: "Subjective" }
      ],
      labels: {
        options: ["A", "B", "C", "D"],
        answers: ["P", "Q", "R", "S", "T"],
      },
      swipeActions: {
        left: () => this.nextQuestion(),
        right: () => this.previousQuestion(),
      },
      sectionIndex: 0,
      questionIndex: 0,
      helpDialog: false,
      editSectionDialog: false,
      newSectionDialog: false,
      incompleteDialog: false,
      solutionDialog: false,
      subjectName: "",
      newSectionSubject: "",
      emptyQuestion: {
        section: 0,
        text: "",
        type: 0,
        status: 1,
        correctMarks: 4,
        incorrectMarks: 1,
        partialMarks: 0,
        topic: null,
        optionCount: 4,
      },
      emptyAnswer: {
        answer: [],
        solution: "",
      },
      subjectTopics: [],
    }
  },
  computed: {
    small() {
      return ["xs", "sm"].includes(this.$mq)
    },
    subjects() {
      return this.subjectTopics.map((subject) => {
        return { value: subject.id, text: subject.name }
      })
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
        topics[subject.id] = subject.topics.map((topic) => {
          return { value: topic.id, text: topic.name }
        })
      })
      return topics
    },
    sections() {
      return this.test.sections
    },
    questions() {
      return this.test.questions
    },
    answers() {
      return this.test.answers
    },
    currentQuestion() {
      return this.test.questions[this.questionIndex]
    },
    currentAnswer() {
      return this.test.answers[this.questionIndex]
    },
    currentSolution() {
      return this.currentAnswer.solution
    },
    currentSection() {
      return this.test.sections[this.sectionIndex]
    },
  },
  watch: {
    questionIndex(newQuestion, oldQuestion) {
      this.updateStatus(newQuestion)
    },
    currentSolution(newSolution, oldSolution) {
      if (
        newSolution !== null &&
        oldSolution !== null &&
        newSolution.length * oldSolution.length === 0
      )
        this.updateStatus(this.questionIndex)
    },
  },
  created() {
    this.$store.cache.dispatch("subjects/list").then((subjects) => {
      this.subjectTopics = subjects
    })
  },
  mounted() {
    const vm = this
    setInterval(function () {
      vm.$emit("update", vm.test)
    }, 5000)
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
    statusColor(status) {
      switch (status) {
        case 0:
          return "grey darken-2"
        case 1:
          return "error"
        case 2:
          return "warning"
        case 3:
          return "info"
        case 4:
          return "success"
        default:
          return "grey"
      }
    },
    validQuestionIndex(i) {
      return i >= 0 && i < this.questions.length
    },
    validSectionIndex(i) {
      return i >= 0 && i < this.sections.length
    },
    changeSection(i) {
      if (this.validSectionIndex(i)) {
        this.sectionIndex = i
        if (this.currentQuestion && this.currentQuestion.section !== i)
          this.changeQuestion(this.currentSection.start)
        return true
      } else return false
    },
    previousSection() {
      return this.changeSection(this.sectionIndex - 1)
    },
    nextSection() {
      return this.changeSection(this.sectionIndex + 1)
    },
    changeQuestion(i) {
      if (this.validQuestionIndex(i)) {
        this.questionIndex = i
        if (this.currentQuestion.section !== this.sectionIndex)
          this.changeSection(this.currentQuestion.section)
        this.updateStatus(i)
        return true
      } else return false
    },
    previousQuestion() {
      return this.changeQuestion(this.questionIndex - 1)
    },
    nextQuestion() {
      return this.changeQuestion(this.questionIndex + 1)
    },
    clearQuestion(i) {
      if (this.validQuestionIndex(i)) {
        if (this.questions[i].type === 3) this.answers[i].answer = [[], [], [], []]
        else this.answers[i].answer = []
        this.updateStatus(i)
      }
    },
    saveQuestion(i) {
      if (this.validQuestionIndex(i) && !this.isEmpty(this.answers[i])) this.updateStatus(i)
      else this.clearQuestion(i)
    },
    updateStatus(i) {
      if (this.validQuestionIndex(i)) {
        if (this.isEmpty(this.currentAnswer.answer)) this.questions[i].status = 1
        else if (this.currentQuestion.topic === null) this.questions[i].status = 2
        else if (!this.currentAnswer.solution) this.questions[i].status = 3
        else this.questions[i].status = 4
      }
    },
    addQuestion(type) {
      const question = { ...this.emptyQuestion }
      question.type = type
      question.section = this.sectionIndex
      question.correctMarks = this.currentQuestion.correctMarks
      question.partialMarks = this.currentQuestion.partialMarks
      question.incorrectMarks = this.currentQuestion.incorrectMarks
      question.topic = this.currentQuestion.topic

      let answer = { ...this.emptyAnswer }
      if (type === 3) answer.answer = [[], [], [], []]

      this.currentSection.end++
      for (let j = this.sectionIndex + 1; j < this.sections.length; j++) {
        this.sections[j].start++
        this.sections[j].end++
      }
      this.questions.splice(this.currentSection.end, 0, question)
      this.answers.splice(this.currentSection.end, 0, answer)
      this.changeQuestion(this.currentSection.end)
    },
    deleteQuestion(i) {
      const index = this.questions[i].section
      const section = this.sections[index]
      if (!this.validQuestionIndex) return false
      else if (section.end > section.start) {
        section.end--
        for (let j = index + 1; j < this.sections.length; j++) {
          this.sections[j].start--
          this.sections[j].end--
        }
        this.questions.splice(i, 1)
        this.answers.splice(i, 1)
        if (!this.previousQuestion()) return this.nextQuestion()
        else return true
      } else return false
    },
    exportTest() {
      utils.downloadData(this.test)
    },
    importTest(e) {
      const id = this.testData.id
      const vm = this
      utils
        .uploadData(e)
        .then((test) => {
          test.id = id
          vm.test = test
          vm.$store.this.$toast.success(`Successfully Imported ${test.name}.`)
        })
        .catch((error) => vm.$store.this.$toast.error(error))
    },
    checkCompleteness() {
      if (this.missingInfo().length) this.incompleteDialog = true
      else this.saveTest()
    },
    saveTest() {
      this.$emit("save")
    },
    addSection(subject) {
      this.sections.push({
        start: this.questions.length,
        end: this.questions.length - 1,
        subject,
      })
      this.changeSection(this.sections.length - 1)
      this.addQuestion(0)
    },
    deleteSection(i) {
      if (this.sections.length > 1) {
        const start = this.sections[i].start
        const end = this.sections[i].end
        const len = end - start + 1

        for (let j = end + 1; j < this.questions.length; j++) {
          this.questions[j].section--
        }
        for (let j = i + 1; j < this.sections.length; j++) {
          this.sections[j].start -= len
          this.sections[j].end -= len
        }

        if (i > 0) this.changeSection(i - 1)

        this.questions.splice(start, len)
        this.answers.splice(start, len)

        if (i === 0) this.changeSection(i + 1)
        this.sections.splice(i, 1)
        return true
      } else return false
    },
    missingInfo() {
      const vm = this
      const noAnswer = this.answers.find((answer) => {
        return vm.isEmpty(answer.answer)
      })
      const noTopic = this.questions.find((question) => {
        return question.topic === null
      })
      const noSolution = this.answers.find((answer) => {
        return answer.solution.length === 0
      })
      const messages = []
      if (noAnswer) messages.push("answer")
      if (noTopic) messages.push("topic name")
      if (noSolution) messages.push("solution")
      if (messages.length === 1) return messages[0]
      else return messages.slice(0, -1).join(", ") + " and " + messages.slice(-1)[0]
    },
  },
}
</script>

<style module lang="scss">
@import "~@/styles/colors";
.questionInfo {
  border-bottom: 1px solid grey !important;
}
.questionText {
  width: 100%;
  margin-top: 5px;
  font-size: 1.3rem;
  letter-spacing: 0.02em;
  color: #606164;
}
.option {
  position: relative;
  margin-bottom: 5px;
  color: #787878;
  .optionLetter {
    position: absolute;
    left: 0;
  }
}

.editor {
  width: auto;
  max-width: min(100%, 900px);
}

.dialog {
  border-radius: 8px;
  font-family: "Open Sans", Arial, Helvetica, sans-serif;
  text-align: left;
  .title {
    font-size: 1.375rem;
    line-height: 1.75rem;
    color: #5e5766;
  }
}
</style>

<style scoped>
.v-text-field {
  padding-top: 0;
}
.v-chip {
  padding-top: 15px;
}
.v-menu__content {
  border-radius: 8px;
  font-size: 1.3rem;
  min-width: 160px;
}
</style>
