<template>
  <v-dialog v-model="dialog" :fullscreen="['xs', 'sm'].includes($mq)" max-width="600">
    <v-card tile>
      <v-toolbar flat color="white">
        <v-toolbar-title>
          <span v-if="newTest">Create new test</span>
          <span v-else>Update {{ test.name }}</span>
        </v-toolbar-title>
        <v-spacer />
        <v-btn text icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <template v-if="status.updating">
        <v-card-text>Updating {{ test.name }}...</v-card-text>
      </template>
      <template v-else-if="status.updated">
        <v-card-text>{{ test.name }} successfully updated!</v-card-text>
      </template>
      <template v-else-if="status.creating">
        <v-card-text>Creating new test...</v-card-text>
      </template>
      <template v-else-if="status.created">
        <v-card-text>
          {{ status.test.name }} is successfully created.
          <br />
          <br />
          <ol>
            <li>
              You can start adding questions in
              <nuxt-link :to="`/test/${status.test.id}/edit`"> Test Editor </nuxt-link>or
            </li>
            <li>
              <a href="https://forms.gle/qvqtmpXo38xqWpq29" target="_blank"
                >Fill this Google form</a
              >
              with the following details and we will add the questions:
              <br />
              Institute Id: {{ instituteId }}
              <br />
              Test Id: {{ status.test.id }}
            </li>
          </ol>
        </v-card-text>
      </template>
      <template v-else>
        <v-card-subtitle v-if="newTest">
          Enter the following details
        </v-card-subtitle>
        <v-card-text>
          <v-text-field v-model="test.name" solo-inverted flat label="Name" />
          <DateField v-model="test.activationDate" label="Activation Date" />
          <TimeField v-model="test.activationTime" label="Activation Time" />
          <DateField v-model="test.closingDate" label="Closing Date" />
          <TimeField v-model="test.closingTime" label="Closing Time" />
          <v-text-field
            v-model="test.duration"
            solo-inverted
            flat
            label="Duration"
            placeholder="_ _ : _ _ : _ _"
            mask="##:##:##"
          />
          <v-select
            v-model="test.exam"
            outlined
            :items="
              exams.map((exam) => {
                return { text: exam.name, value: exam.id }
              })
            "
            label="Exam pattern"
          />
          <v-switch
            v-if="aits !== null"
            v-model="test.free"
            :disabled="aits.price === 0"
            :value="aits.price === 0"
            label="Make this test free"
          />
          <v-textarea
            v-model="test.syllabus"
            solo-inverted
            flat
            placeholder="Write syllabus for this test"
          />
        </v-card-text>
      </template>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          text
          @click="
            dialog = false
            $store.commit('tests/clearStatus')
          "
        >
          close
        </v-btn>
        <v-btn
          v-if="newTest && !status.creating && !status.created"
          color="primary"
          @click="create()"
        >
          Create
        </v-btn>
        <v-btn
          v-if="!newTest && !status.updating && !status.updated"
          color="primary"
          @click="update()"
        >
          Update
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex"
import DateField from "@/components/common/DateField"
import TimeField from "@/components/common/TimeField"
import { testTemplate } from "@/js/test"
import utils from "@/js/utils"

export default {
  props: {
    instituteId: {
      required: false,
      type: Number
    },
    testData: {
      required: false,
      default() {
        return {
          name: "New Test",
          activationDate: utils.getDateAfterDays(2),
          activationTime: "16:00",
          closingDate: utils.getDateAfterDays(7),
          closingTime: "16:00",
          duration: "03:00:00",
          exam: null,
          free: false,
          syllabus: null
        }
      },
      type: Object
    },
    newTest: {
      required: false,
      default: false,
      type: Boolean
    },
    aits: {
      required: false,
      default: null,
      type: Object
    },
    show: {
      required: false,
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      dateMenu: false,
      timeMenu: false,
      test: this.newTest ? this.testData : this.getFormattedTest(this.testData)
    }
  },
  watch: {
    exams(newValue, oldValue) {
      if (newValue !== null && newValue.length) {
        const index = newValue.findIndex((exam) => exam.name === this.testData.exam)
        if (index !== -1) {
          this.test.exam = newValue[index].id
        }
      }
    }
  },
  created() {
    this.$store.cache.dispatch("exams/list")
  },
  computed: {
    ...mapState({
      status: (state) => state.tests.status,
      exams: (state) => state.exams.items
    }),
    dialog: {
      get() {
        return this.show
      },
      set(value) {
        this.$emit("toggle", value)
      }
    }
  },
  methods: {
    formatDuration(duration) {
      return utils.formatDuration(duration)
    },
    validateTestData() {
      let error = null
      if (!this.test.name) error = "Enter test name"
      else if (!this.test.activationDate || !this.test.activationTime)
        error = "Enter activation date and time"
      else if (new Date(this.test.activationDate + " " + this.test.activationTime) <= new Date())
        error = "Test time should be in future."
      else if (!this.test.closingDate || !this.test.closingTime)
        error = "Enter closing date and time"
      else if (
        new Date(this.test.closingDate + " " + this.test.closingTime) <=
        new Date(this.test.activationDate + " " + this.test.activationTime)
      )
        error = "Activation date/time must be earlier than the closing date/time"
      else if (!this.formatDuration(this.test.duration)) error = "Enter duration in correct format"
      else if (
        new Date(this.test.closingDate + " " + this.test.closingTime) -
          new Date(this.test.activationDate + " " + this.test.activationTime) <
        utils.durationToMilliseconds(this.test.duration)
      )
        error =
          "The gap between activation time and closing time must be greater than or equal to the duration"
      if (error) {
        this.$toast.info(error)
        return false
      } else return true
    },
    getFormattedTest(test) {
      return {
        id: test.id,
        name: test.name,
        activationDate: test.activationTime.split("T")[0],
        activationTime: test.activationTime.split("T")[1].split("+")[0],
        closingDate: test.closingTime.split("T")[0],
        closingTime: test.closingTime.split("T")[1].split("+")[0],
        duration: test.timeAlotted,
        free: test.free,
        syllabus: test.syllabus
      }
    },
    getTestInSubmitFormat(test) {
      return {
        name: test.name,
        activationTime: test.activationDate + " " + test.activationTime,
        closingTime: test.closingDate + " " + test.closingTime,
        timeAlotted: this.formatDuration(test.duration),
        exam: test.exam,
        syllabus: test.syllabus
      }
    },
    create() {
      if (this.validateTestData()) {
        const data = {
          ...this.getTestInSubmitFormat(this.test),
          questions: testTemplate.questions,
          answers: testTemplate.answers,
          sections: testTemplate.sections,
          free: this.test.free
        }
        if (this.aits !== null) {
          data.aits = true
          data.testSeries = [this.aits.id]
          data.free = data.free || this.aits.price === 0
        }
        this.$store.cache.dispatch("tests/create", data)
      }
    },
    update() {
      const data = {
        id: this.test.id,
        ...this.getTestInSubmitFormat(this.test),
        free: this.test.free
      }
      if (this.aits !== null) data.free = data.free || this.aits.price === 0
      this.$store.cache.dispatch("tests/update", data)
    }
  },

  components: { DateField, TimeField }
}
</script>

<style module lang="scss">
@import "~@/sass/components";
</style>
