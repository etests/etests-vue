<template>
  <v-app>
    <v-container style="height: 100%;">
      <Header :showDrawer="false" :temporaryDrawer="true" />
      <v-main app class="mt-8">
        <v-row>
          <v-col cols="12">
            <slot />
          </v-col>
        </v-row>
      </v-main>
    </v-container>
  </v-app>
</template>

<script>
import Header from "@/components/public/Header.vue"

export default {
  components: {
    Header,
  },
  data() {
    return {}
  },
}
</script>
