<template>
  <v-list-item class="vertical-nav-menu-link" v-bind="$attrs" active-class="plume">
    <v-list-item-icon>
      <v-icon :class="{ 'alternate-icon-small': !icon }" class="mx-auto">
        {{ icon }}
      </v-icon>
    </v-list-item-icon>

    <v-list-item-title>
      {{ title }}
    </v-list-item-title>
  </v-list-item>
</template>

<script>
import { mdiCheckboxBlankCircleOutline } from "@mdi/js"

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: undefined,
    },
  },
  setup() {
    return {
      alternateIcon: mdiCheckboxBlankCircleOutline,
    }
  },
}
</script>
