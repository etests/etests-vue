<template>
  <v-app>
    <v-container style="max-width:100%;" class="ma-0 pa-0">
      <Header :dark="true" />
      <Carousel />
    </v-container>
    <v-main v-if="institute" app class="pa-0">
      <SectionLayout v-for="(section, i) in sections" :key="i" style="min-height: 100vh">
        <v-container>
          <component :is="section.component" :title="section.title" />
        </v-container>
      </SectionLayout>
    </v-main>
    <Footer v-if="institute" />
    <v-dialog> </v-dialog>
    <v-dialog v-if="banner" v-model="bannerDialog" width="500">
      <v-card>
        <v-card-title class="indigo white--text">
          <v-avatar
            v-if="institute && institute.user && institute.user.image"
            size="32px"
            class="mr-2"
          >
            <v-img :src="institute.user.image" />
          </v-avatar>
          <template v-if="institute && institute.user">
            {{ institute.user.name }}
          </template>
          <v-spacer />
          <v-btn dark icon @click="bannerDialog = !bannerDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="indigo py-4 text-center white--text">
          <v-img
            src="https://etests.co.in/img/student_admission.png"
            width="60%"
            class="mb-4 mx-auto"
          />
          <div class="display-2 font-weight-bold text-uppercase">
            {{ banner.title }}
          </div>
          <div class="title font-weight-regular text-uppercase">{{ banner.subtitle }}</div>
          <v-btn
            rounded
            x-large
            class="mx-auto mt-10"
            color="white"
            :href="banner.link.href"
            target="_blank"
          >
            {{ banner.link.text }}
          </v-btn>
        </v-card-text>
        <v-divider />
        <v-card-text class="py-4" v-if="institute && institute.contacts">
          <a class="black--text" :href="`tel:${institute.contacts.phone}`">
            <v-icon small color="indigo" class="mr-3">mdi-phone</v-icon>
            {{ institute.contacts.phone }}
          </a>
          <br />
          <a class="black--text" :href="`mailto:${institute.contacts.email}`" target="_blank">
            <v-icon small color="indigo" class="mr-3">mdi-email</v-icon>
            {{ institute.contacts.email }}
          </a>
          <br />
          <a class="black--text">
            <v-icon small color="indigo" class="mr-3">mdi-map-marker</v-icon>
            {{ institute.contacts.address }}
          </a>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex"
import Header from "@/components/institute/Header"
import Carousel from "@/components/institute/Carousel"
import Notifications from "@/components/institute/Notifications"
import Features from "@/components/institute/Features"
import Team from "@/components/institute/Team"
import Toppers from "@/components/institute/Toppers"
import Contact from "@/components/institute/Contact"
import Footer from "@/components/institute/Footer"
import SectionLayout from "@/components/institute/SectionLayout"

export default {
  components: {
    Header,
    Carousel,
    Notifications,
    Features,
    Team,
    Toppers,
    Contact,
    SectionLayout,
    Footer
  },
  data() {
    return {
      bannerDialog: true,
      defaultSections: [
        { component: "Notifications" },
        { component: "Features" },
        { component: "Team" },
        { component: "Toppers" },
        { component: "Contact" }
      ]
    }
  },
  computed: {
    ...mapGetters({
      institute: "institutes/institute",
      theme: "institutes/theme",
      status: "institutes/status"
    }),
    sections() {
      if (this.institute && this.institute.settings && this.institute.settings.sections) {
        return this.defaultSections.filter((section1) => {
          return (
            !this.institute.settings.sections.find((section2) => {
              return section1.component === section2.component
            }) ||
            this.institute.settings.sections.find((section2) => {
              if (section1.component === section2.component && section2.show) {
                if (section2.name.length) section1.title = section2.name
                return true
              } else return false
            })
          )
        })
      } else return this.defaultSections
    },
    banner() {
      if (this.institute && this.institute.extras && this.institute.extras.banner)
        return this.institute.extras.banner
      else return null
    }
  },
  watch: {
    theme(newValue, oldValue) {
      this.$vuetify.theme.themes.light.primary = newValue
    }
  },
  mounted() {
    this.$store.cache.dispatch("institutes/get", this.$handle)
  }
}
</script>
