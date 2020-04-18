<template>
  <v-row align="center" :class="$style.social">
    <v-item-group>
      <v-item v-for="(page, i) in socialPages" :key="i">
        <v-col cols="12" class="ma-0 pa-0">
          <v-tooltip left>
            <template #activator="{ on }">
              <transition appear enter-active-class="animated zoomInRight">
                <v-btn
                  fab
                  dark
                  small
                  :href="page.href"
                  target="blank"
                  :color="page.color"
                  v-on="on"
                >
                  <v-icon>{{ page.icon }}</v-icon>
                </v-btn>
              </transition>
            </template>
            <span>{{ page.title }}</span>
          </v-tooltip>
        </v-col>
      </v-item>
    </v-item-group>
  </v-row>
</template>

<script>
import { socialPages } from "@/js/socialPages"

export default {
  data() {
    return {
      socialPages
    }
  }
}
</script>

<style module lang="scss">
.social {
  position: fixed;
  right: 50px;
  top: 0;
  z-index: 1;
  width: 50px;
  height: 100%;
}
</style>
