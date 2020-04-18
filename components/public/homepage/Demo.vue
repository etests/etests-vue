<template>
  <SectionLayout>
    <template slot="heading">
      Free Demo
    </template>
    <template slot="subheading">
      experience all the features for free
    </template>
    <v-row slot="content" :wrap="isSmallScreen" justify="center" align="center">
      <v-col cols="12" md="6" lg="4" color="transparent" :class="$style.demoSheet">
        <!-- <div :class="$style.heading">Students</div> -->
        <p :class="$style.description">
          Get practice tests for various entrance exams including JEE Main, JEE Advances, NEET, CLAT
          and
          <nuxt-link to="/exams"> many more </nuxt-link>, free of cost.
        </p>
        <v-btn
          rounded
          dark
          large
          color="primary"
          :to="{ name: 'test', params: { id: 0, demo: true } }"
        >
          attempt demo test
        </v-btn>
      </v-col>
    </v-row>
  </SectionLayout>
</template>

<script>
import SectionLayout from "@/components/public/homepage/SectionLayout.vue"

export default {
  name: "Demo",
  components: {
    SectionLayout
  },
  data() {
    return {
      isSmallScreen: this.$vuetify.breakpoint.smAndDown,
      institute: {
        description:
          " Watch our demo video to learn about how to conduct an online test. Try it for free now."
      },
      student: {
        description:
          "Free practice tests for various entrance exams including JEE Main, JEE Advances, NEET, CLAT and many more."
      }
    }
  }
}
</script>

<style module lang="scss">
.demoSheet {
  padding: 60px 20px 0;
  .heading {
    font-family: "Open Sans", Arial, Helvetica, sans-serif;
    font-weight: 600;
    font-size: 1.2rem;
    text-transform: uppercase;
  }
  .description {
    margin: 15px auto;
    max-width: 400px;
    font-family: "Montserrat", Arial, Helvetica, sans-serif;
    font-size: 1.1rem;
  }
}
</style>
