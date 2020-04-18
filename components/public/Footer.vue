<template>
  <v-row justify="center" align="center">
    <v-card flat class="text-center">
      <v-card-actions>
        <span class="primary--text">
          &copy;2019 &nbsp;
          <strong>eTests</strong>
        </span>
        <v-btn
          v-for="page in socialPages"
          :key="page.href"
          color="primary"
          icon
          large
          :href="page.href"
          target="blank"
        >
          <v-icon size="20px">
            {{ page.icon }}
          </v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-row>
</template>

<script>
import { socialPages } from "@/js/socialPages"

export default {
  props: {
    fixed: {
      required: false,
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      socialPages
    }
  }
}
</script>
