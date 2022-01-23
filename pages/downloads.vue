<template>
  <StandardLayout>
    <v-card>
      <v-card-title>
        <v-row justify="center" align="center">
          <v-col cols="12" md="auto">
            {{ title }}
          </v-col>

          <v-spacer />

          <v-col cols="12" md="auto" class="text-center">
            <v-text-field
              v-model="search"
              solo-inverted
              flat
              dense
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            />
          </v-col>
          <v-col cols="12" md="auto" class="text-center">
            <v-btn v-if="editable" color="primary" @click="dialog = true"> Add {{ title }} </v-btn>
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text class="px-0">
        <v-data-table
          :headers="downloadHeaders"
          :items="downloads"
          :search="search"
          :items-per-page="10"
          :single-expand="true"
          :expanded.sync="expanded"
          sort-by="date"
          :sort-desc="true"
        >
          <template #item.date="{ item }">
            {{ formatDate(item.date, false) }}
          </template>
          <template #item.link="{ item }">
            <v-btn icon large color="success" :href="item.link" target="_blank">
              <v-icon>mdi-cloud-download</v-icon>
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
          </template>
          <template #item.data-table-expand="{ expand }">
            <v-btn icon @click="expand">
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <template #item.expanded-item="{ item }">
            {{ item.description }}
          </template>
        </v-data-table>
      </v-card-text>

      <v-dialog v-model="dialog" width="500">
        <v-card tile>
          <v-card-title>{{ formTitle }}</v-card-title>
          <v-divider />
          <v-card-text>
            <v-container>
              <v-text-field v-model="editedItem.title" solo-inverted flat label="Title" />
              <v-text-field v-model="editedItem.link" solo-inverted flat label="Download Link" />
              <v-textarea v-model="editedItem.description" solo-inverted flat label="Description" />
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text color="primary" @click="close">
              Cancle
            </v-btn>
            <v-btn text color="primary" class="mx-2" @click="save">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </StandardLayout>
</template>

<script>
import { mapGetters } from "vuex"
import StandardLayout from "@/layouts/StandardLayout"
import utils from "@/js/utils"

export default {
  components: {
    StandardLayout,
  },
  middleware: "institute",
  head() {
    return {
      title: "Downloads",
    }
  },
  data() {
    return {
      menu1: false,
      dialog: false,
      dialog1: false,
      search: "",
      search2: "",
      editIndex: -1,
      expanded: [],
      editedItem: {
        title: "",
        description: "",
        date: "",
        link: "",
      },
      defaultItem: {
        title: "",
        description: "",
        date: "",
        link: "",
      },
      downloadHeaders: [
        { text: "Date", value: "date", align: "center" },
        {
          text: "Title ",
          value: "title",
        },
        { text: "", sortable: false, value: "link", align: "end" },
      ],
    }
  },
  computed: {
    ...mapGetters({
      institute: "institutes/institute",
      editable: "institutes/editable",
      status: "institutes/status",
    }),
    title() {
      const defaultTitle = "Downloads"
      if (this.institute && this.institute.settings && this.institute.settings.sections) {
        const exists = this.institute.settings.sections.find(
          (section) => section.component === this.$route.name
        )
        if (exists && exists.name && exists.name.length) return exists.name
        else return defaultTitle
      } else return defaultTitle
    },
    formTitle() {
      return this.editIndex === -1
        ? "New Download item  "
        : " Edit " + this.downloads[this.editIndex].title
    },
    downloads: {
      get() {
        if (this.institute) return this.institute.downloads
        else return []
      },
      set(downloads) {
        this.$store.cache.dispatch("institutes/update", {
          downloads,
          handle: this.$handle,
        })
      },
    },
  },

  methods: {
    formatDate: utils.formatDate,
    editItem(item) {
      this.editIndex = this.downloads.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    save() {
      this.editedItem.date = new Date()
      if (this.editIndex > -1)
        this.downloads = [
          ...this.downloads.slice(0, this.editIndex),
          this.editedItem,
          ...this.downloads.slice(this.editIndex + 1),
        ]
      else this.downloads = this.downloads.concat(this.editedItem)
      this.close()
    },
    deleteItem(item) {
      const index = this.downloads.indexOf(item)
      if (index !== -1 && confirm("Are you sure you want to delete this item?"))
        this.downloads = [...this.downloads.slice(0, index), ...this.downloads.slice(index + 1)]
    },

    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editIndex = -1
      }, 300)
    },
  },
}
</script>
