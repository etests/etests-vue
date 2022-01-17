<template>
  <v-container fluid :class="[$style.hero, $style[$mq]]" fill-height>
    <v-row justify="center" align="center">
      <!-- <v-col cols="12" lg="auto">
        <img :src="require('@/assets/logos/etests.png')" :class="$style.logo" />
      </v-col> -->
      <v-col cols="12" lg="auto">
        <div :class="[$style.heading, 'plume--text']">
          CourseClip
        </div>
        <v-btn
          x-large
          rounded
          outlined
          class="plume"
          :to="{ path: 'test', query: { id: 0, demo: 1 } }"
        >
          <transition appear enter-active-class="animated zoomIn">
            <v-icon class="mr-2">mdi-play-circle-outline</v-icon>
          </transition>
          watch a demo
        </v-btn>
      </v-col>
    </v-row>
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
            title: "signup now",
          },
          color: "info",
        },
        {
          title: "Useful analytics",
          src: require("@/assets/images/features/analytics.png"),
          btn: {
            icon: "mdi-youtube",
            title: "watch a demo",
          },
          color: "success",
        },
        {
          title: "Free upto December",
          src: require("@/assets/images/features/money.png"),
          btn: {
            icon: "mdi-currency-usd",
            title: "Try now",
          },
          color: "orange",
        },
      ],
    }
  },
  methods: {
    showRegisterDialog() {
      this.$store.commit("tabs/changeAuthTab", 1)
      this.$store.commit("tabs/toggleAuthDialog", true)
    },
  },
}
</script>

<style module lang="scss">
.hero {
  text-align: center;
  margin: auto;
  height: 70vh;
  width: 100%;

  .heading {
    font-family: "Open Sans", Arial, Helvetica, sans-serif;
    font-weight: bold;
    font-size: 8rem;
  }
  .subheading {
    font-family: "Open Sans", Arial, Helvetica, sans-serif;
    font-weight: 600;
    font-size: 1.6rem;
    text-transform: uppercase;
    margin-bottom: 10px;
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
