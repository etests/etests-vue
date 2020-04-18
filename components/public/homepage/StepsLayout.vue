<template>
  <v-card max-width="500" flat class="ma-auto" :class="$style.stepCard">
    <v-row align="center" justify="center">
      <v-col cols="12" class="mb-3">
        <v-expansion-panels popout class="transparent">
          <v-expansion-panel v-for="(step, i) in steps" :key="i" class="transparent">
            <v-expansion-panel-header>
              <div :class="$style.step">
                {{ step.title }}
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-card-text :class="$style.description">
                {{ step.description }}
              </v-card-text>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>

      <v-col
        cols="12"
        lg="4"
        offset-lg="2"
        :class="[$style.video, 'hidden-sm-and-up hidden-sm-and-down']"
      >
        This will contain Video
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
export default {
  props: {
    steps: {
      required: true,
      type: Array
    }
  },
  data() {
    return {}
  }
}
</script>

<style module lang="scss">
.stepCard {
  border-radius: 8px;
  .step {
    font-family: "Open Sans", Arial, Helvetica, sans-serif;
    font-weight: 600;
    font-size: 1.1rem;
    margin: 8px auto;
  }
  .description {
    font-family: "Montserrat", Arial, Helvetica, sans-serif;
    text-align: left;
    font-size: 0.99rem;
  }
}
.video {
  font-family: "Open Sans", Arial, Helvetica, sans-serif;
  font-size: 1.08rem;
}
</style>
