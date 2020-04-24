<template>
  <v-card class="page my-10" min-height="300">
    <v-card-title>
      Online Class
      <v-spacer />
      <v-btn
        v-if="editable"
        v-show="links && links.filter((link) => link.type == 'lecture').length"
        color="primary"
        @click="updateDialog = true"
      >
        Update links
      </v-btn>
    </v-card-title>
    <v-divider />
    <v-card-text class="px-0">
      <v-row
        v-if="links && !links.filter((link) => link.type == 'lecture').length"
        justify="center"
        align="center"
      >
        <v-btn v-if="editable" color="primary" x-large @click="addDialog = true">
          add link
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <template v-else> No links </template>
      </v-row>
      <v-list v-if="links && links.filter((link) => link.type == 'lecture').length">
        <v-list-item-group color="primary">
          <v-list-item
            v-for="(item, i) in links.filter((link) => link.type == 'lecture')"
            :key="i"
            :href="item.link"
            target="_blank"
          >
            <v-list-item-icon>
              <v-icon color="error">
                mdi-play-circle
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.title }}
              </v-list-item-title>
              <v-subheader class="ma-0 pa-0">{{ item.description }}</v-subheader>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card-text>

    <v-dialog v-model="updateDialog" width="500">
      <v-card tile>
        <v-card-title>
          Online Class
          <v-spacer />
          <v-btn color="primary" @click="addDialog = true">
            Add link
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-data-table
          :headers="headers"
          :items="links.filter((link) => link.type == 'lecture')"
          :items-per-page="5"
        >
          <template #item.actions="{ item }">
            <v-btn icon @click="editItem(item)">
              <v-icon small color="success">
                mdi-pencil
              </v-icon>
            </v-btn>
            <v-btn icon @click="deleteItem(item)">
              <v-icon small color="hot">
                mdi-delete
              </v-icon>
            </v-btn>
          </template>
        </v-data-table>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="updateDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="addDialog" width="500">
      <v-card>
        <v-card-title>
          {{ formTitle }}
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-4">
          <v-text-field v-model="editedItem.title" solo-inverted flat label="Title" />
          <v-text-field v-model="editedItem.link" solo-inverted flat label="Link" />
          <v-textarea
            v-model="editedItem.description"
            solo-inverted
            flat
            label="Description"
            height="100"
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
  </v-card>
</template>

<script>
import { mapGetters } from "vuex"
import utils from "@/js/utils"

export default {
  data() {
    return {
      headers: [
        { text: "Title", value: "title", align: "center" },
        { text: "Link", value: "link", align: "center" },
        { text: "Actions", value: "actions", align: "center" }
      ],
      editIndex: -1,
      updateDialog: false,
      addDialog: false,
      editedItem: {
        title: "",
        description: "",
        link: "",
        type: "lecture"
      },
      defaultItem: {
        title: "",
        description: "",
        link: "",
        type: "lecture"
      }
    }
  },
  methods: {
    editItem(item) {
      this.editIndex = this.links.indexOf(item)
      this.editedItem = Object.assign({}, this.links[this.editIndex])
      this.addDialog = true
    },
    save() {
      if (this.editIndex > -1)
        this.links = [
          ...this.links.slice(0, this.editIndex),
          this.editedItem,
          ...this.links.slice(this.editIndex + 1)
        ]
      else this.links = this.links.concat(this.editedItem)
      this.close()
    },
    deleteItem(item) {
      const index = this.links.indexOf(item)
      if (index !== -1 && confirm("Are you sure you want to delete this item?"))
        this.links = [...this.links.slice(0, index), ...this.links.slice(index + 1)]
    },
    close() {
      this.addDialog = false
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
    formTitle() {
      return this.editIndex === -1 ? "New Link" : "Edit " + this.links[this.editIndex].title
    },
    links: {
      get() {
        if (this.institute) {
          return [].concat(this.institute.links)
        } else return []
      },
      set(links) {
        this.$store.cache.dispatch("institutes/update", {
          links,
          handle: this.institute.handle
        })
      }
    }
  }
}
</script>
