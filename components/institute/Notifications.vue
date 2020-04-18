<template>
  <v-card class="page my-10" min-height="300">
    <v-card-title>
      {{ title }}s
      <v-spacer />
      <v-btn
        v-if="editable"
        v-show="notifications && notifications.length"
        color="primary"
        @click="updateDialog = true"
      >
        Update {{ title }}s
      </v-btn>
    </v-card-title>
    <v-divider />
    <v-card-text class="px-0">
      <v-row v-if="notifications && !notifications.length" justify="center" align="center">
        <v-btn v-if="editable" color="primary" x-large @click="addDialog = true">
          add {{ title }}
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <template v-else> No {{ title }}s </template>
      </v-row>
      <v-list v-if="notifications && notifications.length">
        <v-list-item-group color="primary">
          <v-list-item
            v-for="(item, i) in notifications"
            :key="i"
            @click="
              viewIndex = i
              viewDialog = true
            "
          >
            <v-list-item-icon>
              <v-img
                v-if="withinDays(item.date, 2)"
                :src="require('@/assets/images/icons/new.gif')"
                max-width="30px"
              />
              <v-icon v-else>
                mdi-calendar
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.title }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon class="mr-3">
              {{ formatDate(item.date, false) }}
            </v-list-item-icon>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card-text>

    <v-dialog v-if="notifications && notifications.length" v-model="viewDialog" width="500">
      <v-card>
        <v-card-title>
          {{ notifications[viewIndex].title }}
        </v-card-title>
        <v-card-subtitle>
          {{ formatDate(notifications[viewIndex].date, false) }}
        </v-card-subtitle>
        <v-divider />
        <v-card-text class="py-4">
          {{ notifications[viewIndex].description }}
        </v-card-text>
        <v-card-actions>
          <v-btn icon :disabled="viewIndex === 0" @click="viewIndex -= 1">
            <v-icon color="primary">
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn icon :disabled="viewIndex === notifications.length - 1" @click="viewIndex += 1">
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

    <v-dialog v-model="updateDialog" width="500">
      <v-card tile>
        <v-card-title>
          {{ title }}
          <v-spacer />
          <v-btn color="primary" @click="addDialog = true">
            Add Notification
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-data-table :headers="headers" :items="notifications" :items-per-page="5">
          <template #item.date="{ item }">
            {{ formatDate(item.date, false) }}
          </template>
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
</template>

<script>
import { mapGetters } from "vuex"
import utils from "@/js/utils"

export default {
  props: {
    title: {
      type: String,
      default: "Notification"
    }
  },
  data() {
    return {
      viewIndex: 0,

      headers: [
        { text: "Title", value: "title" },
        { text: "Date", value: "date" },
        { text: "Action ", value: "actions" }
      ],

      editIndex: -1,
      viewDialog: false,
      updateDialog: false,
      addDialog: false,

      editedItem: {
        title: "",
        date: "",
        description: ""
      },
      defaultItem: {
        title: "",
        date: "",
        description: ""
      }
    }
  },
  methods: {
    formatDate: utils.formatDate,
    withinDays(dateString, days = 1) {
      const today = new Date()
      const date = new Date(dateString)
      return Math.ceil(Math.abs(today - date) / (1000 * 60 * 60 * 24)) <= days
    },
    editItem(item) {
      this.editIndex = this.notifications.indexOf(item)
      this.editedItem = Object.assign({}, this.notifications[this.editIndex])
      this.addDialog = true
    },
    save() {
      this.editedItem.date = new Date()
      if (this.editIndex > -1)
        this.notifications = [
          ...this.notifications.slice(0, this.editIndex),
          this.editedItem,
          ...this.notifications.slice(this.editIndex + 1)
        ]
      else this.notifications = this.notifications.concat(this.editedItem)
      this.close()
    },
    deleteItem(item) {
      const index = this.notifications.indexOf(item)
      if (index !== -1 && confirm("Are you sure you want to delete this item?"))
        this.notifications = [
          ...this.notifications.slice(0, index),
          ...this.notifications.slice(index + 1)
        ]
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
      return this.editIndex === -1
        ? "New " + this.title
        : "Edit " + this.notifications[this.editIndex].title
    },
    notifications: {
      get() {
        if (this.institute) {
          return []
            .concat(this.institute.notifications)
            .sort((item1, item2) => new Date(item2.date) - new Date(item1.date))
        } else return []
      },
      set(notifications) {
        this.$store.cache.dispatch("institutes/update", {
          notifications,
          handle: this.institute.handle
        })
      }
    }
  }
}
</script>
