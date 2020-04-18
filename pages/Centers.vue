<template>
  <InstituteLayout>
    <v-row justify="center">
      <v-col cols="12" md="auto" class="display-2">
        {{ title }}
      </v-col>
      <v-spacer />
      <v-col cols="12" md="auto">
        <v-btn v-if="editable" v-show="centers && centers.length" color="primary" @click="addItem">
          Add Center
        </v-btn>
      </v-col>
      <v-col cols="12">
        <v-divider />
      </v-col>
      <v-col v-if="centers && !centers.length" cols="12" justify="center" align="center">
        <template v-if="status.loading">
          Loading...
        </template>
        <v-btn v-else-if="editable" color="primary" large @click="editDialog = true">
          add center
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <template v-else>
          No Centers
        </template>
      </v-col>
      <v-col v-for="(center, i) in centers" :key="i" cols="12">
        <v-card class="object">
          <v-card-title>
            {{ center.name }}
            <v-spacer />
            <v-menu v-if="editable" open-on-hover>
              <template #activator="{ on }">
                <v-btn absolute top right icon v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="editItem(center)">
                  <v-list-item-title>Edit</v-list-item-title>
                </v-list-item>
                <v-list-item @click="deleteItem(center)">
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-title>
          <v-divider />
          <v-card-text class="pa-0">
            <v-row justify="start">
              <v-col cols="12" md="4" class="py-0">
                <v-img :src="center.image" max-height="250px" style="border-radius: 0 0 0 8px;">
                  <template #placeholder>
                    <v-skeleton-loader type="image" />
                  </template>
                </v-img>
              </v-col>
              <v-col cols="12" md="8" class="py-0 text-left">
                <v-list disabled>
                  <v-list-item-group color="primary">
                    <v-list-item v-if="center.phone">
                      <v-list-item-avatar>
                        <v-icon>mdi-phone</v-icon>
                      </v-list-item-avatar>
                      <v-list-item-title v-text="center.phone" />
                    </v-list-item>
                    <v-list-item v-if="center.email">
                      <v-list-item-avatar>
                        <v-icon>mdi-email</v-icon>
                      </v-list-item-avatar>
                      <v-list-item-title v-text="center.email" />
                    </v-list-item>
                    <v-list-item v-if="center.address">
                      <v-list-item-avatar>
                        <v-icon>mdi-map-marker</v-icon>
                      </v-list-item-avatar>
                      <v-list-item-content v-text="center.address" />
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
                <v-btn class="ml-6" large color="primary" dark @click="setMapCenter(center)">
                  View On Google Map
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="mapDialog" fullscreen>
      <v-toolbar dark color="primary">
        <v-toolbar-title class="font-weight-bold">
          {{ mapTitle }}
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon color="white" @click="mapDialog = false">
          <v-icon>
            mdi-chevron-down
          </v-icon>
        </v-btn>
      </v-toolbar>
      <v-card>
        <gmap-map :center="location" :zoom="16" style="width:100%;  height: 100vh;">
          <gmap-marker :position="location" />
        </gmap-map>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editDialog" width="500">
      <v-card tile>
        <v-img :src="editedItem.image" height="200px">
          <DropUpload
            @upload="
              (url) => {
                this.editedItem.image = url
              }
            "
          />
          <template #placeholder>
            <v-skeleton-loader type="image" height="250px" />
          </template>
        </v-img>
        <v-divider />
        <v-card-text class="py-4">
          <div
            class="v-input theme--light v-text-field v-text-field--single-line v-text-field--solo v-text-field--solo-inverted v-text-field--solo-flat v-text-field--is-booted v-text-field--enclosed"
          >
            <div class="v-input__control">
              <div class="v-input__slot">
                <div class="v-text-field__slot">
                  <gmap-autocomplete
                    :value="editedItem.address"
                    placeholder="Address"
                    @place_changed="setCoords"
                  />
                </div>
              </div>
              <div class="v-text-field__details">
                <div class="v-messages theme--light">
                  <div class="v-messages__wrapper" />
                </div>
              </div>
            </div>
          </div>

          <v-card v-if="editedItem.location" class="mb-8">
            <v-card-text class="text-center">
              <v-row>
                <gmap-map
                  :center="editedItem.location"
                  :zoom="16"
                  style="width:100%; height:200px"
                  :draggable="false"
                >
                  <gmap-marker :position="editedItem.location" />
                </gmap-map>
              </v-row>
              <v-row v-if="locationImages && locationImages.length">
                <v-col v-for="(image, i) in locationImages" :key="i" cols="3">
                  <v-card
                    @click="
                      editedItem.image = image.getUrl({
                        maxWidth: 600,
                        maxHeight: 400
                      })
                    "
                  >
                    <v-img
                      :src="image.getUrl({ maxWidth: 100, maxHeight: 100 })"
                      aspect-ratio="1"
                      class="text-center"
                    >
                      <template #placeholder>
                        <v-skeleton-loader type="image" />
                      </template>
                    </v-img>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-text-field v-model="editedItem.name" solo-inverted flat label="Name" />

          <v-text-field v-model="editedItem.phone" solo-inverted flat label="Phone" />
          <v-text-field v-model="editedItem.email" solo-inverted flat label="Email" />

          <v-text-field v-model="editedItem.image" solo-inverted flat label="Image" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="editDialog = false">
            Cancel
          </v-btn>
          <v-btn color="primary" text @click="save">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </InstituteLayout>
