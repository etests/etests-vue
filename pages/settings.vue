<template>
  <InstituteLayout>
    <v-row>
      <v-col cols="12" md="auto" class="display-1">
        Settings
      </v-col>
      <v-spacer />
      <v-col cols="12" md="auto">
        <v-btn dark color="primary" :loading="status.updating" @click="save">
          save
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="8">
        <v-card class="object" flat outlined>
          <v-card-title>
            Sections
            <v-spacer />
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-0 pb-1">
            <v-list>
              <v-subheader>
                Select the the sections to be displayed. Type a custom heading if required:
              </v-subheader>
              <v-list-item v-for="(section, i) in settings.sections" :key="i" c>
                <v-list-item-avatar size="50px">
                  <v-checkbox v-model="section.show" label="" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-text-field
                    v-model="section.name"
                    filled
                    :label="`${section.component} Custom Heading`"
                    dense
                  />
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn dark color="primary" :loading="status.updating" @click="save">
              save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card class="object" flat outlined>
          <v-card-title> Theme color</v-card-title>
          <v-divider />
          <v-card-text>
            <client-only>
              <Sketch
                v-model="settings.color"
                class="ma-auto"
                style="width:100%; box-shadow:none; padding: 0; margin: 0"
              />
            </client-only>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </InstituteLayout>
</template>

<script>
import { mapGetters } from "vuex"
import { Sketch } from "vue-color"
import InstituteLayout from "@/layouts/InstituteLayout"

export default {
  components: {
    InstituteLayout,
    Sketch
  },
  middleware: "institute",
  head() {
    return {
      title: "Settings"
    }
  },
  data() {
    return {
      settings: {
        color: "#000",
        sections: [
          { component: "Notifications", name: "", show: true },
          { component: "Features", name: "", show: true },
          { component: "Team", name: "", show: true },
          { component: "Toppers", name: "", show: true },
          { component: "Contact", name: "", show: true },
          { component: "Test Series", name: "", show: true },
          { component: "Downloads", name: "", show: true },
          { component: "Forms", name: "", show: true },
          { component: "Questions", name: "", show: true },
          { component: "Gallery", name: "", show: true },
          { component: "Faculty", name: "", show: true },
          { component: "Centers", name: "", show: true },
          { component: "Courses", name: "", show: true },
          { component: "FAQ", name: "", show: true }
        ]
      }
    }
  },
  methods: {
    save() {
      this.$store.cache.dispatch("institutes/update", {
        settings: {
          color: this.settings.color.hex ? this.settings.color.hex : this.settings.color,
          sections: this.settings.sections
        },
        handle: this.$handle
      })
    }
  },
  computed: {
    ...mapGetters({
      institute: "institutes/institute",
      editable: "institutes/editable",
      status: "institutes/status"
    })
  },
  mounted() {
    this.$store.cache.dispatch("institutes/get", this.$handle).then((institute) => {
      if (institute.settings) {
        let newSections = this.settings.sections.filter((section1) => {
          return !institute.settings.sections.find((section2) => {
            return section1.component === section2.component
          })
        })
        let newSettings = {}
        if (institute.settings.color) newSettings.color = institute.settings.color
        if (institute.settings.sections)
          newSettings.sections = institute.settings.sections.map((section) => {
            return { ...section }
          })
        newSettings.sections = newSettings.sections.concat(newSections)
        this.settings = newSettings
      }
      this.$watch("settings", {
        deep: true,
        handler(newValue, oldValue) {
          let settings = {
            color: newValue.color.hex ? newValue.color.hex : newValue.color,
            sections: newValue.sections.map((section) => {
              return { ...section }
            })
          }
          this.$store.commit("institutes/updateSuccess", { settings })
        }
      })
    })
  }
}
</script>
