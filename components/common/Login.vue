<template>
  <v-card :tile="['xs', 'sm'].includes($mq)">
    <v-card-title class="pb-0">
      <v-tabs v-model="tab" class="transparent" slider-color="primary" centered>
        <v-tab active-class="primary--text">
          Login
        </v-tab>
        <v-tab active-class="primary--text">
          Signup
        </v-tab>
      </v-tabs>
      <v-btn
        v-if="['xs', 'sm'].includes($mq)"
        fixed
        class="mr-5"
        right
        icon
        @click="$emit('close')"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-divider />
    <v-card-text>
      <div v-if="false" ref="googleLoginBtn">
        <v-btn>
          Continue with Google
        </v-btn>
      </div>

      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-card-title>
            <span v-if="forgot">Recover password</span>
          </v-card-title>
          <v-card-text>
            <transition name="fade">
              <form v-if="forgot">
                <div v-if="status.sending || status.resetting">
                  <v-progress-circular :size="50" color="primary" indeterminate />
                </div>
                <div v-else-if="status.reset" class="text-left">
                  Password Changed Successfully! <br />
                  <div class="text-left my-1">
                    <nuxt-link to="" @click.native="forgot = false">
                      Back to login
                    </nuxt-link>
                  </div>
                </div>
                <div v-else-if="status.sent || status.submitResetError">
                  <v-text-field v-model="code" solo-inverted flat label="Reset Code" />
                  <v-text-field
                    v-model="password1"
                    solo-inverted
                    flat
                    label="New Password"
                    :type="showPassword ? 'text' : 'password'"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                  />
                  <v-text-field
                    v-model="password2"
                    solo-inverted
                    flat
                    label="Confirm Password"
                    :type="showPassword ? 'text' : 'password'"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                  />
                  <div class="text-left my-1">
                    <nuxt-link to="" @click.native="sendResetCode">
                      Resend Code
                    </nuxt-link>
                    <br />
                    <nuxt-link to="" @click.native="forgot = false">
                      Back to login
                    </nuxt-link>
                  </div>
                  <v-btn color="primary" @click="submitResetCode">
                    Change Password
                  </v-btn>
                </div>
                <div v-else>
                  <v-text-field v-model="email" solo-inverted flat label="Email" />
                  <div class="text-left my-1">
                    <nuxt-link to="" @click.native="forgot = false">
                      Back to login
                    </nuxt-link>
                  </div>
                  <br />
                  <v-btn color="primary" @click="sendResetCode">
                    Send Reset Code
                  </v-btn>
                </div>
              </form>
              <form v-else @keyup.enter="login">
                <v-text-field v-model="username" solo-inverted flat label="Email or phone" />
                <v-text-field
                  v-model="password"
                  solo-inverted
                  flat
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  name="input-10-2"
                  label="Password"
                  value=""
                  @click:append="showPassword = !showPassword"
                />
                <div class="text-left my-1">
                  <nuxt-link to="" @click.native="forgot = true">
                    Forgot your password? Click here.
                  </nuxt-link>
                </div>
                <br />
                <v-btn color="primary" @click="login">
                  Login
                </v-btn>
              </form>
            </transition>
          </v-card-text>
        </v-tab-item>

        <v-tab-item>
          <v-card-title v-if="verification" class="body-1">
            Enter the verification code sent to your email.
          </v-card-title>
          <v-card-text>
            <form v-if="verification">
              <v-text-field
                v-model="verificationCode"
                solo-inverted
                flat
                label="Verification Code"
              />
              <v-btn color="primary" @click="verify">
                Submit
              </v-btn>
            </form>
            <form v-else @keyup.enter="register">
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
                @click:append="showPassword = !showPassword"
              />
              <v-btn color="primary" @click="register">
                Signup
              </v-btn>
            </form>
          </v-card-text>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from "vuex"

export default {
  data() {
    return {
      forgot: false,
      verification: false,
      verificationCode: "",
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
  mounted() {
    if (false)
      window.gapi.load("auth2", () => {
        const auth2 = window.gapi.auth2.init({
          client_id: "525257101255-7dv26govso2amp6572enqnl35vh1h6f0.apps.googleusercontent.com",
          cookiepolicy: "single_host_origin"
        })
        auth2.attachClickHandler(
          this.$refs.googleLoginBtn,
          {},
          (googleUser) => {
            console.log(googleUser)
          },
          (error) => console.log(error)
        )
      })
  },
  computed: {
    ...mapState({
      status: (state) => state.tabs.status
    }),
    tab: {
      get() {
        return this.$store.state.tabs.dialog.tab
      },
      set(value) {
        this.$store.commit("tabs/changeAuthTab", value)
      }
    }
  },
  methods: {
    googleLogin(googleUser) {
      console.log(googleUser)
    },
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
        this.$store.cache.dispatch("tabs/submitResetCode", data)
      }
    },
    sendResetCode(e) {
      let error = null
      if (!this.email) error = "Enter your email."
      if (error) this.$toast.info(error)
      else {
        const { email } = this
        if (email) this.$store.cache.dispatch("tabs/sendResetCode", { email })
      }
    },
    login(e) {
      let error = null
      if (!this.username) error = "Enter your email or phone."
      else if (!this.password) error = "Enter your password."

      if (error) this.$toast.info(error)
      else {
        let username = this.username,
          password = this.password
        if (username && password) {
          this.$auth
            .loginWith("local", {
              data: { username, password }
            })
            .then(
              (response) => {
                this.$store.commit("tabs/toggleAuthDialog", false)
                this.$auth.setUser(response.data.user)
                this.$toast.success("Welcome!")
              },
              (error) => {
                this.$toast.success(error)
              }
            )
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
          isStudent: true,
          isInstitute: false
        }

        this.$store.cache.dispatch("tabs/register", data).then(
          (_) => {
            this.verification = true
          },
          (error) => {
            console.log(error)
          }
        )
      }
    },
    verify(e) {
      let error = null
      if (!this.verificationCode) error = "Enter Verification Code."

      const email = this.email
      const verificationCode = this.verificationCode
      const password = this.registerPassword

      if (error) this.$toast.info(error)
      else {
        this.$store
          .dispatch("tabs/verify", {
            email,
            verificationCode
          })
          .then(
            (response) => {
              this.login()
            },
            (error) => {}
          )
      }
    }
  }
}
</script>
