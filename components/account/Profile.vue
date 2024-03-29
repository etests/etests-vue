<template>
  <v-card v-if="!editing" min-height="600">
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
      <v-row v-if="profile.scope.includes('institute')">
        <v-col cols="auto">
          <b>About:</b>
        </v-col>
        <v-col cols="auto"> {{ profile.about }} </v-col>
      </v-row>
      <v-row v-if="profile.scope.includes('institute')">
        <v-col cols="auto">
          <b>Address:</b>
        </v-col>
        <v-col cols="auto"> {{ profile.address }} </v-col>
      </v-row>
    </v-card-text>
    <v-footer color="white" bottom absolute class="pa-6 text-center">
      <v-btn class="ma-auto" color="primary" @click="editing = true" width="100">
        Edit
      </v-btn>
    </v-footer>
  </v-card>
  <v-card v-else min-height="600">
    <v-card-text>
      <v-img
        class="ma-auto mt-12 mb-8"
        max-width="140px"
        max-height="140px"
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
      <v-text-field
        v-model="profile.id"
        solo-inverted
        flat
        prefix="Institute Id: "
        disabled
        v-if="profile.scope.includes('institute')"
      />
      <v-text-field v-model="profile.name" solo-inverted flat label="Name" />
      <v-text-field v-model="profile.phone" solo-inverted flat label="Phone" />
      <v-text-field
        v-model="profile.about"
        solo-inverted
        flat
        placeholder="Write about yourself"
        v-if="profile.scope.includes('institute')"
      />

      <AddressInput
        v-model="profile.address"
        placeholder="Address"
        icon="mdi-map-marker"
        v-if="profile.scope.includes('institute')"
      />
    </v-card-text>
    <v-footer color="white" bottom absolute>
      <v-row class="pa-6" align="center" justify="center">
        <v-btn color="success" @click="save" width="100">
          Save
        </v-btn>
        <v-btn color="primary" @click="editing = false" width="100">
          Cancel
        </v-btn>
      </v-row>
    </v-footer>
    <v-card-text class="text-center"> </v-card-text>
  </v-card>
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
        this.$store.cache.dispatch("profile/update", this.profile).then((profile) => {
          this.editing = false
          this.$auth.$storage.setUniversal("user", profile)
        })
    },
  },
}
</script>
