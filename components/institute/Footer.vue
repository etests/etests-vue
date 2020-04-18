<template>
  <v-container fluid class="ma-0 pa-0">
    <v-row justify="center" class="primary darken-1">
      <v-col class="text-center white--text display-1" cols="12" md="auto">
        <div>Follow Us</div>
      </v-col>

      <v-col v-if="contacts.social" class="text-center" cols="12" md="auto">
        <v-btn
          v-if="contacts.social.facebook"
          :href="contacts.social.facebook"
          target="blank"
          class="mx-4 white--text"
          icon
        >
          <v-icon>mdi-facebook</v-icon>
        </v-btn>
        <v-btn
          v-if="contacts.social.twitter"
          :href="contacts.social.twitter"
          target="blank"
          class="mx-4 white--text"
          icon
        >
          <v-icon>mdi-twitter</v-icon>
        </v-btn>
        <v-btn
          v-if="contacts.social.youtube"
          :href="contacts.social.youtube"
          target="blank"
          class="mx-4 white--text"
          icon
        >
          <v-icon>mdi-youtube</v-icon>
        </v-btn>
        <v-btn
          v-if="contacts.social.linkedin"
          :href="contacts.social.linkedin"
          target="blank"
          class="mx-4 white--text"
          icon
        >
          <v-icon>mdi-linkedin</v-icon>
        </v-btn>
        <v-btn
          v-if="contacts.social.instagram"
          :href="contacts.social.instagram"
          target="blank"
          class="mx-4 white--text"
          icon
        >
          <v-icon>mdi-instagram</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row justify="center" class="primary darken-1">
      <v-col cols="12" md="4" lg="3">
        <div class="title px-2 warning--text">
          | Quick Links
        </div>
        <div class="mx-6 my-2">
          <nuxt-link :class="$style.animate" to="/gallery">
            Gallery
          </nuxt-link>
          <br />
          <nuxt-link :class="$style.animate" to="/faculty">
            Our Faculty
          </nuxt-link>
          <br />
          <nuxt-link :class="$style.animate" to="/downloads">
            Downloads
          </nuxt-link>
          <br />
          <nuxt-link :class="$style.animate" to="/faq">
            Frequently Asked Questions
          </nuxt-link>
        </div>
      </v-col>
      <v-col
        v-if="institute && institute.courses && institute.courses.length"
        cols="12"
        md="4"
        lg="4"
      >
        <div class="title px-2 warning--text">
          | Classroom Courses
        </div>
        <div class="mx-6 my-2">
          <div v-for="(course, i) in institute.courses" :key="i">
            <span :class="$style.animate">{{ course.name }}</span>
            <br /><br />
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="8" lg="3">
        <div class="title px-2 warning--text">
          | Contact
        </div>
        <div class="mx-6 my-2">
          <div v-if="institute && institute.user" class="white--text font-weight-bold mb-3">
            {{ institute.user.name }}
          </div>
          <a :href="`tel:${contacts.phone}`" :class="$style.animate">
            <v-icon small color="white" class="mr-3">mdi-phone</v-icon>
            {{ contacts.phone }}
          </a>
          <br />
          <a :href="`mailto:${contacts.email}`" :class="$style.animate" target="blank">
            <v-icon small color="white" class="mr-3">mdi-email</v-icon>
            {{ contacts.email }}
          </a>
          <br />
          <a :class="$style.animate" target="blank">
            <v-icon small color="white" class="mr-3">mdi-map-marker</v-icon>
            {{ contacts.address }}
          </a>
        </div>
      </v-col>
      <v-col v-if="editable" cols="12" class="text-center">
        <v-btn color="primary lighten-2" class="ma-2" dark @click="edit">
          Update Footer
        </v-btn>
      </v-col>
    </v-row>
    <v-row justify="center" class="grey darken-4 text-center">
      <v-col cols="auto" class="py-2 white--text font-weight-bold">
        Designed and Developed by
      </v-col>
      <v-col class="py-2 px-0" cols="auto">
        <a href="https://etests.co.in/" target="blank">
          <v-img width="15px" style="float:left" :src="require('@/assets/logos/etests.png')" />
          <span :class="[$style.logo, 'chill--text']">
            eTests
          </span>
        </a>
      </v-col>
    </v-row>
    <v-dialog v-model="updateDialog" width="500">
      <v-card>
        <v-card-title>
          Update Footer
        </v-card-title>
        <v-container>
          <v-text-field v-model="defaultContacts.phone" flat solo-inverted label="Phone" />
          <v-text-field v-model="defaultContacts.email" flat solo-inverted label="Email" />
          <v-text-field v-model="defaultContacts.address" flat solo-inverted label="Address" />
          <v-text-field
            v-model="defaultContacts.social.facebook"
            flat
            solo-inverted
            label="Facebook Page"
          />
          <v-text-field
            v-model="defaultContacts.social.twitter"
            flat
            solo-inverted
            label="Twitter Link"
          />
          <v-text-field
            v-model="defaultContacts.social.youtube"
            flat
            solo-inverted
            label="Youtube Channel"
          />
          <v-text-field
            v-model="defaultContacts.social.linkedin"
            flat
            solo-inverted
            label="Linkedin Page"
          />
          <v-text-field
            v-model="defaultContacts.social.instagram"
            flat
            solo-inverted
            label="Instagram Link"
          />
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn text color="primary" @click="updateDialog = false">
            cancel
          </v-btn>
          <v-btn text color="primary" @click="save">
            save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex"
export default {
  data() {
    return {
      updateDialog: false,
      defaultContacts: {
        name: "",
        phone: "",
        address: "",
        social: {
          facebook: "",
          twitter: "",
          youtube: "",
          linkedin: "",
          instagram: ""
        }
      }
    }
  },
  methods: {
    edit() {
      if (this.contacts.phone) this.defaultContacts.phone = this.contacts.phone
      if (this.contacts.email) this.defaultContacts.email = this.contacts.email
      if (this.contacts.address) this.defaultContacts.address = this.contacts.address
      if (this.contacts.social) this.defaultContacts.social = { ...this.contacts.social }
      this.updateDialog = true
    },
    save() {
      this.contacts = {
        ...this.defaultContacts,
        social: { ...this.defaultContacts.social }
      }
      this.updateDialog = false
    }
  },
  computed: {
    ...mapGetters({
      institute: "institutes/institute",
      editable: "institutes/editable",
      status: "institutes/status"
    }),
    contacts: {
      get() {
        if (this.institute && this.institute.contacts) return this.institute.contacts
        else return this.defaultContacts
      },
      set(contacts) {
        this.$store.cache.dispatch("institutes/update", {
          contacts,
          handle: this.institute.handle
        })
      }
    }
  }
}
</script>

<style module lang="scss">
.animate {
  color: white !important;
  cursor: pointer;
}
.animate:hover {
  padding-left: 5px;
  transition: 0.4s all ease;
  color: #edc11f;
}
.logo {
  margin: 0 5px;
  line-height: 15px;
  font-family: "Montserrat", Arial, Helvetica, sans-serif;
  font-weight: 800;
  font-size: 1.5rem;
}
</style>
