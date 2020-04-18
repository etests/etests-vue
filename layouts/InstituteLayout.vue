<template>
  <v-app>
    <v-container>
      <Header />
      <v-content app class="pt-12 px-0">
        <v-row>
          <v-col cols="12">
            <slot />
          </v-col>
        </v-row>
      </v-content>
    </v-container>
  </v-app>
</template>

<script>
import Header from "@/components/institute/Header"

export default {
  components: {
    Header
  },
  computed: {
    theme() {
      return this.$store.getters["institutes/theme"]
    }
  },
  watch: {
    theme(newValue, oldValue) {
      this.$vuetify.theme.themes.light.primary = newValue
    }
  },
  mounted() {
    this.$store.cache.dispatch("institutes/get", this.$handle)
  }
}
</script>
