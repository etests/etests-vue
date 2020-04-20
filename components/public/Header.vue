<template>
  <v-row>
    <SideBar
      :show="drawer"
      :is-temporary="true"
      @change="
        (value) => {
          drawer = value
        }
      "
    />
    <v-app-bar
      flat
      :class="[offsetTop > 20 ? $style.shadow : '', $style.header]"
      app
      tabs
      clipped-left
      :absolute="false"
      :fixed="true"
    >
      <v-app-bar-nav-icon v-if="isSmallScreen" @click="drawer = !drawer">
        <v-icon color="chill">
          mdi-menu
        </v-icon>
      </v-app-bar-nav-icon>

      <nuxt-link to="/" class="hidden-sm-and-down ml-5 mr-8">
        <v-toolbar-title>
          <v-img width="32px" style="float:left" :src="require('@/assets/logos/etests.png')" />
          <span v-if="dark" :class="[$style.logo, 'chill--text']">
            eTests
          </span>
        </v-toolbar-title>
      </nuxt-link>

      <slot name="search" />

      <v-spacer />
      <slot name="default">
        <template v-for="item in topNavMenu">
          <v-btn
            v-if="(item.requiresLogin && loggedIn) || !item.requiresLogin"
            v-show="!isSmallScreen || item.requiresLogin"
            :key="item.title"
            text
            rounded
            depressed
            :icon="isSmallScreen"
            color="secondary"
            :to="item.link"
          >
            <v-icon :class="isSmallScreen ? '' : 'mr-1'">
              {{ item.icon }}
            </v-icon>
            <template v-if="!isSmallScreen">
              {{ item.title }}
            </template>
          </v-btn>
        </template>
      </slot>

      <v-divider vertical inset class="mx-2 hidden-sm-and-down" />

      <DotMenu />
    </v-app-bar>
  </v-row>
</template>

<script>
import { mapGetters } from "vuex"
import SideBar from "./SideBar"
import DotMenu from "@/components/common/DotMenu"

export default {
  components: {
    SideBar,
    DotMenu
  },
  props: {
    dark: {
      required: false,
      default: false,
      type: Boolean
    },
    textColor: {
      required: false,
      default: "secondary",
      type: String
    },
    color: {
      required: false,
      default: "white",
      type: String
    },
    isAbsolute: {
      required: false,
      default: true,
      type: Boolean
    },
    showLogo: {
      required: false,
      default: true,
      type: Boolean
    },
    showDrawer: {
      required: false,
      default: null,
      type: Boolean
    }
  },
  data() {
    return {
      offsetTop: 0,
      drawer: this.showDrawer,
      title: "eTests"
    }
  },
  computed: {
    ...mapGetters(["loggedIn", "user"]),
    isSmallScreen() {
      return ["xs", "sm"].includes(this.$mq)
    },
    topNavMenu() {
      return [
        {
          title: "Test Series",
          icon: "",
          link: { path: "/testseries" }
        },
        {
          title: "Institutes",
          icon: "",
          link: { path: "/institutes" }
        },
        {
          title: "Exams",
          icon: "",
          link: { path: "/exams" }
        },
        {
          title: this.loggedIn ? this.user.name.split(" ")[0] : "",
          icon: "mdi-account-circle",
          link: { path: "/dashboard" },
          requiresLogin: true
        },
        { title: "Help", icon: "", link: { path: "/help" } }
      ]
    }
  },
  mounted() {
    if (process.client) window.onscroll = () => (this.offsetTop = window.scrollY)
  }
}
</script>

<style module lang="scss">
.logo {
  margin: 0 10px;
  line-height: 32px;
  font-family: "Montserrat", Arial, Helvetica, sans-serif;
  font-weight: 800;
  font-size: 2.5rem;
}
.header {
  background-color: rgba(255, 255, 255, 0.15) !important;
  backdrop-filter: blur(15px);
}
.shadow {
  box-shadow: 3px 3px 30px 15px rgba(128, 128, 128, 0.15);
}
</style>
