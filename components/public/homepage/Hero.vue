<template>
  <v-container fluid :class="[$style.hero, $style[$mq]]">
    <v-row justify="center" align="end">
      <v-col cols="12" lg="auto">
        <img :src="require('@/assets/logos/etests.png')" :class="$style.logo" />
      </v-col>
      <v-col cols="12" lg="auto">
        <div :class="[$style.heading, 'chill--text']">
          eTests
        </div>
        <div :class="$style.subheading" cols="12">
          enhance your potential
        </div>
        <v-btn
          large
          rounded
          outlined
          class="chill"
          :to="{ name: 'test-id', query: { demo: 1 }, params: { id: 0 } }"
        >
          <transition appear enter-active-class="animated zoomIn">
            <v-icon>mdi-play-circle</v-icon>
          </transition>
          take a test
        </v-btn>
        <v-btn
          v-if="!$store.getters['loggedIn'] && !['xs', 'sm'].includes($mq)"
          dark
          large
          outlined
          color="secondary"
          rounded
          @click="showRegisterDialog"
        >
          Signup now
        </v-btn>
      </v-col>
    </v-row>
    <!-- <v-row>
      <v-col cols="4" v-for="i in 3" :key="i">
        <v-card class="object">
          <v-card-title> Feature {{ i }} </v-card-title>
        </v-card>
      </v-col>
    </v-row> -->
  </v-container>
</template>

<script>
export default {
  name: "Exams",
  data() {
    return {
      features: [
        {
          title: "Adopted by many",
          src: require("@/assets/images/features/useful.png"),
          btn: {
            icon: "mdi-account-plus",
            title: "signup now"
          },
          color: "info"
        },
        {
          title: "Useful analytics",
          src: require("@/assets/images/features/analytics.png"),
          btn: {
            icon: "mdi-youtube",
            title: "watch a demo"
          },
          color: "success"
        },
        {
          title: "Free upto December",
          src: require("@/assets/images/features/money.png"),
          btn: {
            icon: "mdi-currency-usd",
            title: "Try now"
          },
          color: "orange"
        }
      ]
    }
  },
  methods: {
    showRegisterDialog() {
      this.$store.commit("tabs/changeAuthTab", 1)
      this.$store.commit("tabs/toggleAuthDialog", true)
    }
  }
}
</script>

<style module lang="scss">
@import "~@/sass/colors";

.hero {
  background-color: #fff;
  text-align: center;
  margin: auto;
  padding: 25vh 0;
  width: 100%;
  min-height: 100vh;

  .heading {
    color: $primary;
    font-family: "Montserrat", Arial, Helvetica, sans-serif;
    font-weight: 800;
    font-size: 6rem;
  }
  .subheading {
    font-family: "Open Sans", Arial, Helvetica, sans-serif;
    font-weight: 600;
    font-size: 1.6rem;
    text-transform: uppercase;
    margin-bottom: 10px;
    color: $secondary;
  }
}

.logo {
  width: 200px;
}

.xs,
.sm {
  .heading {
    font-size: 4rem;
  }
  .subheading {
    font-size: 1.5rem;
  }
  .logo {
    width: 100px;
  }
}
</style>
