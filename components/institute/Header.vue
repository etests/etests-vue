<template>
  <v-row class="v-application">
    <SideBar
      :show="drawer"
      :is-temporary="true"
      @change="
        (value) => {
          this.drawer = value
        }
      "
    />
    <v-app-bar
      app
      scroll-threshold="20"
      width="100%"
      flat
      :class="[offsetTop > 20 ? $style.shadow : 'transparent', $style.header]"
      fixed
    >
      <v-skeleton-loader v-if="status.loading" class="mt-1" type="avatar" />
      <template v-else>
        <v-app-bar-nav-icon v-if="isSmallScreen" @click="drawer = !drawer">
          <v-icon :color="color">
            mdi-menu
          </v-icon>
        </v-app-bar-nav-icon>
        <nuxt-link to="/" class="text-truncate">
          <v-toolbar-title :class="[`${color}--text`, 'font-weight-bold']">
            <v-app-bar-nav-icon v-if="!isSmallScreen" class="mb-2">
              <v-avatar v-if="institute && institute.user && institute.user.image" size="32px">
                <v-img :src="institute.user.image" />
              </v-avatar>
              <v-icon v-else :color="color">
                mdi-apple-safari
              </v-icon>
            </v-app-bar-nav-icon>
            <template v-if="institute && institute.user">
              {{ institute.user.name }}
            </template>
            <template v-else>
              Home
            </template>
          </v-toolbar-title>
        </nuxt-link>
      </template>
      <v-spacer />
      <template v-for="(item, i) in menu">
        <v-skeleton-loader
          v-if="status.loading && (!isSmallScreen || item.requiresLogin)"
          :key="i"
          type="chip"
          class="mr-5"
        />
        <template v-else-if="!isSmallScreen || item.requiresLogin">
          <v-btn
            v-if="(item.requiresLogin && loggedIn) || !item.requiresLogin"
            :key="i"
            small
            text
            rounded
            depressed
            :icon="isSmallScreen"
            :color="color"
            :to="item.link"
          >
            <v-icon :class="isSmallScreen ? '' : 'mr-1'">
              {{ item.icon }}
            </v-icon>
            <template v-if="!isSmallScreen">
              <span v-if="item.customTitle && item.customTitle.length">
                {{ item.customTitle }}
              </span>
              <span v-else>
                {{ item.title }}
              </span>
            </template>
          </v-btn>
        </template>
      </template>
      <v-btn
        v-if="editable || (loggedIn && $auth.hasScope('student'))"
        :color="color"
        icon
        to="/dashboard?tab=0"
      >
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
      <v-btn v-if="editable && !status.loading" :color="color" icon to="/settings">
        <v-icon>mdi-dns</v-icon>
      </v-btn>
      <DotMenu :color="color" />
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
  props: ["dark"],
  data() {
    return {
      offsetTop: 0,
      drawer: null
    }
  },
  computed: {
    ...mapGetters({
      institute: "institutes/institute",
      theme: "institutes/theme",
      editable: "institutes/editable",
      status: "institutes/status",
      loggedIn: "loggedIn",
      user: "user"
    }),
    defaultMenu() {
      return [
        {
          title: "Test Series",
          link: this.institute ? `/testseries?institute=${this.institute.id}` : ""
        },
        {
          title: "Downloads",
          link: "/downloads"
        },
        {
          title: "Questions",
          link: "/questions"
        },
        {
          title: "Gallery",
          link: "/gallery"
        },
        {
          title: "Faculty",
          link: "/faculty"
        },
        {
          title: "Centers",
          link: "/centers"
        },
        { title: "Courses", link: "/courses" },
        { title: "FAQ", link: "/faq" }
      ]
    },
    isSmallScreen() {
      return ["xs", "sm"].includes(this.$mq)
    },
    color() {
      return this.dark && this.offsetTop < 20 ? "white" : "primary"
    },
    menu() {
      if (this.institute && this.institute.settings && this.institute.settings.sections) {
        return this.defaultMenu.filter((tab) => {
          return (
            !this.institute.settings.sections.find((section) => {
              return tab.title === section.component
            }) ||
            this.institute.settings.sections.find((section) => {
              if (tab.title === section.component && section.show) {
                if (section.name.length) tab.customTitle = section.name
                else tab.customTitle = null
                return true
              } else return false
            })
          )
        })
      } else return this.defaultMenu
    }
  },
  watch: {
    theme(newValue, oldValue) {
      this.$vuetify.theme.themes.light.primary = newValue
    }
  },
  mounted() {
    if (process.client)
      window.onscroll = () => {
        this.offsetTop = window.scrollY
      }
    this.$store.cache.dispatch("institutes/get", this.$handle)
  }
}
</script>

<style module lang="scss">
.header {
  transition: background-color 500ms ease-in;
}
.shadow {
  background-color: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(15px);
  box-shadow: 3px 3px 30px 15px rgba(128, 128, 128, 0.15);
}
</style>
