<template>
  <v-navigation-drawer v-model="drawer" clipped app floating width="260" :temporary="isTemporary">
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
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>
        </template>
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
    ...mapGetters(["loggedIn", "user"]),
    drawer: {
      get() {
        return this.show
      },
      set(value) {
        this.$emit("change", value)
      }
    },
    menu() {
      return [
        { title: "Home", icon: "mdi-home", link: "/" },

        {
          title: "Tests",
          icon: "mdi-note",
          link: { path: "/dashboard/0" },
          requiresLogin: true
        },

        {
          title: "Dashboard",
          icon: "mdi-account-circle",
          link: { path: "/dashboard" },
          requiresLogin: true
        },

        { divider: true, requiresLogin: true },

        {
          title: "Test Series",
          icon: "mdi-book",
          link: { path: "/testseries" }
        },
        {
          title: "Exams",
          icon: "mdi-newspaper-variant",
          link: { path: "/exams" }
        },

        {
          title: "Institutes",
          icon: "mdi-city",
          link: { path: "/institutes" }
        },

        { divider: true },

        {
          title: "Help",
          icon: "mdi-help-circle",
          link: { path: "/help" }
        }
      ]
    }
  }
}
</script>
