<template>
  <v-col cols="12">
    <v-card :class="$style.displayCard" min-height="80">
      <v-row>
        <v-col cols="12">
          <v-card-title :class="$style.title">
            {{ card.title }}
          </v-card-title>
          <v-card-text v-if="card.text" :class="$style.description">
            {{ card.text }}
          </v-card-text>
        </v-col>
        <v-col cols="12">
          <v-card flat>
            <slot />
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-col>
</template>

<script>
export default {
  props: {
    card: {
      required: false,
      type: Object
    }
  },
  data() {
    return {}
  }
}
</script>

<style module lang="scss">
@import "~@/sass/colors";
.displayCard {
  border: 1px solid #dadce0;
  border-radius: 8px;
  .title {
    font-family: "Open Sans", Arial, Helvetica, sans-serif;
    font-size: 1.875rem;
    line-height: 1.75rem;
    color: #202124;
  }
  .description {
    text-align: left;
    letter-spacing: 0.014em;
    font-family: "Montserrat", Arial, Helvetica, sans-serif;
    font-size: 1.08rem;
    line-height: 1.25rem;
    color: #5f6368;
  }
}
</style>
