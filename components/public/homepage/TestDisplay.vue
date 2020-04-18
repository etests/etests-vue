<template>
  <SectionLayout>
    <v-row
      slot="content"
      wrap
      fill-height
      align="center"
      justify="center"
      :class="[$style.card, $style[$mq]]"
    >
      <v-col cols="12" lg="3" :class="$style.text">
        <div :class="$style.heading">
          Robust Testing Platform
        </div>
        <div :class="$style.description">
          eTests provides you a rich testing platform with support for multiple types of questions.
        </div>
      </v-col>
      <v-col cols="12" lg="3">
        <v-img :src="require('@/assets/images/displays/test.jpg')" :class="$style.display" />
      </v-col>
    </v-row>
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
          title: "Sell your practice tests",
          src: require("@/assets/images/features/sell.png")
        }
      ]
    }
  }
}
</script>

<style module lang="scss">
.card {
  margin: auto;
  border-radius: 8px;
  width: 100%;
  height: auto;

  .display {
    width: 220px;
    margin: 10px auto 10px;
    position: relative;
    border-radius: 20px;
    box-shadow: 0px 0px 40px -10px rgba(0, 0, 0, 0.8);
  }
  .text {
    padding: 0 10px;
    .heading {
      color: #555;
      font-family: "Open Sans", Arial, Helvetica, sans-serif;
      font-weight: 800;
      font-size: 2.1rem;
    }
    .description {
      color: #777;
      text-align: center;
      margin: 10px auto;
      max-width: 500px;
      line-height: 2.2rem;
      font-family: "Montserrat", Arial, Helvetica, sans-serif;
      font-weight: 600;
      font-size: 1.2rem;
    }
  }
}
.sm,
.xs {
  .display {
    width: 200px;
  }
  .text {
    .heading {
      font-size: 2.2rem;
    }
    .description {
      font-size: 1.1rem;
    }
  }
}
</style>
