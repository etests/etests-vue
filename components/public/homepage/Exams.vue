<template>
  <SectionLayout>
    <template slot="heading">
      Featured Exams
    </template>
    <template slot="subheading">
      supporting various entrance exams
    </template>
    <v-row
      slot="content"
      wrap
      justify="center"
      justify-space-around
      :class="$style.cardsContainer"
      :mt-5="!isSmallScreen"
    >
      <v-col v-for="card in cards" :key="card.title" cols="6" sm="3">
        <v-card hover :class="$style.card" @click="$router.push(card.link)">
          <v-img :src="card.src" :class="$style.icon" />
          <v-col cols="12" :class="$style.text">
            {{ card.title }}
          </v-col>
        </v-card>
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
      isSmallScreen: this.$vuetify.breakpoint.smAndDown,
      cards: [
        {
          title: "Lok Sewa",
          src: "https://etests.co.in/exams/pscn.png",
          link: "/exams#18"
        },
        {
          title: "Rastra Bank",
          src: "https://etests.co.in/exams/rastra.png",
          link: "/exams#3"
        },
        {
          title: "JEE MAIN",
          src: "https://etests.co.in/exams/jeemain.png",
          link: "/exams#1"
        },
        {
          title: "NEET",
          src: "https://etests.co.in/exams/neet.png",
          link: "/exams#3"
        }
      ]
    }
  }
}
</script>

<style module lang="scss">
SectionLayout,
.cardsContainer {
  margin: auto;
  margin-top: 50px;
  .card {
    margin: 25px auto 40px;
    border-radius: 8px;
    padding: 5px;
    width: 90%;
    max-width: 300px;
    height: auto;
    min-height: 130px;
    .icon {
      margin: auto;
      width: 60%;
      position: relative;
      top: -40px;
    }
    .text {
      font-family: "Montserrat", Arial, Helvetica, sans-serif;
      font-size: 1.1rem;
      width: 100% 16pt;
      text-align: center;
      position: relative;
      bottom: 10px;
    }
  }
}
</style>
