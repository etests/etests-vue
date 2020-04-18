<template>
  <v-card flat class="my-1 transparent">
    <v-card-title class="text-center">
      <v-row justify="space-between">
        <v-col cols="12" md="auto" class="display-1 font-weight-light">
          {{ title }}
        </v-col>
        <v-spacer />
        <v-col v-show="team && team.length" cols="12" md="auto">
          <v-btn v-if="editable" color="primary" @click="addItem">
            Add Member
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>

    <v-divider />

    <v-card-text>
      <v-row v-if="team && !team.length" justify="center" align="center">
        <v-btn v-if="editable" color="primary" x-large @click="editDialog = true">
          add member
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <template v-else>
          No Team Members
        </template>
      </v-row>
      <v-row v-else>
        <v-col v-for="person in team" :key="person.name" cols="11" sm="6" md="4" xl="3">
          <v-card class="object ma-2" outlined flat hover height="100%">
            <v-img height="200px" :src="person.image">
              <v-menu v-if="editable" open-on-hover>
                <template #activator="{ on }">
                  <v-btn absolute top right icon color="white" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="editItem(person)">
                    <v-list-item-title>Edit</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="deleteItem(person)">
                    <v-list-item-title>Delete</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <template #placeholder>
                <v-skeleton-loader type="image" />
              </template>
            </v-img>
            <v-divider />
            <v-card-title class="primary--text">
              {{ person.name }}
            </v-card-title>
            <v-card-subtitle class="grey--text">
              {{ person.position }}
            </v-card-subtitle>
            <v-card-text>
              <p class="multiline-truncate">
                {{ person.description }}
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>

    <v-dialog v-model="editDialog" max-width="500">
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
        <v-card-text class="pa-4">
          <v-text-field v-model="editedItem.name" solo-inverted flat label="Name" />
          <v-text-field v-model="editedItem.position" solo-inverted flat label="Position" />
          <v-text-field v-model="editedItem.image" solo-inverted flat label="Image URL" />
          <v-textarea
            v-model="editedItem.description"
            solo-inverted
            flat
            label=" Description"
            height="180"
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
      default: "Expert Team"
    }
  },
  data() {
    return {
      editDialog: false,
      editIndex: -1,
      editedItem: {
        name: "",
        position: "",
        description: "",
        image: ""
      },
      defaultItem: {
        name: "",
        position: "",
        description: "",
        image: ""
      }
    }
  },
  methods: {
    editItem(item) {
      this.editIndex = this.team.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editDialog = true
    },
    save() {
      if (this.editIndex > -1)
        this.team = [
          ...this.team.slice(0, this.editIndex),
          this.editedItem,
          ...this.team.slice(this.editIndex + 1)
        ]
      else this.team = this.team.concat(this.editedItem)
      this.close()
    },
    deleteItem(item) {
      const index = this.team.indexOf(item)
      if (index !== -1 && confirm("Are you sure you want to delete this item?"))
        this.team = [...this.team.slice(0, index), ...this.team.slice(index + 1)]
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
    team: {
      get() {
        if (this.institute) return this.institute.team
        else return []
      },
      set(team) {
        this.$store.cache.dispatch("institutes/update", {
          team,
          handle: this.institute.handle
        })
      }
    }
  }
}
</script>

<style scoped>
.rounded-card {
  border-radius: 100px;
}
</style>
