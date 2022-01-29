<template>
  <HeroLayout>
    <component :is="section" v-for="section in sections" :key="section" />
  </HeroLayout>
</template>

<script>
import HeroLayout from "@/layouts/HeroLayout.vue"
import Hero from "@/components/public/homepage/Hero.vue"

export default {
  components: {
    Hero,
    HeroLayout,
  },
  data() {
    return {
      sections: ["Hero"],
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
