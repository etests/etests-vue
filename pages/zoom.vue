<template>
  <StandardLayout>
    <v-col cols="12">
      <v-card class="page">
        <v-card-title>
          Online class
        </v-card-title>
        <v-divider />
        <v-card-text>
          <form v-if="!ready">
            <v-text-field solo-inverted flat v-model="meeting.name" label="Presentor name" />
            <v-text-field solo-inverted flat v-model="meeting.number" label="Meeting number" />
            <v-text-field solo-inverted flat v-model="meeting.password" label="Meeting password" />
            <v-select solo-inverted flat v-model="meeting.role" :items="roles" label="Role" />
            <v-btn color="primary" @click="ready = true">Join</v-btn>
          </form>
          <Zoom :meeting="meeting" v-else />
        </v-card-text>
      </v-card>
    </v-col>
  </StandardLayout>
</template>
<script>
import StandardLayout from "@/layouts/StandardLayout"
var Zoom = () => require("@/components/common/Zoom")

export default {
  head() {
    return {
      script: [
        {
          src: "https://code.jquery.com/jquery-3.3.1.min.js",
        },
      ],
    }
  },
  components: {
    Zoom,
    StandardLayout,
  },
  data() {
    return {
      ready: false,
      meeting: {
        name: "Pankaj",
        number: "762-1052-6997",
        password: "6TyHGk",
        role: 1,
      },
      roles: [
        { value: 0, text: "Attendee" },
        { value: 1, text: "Host" },
        {
          value: 5,
          text: "Assistant",
        },
      ],
    }
  },
}
</script>
