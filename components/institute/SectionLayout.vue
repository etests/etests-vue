<template>
  <v-row class="section">
    <slot />
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      isSmallScreen: this.$vuetify.breakpoint.smAndDown
    }
  }
}
</script>

<style scoped>
.section {
  margin: 0;
  padding: 0;
  width: 100%;
}

.section:nth-child(odd) {
  background-color: #f8f8f8;
}
</style>
