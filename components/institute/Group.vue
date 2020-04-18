<template>
  <v-row justify="center" align="start" class="text-center">
    <v-col cols="12">
      <slot name="activator" :on="{ click: () => (editDialog = true) }">
        <v-btn color="primary" @click="editDialog = true"> Add {{ groupName }} </v-btn>
      </slot>
    </v-col>
    <slot name="empty" :on="{ click: () => (editDialog = true) }">
      <v-col v-if="items && !items.length" cols="12">
        <v-btn v-if="editable" color="primary" x-large @click="editDialog = true">
          add {{ groupName }}
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <template v-else> No {{ groupName }} </template>
      </v-col>
    </slot>
    <v-col v-for="(item, i) in items" :key="i" cols="6" md="3" style="position:relative">
      <slot :item="item" />
      <slot name="menu">
        <v-menu v-if="editable" open-on-hover>
          <template #activator="{ on }">
            <v-btn absolute top right icon color="white" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="editItem(item)">
              <v-list-item-title>Edit</v-list-item-title>
            </v-list-item>
            <v-list-item @click="deleteItem(item)">
              <v-list-item-title>Delete</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </slot>
    </v-col>
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
          <v-text-field v-model="editedItem.link" solo-inverted flat label="Link" />
          <v-textarea
            v-model="editedItem.description"
            solo-inverted
            flat
            label="Description"
            height="180"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="close">
            Cancel
          </v-btn>
          <v-btn color="primary" text @click="save">
            Save
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
    DropUpload
  },
  props: ["groupName"],
  data() {
    return {
      dialog: false,
      editDialog: false,
      editIndex: -1,
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
      this.editIndex = this.items.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editDialog = true
    },
    save() {
      if (this.editIndex > -1)
        this.items = [
          ...this.items.slice(0, this.editIndex),
          this.editedItem,
          ...this.items.slice(this.editIndex + 1)
        ]
      else this.items = this.items.concat(this.editedItem)
      this.close()
    },
    deleteItem(item) {
      const index = this.items.indexOf(item)
      if (index !== -1 && confirm("Are you sure you want to delete this item?"))
        this.items = [...this.items.slice(0, index), ...this.items.slice(index + 1)]
    },
    close() {
      this.editDialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editIndex = -1
      }, 300)
    }
  },
  computed: {
    ...mapGetters({
      institute: "institutes/institute",
      editable: "institutes/editable",
      status: "institutes/status"
    }),
    items: {
      get() {
        if (this.institute) return this.institute[this.groupName]
        else return []
      },
      set(items) {
        this.$store.cache.dispatch("institutes/update", {
          [this.groupName]: items,
          handle: this.institute.handle
        })
      }
    }
  }
}
</script>
