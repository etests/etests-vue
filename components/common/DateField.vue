<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    :nudge-right="40"
    max-width="290px"
    min-width="290px"
  >
    <template #activator="{ on }">
      <v-text-field
        slot="activator"
        solo-inverted
        flat
        :label="label"
        :value="value"
        prepend-inner-icon="mdi-calendar"
        readonly
        v-on="on"
      />
    </template>
    <v-date-picker :value="value" scrollable @input="handleInput">
      <template>
        <v-spacer />
        <v-btn text color="primary" @click="menu = false">
          OK
        </v-btn>
      </template>
    </v-date-picker>
  </v-menu>
</template>
<script>
export default {
  props: ["value", "label"],
  data() {
    return {
      menu: false
    }
  },
  methods: {
    handleInput(value) {
      this.$emit("input", value)
    }
  }
}
</script>
