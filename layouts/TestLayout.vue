<template>
  <v-app>
    <v-container fluid class="pa-0 mx-0">
      <component
        :is="sidebar"
        :is-temporary="true"
        :show="drawer"
        @change="
          (value) => {
            this.drawer = value
          }
        "
      />

      <v-dialog v-model="pageView" fullscreen>
        <v-toolbar color="primary" extended dark flat>
          <v-toolbar-title class="font-weight-bold">
            <slot name="test-name" />
          </v-toolbar-title>
          <v-spacer />
          <slot name="timer" />
          <v-btn large icon @click="pageView = false">
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </v-toolbar>
        <v-card color="grey lighten-4" flat tile>
          <v-card-text class="pa-0 ma-0">
            <v-container>
              <slot name="page-view" />
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-card color="white" flat :height="windowHeight">
        <v-app-bar
          fixed
          flat
          dense
          :extension-height="['xs', 'sm'].includes($mq) ? 100 : 50"
          color="white"
          app
          clipped-right
        >
          <v-app-bar-nav-icon @click="drawer = !drawer">
            <v-icon color="primary">
              mdi-menu
            </v-icon>
          </v-app-bar-nav-icon>
          <v-toolbar-title class="primary--text text-truncate">
            <strong class="text-center">
              <slot name="test-name" />
            </strong>
          </v-toolbar-title>
          <v-spacer />
          <slot name="help" />
          <slot
            name="page-view-activator"
            :on="{
              click: () => (pageView = true)
            }"
          />
          <v-sheet
            slot="extension"
            width="100%"
            :class="['white', ['xs', 'sm'].includes($mq) ? 'text-center' : 'text-left']"
          >
            <slot name="controls" />
            <v-divider />
          </v-sheet>
        </v-app-bar>
        <v-main class="ma-auto mt-0 text-left" app>
          <v-sheet class="px-3" height="auto" min-height="450px">
            <v-row justify="center" justify-md="start">
              <slot name="info" />
            </v-row>

            <slot name="review" />

            <slot name="text-image" />

            <slot name="clear" />

            <slot name="options" />
          </v-sheet>
        </v-main>
      </v-card>

      <v-footer fixed color="white" height="50" app>
        <v-row justify="center" class="text-center">
          <slot name="footer" />
        </v-row>
      </v-footer>

      <v-navigation-drawer
        permanent
        app
        right
        clipped
        touchless
        :mini-variant="['xs', 'sm'].includes($mq)"
        mini-variant-width="45"
      >
        <slot name="questions-panel" />
        <v-row>
          <slot name="submit" />
        </v-row>
      </v-navigation-drawer>
    </v-container>
  </v-app>
</template>

<script>
import StandardSideBar from "@/components/public/SideBar"
import InstituteSideBar from "@/components/institute/SideBar"

export default {
  props: ["showPanel"],
  data() {
    return {
      pageView: false,
      windowHeight: window.innerHeight,
      drawer: null,
      fullscreen: false,
      swipeActions: {
        left: () => this.nextQuestion(),
        right: () => this.previousQuestion()
      }
    }
  },
  computed: {
    panel: {
      get() {
        return this.showPanel
      },
      set(value) {
        this.$emit("changePanel", value)
      }
    },
    sidebar() {
      return this.$handle != "public" ? InstituteSideBar : StandardSideBar
    }
  },
  beforeCreate() {
    const viewport = document.querySelector("meta[name=viewport]")
    viewport.setAttribute(
      "content",
      "width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=yes, minimal-ui"
    )
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", () => {
        this.windowHeight = window.innerHeight
      })
    })
  }
}
</script>
