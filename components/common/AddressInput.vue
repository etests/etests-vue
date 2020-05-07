<template>
  <div
    class="v-input theme--light v-text-field v-text-field--single-line v-text-field--solo v-text-field--solo-inverted v-text-field--solo-flat v-text-field--is-booted v-text-field--enclosed"
  >
    <div class="v-input__control">
      <div class="v-input__slot">
        <div class="v-input__prepend-inner" v-if="icon">
          <div class="v-input__icon v-input__icon--prepend-inner">
            <v-icon>{{ icon }}</v-icon>
          </div>
        </div>
        <div class="v-text-field__slot">
          <gmap-autocomplete :value="value" @place_changed="setValue" :placeholder="placeholder" />
        </div>
      </div>
      <div class="v-text-field__details">
        <div class="v-messages theme--light">
          <div class="v-messages__wrapper" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["value", "icon", "placeholder"],
  methods: {
    setValue(place) {
      this.$emit("input", place.formatted_address)
    }
  }
}
</script>
