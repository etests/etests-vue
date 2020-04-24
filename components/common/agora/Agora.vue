<template>
  <Meeting v-if="meeting" @exit="meeting = false" v-bind="config" />
  <v-card class="page mx-auto" max-width="800" v-else>
    <v-card-title>
      Live class
    </v-card-title>
    <v-divider />
    <v-card-text>
      <v-text-field
        solo-inverted
        flat
        v-model="config.channel"
        id="channel"
        placeholder="Enter class name"
      />
      <v-btn color="primary" id="joinBtn" @click="meeting = true">
        Start
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import InputChannelVue from "./InputChannel.vue"

export default {
  head() {
    return {
      script: [{ src: "https://cdn.agora.io/sdk/release/AgoraRTCSDK-3.0.2.js" }]
    }
  },
  components: {
    Meeting: () => import("./Meeting")
  },

  data() {
    return {
      meeting: false,
      config: {
        channel: "",
        baseMode: "al",
        transcode: "interop",
        attendeeMode: "video",
        videoProfile: "480p_4"
      }
    }
  }
}
</script>
