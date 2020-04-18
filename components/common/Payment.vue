<template>
  <v-dialog v-model="dialog" max-width="400">
    <v-card flat :class="$style.dialog">
      <v-card-title> {{ testSeries.name }} </v-card-title>

      <v-card-text class="ma-0 py-0">
        <v-subheader class="pa-0 my-2">
          Enter the Transaction Id received during payment
        </v-subheader>
        <v-text-field v-model="transactionId" solo-inverted flat label="Transaction Id" />
      </v-card-text>
      <v-card-actions class="pt-0">
        <v-spacer />
        <v-btn text color="primary" @click="$emit('close')">
          cancel
        </v-btn>
        <v-btn color="primary" @click="submit">
          submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["testSeries"],
  data() {
    return {
      dialog: true,
      transactionId: ""
    }
  },
  watch: {
    dialog(newValue, oldValue) {
      if (!newValue) this.$emit("close")
    }
  },
  methods: {
    submit() {
      if (!this.transactionId) this.$toast.info("Enter transaction ID.")
      else {
        this.$store
          .dispatch("payments/activate", {
            transactionId: this.transactionId,
            testSeries: this.testSeries.id
          })
          .then(
            (data) => {
              this.$emit("submit")
              this.$emit("close")
            },
            (error) => {}
          )
      }
    }
  }
}
</script>

<style module lang="scss">
.dialog {
  font-family: "Montserrat", Arial, Helvetica, sans-serif;
  border-radius: 8px;
  text-align: left;
  .title {
    font-family: "Open Sans", Arial, Helvetica, sans-serif;
    font-size: 1.17rem;
    line-height: 1.75rem;
    color: #5e5766;
  }
  .subheading {
    font-weight: bold;
    margin-bottom: 8px;
    font-size: 1.1rem;
  }
}
</style>
