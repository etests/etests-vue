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
      <v-btn v-shortkey="['enter']" color="primary" @shortkey="submit" @click="submit">
        Submit
      </v-btn>
    </v-card-text>
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
      const data = {
        oldPassword: this.oldPassword,
        newPassword: this.newPassword
      }
      this.$store.cache.dispatch("auth/changePassword", data)
    }
  }
}
</script>
