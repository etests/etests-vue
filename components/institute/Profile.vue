<template>
  <v-row justify="center">
    <v-col cols="12" lg="7">
      <v-card class="page">
        <v-card-title>
          Profile
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-img
            class="ma-auto mb-10"
            max-width="200px"
            max-height="200px"
            style="border-radius:100%"
            :src="profile.image ? profile.image : require('@/assets/images/icons/institute.png')"
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
          <v-text-field v-model="profile.id" solo-inverted flat prefix="Institute Id: " disabled />
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
          <v-text-field
            v-model="profile.about"
            solo-inverted
            flat
            prepend-inner-icon="mdi-information"
            placeholder="Write a tagline for your institute"
          />

          <AddressInput v-model="profile.address" placeholder="Address" icon="mdi-map-marker" />

          <v-btn color="primary" @click="save">
            Save
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" lg="5">
      <ChangePassword />
    </v-col>
  </v-row>
</template>

<script>
import DropUpload from "@/components/common/DropUpload"
import ChangePassword from "@/components/common/ChangePassword"
import AddressInput from "@/components/common/AddressInput"

export default {
  components: {
    DropUpload,
    ChangePassword,
    AddressInput
  },
  computed: {
    profile: {
      get() {
        return this.$auth.user
      },
      set(value) {
        this.$store.commit("profile/updateSuccess", value)
      }
    }
  },
  methods: {
    save(e) {
      let error = null
      if (!this.profile.name) error = "Enter your name."
      else if (this.profile.name.length > 100) error = "Your name is too long!"
      else if (!this.profile.phone) error = "Enter your phone number."
      else if (this.profile.about && this.profile.about.length > 250)
        error = "About cannot be more than 250 words."

      if (error) this.$toast.info(error)
      else this.$store.cache.dispatch("profile/updateProfile", this.profile)
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
