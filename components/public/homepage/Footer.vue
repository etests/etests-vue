<template>
  <SectionLayout>
    <v-row slot="content" justify="center">
      <v-col cols="12" lg="3" :class="$style.card">
        <div :class="$style.heading">
          About eTests
        </div>
        <p :class="[$style.text, 'secondary--text']">
          eTests is the new standard in online testing solutions. Our online testing platform is
          developed and tested by a team of IITians. We have support for wide range of exam
          patterns.
        </p>
      </v-col>

      <v-col cols="12" lg="3" :class="$style.card">
        <div :class="$style.heading">
          Contact Us
        </div>
        <div :class="$style.text">
          <v-icon color="chill">
            mdi-phone-outline
          </v-icon>
          <br />
          <a href="tel:+917822986293">
            +91 78 2298 6293
          </a>
          <br />
          <v-icon color="chill">
            mdi-email-outline
          </v-icon>
          <br />
          <a href="mailto:help@etests.co.in">
            help@etests.co.in
          </a>
        </div>
      </v-col>

      <v-col cols="12" lg="3" :class="$style.card">
        <div :class="$style.heading">
          Useful Links
        </div>
        <div :class="$style.text">
          <p>
            <nuxt-link to="/career">
              Career at eTests
            </nuxt-link>
          </p>
          <p>
            <nuxt-link to="/terms">
              Terms and Conditions
            </nuxt-link>
          </p>
        </div>
        <v-btn
          v-for="page in socialPages"
          :key="page.href"
          class="chill"
          icon
          large
          :href="page.href"
          target="_blank"
        >
          <v-icon size="20px">
            {{ page.icon }}
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="transparent py-3 secondary--text" text-center>
      <v-icon small color="secondary">
        mdi-copyright
      </v-icon>
      2019 eTests <br />
      <strong>All rights reserved</strong>
    </v-row>
  </SectionLayout>
</template>

<script>
import { mapGetters } from "vuex"
import SectionLayout from "@/components/public/homepage/SectionLayout.vue"
import { socialPages } from "@/js/socialPages"

export default {
  components: {
    SectionLayout
  },
  props: {
    authType: {
      required: false,
      default: 0
    }
  },
  data() {
    return {
      socialPages
    }
  },
  computed: {
    ...mapGetters(["loggedIn", "userType"])
  }
}
</script>

<style module lang="scss">
@import "~@/sass/colors";
.card {
  a {
    color: $secondary;
  }
  max-width: 80%;
  .heading {
    font-family: "Open Sans", Arial, Helvetica, sans-serif;
    font-weight: 600;
    font-size: 1.4rem;
    margin-bottom: 20px;
  }
  .text {
    margin: 15px;
    padding: 10px;
    font-family: "Montserrat", Arial, Helvetica, sans-serif;
    font-size: 1.1rem;
  }
  p.text {
    text-align: justify;
  }
}
</style>
