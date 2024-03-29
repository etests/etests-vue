<template>
  <v-row justify="space-around">
    <v-col cols="12" lg="7">
      <v-card class="page" height="100%">
        <v-card-title>
          Profile
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-img
            class="ma-auto mb-10"
            max-width="200px"
            max-height="200px"
            style="border-radius: 100%;"
            :src="profile.image ? profile.image : require('@/assets/images/icons/student.png')"
          >
            <DropUpload
              small
              height="200px"
              @upload="
                (url) => {
                  this.profile.image = url
                }
              "
            />
            <template #placeholder>
              <v-skeleton-loader type="image" height="200px" />
            </template>
          </v-img>
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
          <DateField v-model="profile.birthDate" label="Birth Date" />
          <AddressInput v-model="profile.address" placeholder="Address" icon="mdi-map-marker" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="save">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="12" lg="5">
      <v-row>
        <v-col cols="12">
          <Batches />
        </v-col>
        <v-col cols="12">
          <ChangePassword />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import DateField from "@/components/common/DateField"
import DropUpload from "@/components/common/DropUpload"
import AddressInput from "@/components/common/AddressInput"
import ChangePassword from "@/components/common/ChangePassword"
import Batches from "./Batches"

export default {
  components: {
    DropUpload,
    DateField,
    AddressInput,
    ChangePassword,
    Batches,
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
      else if (!this.profile.birthDate) error = "Enter your birth date"
      if (error) this.$toast.info(error)
      else this.$store.cache.dispatch("profile/update", this.profile)
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
