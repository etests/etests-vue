<template>
  <InstituteLayout>
    <v-card class="page mb-10">
      <v-card-title>
        {{ title }}
        <v-spacer />
        <v-btn v-if="editable" v-show="faqs && faqs.length" color="primary" @click="dialog = true">
          Update
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text class="px-0">
        <v-row v-if="faqs && !faqs.length" justify="center" align="center">
          <template v-if="status.loading">
            Loading...
          </template>
          <v-btn v-else-if="editable" color="primary" large @click="dialog2 = true">
            add question
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <template v-else>
            No Questions
          </template>
        </v-row>
        <v-expansion-panels focusable flat tile>
          <v-expansion-panel v-for="(item, i) in faqs" :key="i">
            <v-expansion-panel-header>
              <span class="font-weight-bold">{{ item.question }}</span>
            </v-expansion-panel-header>
            <v-expansion-panel-content class="pa-2">
              {{ item.answer }}
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>

      <v-dialog v-model="dialog" fullscreen>
        <v-card>
          <v-card-title>
            Update FAQ

            <v-spacer />
            <v-btn color="primary" @click="dialog2 = true">
              Add FAQ
            </v-btn>

            <v-btn icon @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text class="px-0 py-4">
            <v-list>
              <v-list-item-group>
                <v-list-item v-for="(item, i) in faqs" :key="i">
                  <v-list-item-title>
                    {{ item.question }}
                  </v-list-item-title>
                  <v-list-item-icon>
                    <v-btn icon @click="editItem(i)">
                      <v-icon color="info">
                        mdi-pencil
                      </v-icon>
                    </v-btn>
                    <v-btn icon @click="deleteItem(i)">
                      <v-icon color="hot">
                        mdi-delete
                      </v-icon>
                    </v-btn>
                  </v-list-item-icon>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <br />
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialog2" width="500">
        <v-card>
          <v-card-title>
            {{ formTitle }}
          </v-card-title>
          <v-divider />
          <v-card-text class="my-4">
            <v-text-field v-model="editedItem.question" solo-inverted flat label="Question" />
            <v-textarea v-model="editedItem.answer" solo-inverted flat label="Answer " />
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

export default {
  components: {
    InstituteLayout,
  },
  middleware: "institute",
  head() {
    return {
      title: "FAQ",
    }
  },
  data() {
    return {
      dialog: false,
      dialog2: false,
      editIndex: -1,
      editedItem: {
        question: "",
        answer: "",
      },
      defaultItem: {
        question: "",
        answer: "",
      },
    }
  },
  methods: {
    editItem(index) {
      this.editIndex = index
      this.editedItem = Object.assign({}, this.faqs[index])
      this.dialog2 = true
    },
    save() {
      if (this.editIndex > -1)
        this.faqs = [
          ...this.faqs.slice(0, this.editIndex),
          this.editedItem,
          ...this.faqs.slice(this.editIndex + 1),
        ]
      else this.faqs = this.faqs.concat(this.editedItem)
      this.close()
    },
    deleteItem(index) {
      if (index !== -1 && confirm("Are you sure you want to delete this item?"))
        this.faqs = [...this.faqs.slice(0, index), ...this.faqs.slice(index + 1)]
    },
    close() {
      this.dialog2 = false
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
    title() {
      const defaultTitle = "Frequently Asked Questions"
      if (this.institute && this.institute.settings && this.institute.settings.sections) {
        const exists = this.institute.settings.sections.find(
          (section) => section.component === this.$route.name
        )
        if (exists && exists.name && exists.name.length) return exists.name
        else return defaultTitle
      } else return defaultTitle
    },
    formTitle() {
      return this.editIndex === -1 ? "New FAQ " : "Update FAQ"
    },
    faqs: {
      get() {
        if (this.institute) return this.institute.faqs
        else return []
      },
      set(faqs) {
        this.$store.cache.dispatch("institutes/update", {
          faqs,
          handle: this.$handle,
        })
      },
    },
  },
}
</script>
