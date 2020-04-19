<template>
  <SectionLayout>
    <template slot="heading">
      Welcome
    </template>
    <template slot="subheading">
      to your online tests partner
    </template>
    <v-col slot="content" cols="12" md="6" lg="4" color="transparent">
      <p class="my-6">
        Get practice tests for various Engineering, Medical, Bank PO and
        <nuxt-link to="/exams">
          other exams
        </nuxt-link>
        <strong>FREE</strong> of cost.
      </p>
      <v-btn
        rounded
        dark
        large
        color="chill"
        :to="{ name: 'test-id', query: { demo: 1 }, params: { id: 0 } }"
      >
        <v-icon>mdi-play-circle</v-icon>
        attempt demo test
      </v-btn>
    </v-col>
  </SectionLayout>
</template>

<script>
import SectionLayout from "@/components/public/homepage/SectionLayout.vue"

export default {
  name: "Welcome",
  components: {
    SectionLayout
  },
  data() {
    return {
      cards: [
        {
          title: "Create online tests",
          src: require("@/assets/images/features/create.png")
        },
        {
          title: "Attempt online tests",
          src: require("@/assets/images/features/attempt.png")
        },
        {
          title: "Detailed analysis of tests",
          src: require("@/assets/images/features/analysis.png")
        },
        {
          title: "Sell your Test Series",
          src: require("@/assets/images/features/sell.png")
        }
      ]
    }
  }
}
</script>
