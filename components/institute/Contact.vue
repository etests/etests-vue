<template>
  <v-card class="page my-10 elevation-0" outlined max-width="600">
    <v-card-title>{{ title }}</v-card-title>
    <v-divider />
    <v-card-text>
      <v-form ref="form" v-model="valid" :lazy-validation="true">
        <v-text-field
          v-model="firstName"
          solo-inverted
          flat
          :rules="rules.firstName"
          label="First Name"
          required
        />
        <v-text-field v-model="lastName" solo-inverted flat label="Last Name" />
        <v-text-field
          v-model="phone"
          solo-inverted
          flat
          label="Phone "
          :rules="rules.phone"
          required
        />
        <v-text-field
          v-model="email"
          solo-inverted
          flat
          :rules="rules.email"
          label="E-mail"
          required
        />

        <v-textarea
          v-model="description"
          solo-inverted
          flat
          :counter="250"
          label="Description"
          :rules="rules.description"
        />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn text color="primary" @click="reset">
        Reset
      </v-btn>
      <v-btn :disabled="!valid" color="primary" @click="validate">
        Submit
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "Contact Us"
    }
  },
  data: () => ({
    valid: true,
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    description: "",
    rules: {
      firstName: [
        (v) => !!v || "Write your name",
        (v) => (v && v.length <= 50) || "Your name is too long"
      ],
      phone: [
        (v) => !!v || "Please enter your phone number",
        (v) => /[6-9]\d{9,12}/.test(v) || "Enter a valid phone number"
      ],
      email: [
        (v) => !!v || "Please enter your email id",
        (v) => (v && v.length <= 100) || "Email is too long",
        (v) => /.+@.+\..+/.test(v) || "Enter a valid email id"
      ],
      description: [
        (v) => !!v || "Write a few words.",
        (v) => (v && v.length <= 250) || "Description is too long"
      ]
    }
  }),
  methods: {
    validate() {
      this.$refs.form.validate()
      this.submit()
    },
    reset() {
      this.$refs.form.reset()
    },
    submit() {
      this.$store.cache.dispatch("institutes/contact", {
        firstName: this.firstName,
        lastName: this.lastName,
        phone: this.phone,
        email: this.email,
        description: this.description,
        institute: this.$handle
      })
    }
  }
}
</script>
