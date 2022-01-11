<template>
  <v-app class="text-center">
    <v-container>
      <Header>
        <template slot="search">
          <slot name="search" />
        </template>
      </Header>
      <v-main app class="pt-12 px-0">
        <v-row>
          <slot />
        </v-row>
      </v-main>
    </v-container>
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
.logo {
  width: 40px;
  float: left;
  margin: 0 5px;
}
</style>
