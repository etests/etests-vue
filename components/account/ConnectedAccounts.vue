<template>
  <v-card>
    <v-card-title class="font-weight-bold px-6">
      Connected Accounts
    </v-card-title>
    <v-card-subtitle class="px-6">
      Display content from your connected accounts
    </v-card-subtitle>
    <v-card-text class="px-3">
      <v-list>
        <v-list-item v-for="(provider, i) in providers" :key="i" class="mb-4">
          <v-list-item-avatar>
            <v-img contain :src="provider.icon" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              {{ provider.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ provider.username }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action><v-switch :value="provider.connected" /></v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      providers: [
        {
          name: "Google",
          username: "Not Connected",
          connected: false,
          icon: require("@/assets/icons/google.png"),
        },
        {
          name: "Facebook",
          username: "Not Connected",
          connected: false,
          icon: require("@/assets/icons/facebook.png"),
        },
        {
          name: "Twitter",
          username: "Not Connected",
          connected: false,
          icon: require("@/assets/icons/twitter.png"),
        },
      ],
    }
  },
  methods: {},
}
</script>
