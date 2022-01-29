<template>
  <v-card>
    <v-card-title>
      Plan
    </v-card-title>
    <v-divider class="mb-4" />
    <v-card-text>
      <template v-if="$handle === 'public'">
        No plan is active
      </template>
      <template v-else>
        Institute Plan
      </template>
    </v-card-text>
    <v-card-actions> </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {},
}
</script>
