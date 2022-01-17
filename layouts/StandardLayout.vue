<template>
  <v-app>
    <v-container fluid style="height: 100%;">
      <Header :fluid="true">
        <template slot="search">
          <slot name="search" />
        </template>
      </Header>
      <v-main app class="mt-8">
        <v-row>
          <v-col cols="12" class="boxed-container">
            <slot />
          </v-col>
        </v-row>
      </v-main>
    </v-container>
  </v-app>
</template>

<script>
import Header from "@/components/public/Header.vue"

export default {
  components: {
    Header,
  },
  data() {
    return {}
  },
  watch: {
    theme(newValue, oldValue) {
      this.$vuetify.theme.themes.light.primary = newValue
    },
  },
  mounted() {
    if (this.$auth.loggedIn && this.$auth.hasScope("institute")) {
      this.$store.cache.dispatch("institutes/get", this.$auth.user.handle)
    }
    if (this.$handle !== "public") this.$store.cache.dispatch("institutes/get", this.$handle)
  },
}
</script>

<style module lang="scss">
@import "~@/styles/colors";

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
