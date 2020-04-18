<template>
  <component :is="layout">
    <v-col cols="12">
      <v-card class="transparent elevation-0">
        <v-row justify="center" align="center">
          <v-col cols="12" class="my-12 primary--text display-4 font-weight-bold">
            {{ error.statusCode }}!
          </v-col>
          <v-col cols="12" class="primary--text text--darken-3 heading font-weight-bold">
            <span v-if="error.statusCode === 404">Page not found</span>
            <span v-else>An error occurred</span>
          </v-col>
          <nuxt-link to="/"> Go to Home Page</nuxt-link>
        </v-row>
      </v-card>
    </v-col>
  </component>
</template>

<script>
import StandardLayout from "@/layouts/StandardLayout"
import InstituteLayout from "@/layouts/InstituteLayout"

export default {
  props: ["error"],
  computed: {
    layout() {
      return this.$handle == "public" ? StandardLayout : InstituteLayout
    }
  }
}
</script>
