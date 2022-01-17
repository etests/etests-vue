<template>
  <v-card height="100%" min-height="500" class="pa-8">
    <v-card-title> </v-card-title>
    <v-card-text class="py-4">
      <v-list color="transparent" class="text-body-2" dark>
        <v-list-item>
          <v-list-item-avatar size="48">
            <v-icon color="chill">mdi-phone</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <a :href="`tel:${contacts.phone}`" class="black--text">
              {{ contacts.phone }}
            </a>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-avatar size="48">
            <v-icon color="chill">mdi-email</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <a :href="`mailto:${contacts.email}`" class="black--text">
              {{ contacts.email }}
            </a>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-avatar size="48">
            <v-icon color="chill">mdi-map-marker</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="black--text">
            {{ contacts.address }}
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-avatar size="48">
            <v-icon color="chill">mdi-web</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <a href="https://courseclip.com/" target="_blank">
              <span :class="[$style.logo, 'chill--text']">
                CourseClip
              </span>
            </a>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-footer absolute justify="center" bottom color="white" class="pa-10">
      <v-col v-if="contacts.social" class="text-center" cols="12" md="auto">
        <v-btn
          v-if="contacts.social.facebook"
          :href="contacts.social.facebook"
          target="_blank"
          class="mx-4 facebook white--text"
          icon
        >
          <v-icon>mdi-facebook</v-icon>
        </v-btn>
        <v-btn
          v-if="contacts.social.twitter"
          :href="contacts.social.twitter"
          target="_blank"
          class="mx-4 cool white--text"
          icon
        >
          <v-icon>mdi-twitter</v-icon>
        </v-btn>
        <v-btn
          v-if="contacts.social.youtube"
          :href="contacts.social.youtube"
          target="_blank"
          class="mx-4 youtube white--text"
          icon
        >
          <v-icon>mdi-youtube</v-icon>
        </v-btn>
        <v-btn
          v-if="contacts.social.linkedin"
          :href="contacts.social.linkedin"
          target="_blank"
          class="mx-4"
          icon
        >
          <v-icon>mdi-linkedin</v-icon>
        </v-btn>
        <v-btn
          v-if="contacts.social.instagram"
          :href="contacts.social.instagram"
          target="_blank"
          class="mx-4"
          icon
        >
          <v-icon>mdi-instagram</v-icon>
        </v-btn>
      </v-col>
      <v-spacer v-if="['lg', 'xl'].includes($mq)" />
      <v-btn color="primary" class="mx-auto" @click="edit" v-if="editable">
        Update
      </v-btn>
    </v-footer>

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
  </v-card>
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
          instagram: "",
        },
      },
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
        social: { ...this.defaultContacts.social },
      }
      this.updateDialog = false
    },
  },
  computed: {
    ...mapGetters({
      institute: "institutes/institute",
      editable: "institutes/editable",
      status: "institutes/status",
    }),
    contacts: {
      get() {
        if (this.institute && this.institute.contacts) return this.institute.contacts
        else return this.defaultContacts
      },
      set(contacts) {
        this.$store.cache.dispatch("institutes/update", {
          contacts,
          handle: this.institute.handle,
        })
      },
    },
  },
}
</script>

<style module lang="scss">
.logo {
  font-family: "Montserrat", Arial, Helvetica, sans-serif;
  font-weight: 800;
  font-size: 1rem;
}
</style>
