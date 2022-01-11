<template>
  <InstituteLayout>
    <v-card class="page my-10" min-height="300">
      <v-card-title>
        {{ title }}s
        <v-spacer />
        <v-btn
          v-if="editable"
          v-show="forms && forms.length"
          color="primary"
          @click="addDialog = true"
        >
          add {{ title }}s
        </v-btn>
      </v-card-title>
      <v-divider />
      <v-card-text class="px-0">
        <v-row v-if="forms && !forms.length" justify="center" align="center">
          <v-btn v-if="editable" color="primary" x-large @click="addDialog = true">
            add {{ title }}
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <template v-else> No {{ title }}s </template>
        </v-row>
        <v-list v-if="forms && forms.length">
          <v-list-item v-for="(item, i) in forms" :key="i">
            <v-list-item-avatar>
              <v-icon color="primary">
                mdi-table-edit
              </v-icon>
            </v-list-item-avatar>
            <v-list-item-title>
              {{ item.title }}
            </v-list-item-title>
            <v-list-item-title class="text-right">
              <v-btn
                icon
                large
                color="primary"
                @click="
                  viewIndex = i
                  viewDialog = true
                "
              >
                <v-icon>mdi-information-outline</v-icon>
              </v-btn>
              <v-btn icon large color="primary" :href="item.link" target="_blank">
                <v-icon>mdi-open-in-new</v-icon>
              </v-btn>
              <v-btn v-if="editable" icon @click="editItem(item)">
                <v-icon color="info">
                  mdi-pencil
                </v-icon>
              </v-btn>
              <v-btn v-if="editable" icon @click="deleteItem(item)">
                <v-icon color="hot">
                  mdi-delete
                </v-icon>
              </v-btn>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-dialog v-if="forms && forms.length" v-model="viewDialog" width="500">
        <v-card>
          <v-card-title class="primary white--text">
            {{ forms[viewIndex].title }}
            <v-spacer />
            <v-btn
              v-if="forms[viewIndex].link"
              icon
              large
              dark
              :href="forms[viewIndex].link"
              target="_blank"
            >
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text class="py-4">
            {{ forms[viewIndex].description }}
          </v-card-text>
          <v-card-actions>
            <v-btn icon :disabled="viewIndex === 0" @click="viewIndex -= 1">
              <v-icon color="primary">
                mdi-chevron-left
              </v-icon>
            </v-btn>
            <v-btn icon :disabled="viewIndex === forms.length - 1" @click="viewIndex += 1">
              <v-icon color="primary">
                mdi-chevron-right
              </v-icon>
            </v-btn>
            <v-spacer />
            <v-btn text color="primary" @click="viewDialog = false">
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
              height="250"
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
  </InstituteLayout>
</template>

<script>
import { mapGetters } from "vuex"
import InstituteLayout from "@/layouts/InstituteLayout"
import utils from "@/js/utils"

export default {
  components: {
    InstituteLayout,
  },
  middleware: "institute",
  head() {
    return {
      title: "Forms",
    }
  },
  props: {
    title: {
      type: String,
      default: "Form",
    },
  },
  data() {
    return {
      viewIndex: 0,

      headers: [
        { text: "Title", value: "title", align: "left" },
        { text: "Action ", value: "actions", align: "left" },
      ],

      editIndex: -1,
      viewDialog: false,
      updateDialog: false,
      addDialog: false,

      editedItem: {
        title: "",
        description: "",
        link: "",
      },
      defaultItem: {
        title: "",
        description: "",
        link: "",
      },
    }
  },
  methods: {
    editItem(item) {
      this.editIndex = this.forms.indexOf(item)
      this.editedItem = Object.assign({}, this.forms[this.editIndex])
      this.addDialog = true
    },
    save() {
      if (this.editIndex > -1)
        this.forms = [
          ...this.forms.slice(0, this.editIndex),
          this.editedItem,
          ...this.forms.slice(this.editIndex + 1),
        ]
      else this.forms = this.forms.concat(this.editedItem)
      this.close()
    },
    deleteItem(item) {
      const index = this.forms.indexOf(item)
      if (index !== -1 && confirm("Are you sure you want to delete this item?"))
        this.forms = [...this.forms.slice(0, index), ...this.forms.slice(index + 1)]
    },
    close() {
      this.addDialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editIndex = -1
      }, 300)
    },
  },
  computed: {
    ...mapGetters({
      institute: "institutes/institute",
      editable: "institutes/editable",
      status: "institutes/status",
    }),
    formTitle() {
      return this.editIndex === -1
        ? "New " + this.title
        : "Edit " + this.forms[this.editIndex].title
    },
    forms: {
      get() {
        if (this.institute) {
          return this.institute.forms
        } else return []
      },
      set(forms) {
        this.$store.cache.dispatch("institutes/update", {
          forms,
          handle: this.institute.handle,
        })
      },
    },
  },
}
</script>
