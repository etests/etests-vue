<template>
  <HeroLayout>
    <Social class="hidden-sm-and-down" />
    <component :is="section" v-for="section in sections" :key="section" />
  </HeroLayout>
</template>

<script>
import HeroLayout from "@/layouts/HeroLayout.vue"
import SectionLayout from "@/components/public/homepage/SectionLayout.vue"
import Hero from "@/components/public/homepage/Hero.vue"
import TestDisplay from "@/components/public/homepage/TestDisplay.vue"
import QuickStart from "@/components/public/homepage/QuickStart.vue"
import Footer from "@/components/public/homepage/Footer.vue"

const Social = () => import("@/components/public/Social.vue")

export default {
  components: {
    Hero,
    Social,
    HeroLayout,
    TestDisplay,
    QuickStart,
    SectionLayout,
    Footer,
  },
  data() {
    return {
      sections: ["Hero", "TestDisplay", "QuickStart", "Footer"],
      options: {
        licenseKey: null,
        scrollingSpeed: 500,
        parallax: true,
        verticalCentered: true,
        menu: "#menu",
        controlArrows: true,
        scrollBar: true,
      },
    }
  },
  computed: {
    disableFullpage() {
      return window.innerHeight <= 450 || window.innerWidth <= 970
    },
    user() {
      return this.$store.state.auth.user
    },
  },
}
</script>

<style scoped>
.fullpage-wrapper {
  width: 100% !important;
}
</style>
