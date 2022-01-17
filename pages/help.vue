<template>
  <StandardLayout>
    <v-card
      v-for="(step, i) in steps"
      v-show="
        !$auth.loggedIn ||
        step.scope.find((scope) => $auth.hasScope(scope)) ||
        $auth.hasScope('staff')
      "
      :key="i"
      class="page text-left mb-4 mb-xl-12 pa-2"
      min-height="180"
    >
      <v-card-title>{{ step.title }}</v-card-title>
      <v-card-text class="body-1">
        {{ step.description }}
      </v-card-text>
    </v-card>
  </StandardLayout>
</template>

<script>
import { mapGetters } from "vuex"
import StandardLayout from "@/layouts/StandardLayout"

export default {
  components: {
    StandardLayout,
  },
  middleware: "public",
  head() {
    return {
      title: "Help",
    }
  },
  data() {
    return {
      steps: [
        {
          title: "Can I attempt tests of a Test Series multiple times?",
          description: "Yes, you can.",
          scope: ["student"],
        },

        {
          title: "Can I attempt tests multiple times?",
          description:
            "Yes, you can attempt. During the period the test is active you can attempt it once and rank will be generated for the same. After the ranks are declared you can attempt them any number of times for practise.",
          scope: ["student"],
        },
        {
          title: "How can I get the amount for the sales of Test Series created by me?",
          description:
            "There is a buyers section in dashboard. This will show you the list of buyers for each Test Series. The update of new buyers may take some time. It is generally updated in less than 3 hrs. According to the number of buyers and rate of Test Series, amount will be credited to your account at the end of each week.",
          scope: ["institute"],
        },
        {
          title: "How can I purchase a Test Series?",
          description:
            "You can search for a Test Series by its name or from the institutes and exams sections. The links for these sections are avialable in the navigation bar. For purchasing an Test Series you need to click on buy button and make payment for Test Series by one of the methods. After completing the payment you need submit the transaction id and receipt in the same dialog. The purchased Test Series will appear in your dashboard shortly.",
          scope: ["student"],
        },
        {
          title: "How are tests different from Test Series?",
          description:
            "Tests are regular tests which are conducted by an institute for its students. The rank is generated after the institute declares ranks. Test analysis and review can be seen only after the rank is declared for the test. Any student can buy Test Series of any institute.",
          scope: ["institute", "student"],
        },
        {
          title: "Will I get a rank for practice tests?",
          description:
            "Yes, you will get a virtual rank which means the rank you would have obtained if you performed similarly in the live test.",
          scope: ["student"],
        },
      ],
    }
  },
}
</script>

<style module lang="scss">
@import "~@/styles/colors";
.stepCard {
  border-radius: 8px;
  .step {
    font-family: "Open Sans", Arial, Helvetica, sans-serif;
    font-weight: 400;
    font-size: 1.1rem;
    margin: 8px auto;
  }
  .description {
    font-family: "Montserrat", Arial, Helvetica, sans-serif;
    text-align: left;
    font-size: 0.99rem;
  }
}
</style>
