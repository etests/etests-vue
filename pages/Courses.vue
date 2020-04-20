<template>
  <InstituteLayout>
    <v-row justify="center" align="center" class="text-center">
      <v-col cols="12" md="auto" class="display-2">
        {{ title }}
      </v-col>
      <v-spacer />
      <v-col cols="12" md="auto">
        <v-btn v-if="editable" v-show="courses && courses.length" color="primary" @click="addItem">
          Add Course
        </v-btn>
      </v-col>
      <v-col cols="12">
        <v-divider />
      </v-col>
      <v-col v-if="courses && !courses.length" cols="12" justify="center" align="center">
        <template v-if="status.loading">
          Loading...
        </template>
        <v-btn v-else-if="editable" color="primary" large @click="editDialog = true">
          add course
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <template v-else>
          No Courses
        </template>
      </v-col>
      <v-col v-for="(course, i) in courses" :key="i" cols="12">
        <v-card class="object mb-10" hover height="100%">
          <v-img
            class="primary lighten-5 pl-5 pt-5"
            :src="['lg', 'xl'].includes($mq) ? require('@/assets/images/bg/courses.png') : ''"
          >
            <v-card-title class="display-1 font-weight-light text-uppercase mb-1">
              for {{ course.eligibility }}
            </v-card-title>
            <v-card-subtitle class="title black--text">
              {{ course.name }}
            </v-card-subtitle>
            <v-menu v-if="editable" open-on-hover>
              <template #activator="{ on }">
                <v-btn absolute top right icon color="primary" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="editItem(course)">
                  <v-list-item-title>Edit</v-list-item-title>
                </v-list-item>
                <v-list-item @click="deleteItem(course)">
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-img>

          <v-divider class="grey lighten-2" />

          <v-card-text class="px-0">
            <v-list class="text-left">
              <v-list-item v-for="(detail, j) in course.details" :key="j">
                <v-list-item-avatar>
                  <v-icon color="primary">
                    mdi-chevron-right
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-title>
                  {{ detail.title }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ detail.value }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="editDialog" width="500">
      <v-card tile>
        <v-card-title class="text-truncate">
          {{ formTitle }}
        </v-card-title>
        <v-divider />
        <v-card-text class="py-4">
          <v-text-field v-model="editedItem.name" solo-inverted flat label="Course Name" />
          <v-text-field v-model="editedItem.eligibility" solo-inverted flat label="Eligibility" />
          <v-text-field
            v-for="(detail, i) in editedItem.details"
            :key="i"
            v-model="detail.value"
            solo-inverted
            flat
            :label="detail.title"
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
  </InstituteLayout>
</template>

<script>
import { mapGetters } from "vuex"
import InstituteLayout from "@/layouts/InstituteLayout"

export default {
  components: {
    InstituteLayout
  },
  head() {
    return {
      title: "Courses"
    }
  },
  data() {
    return {
      editIndex: -1,
      editDialog: false,
      editedItem: {
        name: "",
        eligibility: "",
        details: [
          {
            title: "Preparation for",
            value: ""
          },
          {
            title: "Course Duration",
            value: ""
          },
          {
            title: "Weekly Schedule",
            value: ""
          },
          {
            title: "Medium Of Instructions",
            value: ""
          },
          {
            title: "Medium of Study Material",
            value: ""
          },
          {
            title: "Mode of Admission",
            value: ""
          }
        ]
      },
      defaultItem: {
        name: "",
        eligibility: "",
        details: [
          {
            title: "Preparation for",
            value: ""
          },
          {
            title: "Course Duration",
            value: ""
          },
          {
            title: "Weekly Schedule",
            value: ""
          },
          {
            title: "Medium Of Instructions",
            value: ""
          },
          {
            title: "Medium of Study Material",
            value: ""
          },
          {
            title: "Mode of Admission",
            value: ""
          }
        ]
      }
    }
  },
  methods: {
    editItem(item) {
      this.editIndex = this.courses.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editDialog = true
    },
    save() {
      this.editedItem.date = new Date()
      if (this.editIndex > -1)
        this.courses = [
          ...this.courses.slice(0, this.editIndex),
          this.editedItem,
          ...this.courses.slice(this.editIndex + 1)
        ]
      else this.courses = this.courses.concat(this.editedItem)
      this.editDialog = false
    },
    deleteItem(item) {
      const index = this.courses.indexOf(item)
      if (index !== -1 && confirm("Are you sure you want to delete this item?"))
        this.courses = [...this.courses.slice(0, index), ...this.courses.slice(index + 1)]
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
    title() {
      const defaultTitle = "Our Courses"
      if (this.institute && this.institute.settings && this.institute.settings.sections) {
        const exists = this.institute.settings.sections.find(
          (section) => section.component === this.$route.name
        )
        if (exists && exists.name && exists.name.length) return exists.name
        else return defaultTitle
      } else return defaultTitle
    },
    formTitle() {
      return this.editIndex === -1 ? "New Course  " : "Edit " + this.courses[this.editIndex].name
    },
    courses: {
      get() {
        if (this.institute) return this.institute.courses
        else return []
      },
      set(courses) {
        this.$store.cache.dispatch("institutes/update", {
          courses,
          handle: this.$handle
        })
      }
    }
  }
}
</script>
