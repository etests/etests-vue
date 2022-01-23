<template>
  <StandardLayout>
    <v-row justify="center">
      <v-col cols="12" lg="4">
        <Profile />
      </v-col>
      <v-col cols="12" lg="8">
        <v-tabs v-model="currentTab" show-arrows>
          <v-tabs-slider></v-tabs-slider>
          <v-tab v-for="(tab, i) in tabs" :key="i" class="font-weight-bold">
            <v-icon class="mr-3">{{ tab.icon }}</v-icon> {{ tab.title }}
          </v-tab>
        </v-tabs>
        <v-sheet class="transparent py-6">
          <template v-for="(tab, i) in tabs">
            <component :is="tab.component" :key="i" v-show="i == currentTab" />
          </template>
        </v-sheet>
      </v-col>
    </v-row>
  </StandardLayout>
</template>

<script>
import StandardLayout from "@/layouts/StandardLayout"
import Profile from "@/components/account/Profile"

export default {
  middleware: "login",
  components: {
    StandardLayout,
    Profile,
  },
  data() {
    return {
      currentTab: null,
      tabs: [
        {
          title: "Security",
          icon: "mdi-lock-outline",
          component: () => import("@/components/account/Password"),
        },
        {
          title: "Connections",
          icon: "mdi-link",
          component: () => import("@/components/account/ConnectedAccounts"),
        },
        {
          title: "Plan",
          icon: "mdi-bookmark-outline",
          component: () => import("@/components/account/Plan"),
        },
      ],
    }
  },
}
</script>
