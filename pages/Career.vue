<template>
  <StandardLayout>
    <v-col cols="12">
      <v-card class="page" max-width="800">
        <v-img
          :src="require('@/assets/images/bg/circle.svg')"
          max-height="80"
          class="chill white--text font-weight-bold"
        >
          <v-card-title>
            Career at eTests
          </v-card-title>
          <v-card-subtitle class="white--text font-weight-bold">
            Let's Make Conducting Online Tests Easier
          </v-card-subtitle>
        </v-img>
        <v-divider />
        <v-card-text class="px-0">
          <v-list v-for="(list, i) in lists" :key="i">
            <v-subheader>{{ list.heading }}</v-subheader>
            <br />
            <v-list-item-group :color="list.color">
              <v-list-item v-for="(item, j) in list.items" :key="j">
                <v-list-item-icon>
                  <v-icon :color="list.color" v-text="list.icon" />
                </v-list-item-icon>
                <v-list-item-content>
                  {{ item }}
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-row>
            <v-col cols="12">
              <v-btn v-show="!form" class="chill" @click="form = !form">
                <template v-if="!form">
                  Join Now
                </template>
                <template v-else>
                  Close
                </template>
              </v-btn>
              <br />
            </v-col>
            <v-col cols="12">
              <iframe
                v-show="form"
                src="https://docs.google.com/forms/d/e/1FAIpQLSc1lTSlKR6X0Re4mHkUFd4Ixp0zAGrvj3-UUGSbjs2X_0Ay9Q/viewform?embedded=true"
                width="100%"
                height="1800px"
                frameborder="0"
              />
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-col>
  </StandardLayout>
</template>

<script>
import StandardLayout from "@/layouts/StandardLayout"

export default {
  components: {
    StandardLayout
  },
  head() {
    return {
      title: "Careers"
    }
  },
  data() {
    return {
      form: false,
      lists: [
        {
          color: "primary",

          icon: "mdi-check-circle",

          heading:
            "eTests is an online platform that connects institutes and educators around the globe with  students at various levels including: ",

          items: [
            "School students who want to perform good in olympiads and exams like NTSE and KVPY.",

            "Aspirants of Engineering, Medical, Bank PO, SSC, Law or other types of entrance exams.",

            "People who want to learn and test their knowledge in their interested fields."
          ]
        },
        {
          color: "warning",

          icon: "mdi-svg",

          heading:
            "Do you have very good communication skills and know about institutes or educators around you who are interested in conducting their tests online? Here is the opportunity for your career:",

          items: [
            "Contact institutes and tell them about our services. We will provide the institutes their own personal website which can be joined by their students to prepare online.",

            "Help the institutes in creation and conduction of tests hazzle free.",

            "Get a very good incentive from us for each institute you get to us."
          ]
        }
      ]
    }
  }
}
</script>
