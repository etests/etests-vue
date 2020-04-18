<template>
  <v-card class="transparent my-1" flat>
    <v-card-title class="text-center">
      <v-row justify="space-between">
        <v-col cols="12" md="auto" class="display-1 font-weight-light">
          {{ title }}
        </v-col>
        <v-spacer />
        <v-col v-show="toppers && toppers.length" cols="12" md="auto">
          <v-btn v-if="editable" color="primary" @click="addItem">
            Add student
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>
    <v-divider />
    <v-card-text>
      <v-row v-if="toppers && !toppers.length" justify="center" align="center">
        <v-btn v-if="editable" color="primary" x-large @click="editDialog = true">
          add student
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <template v-else>
          No Students
        </template>
      </v-row>
      <v-row v-else>
        <v-col v-for="(student, i) in toppers" :key="i" cols="6" sm="6" md="4" lg="3">
          <v-card class="object ma-auto" flat outlined hover max-width="200" height="100%">
            <v-img height="200px" :src="student.image">
              <v-menu v-if="editable" open-on-hover>
                <template #activator="{ on }">
                  <v-btn absolute top right icon color="white" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="editItem(student)">
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="deleteItem(student)">
                    <v-list-item-title>Delete</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <template #placeholder>
                <v-skeleton-loader type="image" />
              </template>
            </v-img>

            <v-card-subtitle class="title text-center">
              {{ student.name }}
            </v-card-subtitle>
            <v-card-text class="text-center">
              {{ student.exam }} {{ student.year }}
              <br />
              Rank - {{ student.rank }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>

    <v-dialog v-model="editDialog" width="500">
      <v-card>
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
        <v-card-text class="px-4 py-2">
          <v-text-field v-model="editedItem.name" solo-inverted flat label="Name " />
          <v-text-field v-model="editedItem.year" solo-inverted flat dense label="Year" />
          <v-text-field v-model="editedItem.exam" solo-inverted flat label="Exam  " />
          <v-text-field v-model="editedItem.rank" solo-inverted flat label="Rank" />
          <v-text-field v-model="editedItem.image" solo-inverted flat label=" image" />
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
      default: "Our Toppers"
    }
  },
  data() {
    return {
      editDialog: false,
      editIndex: -1,
      headers: [
        { text: "Student Name ", value: "name" },
        { text: "year", value: "year" },
        { text: "Action ", value: "actions" }
      ],
      editedItem: {
        name: "",
        year: "",
        image: "",
        exam: "",
        rank: ""
      },
      defaultItem: {
        name: "",
        year: "",
        image: "",
        exam: "",
        rank: ""
      }
    }
  },
  methods: {
    editItem(item) {
      this.editIndex = this.toppers.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editDialog = true
    },
    save() {
      if (this.editIndex > -1)
        this.toppers = [
          ...this.toppers.slice(0, this.editIndex),
          this.editedItem,
          ...this.toppers.slice(this.editIndex + 1)
        ]
      else this.toppers = this.toppers.concat(this.editedItem)
      this.editDialog = false
    },
    deleteItem(item) {
      const index = this.toppers.indexOf(item)
      if (index !== -1 && confirm("Are you sure you want to delete this item?"))
        this.toppers = [...this.toppers.slice(0, index), ...this.toppers.slice(index + 1)]
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
    toppers: {
      get() {
        if (this.institute) return this.institute.toppers
        else return []
      },
      set(toppers) {
        this.$store.cache.dispatch("institutes/update", {
          toppers,
          handle: this.institute.handle
        })
      }
    }
  }
}
</script>
<style scoped></style>
