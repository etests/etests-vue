<template>
  <StandardLayout>
    <v-col cols="12" lg="8" class="ma-auto">
      <v-card class="page">
        <v-card-title>
          Register as Institute
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <form :class="$style.form" @keyup.enter="register">
            <v-text-field v-model="name" solo-inverted flat label="Name" />
            <v-text-field v-model="email" solo-inverted flat label="Email" />
            <v-text-field v-model="phone" solo-inverted flat label="Phone" />
            <v-text-field
              v-model="registerPassword"
              solo-inverted
              flat
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              name="input-10-2"
              label="Password"
              value=""
              class="input-group--focused"
              @click:append="showPassword = !showPassword"
            />
            <v-btn color="chill" @click="register">
              Register
            </v-btn>
          </form>
        </v-card-text>
      </v-card>
    </v-col>
  </StandardLayout>
</template>

<script>
import { mapState } from "vuex"
import StandardLayout from "@/layouts/StandardLayout"

export default {
  components: {
    StandardLayout
  },
  data() {
    return {
      isSmallScreen: this.$vuetify.breakpoint.smAndDown,
      forgot: false,
      enterCode: false,
      code: "",
      password1: "",
      password2: "",
      username: "",
      password: "",
      name: "",
      email: "",
      phone: "",
      registerPassword: "",
      showPassword: false
    }
  },
  computed: {
    ...mapState({
      status: (state) => state.auth.status
    }),
    tab: {
      get() {
        return this.$store.state.auth.dialog.tab
      },
      set(value) {
        this.$store.cache.dispatch("auth/changeAuthTab", value)
      }
    }
  },
  methods: {
    isValidEmail(email) {
      return (
        email &&
        email.split("@").length === 2 &&
        email.split("@")[1].split(".").length >= 2 &&
        email.split("@")[1].split(".")[1]
      )
    },
    isValidPhone(phone) {
      return !isNaN(phone) && phone.length >= 10 && phone.length <= 13 && parseInt(phone[0]) >= 6
    },
    submitResetCode(e) {
      let error = null
      if (!this.code) error = "Enter reset code."
      if (!this.password1) error = "Enter password."
      if (!this.password2) error = "Confirm password."
      if (this.password1 !== this.password2) error = "Passwords don't match"
      if (error) this.$toast.info(error)
      else {
        const data = {
          resetCode: this.code,
          newPassword: this.password1
        }
        this.$store.cache.dispatch("auth/submitResetCode", data)
      }
    },
    sendResetCode(e) {
      let error = null
      if (!this.email) error = "Enter your email."
      if (error) this.$toast.info(error)
      else {
        const { email } = this
        if (email) this.$store.cache.dispatch("auth/sendResetCode", { email })
      }
    },
    login(e) {
      let error = null
      if (!this.username) error = "Enter your email or phone."
      else if (!this.password) error = "Enter your password."

      if (error) this.$toast.info(error)
      else {
        const { username, password } = this
        if (username && password) {
          this.$store.cache.dispatch("auth/login", { username, password })
        }
      }
    },
    register(e) {
      let error = null
      if (!this.name) error = "Enter your name."
      else if (this.name.length > 100) error = "Your name is too long!"
      else if (!this.email) error = "Enter your email id."
      else if (!this.isValidEmail(this.email)) error = "Email id is invalid!"
      else if (!this.isValidPhone(this.phone)) error = "Phone number is invalid."
      else if (!this.registerPassword) error = "Enter a password."
      else if (this.registerPassword.length < 8) error = "Password is too short!"

      if (error) this.$toast.info(error)
      else {
        const data = {
          name: this.name,
          email: this.email,
          phone: this.phone,
          password: this.registerPassword,
          isStudent: false,
          isInstitute: true
        }
        this.$store.cache.dispatch("auth/register", data)
      }
    }
  }
}
</script>

<style module lang="scss">
.dialog {
  border-radius: 12px;
  min-height: 400px;
  .title {
    margin-left: 54px;
    text-align: left;
    font-size: 1.3rem;
    color: #7e777e;
  }
  .form {
    width: 450px;
    max-width: 95%;
    min-height: 300px;
    border-radius: 8px;
  }
}
</style>
