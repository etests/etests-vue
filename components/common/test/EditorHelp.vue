<template>
  <v-card-text>
    <li>
      The
      <v-btn small :icon="$mq === 'xs'" color="primary">
        <v-icon v-if="$mq === 'xs'">
          mdi-content-save
        </v-icon>
        <span v-else>save</span>
      </v-btn>
      button is present at bottom right corner for saving the test.
    </li>

    <li>
      The questions palette displayed on the right side of screen can be used for navigating through
      questionas. It will also show status of each question as per the following color scheme:
      <ul>
        <li>
          <v-btn fab dark small color="error">
            1
          </v-btn>
          : answer is not set
        </li>
        <li>
          <v-btn fab dark small color="warning">
            2
          </v-btn>
          : answer is set but topic is not set
        </li>
        <li>
          <v-btn fab dark small color="info">
            3
          </v-btn>
          : answer and topic are set but solution is not provided.
        </li>
        <li>
          <v-btn fab dark small color="green">
            4
          </v-btn>
          : answer, topic and solution are provided
        </li>
      </ul>
    </li>
    <br />

    <li>
      For Navigation
      <ol type="a">
        <li>
          Click on
          <v-btn icon color="primary">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          to go to the previous question.
        </li>
        <li>
          Click on
          <v-btn icon color="primary">
            <v-icon>mdi-arrow-right</v-icon>
          </v-btn>
          to go to the next question.
        </li>
        <li>
          You can navigate through sections (subjects) from the dropdown menu at the bottom center.
        </li>
      </ol>
    </li>
    <br />
    <li>
      Use top menu to add or delete questions and sections.
    </li>
    <br />
    <li>
      Marking scheme and question type is shown at the top of each question.
      <ol type="a">
        <li>
          For Correct Marks
          <v-btn icon color="success" rounded outlined small>
            <span>+4</span>
          </v-btn>
        </li>
        <li>
          For Partial Marks
          <v-btn icon color="blue" rounded outlined small>
            <span>+1</span>
          </v-btn>
        </li>
        <li>
          For Incorrect Marks
          <v-btn icon color="error" rounded outlined small>
            <span>-1</span>
          </v-btn>
        </li>
        <li>
          To change the question type you can click on
          <v-btn color="indigo" rounded outlined>
            <span> Single Correct </span>
            <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </li>
        <li>
          To select the topic of question you can click on
          <v-btn color="info" text style="width:150px;" rounded outlined>
            <span> Topic </span>
            <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </li>
      </ol>
    </li>
    <br />
    <li>
      You can create another test only after saving the current test.
    </li>
    <li v-if="instituteId">
      You can also send us PDF / images containing your questions and we will add them to the test.
      Fill out
      <a target="_blank" href="https://forms.gle/XuzzwBP31c3Z1dwn8">this form</a> with the following
      details: <br />
      <ul type="circle">
        <li>Institute Id: {{ instituteId }}</li>
        <li>Test Id: {{ testId }}</li>
      </ul>
    </li>
  </v-card-text>
</template>

<script>
export default {
  data() {
    return {
      testId: this.$route.params.id
    }
  },
  computed: {
    instituteId() {
      if (
        this.$store.state.auth.status.loggedIn &&
        this.$store.state.auth.user.type === "institute"
      ) {
        return this.$store.state.auth.user.id
      } else return false
    }
  }
}
</script>
