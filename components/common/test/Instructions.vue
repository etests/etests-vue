<template>
  <v-card class="page pa-2">
    <v-card-title class="title">
      Instructions
    </v-card-title>
    <v-card-subtitle>
      Please read the instructions carefully
    </v-card-subtitle>
    <v-card-text>
      <v-list>
        <v-list-item v-for="(instruction, i) in instructions" :key="i">
          <v-list-item-icon class="mx-0">
            <v-icon small color="success">
              mdi-checkbox-marked-circle
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>{{ instruction }}</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions>
      <v-checkbox
        :input-value="true"
        label="I agree not to involve in any unfair means and abide by all the terms
      and conditions."
      />
    </v-card-actions>
    <slot />
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      instructions: [
        "The timer at the top of the screen will display the time remaining for completing the test. When the timer reaches zero, the test will end automatically. ",
        "Click on the end test button at the top to submit the test. ",
        "After the test is submitted you can only reattempt it after the result is declared.",
        "Marking scheme and question type is shown at the top of each question"
      ]
    }
  }
}
</script>
