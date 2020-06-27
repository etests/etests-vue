<template>
  <v-card class="page" max-width="500">
    <v-card-title>
      Change Password
    </v-card-title>
    <v-divider class="mb-4" />
    <v-card-text>
      <v-text-field
        v-model="oldPassword"
        solo-inverted
        flat
        :append-icon="showOldPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :type="showOldPassword ? 'text' : 'password'"
        label="Current Password"
        class="input-group--focused"
        @click:append="showOldPassword = !showOldPassword"
      />

      <v-text-field
        v-model="newPassword"
        solo-inverted
        flat
        :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :type="showNewPassword ? 'text' : 'password'"
        label="New Password"
        class="input-group--focused"
        @click:append="showNewPassword = !showNewPassword"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn v-shortkey="['enter']" color="primary" @shortkey="submit" @click="submit">
        Submit
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      showNewPassword: false,
      showOldPassword: false,
      oldPassword: "",
      newPassword: ""
    }
  },
  methods: {
    submit() {
      let error = null
      if (!this.oldPassword) error = "Enter your current password."
      else if (!this.newPassword) error = "Enter new password."
      if (error) this.$toast.info(error)
      else {
        const data = {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword
        }
        this.$store.cache.dispatch("tabs/changePassword", data)
      }
    }
  }
}
</script>
