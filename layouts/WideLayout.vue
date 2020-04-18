<template>
  <v-container fluid>
    <Header :temporary-drawer="true" />
    <v-content app>
      <v-container fluid grid-list-lg>
        <v-row class="mb-4">
          <slot />
        </v-row>
      </v-container>
      <Footer />
    </v-content>
  </v-container>
</template>

<script>
import Header from "@/components/public/Header.vue"
import Footer from "@/components/public/Footer.vue"

export default {
  components: {
    Header,
    Footer
  },
  data() {
    return {}
  }
}
</script>

<style module lang="scss">
@import "~@/sass/colors";
.logo {
  width: 40px;
  float: left;
  margin: 0 5px;
}
</style>
