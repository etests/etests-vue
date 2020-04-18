<template>
  <v-col cols="12" :class="$style.section">
    <v-col cols="12" :class="$style.heading">
      {{ heading }}
    </v-col>
    <v-divider class="mb-5" />
    <v-spacer />
    <v-col cols="12" />
    <v-row>
      <slot />
    </v-row>
  </v-col>
</template>

<script>
export default {
  props: {
    heading: {
      required: false,
      type: String
    }
  },
  data() {
    return {}
  }
}
</script>

<style module lang="scss">
@import "~@/sass/colors";
.section {
  font-family: "Montserrat", Arial, sans-serif;
  margin: 20px 10px;
  width: 100%;
  .heading {
    margin: 10px;
    text-align: left;
    letter-spacing: 0.014em;
    font-size: 2.08rem;
    font-family: "Open Sans", Arial, sans-serif;
    font-weight: 600;
    line-height: 2.25rem;
    color: #5f6368;
    &:not(:first-child) {
      margin-top: 50px;
    }
  }
}
</style>
