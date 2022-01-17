<template>
  <v-row justify="center">
    <v-col cols="12">
      <v-card class="page" v-if="!editing">
        <v-card-text class="text-center">
          <v-row justify="center" align="center">
            <v-col cols="12">
              <v-img
                class="ma-auto mt-12"
                max-width="140px"
                max-height="140px"
                style="border-radius: 100%;"
                :src="profile.image ? profile.image : require('@/assets/images/avatars/1.png')"
              >
                <template #placeholder>
                  <v-skeleton-loader type="image" height="250px" />
                </template>
              </v-img>
            </v-col>
            <v-col cols="12" class="title">
              {{ profile.name }}
              <div>
                <v-chip color="success" class="text-capitalize">
                  {{ profile.scope[0] }}
                </v-chip>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-title class="font-weight-bold">
          Details
        </v-card-title>
        <v-divider />
        <v-card-text class="text-body-1">
          <v-row v-if="profile.scope.includes('institute')">
            <v-col cols="auto">
              <b>Institute ID:</b>
            </v-col>
            <v-col cols="auto"> {{ profile.id }} </v-col>
          </v-row>
          <v-row>
            <v-col cols="auto">
              <b>Email:</b>
            </v-col>
            <v-col cols="auto"> {{ profile.email }} </v-col>
          </v-row>
          <v-row>
            <v-col cols="auto">
              <b>Phone:</b>
            </v-col>
            <v-col cols="auto"> {{ profile.phone }} </v-col>
          </v-row>
          <v-row>
            <v-col cols="auto">
              <b>About:</b>
            </v-col>
            <v-col cols="auto"> {{ profile.about }} </v-col>
          </v-row>
          <v-row>
            <v-col cols="auto">
              <b>Address:</b>
            </v-col>
            <v-col cols="auto"> {{ profile.address }} </v-col>
          </v-row>
        </v-card-text>
        <v-card-text class="text-center">
          <v-btn color="primary" @click="editing = true" width="100">
            Edit
          </v-btn>
        </v-card-text>
      </v-card>
      <v-card v-else>
        <v-card-text>
          <v-img
            class="ma-auto mb-10"
            max-width="200px"
            max-height="200px"
            style="border-radius: 100%;"
            :src="profile.image ? profile.image : require('@/assets/images/avatars/1.png')"
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
        </v-card-text>
        <v-card-text>
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
        </v-card-text>
        <v-card-text class="text-center">
          <v-btn color="success" @click="save" width="100">
            Save
          </v-btn>
          <v-btn color="primary" @click="editing = false" width="100">
            Cancel
          </v-btn>
        </v-card-text>
      </v-card>
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
    AddressInput,
  },
  data() {
    return { editing: false }
  },
  computed: {
    profile: {
      get() {
        return this.$auth.user
      },
      set(value) {
        this.$store.commit("profile/updateSuccess", value)
      },
    },
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
      else
        this.$store.cache
          .dispatch("profile/updateProfile", this.profile)
          .then((_) => (this.editing = false))
    },
  },
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
