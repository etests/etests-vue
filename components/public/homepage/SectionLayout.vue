<template>
  <div class="section">
    <v-row :class="[$style.section, !isSmallScreen ? $style.space : '', 'wave']">
      <v-col cols="12">
        <div :class="$style.heading">
          <slot name="heading" />
        </div>
        <div :class="$style.subheading">
          <slot name="subheading" />
        </div>
        <v-row justify="center" align="center" wrap>
          <slot name="content" />
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isSmallScreen: this.$vuetify.breakpoint.smAndDown,
    }
  },
}
</script>
<style module lang="scss">
@import "~@/styles/colors";

.section {
  text-align: center;
  margin: 50px auto;
  padding: 50px 0 20px;
  min-height: 500px;

  .heading {
    font-family: "Open Sans", Arial, Helvetica, sans-serif;
    font-weight: 800;
    font-size: 2.1rem;
    color: #555;
    padding: 0 0 20px;
  }
  .subheading {
    font-family: "Montserrat", Arial, Helvetica, sans-serif;
    font-weight: 600;
    font-size: 1.2rem;
    color: #777;
  }
}
.section:last-child {
  margin-bottom: 0;
}
</style>

<style scoped>
.section {
  z-index: 0;
}

.section:nth-child(even) {
  background-color: #f8f8f8;
}
</style>
