<template>
  <InstituteLayout>
    <v-card class="page mb-10">
      <v-card-title>
        <v-row justify="center" align="center">
          <v-col cols="12" md="auto">
            {{ title }}
          </v-col>

          <v-spacer />

          <v-col cols="12" md="auto" class="text-center">
            <v-select
              v-model="event"
              solo-inverted
              flat
              dense
              :items="
                gallery.map((event, i) => {
                  return { text: event.name, value: i }
                })
              "
              label="Select event "
              class="mb-n7 mr-4"
              @change="newGallery.event = event"
            />
          </v-col>
          <v-col cols="6" md="auto" class="text-center">
            <v-btn
              v-if="editable"
              v-show="
                gallery && gallery.length && gallery[event].images && gallery[event].images.length
              "
              color="primary"
              @click="
                if (gallery && gallery.length) newGallery.event = event
                newDialog = true
              "
            >
              Add Images
            </v-btn>
          </v-col>
          <v-col cols="6" md="auto" class="text-center">
            <v-btn
              v-if="editable"
              v-show="
                gallery && gallery.length && gallery[event].images && gallery[event].images.length
              "
              text
              color="primary"
              @click="
                newGallery.event = event
                deleteDialog = true
              "
            >
              Delete
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-container>
          <v-row
            v-if="
              gallery &&
                (gallery.length === 0 ||
                  !gallery[event].images ||
                  gallery[event].images.length === 0)
            "
            justify="center"
            align="center"
            class="full-height"
          >
            <template v-if="status.loading">
              Loading...
            </template>
            <v-btn
              v-else-if="editable"
              v-show="
                gallery.length === 0 || !gallery[event].images || gallery[event].images.length === 0
              "
              x-large
              color="primary"
              @click="
                if (gallery && gallery.length) newGallery.event = event
                newDialog = true
              "
            >
              Add Images
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <span v-else>No images</span>
          </v-row>
          <v-row v-else>
            <v-col v-for="(url, i) in gallery[event].images" :key="i" cols="12" sm="6" md="3">
              <v-img height="auto" :src="url" aspect-ratio="1">
                <template #placeholder>
                  <v-skeleton-loader type="image" />
                </template>
              </v-img>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-dialog v-if="editable && gallery && gallery.length" v-model="deleteDialog" width="500">
        <v-card>
          <v-card-title>
            Delete Images
          </v-card-title>

          <v-divider />

          <v-card-text>
            <v-row>
              <v-col v-for="(url, i) in gallery[event].images" :key="i" cols="3">
                <v-card @click="toggleImage(i)">
                  <v-img :src="url" aspect-ratio="1" class="text-center">
                    <v-checkbox
                      dark
                      color="white"
                      :input-value="selected"
                      :value="i"
                      class="ma-1"
                    />
                    <template #placeholder>
                      <v-skeleton-loader type="image" />
                    </template>
                  </v-img>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text color="error" @click="deleteDialog = false">
              close
            </v-btn>
            <v-btn text color="error" :disabled="selected.length === 0" @click="deleteConfirmation">
              delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="newDialog" width="500">
        <v-card>
          <v-card-title class="py-5">
            Add Images
            <v-spacer />
          </v-card-title>
          <v-divider />
          <v-card-text class="py-8">
            <v-select
              v-model="newGallery.event"
              solo-inverted
              flat
              :items="[
                { text: 'New Event', value: -1 },
                ...gallery.map((event, index) => {
                  return { text: event.name, value: index }
                })
              ]"
              label="Select Event"
            />
            <v-text-field
              v-show="newGallery.event === -1"
              v-model="newGallery.name"
              solo-inverted
              flat
              label="Event name"
            />
            <v-combobox
              v-model="newGallery.images"
              solo-inverted
              flat
              append-icon=""
              height="200px"
              chips
              clearable
              label="Image URLs (Press enter after typing each URL)"
              multiple
            >
              <template #selection="{ attrs, item, select, selected }">
                <v-chip
                  :href="item"
                  target="blank"
                  v-bind="attrs"
                  :input-value="selected"
                  close
                  @click="select"
                  @click:close="newGallery.images.splice(newGallery.images.indexOf(item), 1)"
                >
                  <strong class="text-truncate">{{ item }}</strong>
                </v-chip>
              </template>
            </v-combobox>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" text @click="newDialog = false">
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              :disabled="
                (newGallery.event === -1 && !newGallery.name) || newGallery.images.length === 0
              "
              @click="save"
            >
              Add
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </InstituteLayout>
</template>

<script>
import { mapGetters } from "vuex"
import InstituteLayout from "@/layouts/InstituteLayout"

export default {
  components: {
    InstituteLayout
  },
  head() {
    return {
      title: "Gallery"
    }
  },
  data() {
    return {
      event: 0,
      selected: [],
      newDialog: false,
      deleteDialog: false,
      defaultGallery: {
        event: -1,
        name: "",
        images: []
      },
      newGallery: {
        event: -1,
        name: "",
        images: []
      }
    }
  },
  methods: {
    toggleImage(i) {
      const index = this.selected.indexOf(i)
      if (index === -1) this.selected.push(i)
      else this.selected.splice(index, 1)
    },
    deleteConfirmation() {
      if (this.selected.length)
        confirm("Are you sure you want to delete thease images ?") && this.deleteImages()
    },
    deleteImages() {
      if (this.selected.length && this.event > -1) {
        const images = this.gallery[this.event].images.filter(
          (item, index) => !this.selected.includes(index)
        )
        this.gallery = [
          ...this.gallery.slice(0, this.event),
          {
            name: this.gallery[this.event].name,
            images
          },
          ...this.gallery.slice(this.event + 1)
        ]
        this.deleteDialog = false
      }
    },
    save() {
      if (this.newGallery.event === -1) {
        this.gallery = this.gallery.concat({
          name: this.newGallery.name,
          images: this.newGallery.images
        })
      } else {
        const images = this.gallery[this.newGallery.event].images.concat(this.newGallery.images)
        this.gallery = [
          ...this.gallery.slice(0, this.event),
          {
            name: this.gallery[this.newGallery.event].name,
            images
          },
          ...this.gallery.slice(this.event + 1)
        ]
      }
      this.newGallery = { ...this.defaultGallery }
      this.newDialog = false
    }
  },
  computed: {
    ...mapGetters({
      institute: "institutes/institute",
      editable: "institutes/editable",
      status: "institutes/status"
    }),
    title() {
      const defaultTitle = "Gallery"
      if (this.institute && this.institute.settings && this.institute.settings.sections) {
        const exists = this.institute.settings.sections.find(
          (section) => section.component === this.$route.meta.title
        )
        if (exists && exists.name && exists.name.length) return exists.name
        else return defaultTitle
      } else return defaultTitle
    },
    gallery: {
      get() {
        if (this.institute) return this.institute.gallery
        else return []
      },
      set(gallery) {
        this.$store.cache.dispatch("institutes/update", {
          gallery,
          handle: this.institute.handle
        })
      }
    }
  }
}
</script>
