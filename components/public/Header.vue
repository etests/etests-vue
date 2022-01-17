<template>
  <v-row>
    <SideBar
      :show="drawer"
      :is-temporary="temporaryDrawer"
      @change="
        (value) => {
          drawer = value
        }
      "
    />
    <v-app-bar
      flat
      :class="[
        offsetTop > 20 ? $style.shadow : '',
        $style.header,
        fluid ? 'boxed-container' : 'mx-4 my-2',
      ]"
      app
      tabs
      :absolute="false"
      :fixed="true"
    >
      <v-app-bar-nav-icon v-if="!drawer" @click="drawer = !drawer">
        <v-icon large color="plume">
          mdi-menu
        </v-icon>
      </v-app-bar-nav-icon>

      <slot name="search" />

      <v-spacer />
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
    DotMenu,
  },
  props: {
    dark: {
      required: false,
      default: false,
      type: Boolean,
    },
    textColor: {
      required: false,
      default: "secondary",
      type: String,
    },
    color: {
      required: false,
      default: "white",
      type: String,
    },
    isAbsolute: {
      required: false,
      default: true,
      type: Boolean,
    },
    showLogo: {
      required: false,
      default: true,
      type: Boolean,
    },
    temporaryDrawer: {
      required: false,
      default: null,
      type: Boolean,
    },
    showDrawer: {
      required: false,
      default: null,
      type: Boolean,
    },
    fluid: {
      required: false,
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      offsetTop: 0,
      drawer: this.showDrawer,
      title: "CourseClip",
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
          link: { path: "/testseries" },
        },
        {
          title: "Institutes",
          icon: "",
          link: { path: "/institutes" },
        },
        {
          title: "Exams",
          icon: "",
          link: { path: "/exams" },
        },
        {
          title: this.loggedIn ? this.user.name.split(" ")[0] : "",
          icon: "mdi-account-circle",
          link: { path: "/dashboard" },
          requiresLogin: true,
        },
        { title: "Help", icon: "", link: { path: "/help" } },
      ]
    },
  },
  mounted() {
    if (process.client) window.onscroll = () => (this.offsetTop = window.scrollY)
  },
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
