<template>
  <v-app>
    <v-container style="max-width:100%;" class="ma-0 pa-0">
      <Header :dark="true" />
      <Carousel />
    </v-container>
    <v-content v-if="institute" app class="pa-0">
      <SectionLayout v-for="(section, i) in sections" :key="i">
        <v-container style="min-height: 100vh">
          <component :is="section.component" :title="section.title" />
        </v-container>
      </SectionLayout>
    </v-content>
    <Footer v-if="institute" />
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
