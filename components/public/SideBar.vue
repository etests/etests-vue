<template>
  <v-navigation-drawer app v-model="drawer" :temporary="isTemporary" width="260" dark>
    <v-row class="py-6 px-2">
      <v-col cols="auto">
        <router-link to="/" class="d-flex align-center">
          <v-img
            :src="require('@/assets/logos/etests.png')"
            max-height="30px"
            max-width="30px"
            alt="logo"
            contain
            eager
            class="me-3"
          />
          <v-slide-x-transition>
            <div class="text-h5 white--text">
              CourseClip
            </div>
          </v-slide-x-transition>
        </router-link>
      </v-col>
    </v-row>

    <v-list expand shaped class="pr-5">
      <v-list-item-group>
        <template v-for="(item, i) in menu">
          <nav-menu-link
            v-if="checkVisible(item)"
            :key="i"
            :title="item.title"
            :to="item.link"
            :icon="item.icon"
          />
        </template>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import { mapGetters } from "vuex"

import NavMenuLink from "@/components/ui/nav/NavMenuLink.vue"

export default {
  props: {
    show: {
      required: false,
      default: true,
    },
    isTemporary: {
      required: false,
      default: false,
    },
  },
  components: {
    NavMenuLink,
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
      },
    },
    menu() {
      return [
        { title: "Home", icon: "mdi-home-outline", link: "/" },

        {
          title: "Tests",
          icon: "mdi-math-compass",
          link: { path: "/user/tests" },
          auth: true,
          sites: ["public", "institute"],
          scope: ["student", "institute", "staff"],
        },

        {
          title: "Online Classes",
          icon: "mdi-video-outline",
          link: { path: "/institute/classes" },
          auth: true,
          sites: ["institute"],
          scope: ["student", "institute", "staff"],
        },

        {
          title: "Assignments",
          icon: "mdi-paperclip",
          link: { path: "/institute/assignments" },
          auth: true,
          sites: ["institute"],
          scope: ["student", "institute", "staff"],
        },

        {
          title: "Question Bank",
          icon: "mdi-book-multiple",
          link: { path: "/questionbank" },
          auth: true,
          sites: ["public"],
          scope: ["staff"],
        },

        {
          title: "Annotate",
          icon: "mdi-pencil-box-outline",
          link: { path: "/annotate" },
          auth: true,
          sites: ["public"],
          scope: ["staff"],
        },

        {
          title: "Students",
          icon: "mdi-account-multiple-outline",
          link: { path: "/institute/students" },
          auth: true,
          sites: ["institute"],
          scope: ["institute"],
        },

        {
          title: "Test Series",
          icon: "mdi-book-outline",
          link: { path: "/testseries" },
          sites: ["public"],
        },
        {
          title: "Exams",
          icon: "mdi-newspaper-variant-outline",
          link: { path: "/exams" },
          sites: ["public"],
        },

        {
          title: "Institutes",
          icon: "mdi-school-outline",
          link: { path: "/institutes" },
          sites: ["public"],
        },

        {
          title: "Plans",
          icon: "mdi-tag-outline",
          link: { path: "/plans" },
          auth: false,
          sites: ["public"],
        },

        {
          title: "Help",
          icon: "mdi-help-circle-outline",
          link: { path: "/help" },
          sites: ["public", "institute"],
        },
      ]
    },
  },
  methods: {
    checkVisible(item) {
      let authCheck = false,
        siteCheck = false,
        scopeCheck = false

      if (item.auth === true && this.loggedIn) authCheck = true
      else if (item.auth === false && !this.loggedIn) authCheck = true
      else if (item.auth === undefined) authCheck = true

      if (Array.isArray(item.sites)) {
        if (this.$handle === "public" && item.sites.includes("public")) siteCheck = true
        if (this.$handle === "public" && this.loggedIn && this.$auth.hasScope("institute"))
          siteCheck = true
        if (this.$handle !== "public" && item.sites.includes("institute")) siteCheck = true
      } else siteCheck = true

      if (Array.isArray(item.scope) && this.loggedIn) {
        if (item.scope.filter((value) => this.$auth.hasScope(value)).length > 0) scopeCheck = true
      } else scopeCheck = true

      return authCheck && siteCheck && scopeCheck
    },
  },
}
</script>
