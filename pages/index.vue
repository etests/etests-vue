<template>
  <v-app>
    <v-overlay v-if="loading" color="transparent">
      <v-progress-circular color="primary" indeterminate size="64" />
    </v-overlay>
    <component :is="component" v-else />
  </v-app>
</template>

<script>
const PublicHomePage = () => import("@/components/public/homepage/HomePage.vue")
const InstituteHomePage = () => import("@/components/institute/HomePage.vue")

export default {
  head() {
    return {
      title: "Home",
    }
  },
  computed: {
    loading() {
      if (!this.$handle) return true
      else return false
    },
    component() {
      return this.$handle == "public" ? PublicHomePage : InstituteHomePage
    },
  },
}
</script>

<style scoped>
.fullpage-wrapper {
  width: 100% !important;
}
</style>
