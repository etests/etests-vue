<template>
  <v-navigation-drawer
    v-model="drawer"
    clipped
    app
    floating
    width="260"
    :temporary="isTemporary"
    class="v-application"
  >
    <v-list>
      <v-list-item-group color="primary">
        <template v-for="(item, i) in menu">
          <div v-if="!item.requiresLogin || (item.requiresLogin && loggedIn)" :key="i">
            <v-divider v-if="item.divider" dark class="my-2" />
            <v-list-item v-else exact :to="item.link">
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  <span v-if="item.customTitle && item.customTitle.length">
                    {{ item.customTitle }}
                  </span>
                  <span v-else>
                    {{ item.title }}
                  </span>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>
        </template>
        <v-list-item
          v-if="editable || (loggedIn && user && user.type === 'student')"
          exact
          to="/settings"
        >
          <v-list-item-action>
            <v-icon>mdi-dns</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              Settings
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import { mapGetters } from "vuex"

export default {
  props: {
    show: {
      required: false,
      default: true
    },
    isTemporary: {
      required: false,
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {
    drawer: {
      get() {
        return this.show
      },
      set(value) {
        this.$emit("change", value)
      }
    },
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
        { title: "Home", icon: "mdi-home", link: "/" },
        {
          title: "Tests",
          icon: "mdi-note",
          link: { path: "/dashboard/0" },
          requiresLogin: true
        },
        {
          title: "Test Series",
          icon: "mdi-book",
          link: {
            path: this.institute ? `/testseries?institute=${this.institute.id}` : ""
          }
        },

        { divider: true, requiresLogin: true },

        {
          title: "Courses",
          icon: "",
          link: { path: "/courses" },
          icon: "mdi-book-open-page-variant"
        },

        {
          title: "Downloads",
          icon: "mdi-download",
          link: { path: "/downloads" }
        },

        {
          title: "Questions",
          icon: "mdi-comment-question",
          link: "/questions"
        },

        { divider: true },

        {
          title: "Gallery",
          icon: "mdi-image",
          link: { path: "/gallery" }
        },

        {
          title: "Faculty",
          icon: "mdi-account-multiple",
          link: { path: "/faculty" }
        },
        {
          title: "Centers",
          icon: "mdi-city",
          link: { path: "/centers" }
        },

        { divider: true },

        {
          title: "FAQ",
          icon: "mdi-help-circle",
          link: { path: "/faq" }
        }
      ]
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
      this.setTheme(newValue)
    }
  },
  mounted() {
    this.$store.cache.dispatch("institutes/get", this.$handle)
    this.setTheme(this.theme)
  },
  methods: {
    setTheme(color) {
      this.$vuetify.theme.themes.light.primary = color
    }
  }
}
</script>
