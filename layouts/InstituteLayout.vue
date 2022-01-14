<template>
  <v-app>
    <v-container>
      <Header />
      <v-main app class="mt-12 pt-12 px-0">
        <v-row>
          <v-col cols="12">
            <v-skeleton-loader type="persistent" width="64" v-show="loading" />
            <slot v-show="!loading" />
          </v-col>
        </v-row>
      </v-main>
    </v-container>
  </v-app>
</template>

<script>
import Header from "@/components/institute/Header"

export default {
  components: {
    Header,
  },
  computed: {
    loading() {
      if (!this.$handle) return true
      else return false
    },
    theme() {
      return this.$store.getters["institutes/theme"]
    },
  },
  watch: {
    theme(newValue, oldValue) {
      this.$vuetify.theme.themes.light.primary = newValue
    },
  },
  mounted() {
    if (this.$handle === "public") this.$router.push("/404")
    else this.$store.cache.dispatch("institutes/get", this.$handle)
  },
}
</script>
