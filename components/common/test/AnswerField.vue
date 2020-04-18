<template>
  <v-col cols="12">
    <v-radio-group
      v-if="question.type === 0"
      v-model="response"
      :mandatory="false"
      :disabled="disabled"
    >
      <v-radio
        v-for="j in question.optionCount || 4"
        :key="j"
        :on-icon="`mdi-alpha-${letter('a', j - 1, true)}-circle`"
        :off-icon="`mdi-alpha-${letter('a', j - 1, true)}-circle-outline`"
        class="mb-2 ml-2"
      />
    </v-radio-group>

    <div v-else-if="question.type === 1" class="mt-5">
      <v-checkbox
        v-for="j in question.optionCount || 4"
        :key="j"
        v-model="response"
        :value="j - 1"
        :on-icon="`mdi-alpha-${letter('a', j - 1, true)}-circle`"
        :off-icon="`mdi-alpha-${letter('a', j - 1, true)}-circle-outline`"
        multiple
        height="0"
        class="mt-0 mb-1"
        :disabled="disabled"
      />
    </div>

    <div v-else-if="question.type === 2" class="mt-5">
      <v-text-field
        v-model="response"
        solo-inverted
        flat
        label="Answer (integer or decimal number)"
        type="number"
        :disabled="disabled"
      />
    </div>

    <div v-else-if="question.type === 3" cols="12">
      <v-row>
        <v-col cols="1" class="py-0" />
        <v-col v-for="j in labels.answers.length" :key="`label-answer-${j}`" cols="1" class="py-0">
          <v-checkbox
            height="0"
            :off-icon="`mdi-alpha-${letter('p', j - 1, true)}`"
            class="mt-0 mb-1"
            :disabled="disabled"
          />
        </v-col>
      </v-row>
      <v-row v-for="i in labels.options.length" :key="`label-option-${i}`">
        <v-col cols="1" class="py-0">
          <v-checkbox
            height="0"
            :off-icon="`mdi-alpha-${letter('a', i - 1, true)}-circle`"
            class="mt-0 mb-1"
            :disabled="disabled"
          />
        </v-col>

        <v-col v-for="j in labels.answers.length" :key="`${i}-${j}`" cols="1" class="py-0">
          <v-checkbox
            :ref="`matrix-${i - 1}-${j - 1}`"
            v-model="response[i - 1]"
            :value="j - 1"
            off-icon="mdi-radiobox-blank"
            on-icon="mdi-radiobox-marked"
            multiple
            height="0"
            class="mt-0 mb-1"
            :disabled="disabled"
          />
        </v-col>
      </v-row>
    </div>
  </v-col>
</template>

<script>
export default {
  props: ["question", "value", "disabled"],
  data() {
    return {
      labels: {
        options: ["A", "B", "C", "D"],
        answers: ["P", "Q", "R", "S", "T"]
      }
    }
  },
  computed: {
    response: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit("input", value)
        this.$emit("change")
      }
    }
  },
  methods: {
    matrixInput(i, j) {
      console.log(this.$refs[`matrix-${i}-${j}`][0].inputValue)
      console.log(i, j)
    },
    letter(start, index, order) {
      const small = "abcdefghijklmnopqrstuvwxyz"
      const caps = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      const size = small.length
      return order
        ? small[(small.indexOf(start) + index) % size]
        : caps[(caps.indexOf(start) + index) % size]
    }
  }
}
</script>