</template>

<script>
import { mapGetters } from "vuex"
import Map from "vue2-google-maps/src/components/map"
import Marker from "vue2-google-maps/src/components/marker"
import Autocomplete from "vue2-google-maps/src/components/autocomplete"
import InstituteLayout from "@/layouts/InstituteLayout"
import DropUpload from "@/components/common/DropUpload"

export default {
  components: {
    DropUpload,
    GmapMap: Map,
    GmapMarker: Marker,
    GmapAutocomplete: Autocomplete,
    InstituteLayout
  },
  data() {
    return {
      editIndex: -1,
      editDialog: false,
      editedItem: {
        name: "",
        email: "",
        phone: "",
        image: "",
        address: "",
        location: ""
      },
      defaultItem: {
        name: "",
        email: "",
        phone: "",
        image: "",
        address: "",
        location: ""
      },
      mapDialog: false,
      location: {},
      places: [],
      locationImages: [],
      mapTitle: "",
      currentPlace: null
    }
  },
  methods: {
    setCoords(place) {
      const marker = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      }
      this.editedItem.location = marker
      this.editedItem.address = place.formatted_address
      if (this.editedItem.name === "" && place.name) this.editedItem.name = place.name
      if (this.editedItem.phone === "" && place.international_phone_number)
        this.editedItem.phone = place.international_phone_number
      if (place.photos) this.locationImages = place.photos
    },
    setMapCenter(center) {
      this.mapDialog = true
      this.mapTitle = center.name
      this.location = center.location
    },
    editItem(item) {
      this.editIndex = this.centers.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editDialog = true
    },
    save() {
      this.editedItem.date = new Date()
      if (this.editIndex > -1)
        this.centers = [
          ...this.centers.slice(0, this.editIndex),
          this.editedItem,
          ...this.centers.slice(this.editIndex + 1)
        ]
      else this.centers = this.centers.concat(this.editedItem)
      this.editDialog = false
    },
    deleteItem(item) {
      const index = this.centers.indexOf(item)
      if (index !== -1 && confirm("Are you sure you want to delete this item?"))
        this.centers = [...this.centers.slice(0, index), ...this.centers.slice(index + 1)]
    },
    addItem() {
      this.editIndex = -1
      this.editedItem = { ...this.defaultItem }
      this.editDialog = true
    }
  },
  computed: {
    ...mapGetters({
      institute: "institutes/institute",
      editable: "institutes/editable",
      status: "institutes/status"
    }),
    title() {
      const defaultTitle = "Our Centers"
      if (this.institute && this.institute.settings && this.institute.settings.sections) {
        const exists = this.institute.settings.sections.find(
          (section) => section.component === this.$route.meta.title
        )
        if (exists && exists.name && exists.name.length) return exists.name
        else return defaultTitle
      } else return defaultTitle
    },
    centers: {
      get() {
        if (this.institute) return this.institute.centers
        else return []
      },
      set(centers) {
        this.$store.cache.dispatch("institutes/update", {
          centers,
          handle: this.$handle
        })
      }
    }
  }
}
</script>
