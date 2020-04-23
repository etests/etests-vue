<template>
  <div>
    <slot name="help" />
    <v-btn v-if="loggedIn" :color="color" class="mx-0" icon @click="logout">
      <v-icon>mdi-power</v-icon>
    </v-btn>
    <v-btn
      v-else
      :color="color"
      class="mx-0"
      rounded
      @click="$store.commit('tabs/toggleAuthDialog', true)"
    >
      Login
    </v-btn>

    <v-dialog
      v-model="showLoginDialog"
      :fullscreen="['xs', 'sm'].includes($mq)"
      :persistent="['xs', 'sm'].includes($mq)"
      :retain-focus="false"
      max-width="600px"
    >
      <Login @close="showLoginDialog = false" />
    </v-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import Login from "./Login"

export default {
  components: {
    Login
  },
  props: {
    show: {
      required: false,
      default: true,
      type: Boolean
    },
    isTemporary: {
      required: false,
      default: false,
      type: Boolean
    },
    color: {
      type: String,
      default: "secondary"
    }
  },
  data() {
    return {
      dotMenu: [
        {
          title: "Help",
          icon: "mdi-help-circle-outline",
          link: "/faq",
          action: (_) => null
        },
        {
          title: "Logout",
          icon: "mdi-logout-variant",
          link: "",
          action: this.logout
        }
      ]
    }
  },
  computed: {
    ...mapGetters(["loggedIn", "user"]),
    showLoginDialog: {
      get: function() {
        return this.$store.getters["tabs/dialog"].show
      },
      set: function(value) {
        this.$store.commit("tabs/toggleAuthDialog", value)
      }
    },
    drawer: {
      get() {
        return this.show
      },
      set(value) {
        this.$emit("change", value)
      }
    },
    isStudent() {
      if (!this.loggedIn) return false
      else return this.user.type === "student"
    },
    isInstitute() {
      if (!this.loggedIn) return false
      else return this.user.type === "institute"
    }
  },
  methods: {
    logout() {
      this.$auth.logout()
      this.$store.cache.clear()
    }
  }
}
</script>

<style scoped>
.v-menu__content {
  border-radius: 8px;
  font-family: "Istok Web";
  font-size: 1.3rem;
  min-width: 160px;
}
</style>
