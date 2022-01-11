<template>
  <v-app class="text-center">
    <v-main app class="ma-0 pa-0">
      <Header
        :temporary-drawer="true"
        :disable-drawer-close="true"
        :show-search-bar="false"
        :dark="true"
        :show-logo="false"
      />
      <slot />
    </v-main>
  </v-app>
</template>

<script>
import Header from "@/components/public/Header.vue"

export default {
  components: {
    Header
  },
  data() {
    return {}
  }
}
</script>

<style module lang="scss">
@import "~@/sass/colors";

body {
  margin: 0;
  padding: 0;
}
</style>
