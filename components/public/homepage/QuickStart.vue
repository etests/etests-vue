<template>
  <SectionLayout>
    <template slot="heading">
      Quick Start
    </template>
    <v-tabs-items slot="content" v-model="showTab">
      <v-tab-item v-for="(tab, i) in tabs" :key="i">
        <StepsLayout :steps="tab.steps" />
      </v-tab-item>
    </v-tabs-items>
  </SectionLayout>
</template>

<script>
import SectionLayout from "@/components/public/homepage/SectionLayout.vue"
import StepsLayout from "@/components/public/homepage/StepsLayout.vue"

export default {
  components: {
    SectionLayout,
    StepsLayout,
  },
  props: {
    authType: {
      required: false,
      default: 0,
    },
  },
  data() {
    return {
      isSmallScreen: this.$vuetify.breakpoint.smAndDown,
      showTab: parseInt(this.authType),
      tabs: [
        {
          id: "StudentServices",
          title: "Students",
          icon: "mdi-account-multiple",
          steps: [
            {
              title: "Join eTests",
              description:
                "Let's start your awesome experience of taking online tests. Click on the register button to register as a student. You will be redirected to your dashboard after successful registration.",
            },
            {
              title: "Select a test",
              description:
                "The Demo test is available on the homepage. The test and Test Series for which you are registered will appear on your dashboard. You can search for Test Series institute wise or exam wise from navigation bar and buy them. Some Test Series are available for free.",
            },
            {
              title: "Attempt the test",
              description:
                "You can attempt any test from your dashboard. Instructions are displayed at the start of each test. Read them to know the pattern of the test. ",
            },
            {
              title: "Analyze your performance",
              description:
                "After completion of the test you can see the marks in each subject and the total marks obtained. For each test you can see the rank, topic wise performance, subject wise performance and compare yourself with with the average and the top performer after the test has ended and result is declared. After this you can also review your test to know the correct answers, solutions and the time spent on each question.",
            },
          ],
        },
        {
          id: "institute",
          title: "Institutes",
          icon: "mdi-domain",
          steps: [
            {
              title: "Join eTests",
              description:
                "Let's start your awesome experience of online test creation. Click on the register button to register as an institute. After this you are ready to create tests.",
            },
            {
              title: "Create a test or Test Series",
              description:
                "Go to your dashboard and open tests section. You can create a new test here by filling the necessary details. While creating tests you can select eligible batches of your institute. For creating an Test Series you need not add any batch. Any student who has purchased your Test Series can attempt them. ",
            },
            {
              title: "Add questions and sections",
              description:
                "After the test is created you can add question to your test either by using our test editor or by simply sending us the pdf or images of your question paper using the google form link provided after test creation. The test editor is very easy to use. First add the sections of your test then for each question select the topic, question type, correct Marks, incorrect Marks, partial marks (if any), correct answer and the solution.",
            },
            {
              title: "Publish the test",
              description:
                "Click on save this test when you are done. The test will be active between the activation time and the closing time that you provided during test creation. Registered students can start the test within this time frame and attempt the test for the time alloted provided during the test creation.",
            },
          ],
        },
      ],
    }
  },
}
</script>

<style module lang="scss">
.cardsContainer {
  margin: 25px auto;
}
</style>
