<template>
  <v-card class="page">
    <v-card-title>
      Profile
    </v-card-title>
    <v-divider />
    <v-card-text>
      <v-row justify="space-around">
        <v-col cols="12" lg="3">
          <v-img
            class="ma-auto mb-10"
            max-width="200px"
            max-height="200px"
            style="border-radius:100%"
            :src="profile.image ? profile.image : require('@/assets/images/icons/student.png')"
          >
            <DropUpload
              small
              @upload="
                (url) => {
                  this.profile.image = url
                }
              "
            />
            <template #placeholder>
              <v-skeleton-loader type="image" height="250px" />
            </template>
          </v-img>
        </v-col>
        <v-col cols="12" lg="7">
          <v-text-field
            v-model="profile.name"
            solo-inverted
            flat
            prepend-inner-icon="mdi-rename-box"
            label="Name"
          />
          <v-text-field
            v-model="profile.phone"
            solo-inverted
            flat
            prepend-inner-icon="mdi-phone"
            label="Phone"
          />
          <v-autocomplete
            v-model="profile.state"
            :items="states"
            outlined
            prepend-inner-icon="mdi-map-marker"
            label="State"
          />
          <v-text-field
            v-model="profile.city"
            solo-inverted
            flat
            prepend-inner-icon="mdi-city"
            label="City"
          />
          <v-btn color="primary" @click="save">
            Save
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { states } from "@/js/states"
import DropUpload from "@/components/common/DropUpload"

export default {
  components: {
    DropUpload
  },
  data() {
    return {
      states
    }
  },
  computed: {
    profile() {
      return { ...this.$auth.user }
    }
  },
  methods: {
    save(e) {
      let error = null
      if (!this.profile.name) error = "Enter your name."
      else if (this.profile.name.length > 100) error = "Your name is too long!"
      else if (!this.profile.phone) error = "Enter your phone number."
      else if (!this.profile.state) error = "Select your state."
      else if (!this.profile.city) error = "Select your city."

      if (error) this.$toast.info(error)
      else {
        const data = {
          name: this.profile.name,
          phone: this.profile.phone,
          city: this.profile.city,
          state: this.profile.state,
          image: this.profile.image
        }

        this.$store.cache.dispatch("profile/updateProfile", data)
      }
    }
  }
}
</script>

<style module lang="scss">
.profileCard {
  margin: auto;
  width: 660px;
  max-width: 100%;
  padding: 20px;
  border-radius: 8px;
}
</style>
