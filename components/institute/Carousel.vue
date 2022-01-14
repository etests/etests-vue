<template>
  <v-row class="v-application">
    <v-carousel continuous cycle hide-delimiters class="black" style="height: 100vh;">
      <v-carousel-item v-if="carousel && !carousel.length" :src="defaultImage" class="text-center">
        <v-overlay absolute>
          <v-row justify="center" align="center" class="full-height">
            <v-col v-if="institute" cols="12" class="text-center white--text">
              <div class="display-2 font-weight-bold">
                {{ institute.user.name }}
              </div>
              <div class="title my-5">
                {{ institute.about }}
              </div>
            </v-col>
            <v-col cols="auto" v-else>
              <v-progress-circular size="80" indeterminate color="primary" />
            </v-col>
            <v-btn v-if="editable" x-large color="primary" @click="newDialog = true">
              Add Images
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-row>
        </v-overlay>
      </v-carousel-item>
      <v-carousel-item
        v-for="(item, i) in carousel"
        :key="i"
        :src="item.image"
        class="text-right"
        :transition="false"
        style="height: 100% !important;"
      >
        <v-overlay absolute :opacity="item.opacity || 0.6">
          <v-row justify="center" align="center" class="full-height">
            <v-col v-if="institute" cols="12" class="text-center white--text">
              <div class="display-2 font-weight-bold">
                {{ institute.user.name }}
              </div>
              <div class="title my-5">
                {{ institute.about }}
              </div>
            </v-col>
          </v-row>
          <v-row
            v-if="editable"
            v-show="carousel && carousel.length"
            align="center"
            justify="center"
          >
            <v-btn color="primary" @click="newDialog = true">
              Add Images
            </v-btn>
            <v-btn text color="white" outlined @click="deleteDialog = true">
              Delete Images
            </v-btn>
          </v-row>
        </v-overlay>
      </v-carousel-item>
    </v-carousel>

    <v-dialog v-model="deleteDialog" width="500">
      <v-card>
        <v-card-title>
          Delete Images
        </v-card-title>

        <v-divider />

        <v-card-text>
          <v-row>
            <v-col v-for="(item, i) in carousel" :key="i" cols="3">
              <v-card @click="toggleImage(i)">
                <v-img :src="item.image" aspect-ratio="1" class="text-center">
                  <v-checkbox dark color="white" :input-value="selected" :value="i" class="ma-1" />
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
            Close
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
          <DropUpload
            @upload="
              (url) => {
                newImages.push(url)
              }
            "
            height="200px"
          />

          <v-row v-if="newImages && newImages.length">
            <v-col v-for="(image, i) in newImages" :key="i" cols="3">
              <v-card>
                <v-hover>
                  <template v-slot:default="{ hover }">
                    <v-img :src="image" aspect-ratio="1" class="text-center">
                      <v-overlay absolute color="#000" v-if="hover">
                        <v-btn x-large icon color="white" @click="newImages.splice(i, 1)">
                          <v-icon>
                            mdi-close
                          </v-icon>
                        </v-btn>
                      </v-overlay>
                      <template #placeholder>
                        <v-skeleton-loader type="image" />
                      </template>
                    </v-img>
                  </template>
                </v-hover>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="newDialog = false">
            Cancel
          </v-btn>
          <v-btn color="primary" :disabled="newImages.length === 0" @click="save">
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapGetters } from "vuex"
import DropUpload from "@/components/common/DropUpload"

export default {
  components: {
    DropUpload,
  },
  data() {
    return {
      selected: [],
      newImages: [],
      deleteDialog: false,
      newDialog: false,
      defaultImage:
        "https://c4.wallpaperflare.com/wallpaper/653/402/499/romain-trystam-digital-art-cityscape-city-lights-wallpaper-preview.jpg",
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
      if (this.selected.length) {
        this.carousel = this.carousel.filter((item, index) => !this.selected.includes(index))
        this.deleteDialog = false
      }
    },
    save() {
      if (this.newImages.length) {
        this.carousel = this.carousel.concat(
          this.newImages.map((image) => {
            return { image }
          })
        )
      }
      this.newImages = []
      this.newDialog = false
    },
  },
  computed: {
    ...mapGetters({
      institute: "institutes/institute",
      editable: "institutes/editable",
      status: "institutes/status",
    }),
    carousel: {
      get() {
        if (this.institute) return this.institute.carousel
        else return []
      },
      set(carousel) {
        this.$store.cache.dispatch("institutes/update", {
          carousel,
          handle: this.institute.handle,
        })
      },
    },
  },
}
</script>
