<template>
  <v-card flat class="my-2 transparent">
    <v-card-title class="text-center">
      <v-row justify="space-between">
        <v-col cols="12" md="auto" class="display-1 font-weight-light"> Our {{ title }}s </v-col>
        <v-spacer />
        <v-col v-show="features && features.length" cols="12" md="auto">
          <v-btn v-if="editable" color="primary" dark @click="addItem"> Add {{ title }} </v-btn>
        </v-col>
      </v-row>
    </v-card-title>

    <v-divider />
    <v-card-text>
      <v-row justify="center" align="center" class="text-center">
        <v-col v-if="features && !features.length" cols="12">
          <v-btn v-if="editable" color="primary" x-large @click="editDialog = true">
            add {{ title }}
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <template v-else> No {{ title }}s </template>
        </v-col>
        <v-col v-for="feature in features" :key="feature.id" cols="12" sm="6" md="6" lg="3">
          <v-card
            class="object mx-auto  my-1"
            outlined
            flat
            hover
            :href="feature.link"
            target="blank"
            height="100%"
          >
            <v-img :src="feature.image" height="200" class="mx-auto">
              <v-menu v-if="editable" open-on-hover>
                <template #activator="{ on }">
                  <v-btn absolute top right icon color="white" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="editItem(feature)">
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="deleteItem(feature)">
                    <v-list-item-title>Delete</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <template #placeholder>
                <v-skeleton-loader type="image" />
              </template>
            </v-img>
            <v-divider />
            <v-card-subtitle class="title text-center">
              {{ feature.title }}
            </v-card-subtitle>
            <v-card-text class=" text-center">
              {{ feature.description }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>

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
          <v-text-field v-model="editedItem.title" solo-inverted flat label="Title" />
          <v-text-field v-model="editedItem.image" solo-inverted flat label="Image" />
          <v-text-field v-model="editedItem.link" solo-inverted flat label="Link" />
          <v-textarea
            v-model="editedItem.description"
            solo-inverted
            flat
            label="Description"
            height="200px"
          />
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
  </v-card>
</template>
<script>
import { mapGetters } from "vuex"
import DropUpload from "@/components/common/DropUpload"

export default {
  components: {
    DropUpload
  },
  props: {
    title: {
      type: String,
      default: "Feature"
    }
  },
  data() {
    return {
      dialog: false,
      editDialog: false,
      editIndex: -1,
      headers: [
        { text: "Title ", value: "title" },
        { text: "Action ", value: "actions" }
      ],
      editedItem: {
        title: "",
        description: "",
        image: "",
        link: ""
      },
      defaultItem: {
        title: "",
        description: "",
        image: "",
        link: ""
      }
    }
  },
  methods: {
    editItem(item) {
      this.editIndex = this.features.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editDialog = true
    },
    save() {
      if (this.editIndex > -1)
        this.features = [
          ...this.features.slice(0, this.editIndex),
          this.editedItem,
          ...this.features.slice(this.editIndex + 1)
        ]
      else this.features = this.features.concat(this.editedItem)
      this.close()
    },
    deleteItem(item) {
      const index = this.features.indexOf(item)
      if (index !== -1 && confirm("Are you sure you want to delete this item?"))
        this.features = [...this.features.slice(0, index), ...this.features.slice(index + 1)]
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
    formTitle() {
      return this.editIndex === -1 ? "New Feature" : "Edit " + this.features[this.editIndex].title
    },
    features: {
      get() {
        if (this.institute) return this.institute.features
        else return []
      },
      set(features) {
        this.$store.cache.dispatch("institutes/update", {
          features,
          handle: this.institute.handle
        })
      }
    }
  }
}
</script>
